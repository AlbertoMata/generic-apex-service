public with sharing class GenericApexService {

    @AuraEnabled
    public static String executeSOQL (String soqlString) {
        String jsonResponse             = null;
        QueryException queryException   = new QueryException ();
        List<SObject> sobjects          = Database.query (soqlString);
        SObjectAccessDecision decision  = Security.stripInaccessible (AccessType.READABLE, sobjects);
        String errorMessage             = 'You cannot read these fields: ' + decision.getRemovedFields();

        System.debug (LoggingLevel.FINEST, decision);
        System.debug (LoggingLevel.FINEST, decision.getRemovedFields ());

        if (decision.getRemovedFields().size() > 0) {
            throw new QueryException (errorMessage);
        }

        jsonResponse = JSON.serialize (decision.getRecords());

        return jsonResponse;
    } 

    @AuraEnabled
    public static String executeSOSL (String soslString) {
        String jsonResponse                         = null;
        List<List<SObject>> sobjectLists            = Search.query (soslString);
        List<List<SObject>> depuratedSobjectLists   = new List<List<SObject>>();

        for (List<SObject> sobjects : sobjectLists) {
            SObjectAccessDecision decision    = Security.stripInaccessible (AccessType.READABLE, sobjects);
            String errorMessage               = 'You cannot read these fields: ' + decision.getRemovedFields();

            System.debug(LoggingLevel.FINEST, decision);

            // Issue: Improve error readiness  
            if (decision.getRemovedFields().size() > 0) {
                throw new QueryException (errorMessage);
            }

            depuratedSobjectLists.add( decision.getRecords().clone());
        }

        jsonResponse = JSON.serialize (depuratedSobjectLists);

        return jsonResponse;
    }

    @AuraEnabled
    public static String insertRecords (String jsonSObjects) {
        String jsonResponse               = null;
        List<SObject> records             = (List<SObject>) JSON.deserialize (jsonSObjects, List<SObject>.class);
        SObjectAccessDecision decision    = Security.stripInaccessible (AccessType.CREATABLE, records);
        String errorMessage               = 'You cannot write over these fields: ' + decision.getRemovedFields(); 

        // If jsonSObjects has fields that do not belong to the object
        // definition, stripInaccesible() doesn't consider it for the
        // revision (issue: include this assertion to the unit test)
        if (decision.getRemovedFields().size() > 0) {
            throw new DmlException (errorMessage);
        }

        List<SObject> depuratedRecords    = decision.getRecords();

        System.debug(LoggingLevel.FINEST, decision);
        System.debug(LoggingLevel.FINEST, depuratedRecords); 

        insert depuratedRecords;

        jsonResponse                      = JSON.serialize (depuratedRecords, true);

        System.debug (LoggingLevel.FINEST, jsonResponse); 

        return jsonResponse;
    }

    @AuraEnabled
    public static String updateRecords (String jsonSObjects) {
        String jsonResponse               = null;
        List<SObject> records             = (List<SObject>) JSON.deserialize(jsonSObjects, List<SObject>.class);
        SObjectAccessDecision decision    = Security.stripInaccessible(AccessType.UPDATABLE , records);
        List<SObject> depuratedRecords    = decision.getRecords();
        String errorMessage               = 'You cannot write over these fields: ' + decision.getRemovedFields(); 

        if (decision.getRemovedFields().size() > 0) {
            throw new DmlException (errorMessage);
        }

        update depuratedRecords;

        jsonResponse                      = JSON.serialize(depuratedRecords);

        return jsonResponse;
    }

    @AuraEnabled
    public static String upsertRecords (String jsonSObjects) {
        String jsonResponse                   = null;
        Map<Integer,Integer> recordsOrder     = new Map<Integer, Integer>();
        List<SObject> updatableRecords        = new List<SObject> ();
        List<SObject> insertableRecords       = new List<SObject> ();
        List<SObject> upsertedRecords         = new List<SObject> ();

        List<SObject> records                 = (List<SObject>) JSON.deserialize (jsonSObjects, List<SObject>.class);
        SObjectAccessDecision decision        = Security.stripInaccessible (AccessType.UPSERTABLE, records);
        List<SObject> depuratedRecords        = decision.getRecords ();
        String errorMessage                   = 'You cannot write over these fields: ' + decision.getRemovedFields(); 

        if (decision.getRemovedFields().size() > 0) {
            throw new DmlException (errorMessage);
        }

        System.debug (LoggingLevel.FINEST, records);

        SavePoint sp                          = Database.setSavepoint ();

        for (Integer i = 0; i < depuratedRecords.size(); ++i) {
            if (depuratedRecords[i].Id != null) {
                updatableRecords.add (depuratedRecords[i]);
                recordsOrder.put (updatableRecords.size() - 1, i);
            } else {
                insertableRecords.add (depuratedRecords[i]);
                recordsOrder.put (insertableRecords.size() - 1, i);
            }
        }

        System.debug(LoggingLevel.FINEST, updatableRecords);
        System.debug(LoggingLevel.FINEST, insertableRecords);

        try {
            update updatableRecords;
            insert insertableRecords;

            upsertedRecords = returnOriginalOrder (depuratedRecords, updatableRecords, insertableRecords, recordsOrder);
        } catch (Exception e) {
            Database.rollback (sp); // All or nothing transaction
            throw e; // Make the error accesible for the Aura interface
        }

        jsonResponse = JSON.serialize (upsertedRecords);

        return jsonResponse;
    }

    @AuraEnabled
    public static void deleteRecords (String jsonSObjects) {
        List<SObject> records   = (List<SObject>) JSON.deserialize (jsonSObjects, List<SObject>.class);

        // Even if sobjects are not checked for deletion, the access rights are preserved
        delete records;
    }

    public static List<SObject> returnOriginalOrder (List<SObject> depuratedRecords,  List<SObject> updatedRecords, List<SObject> insertedRecords, Map<Integer,Integer> recordsOrder) {
        List<SObject> sortedRecords = new List<SObject>(depuratedRecords);

        for (Integer i = 0; i < updatedRecords.size(); ++i) {
            SObject updated                         = updatedRecords[i];
            sortedRecords[recordsOrder.get (i)]     = updated;
        }

        for (Integer i = 0; i < insertedRecords.size(); ++i) {
            SObject inserted                        = insertedRecords[i];
            sortedRecords[recordsOrder.get (i)]     = inserted;
        }

        return sortedRecords;
    }
}

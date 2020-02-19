@isTest
public class GenericApexServiceTest {
    private static Id [] fixedSearchResults;   

    @TestSetup
    static void setUpRecords () {
        List<Contact> contacts = new List<Contact> ();

        contacts.add(createContact('Alice', 'Blake'));
        contacts.add(createContact('Bob', 'Rivest'));

        insert contacts;

        Case cs = new Case(Status = 'New', Origin = 'Phone');

        insert cs;

        createReadOnlyUser();
        createStandarUser ();

        System.debug (LoggingLevel.FINEST, contacts);
        System.debug (LoggingLevel.FINEST, fixedSearchResults);

    }

    static void createStandarUser () {

        // Create a unique UserName
         Profile p = [SELECT Id FROM Profile WHERE Name='Standard User'];

         User u2 = new User(Alias = 'ndd', Email='foobar@testorg.com',
         EmailEncodingKey='UTF-8', LastName='Testing', LanguageLocaleKey='en_US',
         LocaleSidKey='en_US', ProfileId = p.Id,
         TimeZoneSidKey='America/Los_Angeles', UserName='foobar@testorg.com');

         insert u2;

    }

    static void createReadOnlyUser () {

        // Create a unique UserName
        String uniqueUserName = 'readonlyuser' + DateTime.now().getTime() + '@testorg.com';

        // This code runs as the system user
        Profile readOnlyProfile = [SELECT Id FROM Profile WHERE Name = 'Read Only'];
        User readOnlyUser = new User(Alias = 'reado', Email='readonlyuser@testorg.com',
            EmailEncodingKey='UTF-8', LastName='Testing', LanguageLocaleKey='en_US',
            LocaleSidKey='en_US', ProfileId = readOnlyProfile.Id,
            TimeZoneSidKey='America/Los_Angeles',
            UserName=uniqueUserName);

        insert readOnlyUser;
    }

    // << TEST METHODS

    @IsTest 
    static void getRecords() {
        List<Contact> contactsQueried       = null;
        List<List<Contact>> contactsFound   = null;
        Boolean queryAssertion              = true;
        Boolean searchAssertion             = true;
        Integer resultsSize                 = 2;
        fixedSearchResults                  = new Id[resultsSize];

        String soqlString                   = 'SELECT Id, FirstName FROM Contact';
        String soslString                   = 'FIND \'Bob\' IN ALL FIELDS RETURNING Contact(Id)';

        contactsQueried                     = (List<Contact>) JSON.deserialize (GenericApexService.executeSOQL(soqlString), List<Contact>.class);

        System.debug (LoggingLevel.FINEST, contactsQueried);

        setFixedSearchResults(fixedSearchResults, contactsQueried);

        for (Contact contact : contactsQueried) {
            if (contact.FirstName != 'Alice' && contact.FirstName != 'Bob') {
                queryAssertion = false;
            }
        }

        System.debug (LoggingLevel.FINEST, fixedSearchResults);

        Test.setFixedSearchResults(fixedSearchResults);

        contactsFound                       = (List<List<Contact>>) JSON.deserialize (GenericApexService.executeSOSL(soslString), List<List<Contact>>.class );

        for (List<Contact> contacts : contactsFound) {
            for (Contact record : contacts) {
                Boolean result = false;
                for (Id resultId : fixedSearchResults) { 
                    if (record.Id == resultId) {  
                        result = true;
                    }
                }
                if (!result) {
                    searchAssertion = false;
                }
            }
        }

        System.debug (LoggingLevel.FINEST, contactsFound);

        System.assert(queryAssertion, 'SOQL Response is invalid');
        System.assert(searchAssertion, 'SOSL Response is invalid');
    }

    @IsTest 
    static void createRecords () {
        List<Contact> contacts          = new List<Contact> ();
        List<Contact> insertedRecords   = new List<Contact> ();
        String jsonContacts             = null;
        String jsonInsertedRecords      = null;
        Boolean assertion               = true;

        contacts.add( createContact('Cow', 'Cat') );
        contacts.add( createContact('Pig', 'Sheep') );

        jsonContacts                    = JSON.serialize (contacts);
        jsonInsertedRecords             = GenericApexService.insertRecords (jsonContacts);

        System.debug (LoggingLevel.FINEST, jsonInsertedRecords);

        insertedRecords                 = (List<Contact>) JSON.deserialize (jsonInsertedRecords, List<Contact>.class);

        System.debug(LoggingLevel.FINEST, insertedRecords);

        for (Integer i = 0; i < contacts.size(); ++i) {
            if (contacts[i].FirstName != insertedRecords[i].FirstName) {
                assertion = false;
            }
        }

        System.assert (assertion, 'Records did not return in the same order they were inserted.');
    }

    @IsTest
    static void failedRecordCreation () {
        User readOnlyUser                     = [SELECT Id, Email FROM User WHERE Email = 'readonlyuser@testorg.com' ];
        DmlException exceptionPlaceholder     = null;

        System.runAs(readOnlyUser) {
            try {
                createRecords();
            } catch (DmlException e) {
                exceptionPlaceholder = e;
            }
        }

        System.assert (exceptionPlaceholder != null, 'Permissions over SObjects are not enforced');
    }

    @IsTest
    static void updateRecords () {
        List<Contact> contacts          = [SELECT Id, FirstName, LastName FROM Contact];
        List<Contact> updatedRecords    = new List<Contact>();
        String jsonContacts             = null;
        String jsonUpdatedRecords       = null;
        Boolean assertion               = true;

        for (Contact record : contacts) {
            record.FirstName            = 'Edsger';
        }

        jsonContacts                    = JSON.serialize (contacts);
        jsonUpdatedRecords              = GenericApexService.updateRecords (jsonContacts);

        updatedRecords                  = (List<Contact>) JSON.deserialize (jsonUpdatedRecords, List<Contact>.class);

        for (Integer i = 0; i < contacts.size(); ++i) {
            if (contacts[i].FirstName != updatedRecords[i].FirstName) {
                assertion = false;
            }
        }

        System.assert (assertion, 'Records did not return in the same order they were updated.');
    }

    @IsTest 
    static void upsertRecords () {
        List<Contact> previousContacts    = [SELECT Id, FirstName, LastName FROM Contact];
        List<Contact> newContacts         = new List<Contact> ();
        List<Contact> upsertableRecords   = new List<Contact> ();
        List<Contact> upsertedRecords     = new List<Contact> ();
        String jsonContacts               = null;
        String jsonUpsertedRecords        = null;
        Boolean assertion                 = true;

        newContacts.add( createContact('Cow', 'Cat') );
        newContacts.add( createContact('Pig', 'Sheep') );

        upsertableRecords.addAll (previousContacts);
        upsertableRecords.addAll (newContacts);

        jsonContacts                      = JSON.serialize (upsertableRecords);
        jsonUpsertedRecords               = GenericApexService.upsertRecords (jsonContacts);

        System.debug (LoggingLevel.FINEST, jsonUpsertedRecords);

        upsertedRecords                   = (List<Contact>) JSON.deserialize (jsonUpsertedRecords, List<Contact>.class);

        Integer i = 0;

        while (i < previousContacts.size()) {
            if (previousContacts[i].FirstName != upsertedRecords[i].FirstName) {
                assertion = false;
            }
            ++i;
        }

        while (i < newContacts.size()) {
            if (previousContacts[i].FirstName != upsertedRecords[i].FirstName) {
                assertion = false;
            }
            ++i;
        }

        System.assert (assertion, 'Records did not return in the same order they were upserted.');
    }

    @IsTest
    static void deleteRecordsAndFail() {
        User standarUser = [SELECT Id, Email FROM User WHERE Email = 'foobar@testorg.com' ];

        System.runAs (standarUser) {
            List<Case> currentCases      = [SELECT Id FROM Case];
            String jsonCases             = null;
            Boolean assertion            = true;

            jsonCases                    = JSON.serialize (currentCases);

            try {
                GenericApexService.deleteRecords (jsonCases);
            } catch (DmlException e) {
                System.debug(e);

            }

            List<Case> leftContacts      = [SELECT Id FROM Case];

            System.assert (leftContacts.size() > 0, 'Access rights were not preserved.');
        }
    }


    @IsTest
    static void deleteRecords() {
        List<Contact> currentContacts   = [SELECT Id FROM Contact];
        String jsonContacts             = null;
        Boolean assertion               = true;

        jsonContacts                    = JSON.serialize (currentContacts);
        GenericApexService.deleteRecords (jsonContacts);

        List<Contact> leftContacts      = [SELECT Id FROM Contact];

        System.assert (leftContacts.size() == 0, 'Records were not deleted');
    }


    // TEST METHODS >>


    // << UTILITIES 

    static Contact createContact (String firstName, String lastName) {
        Contact newContact = new Contact(
            FirstName = firstName,
            LastName  = lastName
        );

        return newContact;
    }

    static void setFixedSearchResults (Id [] fixedSearchResults, List <SObject> sobjects ) {
        for (Integer i = 0; i < fixedSearchResults.size(); i++) {
            fixedSearchResults[i] = sobjects[i].Id;
        }
    } 

    // UTILITIES >>
}


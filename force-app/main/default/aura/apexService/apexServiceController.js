({
    soql_call: function (component, event, helper) {
        let params = event.getParam ('arguments');
        let promise = null;

        if (params) {
            let action_query = helper.configure_action(component, 'c.executeSOQL', 'soqlString', params.query_string);

            promise = new Promise((resolve, reject) => {
                action_query.setCallback(this, $A.getCallback((response) => {
                    helper.handle_response (response, resolve, reject);  // (context) => {handle response properly and resolve promise}
                }));
            }); 

            $A.enqueueAction(action_query);
        }

        return promise;
    },

    sosl_call: function (component, event, helper) {
        let params = event.getParam('arguments');
        let promise = null;


        if (params) {
            let sosl_string = params.query_string;
            let action_name = 'c.executeSOSL';
            let action_find = component.get(action_name);

            action_find.setParam('soslString', sosl_string);

            promise = new Promise((resolve, reject) => {
                action_find.setCallback(this, $A.getCallback((response) => {
                    helper.handle_response (response, resolve, reject);  // (context) => {handle response properly and resolve promise}
                }));
            });

            $A.enqueueAction(action_find);
        }


        return promise;

    },

    insert_call: function (component, event, helper) {
        let params    = event.getParam ('arguments');
        let promise   = null;

        if (params) {
            let sobjects_string         = null;

            let action_name             = 'c.insertRecords';
            let action_insert_records   = component.get (action_name);

            let records                 = helper.add_sobject_type (params);

            sobjects_string             = JSON.stringify(records);
            
            action_insert_records.setParam('jsonSObjects', sobjects_string);

            promise = new Promise((resolve, reject) => {
                action_insert_records.setCallback(this, $A.getCallback((response) => {
                    helper.handle_response (response, resolve, reject);
                }));
            });

            $A.enqueueAction(action_insert_records);
        }
        


        return promise;

    },

    upsert_call: function (component, event, helper) {
        let params    = event.getParam ('arguments');
        let promise   = null;

        if (params) {
            let sobjects_string         = null;
            let action_upsert_records   = component.get ('c.upsertRecords');
            let records                 = helper.add_sobject_type (params);

            sobjects_string             = JSON.stringify (records);

            action_upsert_records.setParam ('jsonSObjects', sobjects_string);

            promise = new Promise((resolve, reject) => {
                action_insert_records.setCallback(this, $A.getCallback((response) => {
                    helper.handle_response (response, resolve, reject);
                }));
            });

            $A.enqueueAction(action_upsert_records);
        }

        return promise;

    },

    update_call: function (component, event, helper) {
        let params = event.getParam ('arguments');
        let promise = null;

        if (params) {
            let sobjects_string         = null;
            let action_update_records   = component.get ('c.updateRecords');
            let records                 = helper.add_sobject_type (params);

            sobjects_string             = JSON.stringify (records);

            sobjects_string = JSON.stringify (params.records);

            action_update_records.setParam ('jsonSObjects', sobjects_string);

            promise = new Promise((resolve, reject) => {
                action_insert_records.setCallback(this, $A.getCallback((response) => {
                    helper.handle_response (response, resolve, reject);
                }));
            });

            $A.enqueueAction(action_update_records);
        }

        return promise;
        
    },

    delete_call: function (component, event, helper) {
        let params = event.getParam ('arguments');
        let promise = null;

        if (params) {
            let sobjects_string         = null;
            let action_delete_records   = component.get ('c.deleteRecords');

            let records                 = helper.add_sobject_type (params);
            sobjects_string             = JSON.stringify (records);

            action_delete_records.setParam ('jsonSObjects', sobjects_string);

            promise = new Promise((resolve, reject) => {
                action_delete_records.setCallback(this, $A.getCallback((response) => {
                    helper.handle_response (response, resolve, reject);
                }));
            });


            $A.enqueueAction(action_delete_records);
        }
         
        return promise;
    }

})

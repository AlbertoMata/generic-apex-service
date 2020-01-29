({
    soql_call: function (component, event, helper) {
        let params = event.getParam ('arguments');
        let promise = null;

        if (params) {

            let action_query = helper.configure_action(component, 'c.executeSOQL', 'soqlString', params.query_string);

            promise = new Promise((resolve, reject) => {

                action_query.setCallback(this, $A.getCallback((response) => {
                    let state = response.getState();

                    if (state === 'SUCCESS') {
                        resolve(JSON.parse(response.getReturnValue()));
                    } else if (state === 'ERROR') {
                        let errors = response.getError();
                        if (errors) {
                            if (errors[0] && errors[0].message) {
                                console.debug('[Generic Apex Service]: ' + errors[0].message);
                            }
                        } else {
                            console.debug('[Generic Apex Service]: Unknown error.');
                        }
                        reject(errors);
                    } else if (state === 'INCOMPLETE') {
                        reject('[Generic Apex Service]: Operation incomplete, check your internet connection.');
                    }

                }));

            }); 

            $A.enqueueAction(action_query);
        }

        return promise;
    },

    sosl_call: function (component, event) {
        let params = event.getParam('arguments');
        let promise = null;


        if (params) {
            let sosl_string = params.query_string;
            let action_name = 'c.executeSOSL';
            let action_find = component.get(action_name);

            action_find.setParam('soslString', sosl_string);

            promise = new Promise((resolve, reject) => {
                action_find.setCallback(this, $A.getCallback(function (response) {
                    let state = response.getState();

                    if (state === 'SUCCESS') {
                        resolve(JSON.parse(response.getReturnValue()));
                    } else if (state === 'ERROR') {
                        let errors = response.getError();
                        if (errors) {
                            if (errors[0] && errors[0].message) {
                                console.debug('[Generic Apex Service]: ' + errors[0].message);
                            }
                        } else {
                            console.debug('[Generic Apex Service]: Unknown error.');
                        }
                        reject(errors);
                    } else if (state === 'INCOMPLETE') {
                        reject('[Generic Apex Service]: Operation incomplete, check your internet connection.');
                    }
                }));
            });

            $A.enqueueAction(action_find);
        }


        return promise;

    },

    insert_call: function (component, event) {
        let params = event.getParam ('arguments');
        let promise = null;


        if (params) {
            let sobjects_string         = null;
            let sobject_type            = params.sobject_type;
            let action_name             = 'c.insertRecords';
            let action_insert_records   = component.get (action_name);

            for (let record of params.records) {
                if ($A.util.isUndefinedOrNull(record.attributes)) {
                    record.attributes = new Object();
                    record.attributes.type = sobject_type;
                }
            }

            sobjects_string = JSON.stringify(params.records);
            
            action_insert_records.setParam('jsonSObjects', sobjects_string);

            promise = new Promise((resolve, reject) => {

                action_insert_records.setCallback(this, $A.getCallback(function(response) {
                    let state = response.getState();

                    if (state === 'SUCCESS') {
                        resolve(JSON.parse(response.getReturnValue()));
                    } else if (state === 'ERROR') {
                        let errors = response.getError();
                        if (errors) {
                            if (errors[0] && errors[0].message) {
                                console.debug('[Generic Apex Service]: ' + errors[0].message);
                            }
                        } else {
                            console.debug('[Generic Apex Service]: Unknown error.');
                        }
                        reject(errors);
                    } else if (state === 'INCOMPLETE') {
                        reject('[Generic Apex Service]: Operation incomplete, check your internet connection.');
                    }

                }));

            });

            $A.enqueueAction(action_insert_records);
        }
        


        return promise;

    },

    upsert_call: function (component, event) {
        let params = event.getParam ('arguments');

        if (params) {
            let sobjects_string         = null;
            let callback                = params.callback;
            let sobject_type            = params.sobject_type;
            let action_insert_records   = component.get ('c.upsert_records');

            for (let record of params.records) {
                if ($A.util.isUndefinedOrNull(record.attributes)) {
                    record.attributes         = new Object ();
                    record.attributes.type    = sobject_type;
                } 
           }

            sobjects_string = JSON.stringify (params.records);

            action_insert_records.setParam ('sobjects_string', sobjects_string);

            action_insert_records.setCallback (this, function (response) {
                let state = response.getState ();
                if (state === 'SUCCESS') {
                    if (callback) callback (response.getReturnValue());
                }
            });

            $A.enqueueAction(action_insert_records);
        }

    },

    update_call: function (component, event) {
        let params = event.getParam ('arguments');

        if (params) {
            let sobjects_string         = null;
            let callback                = params.callback;
            let sobject_type            = params.sobject_type;
            let action_insert_records   = component.get ('c.update_records');

            for (let record of params.records) {
                if ($A.util.isUndefinedOrNull(record.attributes)) {
                    record.attributes         = new Object ();
                    record.attributes.type    = sobject_type;
                } 
           }

            sobjects_string = JSON.stringify (params.records);

            action_insert_records.setParam ('sobjects_string', sobjects_string);

            action_insert_records.setCallback (this, function (response) {
                let state = response.getState ();
                if (state === 'SUCCESS') {
                    if (callback) callback (response.getReturnValue());
                }
            });

            $A.enqueueAction(action_insert_records);
        }
        
    },

    delete_call: function (component, event) {
        let params = event.getParam ('arguments');

        if (params) {
            let sobjects_string         = null;
            let callback                = params.callback;
            let sobject_type            = params.sobject_type;
            let action_delete_records   = component.get ('c.delete_records');

            for (let record of params.records) {
                if ($A.util.isUndefinedOrNull(record.attributes)) {
                    record.attributes         = new Object ();
                    record.attributes.type    = sobject_type;
                } 
           }

            sobjects_string = JSON.stringify (params.records);

            action_delete_records.setParam ('sobjects_string', sobjects_string);

            action_delete_records.setCallback (this, function (response) {
                let state = response.getState ();
                if (state === 'SUCCESS') {
                    if (callback) callback (response.getReturnValue());
                }
            });

            $A.enqueueAction(action_delete_records);
        }

    }

})

window._apex_service = ( function () {
    var service_identifier    = '[GApxS]'
    var service_component     = null;
    var service_initialized   = false;

    function create_component () { 
        return new Promise ((resolve, reject) => {
            $A.createComponent (
                "c:apexServiceAura",
                {},
                function (service_instance, status, error_message) {
                    console.debug(service_identifier + ': ' + status);
                    if (status === 'SUCCESS') {
                        service_component   = service_instance;
                        service_initialized = true;
                        resolve (status, error_message);
                    } else if (status ==='ERROR') {
                        reject (status, error_message);
                    } else if (status === 'INCOMPLETE') {
                        reject (status, error_message);
                    }
                }
            );
        });
    }

    async function initialize_service () {
        await create_component();
    }

    return {
        
        init: function () {
            initialize_service ();
        },

        query: function (query_string) {
            return new Promise ((resolve, reject) => {

                if (!service_initialized) initialize_service (); // Force initialization to simplify the interface

                service_component.soql(query_string).then((results) => {
                    resolve (JSON.parse(JSON.stringify(results)));
                }).catch((errors) => {
                    console.debug (errors);
                    reject (errors);
                });
            });
        }, 

        search: function (search_string) {
            
            if (!service_initialized) initialize_service (); // Force initialization to simplify the interface

            return new Promise ((resolve, reject) => {
                if (service_initialized) {
                    service_component.sosl (search_string, function (results) {
                        resolve (JSON.parse(results));
                    });
                } else {
                    reject (service_identifier + ': Service not initialized');
                } 
            });
        }, 

        insert_records: function (records, sobject_name) {
            return new Promise ((resolve, reject) => {
                if (service_initialized) {
                    service_component.insert_records (records, sobject_name, function (results) {
                        resolve (results);
                    });
                } else {
                    reject (service_identifier + ': Service not initialized');
                }
            });
        },

        upsert_records: function (records, sobject_name) {
            return new Promise ((resolve, reject) => {
                if (service_initialized) {
                    console.debug (records);
                    service_component.upsert_records (records, sobject_name, function (results) {
                        resolve (results);
                    });
                } else {
                    reject (service_identifier + ': Service not initialized');
                }
            });
        },

        update_records: function (records, sobject_name) {
            return new Promise ((resolve, reject) => {
                if (service_initialized) {
                    service_component.update_records (records, sobject_name, function (results) {
                        resolve (results);
                    });
                } else {
                    reject (service_identifier + ': Service not initialized');
                }
            });
        },

        delete_records: function (records, sobject_name) {
            return new Promise ((resolve, reject) => {
                if (service_initialized) {
                    service_component.delete_records (records, sobject_name, function (results) {
                        resolve (results);
                    });
                } else {
                    reject (service_identifier + ': Service not initialized');
                }
            });
        },

    }

}());

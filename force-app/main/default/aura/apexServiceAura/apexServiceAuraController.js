({
    soqlCall: function (component, event, helper) {
        let params = event.getParam('arguments');
        let promise = null;

        if (params) {
            let action_settings = {
                action_name: 'c.executeSOQL',
                action_argument_name: 'soqlString',
                action_argument_value: params.query_string
            };

            promise = helper.setupPromise(component, action_settings);
        }

        return promise;
    },

    soslCall: function (component, event, helper) {
        let params = event.getParam('arguments');
        let promise = null;

        if (params) {
            let action_settings = {
                action_name: 'c.executeSOSL',
                action_argument_name: 'soslString',
                action_argument_value: params.query_string
            };

            promise = helper.setupPromise(component, action_settings);
        }

        return promise;
    },

    insertCall: function (component, event, helper) {
        let params = event.getParam('arguments');
        let promise = null;

        if (params) {
            let sobject_string = helper.getSObjectString(params);
            let action_settings = {
                action_name: 'c.insertRecords',
                action_argument_name: 'jsonSObjects',
                action_argument_value: sobject_string
            };

            promise = helper.setupPromise(component, action_settings);
        }


        return promise;

    },

    updateCall: function (component, event, helper) {
        let params = event.getParam('arguments');
        let promise = null;

        if (params) {
            let sobject_string = helper.getSObjectString(params);
            let action_settings = {
                action_name: 'c.updateRecords',
                action_argument_name: 'jsonSObject',
                action_argument_value: sobject_string
            };

            promise = helper.setup_promise(component, action_settings);

        }

        return promise;

    },

    upsertCall: function (component, event, helper) {
        let params = event.getParam('arguments');
        let promise = null;

        if (params) {
            let sobject_string = helper.getSObjectString(params);
            let action_settings = {
                action_name: 'c.upsertRecords',
                action_argument_name: 'jsonSObjects',
                action_argument_value: sobject_string
            };

            promise = helper.setup_promise(component, action_settings);
        }

        return promise;

    },

    deleteCall: function (component, event, helper) {
        let params = event.getParam('arguments');
        let promise = null;

        if (params) {
            let sobject_string = helper.getSObjectString(params);
            let action_settings = {
                action_name: 'c.deleteRecords',
                action_argument_name: 'jsonSObjects',
                action_argument_value: sobject_string
            };

            promise = helper.setupPromise(component, action_settings);
        }

        return promise;
    }
})

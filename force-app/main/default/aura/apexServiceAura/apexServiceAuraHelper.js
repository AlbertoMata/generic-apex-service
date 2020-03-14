({
    configureAction: function (component, action_name, parameter_name, string_parameter) {
        let action = component.get(action_name);
        let parameters = new Object();

        parameters[parameter_name] = string_parameter;

        action.setParams(parameters);

        return action;
    },

    handleResponse: function (response, resolve, reject) {
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

    },

    addSObjectType: function (params) {
        let sobject_type = params.sobject_type;

        for (let record of params.records) {
            if ($A.util.isUndefinedOrNull(record.attributes)) {
                record.attributes = new Object();
                record.attributes.type = sobject_type;
            }
        }

        return params.records;
    },

    getSObjectString: function (params) {
        let records = this.addSObjectType(params);
        let sobject_string = JSON.stringify(records);

        return sobject_string;
    },

    setupPromise: function (component, action_settings) {

        let action = this.configureAction(
            component,
            action_settings.action_name,
            action_settings.action_argument_name,
            action_settings.action_argument_value
        );

        let promise = new Promise((resolve, reject) => {
            action.setCallback(this, $A.getCallback((response) => {
                this.handleResponse(response, resolve, reject);  // (context) => {handle response properly and resolve promise}
            }));
        });

        $A.enqueueAction(action);

        return promise;
    },

})

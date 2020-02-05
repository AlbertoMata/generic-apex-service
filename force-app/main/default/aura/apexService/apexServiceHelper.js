({
    configure_action: function(component, action_name, parameter_name, string_parameter) {
        let action     = component.get(action_name);
        let parameters = new Object();

        parameters[parameter_name] = string_parameter;

        action.setParams (parameters);

        return action;

    },

    handle_response: function (response, resolve, reject) {
        let state = response.getState();

        if (state === 'SUCCESS') {
            resolve ( JSON.parse (response.getReturnValue()) );
        } else if (state === 'ERROR')  {
            let errors = response.getError ();
            if (errors) {
                if (errors[0] && errors[0].message) {
                    console.debug ('[Generic Apex Service]: ' + errors[0].message);
                }
            } else {
                console.debug ('[Generic Apex Service]: Unknown error.');
            }
            reject (errors);
        } else if (state === 'INCOMPLETE') {
            reject ('[Generic Apex Service]: Operation incomplete, check your internet connection.');
        } 

    },

    add_sobject_type: function (params) {
        let sobject_type            = params.sobject_type;

        for (let record of params.records) {
            if ($A.util.isUndefinedOrNull(record.attributes)) {
                record.attributes = new Object();
                record.attributes.type = sobject_type;
            }
        }

        return params.records;
    }

})

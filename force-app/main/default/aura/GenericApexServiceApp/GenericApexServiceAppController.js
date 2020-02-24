({
    scripts_cargados: function (component, event, helper) {
        _apex_service.init ();
    },

    query_accounts: function (component, event, helper) {
        let apex_service = component.find ('apex_service');

        apex_service.soql ('SELECT Id, Name, Fax FROM Account').then ((results) => {
            console.debug (results); 
        }).catch(error => {
            console.log(error);
        });

    },

    search_accounts: function (component, event, helper) {
        let apex_service = component.find ('apex_service');

        apex_service.sosl ('FIND {foo} IN NAME Fields RETURNING Account(Name,Fax)').then ((results) => {
            console.debug (results); 
        }); 

    },

    insert_accounts: function (component, event, helper) {
        let apex_service = component.find ('apex_service');

        let foo         = new Object();
            foo.Name    = 'foo';
            foo.Fax     = '+1-212-9876543';

        let accs        = new Array();
            accs.push (foo);

        apex_service.insert (accs,'Account').then ((results) => {
            console.debug (results); 
        }); 

    },

    delete_accounts: function (component, event, helper) {
        let apex_service = component.find ('apex_service');


        apex_service.soql ("SELECT Id, Name FROM Account WHERE Name = 'foo' ").then ((results) => {
            console.debug (results); 
            console.debug (typeof results); 
            apex_service.delete(results, 'Account').then ((results) => { console.debug (results) }  );
        }); 

    }

})

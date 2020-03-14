({
    scripts_cargados: function (component, event, helper) {
        _apexService.init ();
    },

    query_accounts: function (component, event, helper) {
        let apexService = component.find ('apexService');

        apexService.soql ('SELECT Id, Name, Fax FROM Account').then ((results) => {
            console.debug (results); 
        }).catch(error => {
            console.log(error);
        });

    },

    search_accounts: function (component, event, helper) {
        let apexService = component.find ('apexService');

        apexService.sosl ('FIND {foo} IN NAME Fields RETURNING Account(Name,Fax)').then ((results) => {
            console.debug (results); 
        }); 

    },

    insert_accounts: function (component, event, helper) {
        let apexService = component.find ('apexService');

        let foo         = new Object();
            foo.Name    = 'foo';
            foo.Fax     = '+1-212-9876543';

        let accs        = new Array();
            accs.push (foo);

        apexService.insert (accs,'Account').then ((results) => {
            console.debug (results); 
        }); 

    },

    delete_accounts: function (component, event, helper) {
        let apexService = component.find ('apexService');


        apexService.soql ("SELECT Id, Name FROM Account WHERE Name = 'foo' ").then ((results) => {
            console.debug (results); 
            console.debug (typeof results); 
            apexService.delete(results, 'Account').then ((results) => { console.debug (results) }  );
        }); 

    }

})

import { LightningElement } from 'lwc';

export default class ApexServiceDemo extends LightningElement {

    handleClick = event => {
            let apexService = this.template.querySelector('c-apex-service');

            let accountPromise = apexService.soql ('SELECT Name, ( SELECT LastName FROM Contacts) FROM Account');

            accountPromise.then(result => {
                console.log(result);

            });
    }

    searchAccounts = event => {
        let apexService = this.template.querySelector('c-apex-service');
        apexService.sosl ('FIND {foo} IN NAME Fields RETURNING Account(Name,Fax)').then ((results) => {
            console.debug (results); 
        }); 


    }

    insertAccounts = event => {
        let apexService = this.template.querySelector('c-apex-service');

        let foo         = new Object();
            foo.Name    = 'foo';
            foo.Fax     = '+1-212-9876543';

        let accs        = new Array();
            accs.push (foo);

        apexService.insert (accs,'Account').then ((results) => {
            console.debug (results); 
        }); 
    }


}
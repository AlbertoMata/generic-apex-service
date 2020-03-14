import { LightningElement, api } from 'lwc';

import executeSOQL from '@salesforce/apex/GenericApexService.executeSOQL';
import executeSOSL from '@salesforce/apex/GenericApexService.executeSOSL';

import insertRecords from '@salesforce/apex/GenericApexService.insertRecords';
import updateRecords from '@salesforce/apex/GenericApexService.updateRecords';
import upsertRecords from '@salesforce/apex/GenericApexService.upsertRecords';
import deleteRecords from '@salesforce/apex/GenericApexService.deleteRecords';


export default class ApexService extends LightningElement {

    @api
    soql(soqlString) {
        return new Promise((resolve, reject) => {
            executeSOQL({ soqlString: soqlString })
                .then(result => {
                    resolve(JSON.parse(result));
                })
                .catch(error => {
                    console.error(error);
                    reject(error);
                });
        });
    }

    @api
    sosl(soslString) {
        let action_promise = new Promise((resolve, reject) => {
            executeSOSL({ soslString: soslString })
                .then(result => {
                    resolve(JSON.parse(result));
                })
                .catch(error => {
                    console.error(error);
                    reject(error);
                });

        });
        return action_promise;
    }

    @api
    insert(records, sobject_type) {
        const jsonSObjects = this.get_sobject_string(records, sobject_type);

        console.log(jsonSObjects);

        return new Promise((resolve, reject) => {
            insertRecords({ jsonSObjects: jsonSObjects })
                .then(result => {
                    resolve(JSON.parse(result));
                })
                .catch(error => {
                    console.error(error);
                    reject(error);
                });

        });

    }

    @api
    update(records, sobject_type) {
        const jsonSObjects = this.get_sobject_string(records, sobject_type);

        return new Promise((resolve, reject) => {
            updateRecords({ jsonSObjects: jsonSObjects })
                .then(result => {
                    resolve(JSON.parse(result));
                })
                .catch(error => {
                    console.error(error);
                    reject(error);
                });
        });

    }

    @api
    upsert(records, sobject_type) {
        const jsonSObjects = this.get_sobject_string(records, sobject_type);

        return new Promise((resolve, reject) => {
            upsertRecords({ jsonSObjects: jsonSObjects })
                .then(result => {
                    resolve(JSON.parse(result));
                })
                .catch(error => {
                    console.error(error);
                    reject(error);
                });
        });

    }

    @api
    delete(records, sobject_type) {
        const jsonSObjects = this.get_sobject_string(records, sobject_type);

        return new Promise((resolve, reject) => {
            deleteRecords({ jsonSObjects: jsonSObjects })
                .then(result => {
                    resolve(JSON.parse(result));
                })
                .catch(error => {
                    console.error(error);
                    reject(error);
                });
        });

    }

    get_sobject_string = (records, sobject_type) => {
        const formatted_records = this.add_sobject_type(records, sobject_type);
        return JSON.stringify(formatted_records);
    }

    add_sobject_type = (records, sobject_type) => {
        const formatted_records = records.map(record => {
            record.attributes = new Object();
            record.attributes.type = sobject_type;

            return record;
        });

        return formatted_records;
    }


}
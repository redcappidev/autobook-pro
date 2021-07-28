import path from 'path';
import { Model } from 'objection';
import { Table } from '@server/db/common';
import BaseModel from './base';
import jsonSchema from './json-schemas/payer-billing-method.schema';

class PayerBillingMethod extends BaseModel {
  static get tableName() {
    return Table.PAYER_BILLING_METHOD;
  }

  static get jsonSchema() {
    return jsonSchema;
  }

  static get relationMappings() {
    return {
      payer: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, 'payer'),
        join: {
          from: `${Table.PAYER_BILLING_METHOD}.payerId`,
          to: `${Table.PAYER}.id`
        }
      }
    };
  }
}

export default PayerBillingMethod;

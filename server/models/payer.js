import path from 'path';
import { Model } from 'objection';
import { Table } from '@server/db/common';
import BaseModel from './base';
import jsonSchema from './json-schemas/payer.schema';

class Payer extends BaseModel {
  static get tableName() {
    return Table.PAYER;
  }

  static get jsonSchema() {
    return jsonSchema;
  }

  static get relationMappings() {
    return {
      quotes: {
        relation: Model.HasManyRelation,
        modelClass: path.join(__dirname, 'quote'),
        join: {
          from: `${Table.PAYER}.id`,
          to: `${Table.QUOTE}.payerId`
        }
      },
      billingMethods: {
        relation: Model.HasManyRelation,
        modelClass: path.join(__dirname, 'payer-billing-method'),
        join: {
          from: `${Table.PAYER}.id`,
          to: `${Table.PAYER_BILLING_METHOD}.payerId`
        }
      }
    };
  }
}

export default Payer;

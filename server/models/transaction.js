import path from 'path';
import { Model } from 'objection';
import { Table } from '@server/db/common';
import BaseModel from './base';
import jsonSchema from './json-schemas/transaction.schema';

class Transaction extends BaseModel {
  static get tableName() {
    return Table.TRANSACTION;
  }

  static get jsonSchema() {
    return jsonSchema;
  }

  static get relationMappings() {
    return {
      order: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, 'quote'),
        join: {
          from: `${Table.TRANSACTION}.orderId`,
          to: `${Table.QUOTE}.id`
        }
      }
    };
  }
}

export default Transaction;

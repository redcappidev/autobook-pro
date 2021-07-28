import path from 'path';
import { Model } from 'objection';
import { Table } from '@server/db/common';
import BaseModel from './base';
import jsonSchema from './json-schemas/connection.schema';

class Connection extends BaseModel {
  static get tableName() {
    return Table.CONNECTION;
  }

  static get jsonSchema() {
    return jsonSchema;
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.HasOneRelation,
        modelClass: path.join(__dirname, 'user'),
        join: {
          from: `${Table.CONNECTION}.userId`,
          to: `${Table.USER}.id`
        }
      }
    };
  }
}

export default Connection;

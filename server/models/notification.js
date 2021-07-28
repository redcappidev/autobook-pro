import path from 'path';
import { Model } from 'objection';
import { Table } from '@server/db/common';
import BaseModel from './base';
import jsonSchema from './json-schemas/notification.schema';

class Notification extends BaseModel {
  static get tableName() {
    return Table.NOTIFICATION;
  }

  static get jsonSchema() {
    return jsonSchema;
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, 'user'),
        join: {
          from: `${Table.NOTIFICATION}.userId`,
          to: `${Table.USER}.id`
        }
      }
    };
  }
}

export default Notification;

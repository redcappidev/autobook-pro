import path from 'path';
import { Model } from 'objection';
import { Table } from '@server/db/common';
import BaseModel from './base';
import jsonSchema from './json-schemas/event.schema';

class Event extends BaseModel {
  static get tableName() {
    return Table.EVENT;
  }

  static get jsonSchema() {
    return jsonSchema;
  }

  static get relationMappings() {
    return {
      emitter: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, 'user'),
        join: {
          from: `${Table.EVENT}.userId`,
          to: `${Table.USER}.id`
        }
      }
    };
  }
}

export default Event;

import path from 'path';
import { Model } from 'objection';
import { Table } from '@server/db/common';
import BaseModel from './base';
import jsonSchema from './json-schemas/background-job.schema';

class BackgroundJob extends BaseModel {
  static get tableName() {
    return Table.BACKGROUND_JOB;
  }

  static get jsonSchema() {
    return jsonSchema;
  }

  static get relationMappings() {
    return {
      quote: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, 'quote'),
        join: {
          from: `${Table.BACKGROUND_JOB}.quoteId`,
          to: `${Table.QUOTE}.id`
        }
      },
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, 'user'),
        join: {
          from: `${Table.BACKGROUND_JOB}.userId`,
          to: `${Table.USER}.id`
        }
      }
    };
  }
}

export default BackgroundJob;

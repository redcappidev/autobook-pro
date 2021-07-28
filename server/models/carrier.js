import path from 'path';
import { Model } from 'objection';
import { Table } from '@server/db/common';
import BaseModel from './base';
import jsonSchema from './json-schemas/carrier.schema';

class Carrier extends BaseModel {
  static get tableName() {
    return Table.CARRIER;
  }

  static get jsonSchema() {
    return jsonSchema;
  }

  static get relationMappings() {
    return {
      drivers: {
        relation: Model.HasManyRelation,
        modelClass: path.join(__dirname, 'driver'),
        join: {
          from: `${Table.CARRIER}.id`,
          to: `${Table.DRIVER}.carrierId`
        }
      },
      attachments: {
        relation: Model.HasManyRelation,
        modelClass: path.join(__dirname, 'asset'),
        filter(builder) {
          builder.where('attachableType', 'Carrier');
        },
        beforeInsert(model) {
          // eslint-disable-next-line no-param-reassign
          model.attachableType = 'Carrier';
        },
        join: {
          from: `${Table.CARRIER}.id`,
          to: `${Table.ASSET}.attachableId`
        }
      },
      notes: {
        relation: Model.HasManyRelation,
        modelClass: path.join(__dirname, 'note'),
        filter(builder) {
          builder.where('noteableType', 'Carrier');
        },
        beforeInsert(model) {
          // eslint-disable-next-line no-param-reassign
          model.noteableType = 'Carrier';
        },
        join: {
          from: `${Table.CARRIER}.id`,
          to: `${Table.NOTE}.noteableId`
        }
      }
    };
  }
}

export default Carrier;

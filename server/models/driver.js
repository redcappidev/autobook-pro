import path from 'path';
import { Model } from 'objection';
import { Table } from '@server/db/common';
import BaseModel from './base';
import jsonSchema from './json-schemas/driver.schema';

class Driver extends BaseModel {
  static get tableName() {
    return Table.DRIVER;
  }

  static get jsonSchema() {
    return jsonSchema;
  }

  static get relationMappings() {
    return {
      carrier: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, 'carrier'),
        join: {
          from: `${Table.DRIVER}.carrierId`,
          to: `${Table.CARRIER}.id`
        }
      },
      dispatches: {
        relation: Model.HasManyRelation,
        modelClass: path.join(__dirname, 'dispatch'),
        join: {
          from: `${Table.DRIVER}.id`,
          to: `${Table.DISPATCH}.driverId`
        }
      }
    };
  }
}

export default Driver;

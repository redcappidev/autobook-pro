import path from 'path';
import { Model } from 'objection';
import { Table } from '@server/db/common';
import BaseModel from './base';
import jsonSchema from './json-schemas/vehicle-size.schema';

class VehicleSize extends BaseModel {
  static get tableName() {
    return Table.VEHICLE_SIZE;
  }

  static get jsonSchema() {
    return jsonSchema;
  }

  static get relationMappings() {
    return {
      vehicles: {
        relation: Model.HasManyRelation,
        modelClass: path.join(__dirname, 'vehicle-sizechart'),
        join: {
          from: `${Table.VEHICLE_SIZE}.id`,
          to: `${Table.VEHICLE_SIZECHART}.sizeId`
        }
      }
    };
  }
}

export default VehicleSize;

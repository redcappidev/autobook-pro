import path from 'path';
import { Model } from 'objection';
import { Table } from '@server/db/common';
import BaseModel from './base';
import jsonSchema from './json-schemas/vehicle-sizechart.schema';

class VehicleSizeChart extends BaseModel {
  static get tableName() {
    return Table.VEHICLE_SIZECHART;
  }

  static get jsonSchema() {
    return jsonSchema;
  }

  static get relationMappings() {
    return {
      size: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, 'vehicle-size'),
        join: {
          from: `${Table.VEHICLE_SIZECHART}.sizeId`,
          to: `${Table.VEHICLE_SIZE}.id`
        }
      }
    };
  }
}

export default VehicleSizeChart;

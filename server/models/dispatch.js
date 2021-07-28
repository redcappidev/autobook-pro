import path from 'path';
import { Model } from 'objection';
import { Table } from '@server/db/common';
import { getDateStringFromDateObject } from '@server/lib/date-format';
import BaseModel from './base';
import jsonSchema from './json-schemas/dispatch.schema';

class Dispatch extends BaseModel {
  static get tableName() {
    return Table.DISPATCH;
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
          from: `${Table.DISPATCH}.orderId`,
          to: `${Table.QUOTE}.id`
        }
      },
      driver: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, 'driver'),
        join: {
          from: `${Table.DISPATCH}.driverId`,
          to: `${Table.DRIVER}.id`
        }
      }
    };
  }

  $parseJson(json, opt) {
    const newJson = super.$parseJson(json, opt);

    if (newJson.pickupDate && typeof newJson.pickupDate !== 'string') {
      newJson.pickupDate = getDateStringFromDateObject(newJson.pickupDate);
    }

    if (newJson.deliveryDate && typeof newJson.deliveryDate !== 'string') {
      newJson.deliveryDate = getDateStringFromDateObject(newJson.deliveryDate);
    }

    return newJson;
  }
}

export default Dispatch;

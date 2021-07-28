import path from 'path';
import { Model } from 'objection';
import { Table } from '@server/db/common';
import BaseModel from './base';
import jsonSchema from './json-schemas/order-link.schema';

class OrderLink extends BaseModel {
  static get tableName() {
    return Table.ORDER_LINK;
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
          from: `${Table.ORDER_LINK}.orderId`,
          to: `${Table.QUOTE}.id`
        }
      }
    };
  }
}

export default OrderLink;

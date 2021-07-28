import { Table } from '@server/db/common';
import BaseModel from './base';
import jsonSchema from './json-schemas/short-code.schema';

class ShortCode extends BaseModel {
  static get tableName() {
    return Table.SHORT_CODE;
  }

  static get jsonSchema() {
    return jsonSchema;
  }
}

export default ShortCode;

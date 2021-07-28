import { Table } from '@server/db/common';
import BaseModel from './base';
import jsonSchema from './json-schemas/asset.schema';

class Asset extends BaseModel {
  static get tableName() {
    return Table.ASSET;
  }

  static get jsonSchema() {
    return jsonSchema;
  }
}

export default Asset;

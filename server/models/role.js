import path from 'path';
import { Model } from 'objection';
import { Table } from '@server/db/common';
import BaseModel from './base';
import jsonSchema from './json-schemas/role.schema';

class Role extends BaseModel {
  static get tableName() {
    return Table.ROLE;
  }

  static get jsonSchema() {
    return jsonSchema;
  }

  static get relationMappings() {
    return {
      users: {
        relation: Model.HasManyRelation,
        modelClass: path.join(__dirname, 'user'),
        join: {
          from: `${Table.ROLE}.id`,
          to: `${Table.USER}.roleId`
        }
      }
    };
  }
}

export default Role;

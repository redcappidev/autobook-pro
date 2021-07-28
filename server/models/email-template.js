import path from 'path';
import { Model } from 'objection';
import { Table } from '@server/db/common';
import BaseModel from './base';
import jsonSchema from './json-schemas/email-template.schema';

class EmailTemplate extends BaseModel {
  static get tableName() {
    return Table.EMAIL_TEMPLATE;
  }

  static get jsonSchema() {
    return jsonSchema;
  }

  static get relationMappings() {
    return {
      statuses: {
        relation: Model.HasManyRelation,
        modelClass: path.join(__dirname, 'status'),
        join: {
          from: `${Table.EMAIL_TEMPLATE}.id`,
          to: `${Table.STATUS}.emailTemplateId`
        }
      }
    };
  }
}

export default EmailTemplate;

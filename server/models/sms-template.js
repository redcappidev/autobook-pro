import path from 'path';
import { Model } from 'objection';
import { Table } from '@server/db/common';
import BaseModel from './base';
import jsonSchema from './json-schemas/sms-template.schema';

class SMSTemplate extends BaseModel {
  static get tableName() {
    return Table.SMS_TEMPLATE;
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
          from: `${Table.SMS_TEMPLATE}.id`,
          to: `${Table.STATUS}.smsTemplateId`
        }
      },
      followupTypes: {
        relation: Model.HasManyRelation,
        modelClass: path.join(__dirname, 'followup-type'),
        join: {
          from: `${Table.SMS_TEMPLATE}.id`,
          to: `${Table.FOLLOWUP_TYPE}.smsTemplateId`
        }
      }
    };
  }
}

export default SMSTemplate;

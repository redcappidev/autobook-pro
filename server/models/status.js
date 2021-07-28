import path from 'path';
import { Model } from 'objection';
import { Table } from '@server/db/common';
import BaseModel from './base';
import jsonSchema from './json-schemas/status.schema';

class Status extends BaseModel {
  static get tableName() {
    return Table.STATUS;
  }

  static get jsonSchema() {
    return jsonSchema;
  }

  static get relationMappings() {
    return {
      notificationEmailTemplate: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, 'email-template'),
        join: {
          from: `${Table.STATUS}.emailTemplateId`,
          to: `${Table.EMAIL_TEMPLATE}.id`
        }
      },
      notificationSMSTemplate: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, 'sms-template'),
        join: {
          from: `${Table.STATUS}.smsTemplateId`,
          to: `${Table.SMS_TEMPLATE}.id`
        }
      },
      parent: {
        relation: Model.BelongsToOneRelation,
        modelClass: Status,
        join: {
          from: `${Table.STATUS}.parentId`,
          to: `${Table.STATUS}.id`
        }
      },
      children: {
        relation: Model.HasManyRelation,
        modelClass: Status,
        join: {
          from: `${Table.STATUS}.id`,
          to: `${Table.STATUS}.parentId`
        }
      },
      quotesAsParentStatus: {
        relation: Model.HasManyRelation,
        modelClass: path.join(__dirname, 'quote'),
        join: {
          from: `${Table.STATUS}.id`,
          to: `${Table.QUOTE}.parentStatusId`
        }
      },
      quotesAsChildStatus: {
        relation: Model.HasManyRelation,
        modelClass: path.join(__dirname, 'quote'),
        join: {
          from: `${Table.STATUS}.id`,
          to: `${Table.QUOTE}.childStatusId`
        }
      }
    };
  }
}

export default Status;

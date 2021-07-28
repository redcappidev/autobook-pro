import path from 'path';
import { Model } from 'objection';
import { Table } from '@server/db/common';
import { getDateStringFromDateObject } from '@server/lib/date-format';
import BaseModel from './base';
import jsonSchema from './json-schemas/quote.schema';

class Quote extends BaseModel {
  static get tableName() {
    return Table.QUOTE;
  }

  static get jsonSchema() {
    return jsonSchema;
  }

  static get relationMappings() {
    return {
      parent: {
        relation: Model.BelongsToOneRelation,
        modelClass: Quote,
        join: {
          from: `${Table.QUOTE}.parentId`,
          to: `${Table.QUOTE}.id`
        }
      },
      children: {
        relation: Model.HasManyRelation,
        modelClass: Quote,
        join: {
          from: `${Table.QUOTE}.id`,
          to: `${Table.QUOTE}.parentId`
        }
      },
      parentStatus: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, 'status'),
        join: {
          from: `${Table.QUOTE}.parentStatusId`,
          to: `${Table.STATUS}.id`
        }
      },
      childStatus: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, 'status'),
        join: {
          from: `${Table.QUOTE}.childStatusId`,
          to: `${Table.STATUS}.id`
        }
      },
      assignee: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, 'user'),
        join: {
          from: `${Table.QUOTE}.assigneeId`,
          to: `${Table.USER}.id`
        }
      },
      transitions: {
        relation: Model.HasManyRelation,
        modelClass: path.join(__dirname, 'quote-transition'),
        join: {
          from: `${Table.QUOTE}.id`,
          to: `${Table.QUOTE_TRANSITION}.quoteId`
        }
      },
      attachments: {
        relation: Model.HasManyRelation,
        modelClass: path.join(__dirname, 'asset'),
        filter(builder) {
          builder.where('attachableType', 'Quote');
        },
        beforeInsert(model) {
          // eslint-disable-next-line no-param-reassign
          model.attachableType = 'Quote';
        },
        join: {
          from: `${Table.QUOTE}.id`,
          to: `${Table.ASSET}.attachableId`
        }
      },
      internalNotes: {
        relation: Model.HasManyRelation,
        modelClass: path.join(__dirname, 'note'),
        filter(builder) {
          builder.where('noteableType', 'Quote');
        },
        beforeInsert(model) {
          // eslint-disable-next-line no-param-reassign
          model.noteableType = 'Quote';
        },
        join: {
          from: `${Table.QUOTE}.id`,
          to: `${Table.NOTE}.noteableId`
        }
      },
      followups: {
        relation: Model.HasManyRelation,
        modelClass: path.join(__dirname, 'followup'),
        join: {
          from: `${Table.QUOTE}.id`,
          to: `${Table.FOLLOWUP}.quoteId`
        }
      },
      payer: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, 'payer'),
        join: {
          from: `${Table.QUOTE}.payerId`,
          to: `${Table.PAYER}.id`
        }
      },
      payerBillingMethod: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, 'payer-billing-method'),
        join: {
          from: `${Table.QUOTE}.payerBillingMethodId`,
          to: `${Table.PAYER_BILLING_METHOD}.id`
        }
      },
      transactions: {
        relation: Model.HasManyRelation,
        modelClass: path.join(__dirname, 'transaction'),
        join: {
          from: `${Table.QUOTE}.id`,
          to: `${Table.TRANSACTION}.orderId`
        }
      },
      dispatch: {
        relation: Model.HasOneRelation,
        modelClass: path.join(__dirname, 'dispatch'),
        join: {
          from: `${Table.QUOTE}.id`,
          to: `${Table.DISPATCH}.orderId`
        }
      },
      events: {
        relation: Model.HasManyRelation,
        modelClass: path.join(__dirname, 'event'),
        filter(builder) {
          builder.where('targetType', 'Quote');
        },
        beforeInsert(model) {
          // eslint-disable-next-line no-param-reassign
          model.targetType = 'Quote';
        },
        join: {
          from: `${Table.QUOTE}.id`,
          to: `${Table.EVENT}.targetId`
        }
      }
    };
  }

  $parseJson(json, opt) {
    const newJson = super.$parseJson(json, opt);

    if (typeof newJson['transport:availableDate'] === 'object') {
      newJson['transport:availableDate'] = getDateStringFromDateObject(
        newJson['transport:availableDate']
      );
    } else if (newJson.transport && typeof newJson.transport.availableDate === 'object') {
      newJson.transport.availableDate = getDateStringFromDateObject(
        newJson.transport.availableDate
      );
    }

    return newJson;
  }
}

export default Quote;

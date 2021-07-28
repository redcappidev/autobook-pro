import camelCaseString from 'lodash/camelCase';
import _knex from './knex';

export function transaction(fn) {
  return _knex.transaction(fn);
}

/**
 * Run a block of code, creating a new transaction if one isn't passed
 *
 * @param opts with nullable knex transaction object
 * @param fn async function that takes a modified opts object as its only argument
 * @return {Promise<*>}
 */
export function withTransaction(opts, fn) {
  if (opts && opts.transaction) {
    return fn(opts);
  }
  return transaction((trx) => fn({ ...opts, transaction: trx }));
}

export function queryBuilder(tableName, opts) {
  const trx = opts && opts.transaction;
  const builder = trx ? trx(tableName) : _knex(tableName);
  if (opts && opts.forUpdate) {
    return builder.forUpdate();
  }
  return builder;
}

export const Table = {
  USER: camelCaseString('users'),
  ROLE: camelCaseString('roles'),
  PHONE_NUMBER: camelCaseString('phone_numbers'),
  PAYER: camelCaseString('payers'),
  PAYER_BILLING_METHOD: camelCaseString('payer_billing_methods'),
  ASSET: camelCaseString('assets'),
  NOTE: camelCaseString('notes'),
  QUOTE: camelCaseString('quotes'),
  QUOTE_TRANSITION: camelCaseString('quote_transitions'),
  ORDER_LINK: camelCaseString('order_links'),
  TRANSACTION: camelCaseString('transactions'),
  US_CITIES: camelCaseString('us_cities'),
  PRICING_EXCEPTION: camelCaseString('pricing_exceptions'),
  MILEAGE_PRICING: camelCaseString('mileage_pricings'),
  VEHICLE_SIZE: camelCaseString('vehicle_sizes'),
  VEHICLE_SIZECHART: camelCaseString('vehicle_sizecharts'),
  ENCLOSED_FEE: camelCaseString('enclosed_fees'),
  FEE: camelCaseString('fees'),
  EMAIL_TEMPLATE: camelCaseString('email_templates'),
  SMS_TEMPLATE: camelCaseString('sms_templates'),
  STATUS: camelCaseString('statuses'),
  NOTE_ASSIGNMENT: camelCaseString('note_assignments'),
  FOLLOWUP_TYPE: camelCaseString('followup_types'),
  FOLLOWUP: camelCaseString('followups'),
  CARRIER: camelCaseString('carriers'),
  DRIVER: camelCaseString('drivers'),
  DISPATCH: camelCaseString('dispatches'),
  INVITATION: camelCaseString('invitations'),
  REPORT: camelCaseString('reports'),
  EVENT: camelCaseString('events'),
  CONNECTION: camelCaseString('connections'),
  BACKGROUND_JOB: camelCaseString('background_jobs'),
  NOTIFICATION: camelCaseString('notifications'),
  SHORT_CODE: camelCaseString('short_codes')
};

export const knex = _knex;

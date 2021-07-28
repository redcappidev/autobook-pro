/* eslint-disable no-restricted-syntax */
// import placeholderData from '@server/constants/placeholders';
import config from '@server/config';
import { Quote, ShortCode } from '@server/models';
import runPromiseSerial from '@server/lib/promise-serial';
import { convertFormat } from '@server/lib/phone-format';
import * as orderLinkService from './order-link-service';
import * as paymentService from './payment-service';

const resolver = async (user, quote, value) => {
  let returnData;

  if (value === 'email_from_name') {
    returnData = `${user.firstName} ${user.lastName}`;
  } else if (value === 'quote_id') {
    returnData = quote.id;
  } else if (value === 'price') {
    returnData = quote.transport.totalPrice;
  } else if (value === 'deposit') {
    returnData = quote.transport.deposit;
  } else if (value === 'shipper_note') {
    returnData = quote.shipper.note;
  } else if (value === 'cust_firstname') {
    returnData = quote.shipper.firstName;
  } else if (value === 'cust_lastname') {
    returnData = quote.shipper.lastName;
  } else if (value === 'shipper_company') {
    returnData = quote.shipper.companyName;
  } else if (value === 'shipper_email') {
    returnData = quote.shipper.email;
  } else if (value === 'shipper_phone1') {
    returnData = quote.shipper.phone;
    returnData = convertFormat(quote.shipper.phone);
  } else if (value === 'shipper_phone2') {
    returnData = quote.shipper.phone2;
    returnData = convertFormat(quote.shipper.phone2);
  } else if (value === 'shipper_address1') {
    returnData = quote.shipper.address;
  } else if (value === 'shipper_address2') {
    returnData = quote.shipper.address2;
  } else if (value === 'shipper_city') {
    returnData = quote.shipper.city;
  } else if (value === 'shipper_state') {
    returnData = quote.shipper.state;
  } else if (value === 'shipper_zip') {
    returnData = quote.shipper.zipcode;
  } else if (value === 'cc_last_four') {
    const order = await Quote.query()
      .findById(quote.id)
      .withGraphFetched('[payer,payerBillingMethod]');
    const anetProfileId = order.payer ? order.payer.anetProfileId : null;
    const anetPaymentProfileId = order.payerBillingMethod
      ? order.payerBillingMethod.anetPaymentProfileId
      : null;

    const info = await paymentService.getBillingInformation(
      anetProfileId,
      anetPaymentProfileId
    );
    returnData = info ? info.creditCard.cardNumber : '';
  } else if (value === 'my_name') {
    returnData = `${user.firstName} ${user.lastName}`;
  } else if (value === 'my_company_name') {
    returnData = 'Route Runners Auto Transport';
  } else if (value === 'my_email') {
    returnData = user.email;
  } else if (value === 'origin') {
    returnData = quote.origin.name;
  } else if (value === 'origin_phone') {
    returnData = convertFormat(quote.origin.phone);
  } else if (value === 'origin_phone2') {
    returnData = convertFormat(quote.origin.phone2);
  } else if (value === 'origin_email') {
    returnData = quote.origin.email;
  } else if (value === 'origin_address') {
    returnData = quote.origin.address;
  } else if (value === 'origin_address2') {
    returnData = quote.origin.address2;
  } else if (value === 'origin_city') {
    returnData = quote.origin.city;
  } else if (value === 'origin_state') {
    returnData = quote.origin.state;
  } else if (value === 'origin_zipcode') {
    returnData = quote.origin.zipcode;
  } else if (value === 'destination') {
    returnData = quote.destination.name;
  } else if (value === 'destination_phone') {
    returnData = convertFormat(quote.destination.phone);
  } else if (value === 'destination_phone2') {
    returnData = convertFormat(quote.destination.phone2);
  } else if (value === 'destination_email') {
    returnData = quote.destination.email;
  } else if (value === 'destination_address') {
    returnData = quote.destination.address;
  } else if (value === 'destination_address2') {
    returnData = quote.destination.address2;
  } else if (value === 'destination_city') {
    returnData = quote.destination.city;
  } else if (value === 'destination_zipcode') {
    returnData = quote.destination.zipcode;
  } else if (value === 'vehicle_list') {
    returnData = '';
    quote.vehicles.forEach((vehicle) => {
      const { year, make, model } = vehicle;
      returnData = `${returnData}${year}, ${make}, ${model} \n`;
    });
  } else if (value === 'vehicle_vin') {
    returnData = quote.vehicles.map((v) => v.vin).join(',');
  } else if (value === 'vehicle_year') {
    returnData = quote.vehicles.map((v) => v.year).join(',');
  } else if (value === 'vehicle_make') {
    returnData = quote.vehicles.map((v) => v.make).join(',');
  } else if (value === 'vehicle_model') {
    returnData = quote.vehicles.map((v) => v.model).join(',');
  } else if (value === 'vehicle_inop') {
    returnData = quote.vehicles.map((v) => (v.operable ? 'operable' : 'inoperable')).join(',');
  } else if (value === 'carrier_type') {
    returnData = quote.transport.carrierType;
  } else if (value === 'available_date') {
    returnData = quote.transport.availableDate;
  } else if (value === 'delivery_date') {
    returnData = quote.transport.deliveryDate;
  } else if (value === 'order_link') {
    const orderLink = await orderLinkService.createOrderLink(quote.id, 'BOOKING');
    returnData = `${config.baseUrl}/book-order/${orderLink.encryption}`;
  } else if (value === 'billing_link') {
    const orderLink = await orderLinkService.createOrderLink(quote.id, 'BILLING');
    returnData = `${config.baseUrl}/billing-information/${orderLink.encryption}`;
  } else if (value === 'dispatch_message_to_carrier') {
    returnData = '';
  } else if (value === 'dispatch_driver_name') {
    returnData = '';
  } else if (value === 'dispatch_driver_phone') {
    returnData = '';
  } else if (value === 'dispatch_pickup_date') {
    returnData = '';
  } else if (value === 'dispatch_deliver_date') {
    returnData = '';
  } else if (value === 'dispatch_carrier_pay') {
    returnData = '';
  } else if (value === 'carrier_name') {
    returnData = '';
  } else if (value === 'carrier_mc') {
    returnData = user.email;
  } else if (value === 'carrier_dot') {
    returnData = '';
  } else if (value === 'dispatch_driver_phone') {
    returnData = '';
  } else if (value === 'carrier_primary_contact') {
    returnData = '';
  } else if (value === 'carrier_phone') {
    returnData = user.email;
  } else if (value === 'carrier_email') {
    returnData = '';
  } else if (value === 'carrier_custom_field1') {
    returnData = '';
  } else if (value === 'carrier_custom_field2') {
    returnData = '';
  } else if (value === 'carrier_custom_field3') {
    returnData = '';
  } else if (value === 'carrier_custom_field4') {
    returnData = '';
  } else if (value === 'carrier_custom_field5') {
    returnData = '';
  } else if (value === 'carrier_custom_text') {
    returnData = '';
  } else if (value === 'shipper_custom_text') {
    returnData = '';
  } else if (value === 'last_payment_amount') {
    returnData = '';
  } else if (value === 'custom_order_number') {
    returnData = '';
  } else {
    returnData = null;
  }

  return returnData;
};

const getWordsBetweenCurlies = (str) => {
  const results = [];

  if (str.includes('~email_from_name~')) {
    results.push('email_from_name');
  }
  if (str.includes('~quote_id~')) {
    results.push('quote_id');
  }
  if (str.includes('~price~')) {
    results.push('price');
  }
  if (str.includes('~deposit~')) {
    results.push('deposit');
  }
  if (str.includes('~shipper_note~')) {
    results.push('shipper_note');
  }
  if (str.includes('~cust_firstname~')) {
    results.push('cust_firstname');
  }
  if (str.includes('~cust_lastname~')) {
    results.push('cust_lastname');
  }
  if (str.includes('~shipper_company~')) {
    results.push('shipper_company');
  }
  if (str.includes('~shipper_email~')) {
    results.push('shipper_email');
  }
  if (str.includes('~shipper_phone1~')) {
    results.push('shipper_phone1');
  }
  if (str.includes('~shipper_phone2~')) {
    results.push('shipper_phone2');
  }
  if (str.includes('~shipper_address1~')) {
    results.push('shipper_address1');
  }
  if (str.includes('~shipper_address2~')) {
    results.push('shipper_address2');
  }
  if (str.includes('~shipper_city~')) {
    results.push('shipper_city');
  }
  if (str.includes('~shipper_state~')) {
    results.push('shipper_state');
  }
  if (str.includes('~shipper_zip~')) {
    results.push('shipper_zip');
  }
  if (str.includes('~cc_last_four~')) {
    results.push('cc_last_four');
  }
  if (str.includes('~my_name~')) {
    results.push('my_name');
  }
  if (str.includes('~my_company_name~')) {
    results.push('my_company_name');
  }
  if (str.includes('~my_email~')) {
    results.push('my_email');
  }
  if (str.includes('~origin~')) {
    results.push('origin');
  }
  if (str.includes('~origin_phone~')) {
    results.push('origin_phone');
  }
  if (str.includes('~origin_phone2~')) {
    results.push('origin_phone2');
  }
  if (str.includes('~origin_email~')) {
    results.push('origin_email');
  }
  if (str.includes('~origin_address~')) {
    results.push('origin_address');
  }
  if (str.includes('~origin_address2~')) {
    results.push('origin_address2');
  }
  if (str.includes('~origin_city~')) {
    results.push('origin_city');
  }
  if (str.includes('~origin_state~')) {
    results.push('origin_state');
  }
  if (str.includes('~origin_zipcode~')) {
    results.push('origin_zipcode');
  }
  if (str.includes('~destination~')) {
    results.push('destination');
  }
  if (str.includes('~destination_phone~')) {
    results.push('destination_phone');
  }
  if (str.includes('~destination_phone2~')) {
    results.push('destination_phone2');
  }
  if (str.includes('~destination_email~')) {
    results.push('destination_email');
  }
  if (str.includes('~destination_address~')) {
    results.push('destination_address');
  }
  if (str.includes('~destination_address2~')) {
    results.push('destination_address2');
  }
  if (str.includes('~destination_city~')) {
    results.push('destination_city');
  }
  if (str.includes('~destination_zipcode~')) {
    results.push('destination_zipcode');
  }
  if (str.includes('~vehicle_list~')) {
    results.push('vehicle_list');
  }
  if (str.includes('~vehicle_vin~')) {
    results.push('vehicle_vin');
  }
  if (str.includes('~vehicle_year~')) {
    results.push('vehicle_year');
  }
  if (str.includes('~vehicle_make~')) {
    results.push('vehicle_make');
  }
  if (str.includes('~vehicle_model~')) {
    results.push('vehicle_model');
  }
  if (str.includes('~vehicle_inop~')) {
    results.push('vehicle_inop');
  }
  if (str.includes('~carrier_type~')) {
    results.push('carrier_type');
  }
  if (str.includes('~available_date~')) {
    results.push('available_date');
  }
  if (str.includes('~delivery_date~')) {
    results.push('delivery_date');
  }
  if (str.includes('~order_link~')) {
    results.push('order_link');
  }
  if (str.includes('~billing_link~')) {
    results.push('billing_link');
  }
  if (str.includes('~dispatch_message_to_carrier~')) {
    results.push('dispatch_message_to_carrier');
  }
  if (str.includes('~dispatch_driver_name~')) {
    results.push('dispatch_driver_name');
  }
  if (str.includes('~dispatch_driver_phone~')) {
    results.push('dispatch_driver_phone');
  }
  if (str.includes('~dispatch_pickup_date~')) {
    results.push('dispatch_pickup_date');
  }
  if (str.includes('~dispatch_deliver_date~')) {
    results.push('dispatch_deliver_date');
  }
  if (str.includes('~dispatch_carrier_pay~')) {
    results.push('dispatch_carrier_pay');
  }
  if (str.includes('~carrier_name~')) {
    results.push('carrier_name');
  }
  if (str.includes('~carrier_mc~')) {
    results.push('carrier_mc');
  }
  if (str.includes('~carrier_dot~')) {
    results.push('carrier_dot');
  }
  if (str.includes('~carrier_primary_contact~')) {
    results.push('carrier_primary_contact');
  }
  if (str.includes('~carrier_phone~')) {
    results.push('carrier_phone');
  }
  if (str.includes('~carrier_email~')) {
    results.push('carrier_email');
  }
  if (str.includes('~carrier_custom_field1~')) {
    results.push('carrier_custom_field1');
  }
  if (str.includes('~carrier_custom_field2~')) {
    results.push('carrier_custom_field2');
  }
  if (str.includes('~carrier_custom_field3~')) {
    results.push('carrier_custom_field3');
  }
  if (str.includes('~carrier_custom_field4~')) {
    results.push('carrier_custom_field4');
  }
  if (str.includes('~carrier_custom_field5~')) {
    results.push('carrier_custom_field5');
  }
  if (str.includes('~carrier_custom_text~')) {
    results.push('carrier_custom_text');
  }
  if (str.includes('~shipper_custom_text~')) {
    results.push('shipper_custom_text');
  }
  if (str.includes('~last_payment_amount~')) {
    results.push('last_payment_amount');
  }
  if (str.includes('~custom_order_number~')) {
    results.push('custom_order_number');
  }

  return results;
};

const enhanceScript = async (script) => {
  let enhanced = script;
  const shortcodes = await ShortCode.query();
  shortcodes.forEach((shortcode) => {
    const regExp = new RegExp(shortcode.alias, 'g');
    enhanced = enhanced.replace(regExp, shortcode.shortCode);
  });
  return enhanced;
};

export const resolve = async (user, quote, script) => {
  let result = script;

  if (script) {
    result = await enhanceScript(result);
    const shortcodes = getWordsBetweenCurlies(result);
    const promiseSerial = shortcodes.map((shortcode) => async () => {
      const data = await resolver(user, quote, shortcode);
      const regExp = new RegExp(`~${shortcode}~`, 'g');
      result = result.replace(regExp, data || '');
    });

    await runPromiseSerial(promiseSerial);
  }

  return result;
};

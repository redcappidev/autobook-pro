import uniqid from 'uniqid';
import { OrderLink, Quote } from '@server/models';
import { ORDER_LINK_TYPES } from '@server/constants';
import * as paymentService from './payment-service';

export const createOrderLink = async (orderId, type) => {
  const orderLink = await OrderLink.query()
    .insert({
      encryption: uniqid(),
      orderId: parseInt(orderId, 10),
      type,
      expired: false
    })
    .returning('*');
  return orderLink;
};

export const resolveBookOrderLink = async (encryption) => {
  const orderLink = await OrderLink.query().findOne('encryption', encryption);
  if (!orderLink || orderLink.expired) return null;
  if (orderLink.type !== ORDER_LINK_TYPES.BOOKING) return null;

  return Quote.query().findById(orderLink.orderId);
};

export const resolveTermsAndConditionsLink = async (encryption) => {
  const orderLink = await OrderLink.query().findOne('encryption', encryption);
  if (!orderLink || orderLink.expired) return null;
  if (orderLink.type !== ORDER_LINK_TYPES.TERMS) return null;

  return Quote.query().findById(orderLink.orderId);
};

export const resolveBillingInformationLink = async (encryption) => {
  const orderLink = await OrderLink.query().findOne('encryption', encryption);
  if (!orderLink || orderLink.expired) return null;
  if (orderLink.type !== ORDER_LINK_TYPES.BILLING) return null;

  return Quote.query().findById(orderLink.orderId);
};

export const resolveOrderLink = async (encryption) => {
  const orderLink = await OrderLink.query().findOne('encryption', encryption);
  if (!orderLink || orderLink.expired) return null;

  const order = await Quote.query()
    .findById(orderLink.orderId)
    .withGraphFetched('[payer,payerBillingMethod]');
  if (!order) return null;

  if (orderLink.type === 'BOOKING') return order;

  if (orderLink.type === 'TERMS') return order.terms;

  if (orderLink.type === 'BILLING') {
    const anetProfileId = order.payer ? order.payer.anetProfileId : null;
    const anetPaymentProfileId = order.payerBillingMethod
      ? order.payerBillingMethod.anetPaymentProfileId
      : null;

    const response = await paymentService.getBillingInformation(
      anetProfileId,
      anetPaymentProfileId
    );
    if (response) return response.billingAddress;
  }

  return null;
};

export const getOrderLinkByQuoteId = async (orderId) => {
  const orderLink = await OrderLink.query().where('orderId', orderId);

  return orderLink;
};

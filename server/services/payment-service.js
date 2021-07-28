import { Payer, PayerBillingMethod } from '@server/models';
import { AuthorizeNet } from '@server/third-party';

const createCustomerPaymentProfile = async (
  anetProfileId,
  payerId,
  billingInfo
) => {
  const response = await AuthorizeNet.createCustomerPaymentProfile(
    anetProfileId,
    billingInfo.creditCard,
    billingInfo.billingAddress
  );

  let billingMethod = null;

  if (response) {
    if (!response.error) {
      billingMethod = await Payer.relatedQuery('billingMethods')
        .for(payerId)
        .insert({ anetPaymentProfileId: response.data.paymentProfileId })
        .returning('*');
    } else if (
      response.error.code === AuthorizeNet.ERROR_CODES.DUPLICATE_RECORD
    ) {
      billingMethod = await PayerBillingMethod.query()
        .findOne(
          'anetPaymentProfileId',
          response.error.meta.payemntProfileId
        );

      if (!billingMethod) {
        billingMethod = await Payer.relatedQuery('billingMethods')
          .for(payerId)
          .insert({ anetPaymentProfileId: response.error.meta.payemntProfileId })
          .returning('*');
      }
    }
  }

  return billingMethod;
};

export const createPayerIfNecessary = async (billingInfo) => {
  const existingPayer = await Payer.query()
    .findOne('email', billingInfo.billingAddress.email);

  if (existingPayer) {
    const billingMethod = await createCustomerPaymentProfile(
      existingPayer.anetProfileId,
      existingPayer.id,
      billingInfo
    );

    if (billingMethod) {
      return {
        payerId: existingPayer.id,
        payerBillingMethodId: billingMethod.id
      };
    }

    await existingPayer.$query().delete();
  }

  const response = await AuthorizeNet.createCustomerProfile(
    billingInfo.creditCard,
    billingInfo.billingAddress
  );
  if (response) {
    if (!response.error) {
      const payer = await Payer.query()
        .insertGraphAndFetch({
          email: billingInfo.billingAddress.email,
          anetProfileId: response.data.profileId,

          billingMethods: [
            {
              anetPaymentProfileId: response.data.paymentProfileId
            }
          ]
        });

      return {
        payerId: payer.id,
        payerBillingMethodId: payer.billingMethods[0].id
      };
    }

    if (response.error.code === AuthorizeNet.ERROR_CODES.DUPLICATE_RECORD) {
      const re = /A duplicate record with ID ([0-9]+) already exists./g;
      const match = re.exec(response.error.message);
      const profileId = match[1];
      const payer = await Payer.query()
        .insert({
          email: billingInfo.billingAddress.email,
          anetProfileId: profileId
        });

      const billingMethod = await createCustomerPaymentProfile(
        profileId,
        payer.id,
        billingInfo
      );

      if (billingMethod) {
        return {
          payerId: existingPayer.id,
          payerBillingMethodId: billingMethod.id
        };
      }
    }

    return null;
  }

  return null;
};

export const getBillingInformation = async (
  anetProfileId,
  anetPaymentProfileId
) => {
  if (!anetProfileId || !anetPaymentProfileId) return null;

  const response = await AuthorizeNet.getCustomerProfile(anetProfileId);

  if (!response) return null;

  if (!response.error) {
    const { profile } = response.data;

    if (!profile.paymentProfiles || profile.paymentProfiles.length === 0) {
      return null;
    }

    const paymentProfile = await profile.paymentProfiles.find(
      (pp) => pp.customerPaymentProfileId === anetPaymentProfileId
    );

    if (!paymentProfile) return null;

    const { billTo, payment } = paymentProfile;
    const billingInfo = {
      billingAddress: {
        firstName: billTo.firstName,
        lastName: billTo.lastName,
        address: billTo.address,
        city: billTo.city,
        state: billTo.state,
        email: profile.email,
        zipcode: billTo.zip
      },
      creditCard: { ...payment.creditCard }
    };
    return billingInfo;
  }

  return null;
};

export const chargeCustomer = async (
  anetProfileId,
  anetPaymentProfileId,
  amount
) => {
  let response = await AuthorizeNet.getCustomerProfile(anetProfileId);

  if (!response) return null;

  if (!response.error) {
    response = await AuthorizeNet.chargeCustomerProfile(
      anetProfileId,
      anetPaymentProfileId,
      amount
    );

    if (response && !response.error) {
      return response.data.transaction;
    }
  }

  return null;
};

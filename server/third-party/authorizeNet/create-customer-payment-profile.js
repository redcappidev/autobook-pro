import { APIContracts, APIControllers } from 'authorizenet';
import config from '@server/config';

const createCustomerPaymentProfile = (
  customerProfileId,
  cardInfo,
  billingAddress
) => {
  const merchantAuthenticationType = new APIContracts.MerchantAuthenticationType();
  merchantAuthenticationType.setName(config.authorizeNet.loginID);
  merchantAuthenticationType.setTransactionKey(
    config.authorizeNet.transactionKey
  );

  const creditCard = new APIContracts.CreditCardType();
  creditCard.setCardNumber(cardInfo.cardNumber);
  creditCard.setExpirationDate(`${cardInfo.exprYear}-${cardInfo.exprMonth}`);
  creditCard.setCardCode(cardInfo.cvv);

  const paymentType = new APIContracts.PaymentType();
  paymentType.setCreditCard(creditCard);

  const billTo = new APIContracts.CustomerAddressType();
  billTo.setFirstName(billingAddress.firstName);
  billTo.setLastName(billingAddress.lastName);
  billTo.setAddress(billingAddress.address);
  billTo.setCity(billingAddress.city);
  billTo.setState(billingAddress.state);
  billTo.setZip(billingAddress.zipcode);
  if (billingAddress.country) {
    billTo.setCountry(billingAddress.country);
  }
  if (billingAddress.phoneNumber) {
    billTo.setPhoneNumber(billingAddress.phoneNumber);
  }

  const profile = new APIContracts.CustomerPaymentProfileType();
  profile.setBillTo(billTo);
  profile.setPayment(paymentType);

  const request = new APIContracts.CreateCustomerPaymentProfileRequest();
  request.setMerchantAuthentication(merchantAuthenticationType);
  request.setCustomerProfileId(customerProfileId);
  request.setPaymentProfile(profile);

  const controller = new APIControllers.CreateCustomerPaymentProfileController(
    request.getJSON()
  );

  return new Promise((resolve) => {
    controller.execute(() => {
      const apiResponse = controller.getResponse();
      const response = new APIContracts.CreateCustomerPaymentProfileResponse(
        apiResponse
      );

      if (response !== null) {
        if (
          response.getMessages().getResultCode() ===
          APIContracts.MessageTypeEnum.OK
        ) {
          resolve({
            error: null,
            data: {
              paymentProfileId: response.getCustomerPaymentProfileId()
            }
          });
        } else {
          resolve({
            error: {
              code: response.getMessages().getMessage()[0].getCode(),
              message: response.getMessages().getMessage()[0].getText(),
              meta: {
                profileId: response.getCustomerProfileId(),
                payemntProfileId: response.getCustomerPaymentProfileId()
              }
            }
          });
        }
      } else {
        resolve();
      }
    });
  });
};

export default createCustomerPaymentProfile;

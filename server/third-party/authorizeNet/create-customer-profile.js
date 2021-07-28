import { APIContracts, APIControllers } from 'authorizenet';
import config from '@server/config';
import { getRandomString } from './utils';

const createCustomerProfile = (cardInfo, billingAddress) => {
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

  const paymentProfile = new APIContracts.CustomerPaymentProfileType();
  paymentProfile.setCustomerType(APIContracts.CustomerTypeEnum.INDIVIDUAL);
  paymentProfile.setPayment(paymentType);
  paymentProfile.setBillTo(billTo);

  const paymentProfileList = [paymentProfile];

  const customerProfile = new APIContracts.CustomerProfileType();
  customerProfile.setMerchantCustomerId(`M_${getRandomString('cust')}`);
  customerProfile.setDescription('RouteRunnersCustomer');
  customerProfile.setEmail(billingAddress.email);
  customerProfile.setPaymentProfiles(paymentProfileList);

  const request = new APIContracts.CreateCustomerProfileRequest();
  request.setProfile(customerProfile);
  request.setMerchantAuthentication(merchantAuthenticationType);
  if (config.authorizeNet.env === 'sandbox') {
    request.setValidationMode(APIContracts.ValidationModeEnum.TESTMODE);
  } else if (config.authorizeNet.env === 'production') {
    request.setValidationMode(APIContracts.ValidationModeEnum.LIVEMODE);
  }

  const controller = new APIControllers.CreateCustomerProfileController(
    request.getJSON()
  );

  return new Promise((resolve) => {
    controller.execute(() => {
      const apiResponse = controller.getResponse();
      const response = new APIContracts.CreateCustomerProfileResponse(apiResponse);
      if (response !== null) {
        if (
          response.getMessages().getResultCode() ===
          APIContracts.MessageTypeEnum.OK
        ) {
          const profileId = response.getCustomerProfileId();
          let paymentProfileId = response.getCustomerPaymentProfileIdList();
          paymentProfileId = paymentProfileId.numericString[0].toString();

          resolve({
            error: null,
            data: {
              profileId,
              paymentProfileId
            }
          });
        } else {
          resolve({
            error: {
              code: response.getMessages().getMessage()[0].getCode(),
              message: response.getMessages().getMessage()[0].getText()
            }
          });
        }
      } else {
        resolve();
      }
    });
  });
};

export default createCustomerProfile;

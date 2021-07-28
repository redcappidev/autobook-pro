import { APIContracts, APIControllers } from 'authorizenet';
import config from '@server/config';

const chargeCustomerProfile = (
  customerProfileId,
  customerPaymentProfileId,
  amount
) => {
  const merchantAuthenticationType = new APIContracts.MerchantAuthenticationType();
  merchantAuthenticationType.setName(config.authorizeNet.loginID);
  merchantAuthenticationType.setTransactionKey(
    config.authorizeNet.transactionKey
  );

  const profileToCharge = new APIContracts.CustomerProfilePaymentType();
  profileToCharge.setCustomerProfileId(customerProfileId);

  const paymentProfile = new APIContracts.PaymentProfile();
  paymentProfile.setPaymentProfileId(customerPaymentProfileId);
  profileToCharge.setPaymentProfile(paymentProfile);

  const transactionRequestType = new APIContracts.TransactionRequestType();
  transactionRequestType.setTransactionType(
    APIContracts.TransactionTypeEnum.AUTHONLYTRANSACTION
  );
  transactionRequestType.setAmount(amount);
  transactionRequestType.setProfile(profileToCharge);

  const request = new APIContracts.CreateTransactionRequest();
  request.setMerchantAuthentication(merchantAuthenticationType);
  request.setTransactionRequest(transactionRequestType);

  const controller = new APIControllers.CreateTransactionController(
    request.getJSON()
  );
  return new Promise((resolve) => {
    controller.execute(() => {
      const apiResponse = controller.getResponse();
      const response = new APIContracts.CreateTransactionResponse(apiResponse);

      if (response !== null) {
        if (
          response.getMessages().getResultCode() ===
          APIContracts.MessageTypeEnum.OK
        ) {
          if (response.getTransactionResponse().getMessages() !== null) {
            resolve({
              error: null,
              data: {
                transaction: {
                  id: response.getTransactionResponse().getTransId(),
                  code: response.getTransactionResponse().getResponseCode()
                }
              }
            });
          } else if (response.getTransactionResponse().getErrors() !== null) {
            resolve({
              error: {
                code: response
                  .getTransactionResponse()
                  .getErrors()
                  .getError()[0]
                  .getErrorCode(),
                message: response
                  .getTransactionResponse()
                  .getErrors()
                  .getError()[0]
                  .getErrorText()
              }
            });
          }
        } else if (
          response.getTransactionResponse() !== null &&
          response.getTransactionResponse().getErrors() !== null
        ) {
          resolve({
            error: {
              code: response
                .getTransactionResponse()
                .getErrors()
                .getError()[0]
                .getErrorCode(),
              message: response
                .getTransactionResponse()
                .getErrors()
                .getError()[0]
                .getErrorText()
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

export default chargeCustomerProfile;

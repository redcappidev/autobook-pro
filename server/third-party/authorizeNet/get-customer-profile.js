import { APIContracts, APIControllers } from 'authorizenet';
import config from '@server/config';

const getCustomerProfile = (customerProfileId) => {
  const merchantAuthenticationType = new APIContracts.MerchantAuthenticationType();
  merchantAuthenticationType.setName(config.authorizeNet.loginID);
  merchantAuthenticationType.setTransactionKey(
    config.authorizeNet.transactionKey
  );

  const getRequest = new APIContracts.GetCustomerProfileRequest();
  getRequest.setCustomerProfileId(customerProfileId);
  getRequest.setMerchantAuthentication(merchantAuthenticationType);

  const controller = new APIControllers.GetCustomerProfileController(
    getRequest.getJSON()
  );

  return new Promise((resolve) => {
    controller.execute(() => {
      const apiResponse = controller.getResponse();
      const response = new APIContracts.GetCustomerProfileResponse(
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
              profile: response.getProfile()
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

export default getCustomerProfile;

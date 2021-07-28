export default {
  NODE_ENV: process.env.NODE_ENV,
  baseUrl: process.env.BASE_URL || '',
  sessionSecret: process.env.SESSION_SECRET || global.SESSION_SECRET,
  logLevel: process.env.LOG_LEVEL || 'info',
  auth0: {
    domain: process.env.AUTH0_DOMAIN,
    clientId: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET
  },
  googleMap: {
    apiKeyForServer: process.env.GOOGLE_MAP_API_KEY_FOR_SERVER,
    apiKeyForClient: process.env.GOOGLE_MAP_API_KEY_FOR_CLIENT
  },
  aws: {
    stage: process.env.AWS_STAGE,
    s3BucketName: process.env.AWS_S3_BUCKET_NAME,
    websocketDomain: process.env.AWS_WEBSOCKET_DOMAIN,
    jobLambdaWorkerName: process.env.AWS_JOB_LAMBDA_WORKER_NAME
  },
  firebase: {
    apiKey: process.env.FIREBASE_API_KEY,
    projectId: process.env.FIREBASE_PROJECT_ID,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID,
    admin: {
      privateKeyId: process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      clientId: process.env.FIREBASE_ADMIN_CLIENT_ID,
      certUrl: process.env.FIREBASE_ADMIN_CLIENT_CERT_URL
    }
  },
  ringcentral: {
    clientId: process.env.RINGCENTRAL_CLIENTID,
    clientSecret: process.env.RINGCENTRAL_CLIENTSECRET,
    endpoint: process.env.RINGCENTRAL_SERVER,
    username: process.env.RINGCENTRAL_USERNAME,
    extension: process.env.RINGCENTRAL_EXTENSION,
    password: process.env.RINGCENTRAL_PASSWORD
  },
  authorizeNet: {
    env: process.env.AUTHORIZE_NET_ENV,
    loginID: process.env.AUTHORIZE_NET_API_LOGIN_ID,
    transactionKey: process.env.AUTHORIZE_NET_TRANSACTION_KEY
  },
  centralDispatch: {
    dispatchEmail: process.env.DISPATCH_EMAIL,
    uid: process.env.CENTRAL_DISPATCH_UID,
    endpointEmail: process.env.CENTRAL_DISPATCH_ENDPOINT_EMAIL,
    listingIdApi: process.env.CENTRAL_DISPATCH_LISTING_ID_API_URL
  },
  autobook: {
    defaultVehicleSizeId: process.env.DEFAULT_VEHICLE_SIZE_ID,
    defaultFollowupTypeId: process.env.DEFAULT_FOLLOWUP_TYPE_ID,
    postToLoadBoardStatusId: process.env.POST_TO_LOAD_BOARD_STATUS_ID,
    dispatchedStatusId: process.env.DISPATCHED_STATUS_ID,
    canceledStatusId: process.env.CANCELED_STATUS_ID,
    carrierDataApi: process.env.CARRIER_DATA_API_URL
  }
};

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {API_URL_VERSION,
    API_URL_STAGING_VERIFICATION,
    API_URL_DEV_URL,
    API_URL_DEV_URL_V2,
    API_URL_DEV_PAY_STACK_TEST,
    API_URL_STAGING_URL,
    API_URL_DEV_UPLOAD_URL,
    API_URL_STAGING_URL_V2,
    API_URL_DEV_VERIFICATION,
    API_URL_STAGING_UPLOAD_URL,
    API_URL_STAGING_PAY_STACK_TEST,
    API_URL_PRODUCTION_URL,
    API_URL_PRODUCTION_URL_V2,
    API_URL_PRODUCTION_UPLOAD_URL,
    API_URL_PRODUCTION_PAY_STACK_TEST,
    API_URL_PRODUCTION_VERIFICATION 
  } from "@env"


const SETCONFIG = 'PROD';
export const AppVersion = API_URL_VERSION

const config = {
  DEV: {
    databaseUrl: API_URL_DEV_URL,
    databaseUrl2: API_URL_DEV_URL_V2,
    databaseUpload: API_URL_DEV_UPLOAD_URL,
    secretOrKey: API_URL_DEV_VERIFICATION,
    url: "https://staging.bazara.co/",
    payStack: {
      testSecretKey: API_URL_DEV_PAY_STACK_TEST,
      baseUrl: "https://api.paystack.co/bank/resolve",
    }
  },
  STAGING: {
    databaseUrl: API_URL_STAGING_URL,
    databaseUrl2: API_URL_STAGING_URL_V2,
    databaseUpload: API_URL_STAGING_UPLOAD_URL,
    secretOrKey: API_URL_STAGING_VERIFICATION,
    url: "https://bazara.co/",
    payStack: {
      testSecretKey: API_URL_STAGING_PAY_STACK_TEST,
      baseUrl: "https://api.paystack.co/bank/resolve",
    }
  },
  PROD: {
    databaseUrl: API_URL_PRODUCTION_URL,
    databaseUrl2: API_URL_PRODUCTION_URL_V2,
    databaseUpload: API_URL_PRODUCTION_UPLOAD_URL,
    secretOrKey: API_URL_PRODUCTION_VERIFICATION,
    url: "https://bazara.co/",
    payStack: {
      testSecretKey: API_URL_PRODUCTION_PAY_STACK_TEST,
      baseUrl: "https://api.paystack.co/bank/resolve",
    }
  },
};
export default config[SETCONFIG];

import dotenv from "dotenv";

const envFound = dotenv.config();
const SETCONFIG = process.env.REACT_APP_NODE_ENV;
if (!envFound) {
  throw new Error(":warning:  Couldn't find .env file  :warning:");
}
const config = {
  DEV: {
    databaseUrl: process.env.REACT_APP_DEV_URL,
    databaseUrl2: process.env.REACT_APP_DEV_URL_V2,
    databaseUpload: process.env.REACT_APP_DEV_UPLOAD_URL,
    secretOrKey: process.env.REACT_APP_DEV_VERIFICATION,
    payStack: {
      testSecretKey: process.env.REACT_APP_DEV_PAY_STACK_TEST,
      liveSecretKey: "",
      baseUrl: "https://api.paystack.co",
    }
  },
  STAGING: {
    databaseUrl: process.env.REACT_APP_STAGING_URL,
    databaseUrl2: process.env.REACT_APP_STAGING_URL_V2,
    databaseUpload: process.env.REACT_APP_STAGING_UPLOAD_URL,
    secretOrKey: process.env.REACT_APP_STAGING_VERIFICATION,
    payStack: {
      testSecretKey: process.env.REACT_APP_STAGING_PAY_STACK_TEST,
      liveSecretKey: "",
      baseUrl: "https://api.paystack.co",
    }
  },
  PROD: {
    databaseUrl: process.env.REACT_APP_PRODUCTION_URL,
    databaseUrl2: process.env.REACT_APP_PRODUCTION_URL_V2,
    databaseUpload: process.env.REACT_APP_PRODUCTION_UPLOAD_URL,
    secretOrKey: process.env.REACT_APP_PRODUCTION_VERIFICATION,
    payStack: {
      testSecretKey: process.env.REACT_APP_PRODUCTION_PAY_STACK_TEST,
      liveSecretKey: "",
      baseUrl: "https://api.paystack.co",
    }
  },
};
export default config[SETCONFIG];

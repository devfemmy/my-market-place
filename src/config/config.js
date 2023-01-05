
const SETCONFIG = 'DEV';
export const AppVersion = 2

const config = {
  DEV: {
    databaseUrl: 'https://api.bazara.co/api/v2',
    databaseUrl2: 'https://api.bazara.co/api/v2',
    databaseUpload: 'https://prod.bazara.co/upload-microservice/v1/upload/img',
    secretOrKey: 'sk_live_8f334a99611a4cf0245c8e4f1bbc3fddb1861d80',
    url: "https://staging.bazara.co/",
    payStack: {
      testSecretKey: 'pk_test_84d450ead211f32c1d444c98dd6c7fcfd27f897c',
      baseUrl: "https://api.paystack.co/bank/resolve",
    }
  },
  STAGING: {
    databaseUrl: 'https://api.bazara.co/api/v1/staging',
    databaseUrl2: 'https://api.bazara.co/api/v1/staging',
    databaseUpload: 'https://prod.bazara.co/upload-microservice/v1/upload/img',
    secretOrKey: 'sk_live_8f334a99611a4cf0245c8e4f1bbc3fddb1861d80',
    url: "https://bazara.co/",
    payStack: {
      testSecretKey: 'pk_test_84d450ead211f32c1d444c98dd6c7fcfd27f897c',
      baseUrl: "https://api.paystack.co/bank/resolve",
    }
  },
  PROD: {
    databaseUrl: 'https://prod.bazara.co/api/v1/prod',
    databaseUrl2: 'https://prod.bazara.co/api/v1/prod',
    databaseUpload: 'https://prod.bazara.co/upload-microservice/v1/upload/img',
    secretOrKey: 'sk_live_8f334a99611a4cf0245c8e4f1bbc3fddb1861d80',
    url: "https://bazara.co/",
    payStack: {
      testSecretKey: 'pk_live_673d282a2ea6f32939b9b27b162e20f03eff65fd',
      baseUrl: "https://api.paystack.co/bank/resolve",
    }
  },
};
export default config[SETCONFIG];

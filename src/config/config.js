
const SETCONFIG = 'DEV';

const config = {
  DEV: {
    databaseUrl: 'https://api.bazara.co/api/v1/dev',
    databaseUrl2: 'https://api.bazara.co/api/v2/dev',
    databaseUpload: 'https://prod.bazara.co/upload-microservice/v1/upload/img',
    secretOrKey: 'sk_live_8f334a99611a4cf0245c8e4f1bbc3fddb1861d80',
    payStack: {
      testSecretKey: 'pk_test_84d450ead211f32c1d444c98dd6c7fcfd27f897c',
      baseUrl: "https://api.paystack.co",
    }
  },
  STAGING: {
    databaseUrl: 'https://api.bazara.co/api/v1/staging',
    databaseUrl2: 'https://api.bazara.co/api/v1/staging',
    databaseUpload: 'https://prod.bazara.co/upload-microservice/v1/upload/img',
    secretOrKey: 'sk_live_8f334a99611a4cf0245c8e4f1bbc3fddb1861d80',
    payStack: {
      testSecretKey: 'pk_test_84d450ead211f32c1d444c98dd6c7fcfd27f897c',
      baseUrl: "https://api.paystack.co",
    }
  },
  PROD: {
    databaseUrl: 'https://prod.bazara.co/api/v1/prod',
    databaseUrl2: 'https://prod.bazara.co/api/v1/prod',
    databaseUpload: 'https://prod.bazara.co/upload-microservice/v1/upload/img',
    secretOrKey: 'sk_live_8f334a99611a4cf0245c8e4f1bbc3fddb1861d80',
    payStack: {
      testSecretKey: 'pk_live_673d282a2ea6f32939b9b27b162e20f03eff65fd',
      baseUrl: "https://api.paystack.co",
    }
  },
};
export default config[SETCONFIG];

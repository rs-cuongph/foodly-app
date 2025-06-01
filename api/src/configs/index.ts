import { NODE_ENV } from 'src/constants/app.constant';
import type { Config } from './config.interface';
import { config as configDotEnv } from 'dotenv';

configDotEnv();
const configs = (): Config => {
  return {
    app: {
      name: process.env.APP_NAME || 'APP NAME',
      nodeEnv: (process.env.NODE_ENV as NODE_ENV) || NODE_ENV.PRODUCTION,
      port: +process.env.APP_PORT || 3333,
      fallbackLanguage: process.env.APP_FALLBACK_LANGUAGE || 'vi',
      headerLanguage: process.env.APP_HEADER_LANGUAGE || 'x-custom-lang',
      redisHost: process.env.REDIS_HOST || 'localhost',
      redisPort: parseInt(process.env.REDIS_PORT) || 6379,
      frontendUrl: process.env.FRONTEND_URL,
    },
    database: {
      url: process.env.DATABASE_URL,
    },
    jwt: {
      accessSecret: process.env.JWT_ACCESS_SECRET,
      refreshSecret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN,
      refreshIn: process.env.JWT_REFRESH_IN,
    },
    aws: {
      region: process.env.AWS_REGION || 'ap-southeast-1',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      s3BucketName: process.env.AWS_S3_BUCKET_NAME,
    },
    mail: {
      provider: process.env.MAIL_PROVIDER,
      mailFrom: process.env.MAIL_FROM,
      maildev: {
        host: process.env.MAILDEV_HOST,
        port: parseInt(process.env.MAILDEV_PORT) || 1025,
        username: process.env.MAILDEV_USERNAME || 'maildev',
        password: process.env.MAILDEV_PASSWORD || 'maildev',
      },
      gmail: {
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: Boolean(process.env.SMTP_SECURE) || false,
        username: process.env.SMTP_USERNAME,
        password: process.env.SMTP_PASSWORD,
      },
      frontendUrl: process.env.FRONTEND_URL,
    },
    prisma: {
      logLevel: process.env.PRISMA_LOG_LEVEL || 'log',
    },
    webauthn: {
      rpName: process.env.WEBAUTHN_RP_NAME || 'Foodly',
      rpId: process.env.WEBAUTHN_RP_ID || 'localhost:3000',
      origin: process.env.WEBAUTHN_ORIGIN || 'http://localhost:3000',
    },
    webhook: {
      token: process.env.WEBHOOK_TOKEN,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
  };
};

export default configs;

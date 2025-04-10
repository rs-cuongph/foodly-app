import { NODE_ENV } from '@constants/app.constant';

export interface Config {
  database: DatabaseConfig;
  app: AppConfig;
  jwt: JwtConfig;
  mail: MailConfig;
  aws: AwsConfig;
  prisma: PrismaConfig;
  webauthn: WebauthnConfig;
}

export interface AwsConfig {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  s3BucketName: string;
}
export interface AppConfig {
  name: string;
  nodeEnv: NODE_ENV;
  port: number;
  fallbackLanguage: string;
  headerLanguage: string;
  redisHost: string;
  redisPort: number;
}

export interface DatabaseConfig {
  url: string;
}

export interface JwtConfig {
  accessSecret: string;
  refreshSecret: string;
  expiresIn: string;
  refreshIn: string;
}

export interface MailConfig {
  provider: string;
  mailFrom: string;
  maildev: {
    host: string;
    port: number;
    username: string;
    password: string;
  };
  gmail: {
    host: string;
    port: number;
    secure: boolean;
    username: string;
    password: string;
  };
  frontendUrl: string;
}

export interface PrismaConfig {
  logLevel: string;
}

export interface WebauthnConfig {
  rpName: string;
  rpId: string;
  origin: string;
}

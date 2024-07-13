import { NODE_ENV } from '@constants/app.constant';

export interface Config {
  database: DatabaseConfig;
  app: AppConfig;
  jwt: JwtConfig;
  mail: MailConfig;
  aws: AwsConfig;
  payos: PayOSConfig;
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
  host: string;
  port: number;
  secure: boolean;
  ignoreTLS: boolean;
  auth: {
    user: string;
    pass: string;
  };
  queue: {
    name: string;
  };
}

export interface PayOSConfig {
  clientId: string;
  apiKey: string;
  checksumKey: string;
  webhookUrl: string;
}

import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

export interface AppSecrets {
  OPENAI_API_KEY: string;

  MYSQL_HOST: string;
  MYSQL_USER: string;
  MYSQL_PASSWORD: string;
  MYSQL_DATABASE: string;

  MODELSLAB_API_KEY: string;

  KD_AWS_REGION: string;
  KD_AWS_ACCESS_KEY_ID: string;
  KD_AWS_SECRET_ACCESS_KEY: string;
  KD_AWS_S3_BUCKET_NAME: string;
}

let cache: AppSecrets | null = null;

export async function getSecrets(): Promise<AppSecrets> {
  // Cache
  if (cache) {
    return cache;
  }

  // ============================
  // Local Development (.env)
  // ============================

  if (process.env.NODE_ENV === "development") {
    cache = {
      OPENAI_API_KEY: process.env.OPENAI_API_KEY!,

      MYSQL_HOST: process.env.MYSQL_HOST!,
      MYSQL_USER: process.env.MYSQL_USER!,
      MYSQL_PASSWORD: process.env.MYSQL_PASSWORD!,
      MYSQL_DATABASE: process.env.MYSQL_DATABASE!,

      MODELSLAB_API_KEY: process.env.MODELSLAB_API_KEY!,

      KD_AWS_REGION: process.env.KD_AWS_REGION!,
      KD_AWS_ACCESS_KEY_ID: process.env.KD_AWS_ACCESS_KEY_ID!,
      KD_AWS_SECRET_ACCESS_KEY: process.env.KD_AWS_SECRET_ACCESS_KEY!,
      KD_AWS_S3_BUCKET_NAME: process.env.KD_AWS_S3_BUCKET_NAME!,
    };

    return cache;
  }

  // ============================
  // Production (AWS Secrets)
  // ============================

  const client = new SecretsManagerClient({
    region: process.env.KD_SECRET_REGION,
  });

  const response = await client.send(
    new GetSecretValueCommand({
      SecretId: process.env.KD_SECRET_NAME,
    })
  );

  if (!response.SecretString) {
    throw new Error("Secret not found");
  }

  cache = JSON.parse(response.SecretString) as AppSecrets;

  return cache;
}
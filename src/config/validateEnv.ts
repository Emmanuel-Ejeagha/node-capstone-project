import Joi from "joi";

const envSchema = Joi.object({
  PORT: Joi.number().default(3000).description("Server port"),
  NODE_ENV: Joi.string()
    .valid("development", "production", "test")
    .default("development")
    .description("Application environment"),
  JWT_ACCESS_SECRET: Joi.string().required().description("JWT access token secret"),
  JWT_ACCESS_EXPIRES_IN: Joi.string()
    .default("15m")
    .description("JWT access token expiry time"),
  JWT_REFRESH_SECRET: Joi.string().required().description("JWT refresh token secret"),
  JWT_REFRESH_EXPIRES_IN: Joi.string()
    .default("30d")
    .description("JWT refresh token expiry time"),
  DATABASE_URL: Joi.string().uri().required().description("PostgreSQL connection URL"),
  REDIS_URL: Joi.string().uri().required().description("Redis connection URL"),
  CLOUDINARY_CLOUD_NAME: Joi.string().required().description("Cloudinary cloud name"),
  CLOUDINARY_API_KEY: Joi.string().required().description("Cloudinary API key"),
  CLOUDINARY_API_SECRET: Joi.string().required().description("Cloudinary API secret"),
  BULLMQ_CONNECTION: Joi.string().required().description("BullMQ connection URL"),
});

export function validateEnv(env: Record<string, unknown>): {
  error: Error;
  value: Record<string, unknown>;
} {
  const result = envSchema.validate(env, { abortEarly: false });

  if (result.error) {
    const errorMessages = result.error.details.map(
      (detail) => detail.message,
    );
    throw new Error(`Environment validation failed:\n${errorMessages.join("\n")}`);
  }

  return { error: null, value: result.value };
}

// Export the validated env
let validatedEnv: Record<string, unknown>;

try {
  validatedEnv = validateEnv(process.env);
} catch (error) {
  console.error("FATAL: Environment validation error:", error);
  process.exit(1);
}

// Export each env variable as a typed constant
export const env = {
  port: Number(validatedEnv.PORT),
  isProduction: validatedEnv.NODE_ENV === "production",
  nodeEnv: validatedEnv.NODE_ENV,
  logLevel: "info",
  databaseUrl: validatedEnv.DATABASE_URL as string,
  jwtAccessSecret: validatedEnv.JWT_ACCESS_SECRET as string,
  jwtAccessExpiresIn: validatedEnv.JWT_ACCESS_EXPIRES_IN as string,
  jwtRefreshSecret: validatedEnv.JWT_REFRESH_SECRET as string,
  jwtRefreshExpiresIn: validatedEnv.JWT_REFRESH_EXPIRES_IN as string,
  cloudinaryCloudName: validatedEnv.CLOUDINARY_CLOUD_NAME as string,
  cloudinaryApiKey: validatedEnv.CLOUDINARY_API_KEY as string,
  cloudinaryApiSecret: validatedEnv.CLOUDINARY_API_SECRET as string,
  redisUrl: validatedEnv.REDIS_URL as string,
};
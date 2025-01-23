import "reflect-metadata";
import { plainToInstance } from "class-transformer";

import { ConfigSchema } from "./config.schema";
import { validateSync } from "class-validator";

export class ConfigService {
  private config: ConfigSchema;

  constructor() {
    const rawConfig = process.env;
    const validatedConfig = plainToInstance(ConfigSchema, rawConfig, {
      enableImplicitConversion: true,
    });

    const errors = validateSync(validatedConfig);
    if (errors.length > 0) {
      throw new Error(
        `Config validation error: ${errors
          .map((err) => Object.values(err.constraints || {}).join(", "))
          .join("; ")}`
      );
    }

    this.config = validatedConfig;
  }

  get<T>(key: keyof ConfigSchema): T {
    return this.config[key] as T;
  }
}
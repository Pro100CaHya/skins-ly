import { IsNumber, IsString, } from "class-validator";
import { Transform } from "class-transformer";
import dotenv from "dotenv";

// Load .env file
dotenv.config();

export class ConfigSchema {
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
    PORT!: number;

  @IsString()
    POSTGRES_URL!: string;

  @IsString()
    SKINPORT_API_SECRET!: string

  @IsString()
    SKINPORT_API_CLIENT_ID!: string

  @IsString()
    REDIS_URL!: string;
}
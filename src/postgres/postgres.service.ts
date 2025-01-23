import postgres from "postgres";
import { ConfigService } from "../config/config.service";

export class PostgresService {
  public sql: postgres.Sql;

  constructor(private readonly configService: ConfigService) {
    this.sql = postgres(configService.get("POSTGRES_URL"))
  }
}
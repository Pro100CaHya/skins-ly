import { createClient, RedisClientType } from "redis";
import { ConfigService } from "../config/config.service";

export class RedisService {
  client: RedisClientType;

  constructor(private readonly configService: ConfigService) {
    this.client = createClient({
      url: this.configService.get("REDIS_URL")
    })
  }

  public async connect() {
    this.client.connect();
  }

  public async close() {
    this.client.disconnect();
  }

  public async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  public async set(key: string, value: string, ttl: number): Promise<void> {
    await this.client.set(key, value, {
      EX: ttl
    });
  }

  public async delete(key: string): Promise<void> {
    this.client.del(key);
  }
}
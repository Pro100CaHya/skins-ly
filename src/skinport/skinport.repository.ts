import { ConfigService } from "../config"

export class SkinportRepository {
  private headers = {
    "Accept-Encoding": "br",
    "Authorization": ""
  }

  constructor(private readonly configService: ConfigService) {
    const encodedCredentials = Buffer.from(
      `${this.configService.get("SKINPORT_API_CLIENT_ID")}:${this.configService.get("SKINPORT_API_SECRET")}`
    ).toString("base64");

    this.headers.Authorization = `Basic ${encodedCredentials}`;
  }

  private async fetchItems(params: URLSearchParams): Promise<any[]> {

    const response = await fetch(`https://api.skinport.com/v1/items?${params}`, { headers: this.headers })

    if (!response.ok) {
      throw new Error("Error while fetching data")
    }

    return await response.json()
  }

  async fetchTradableItems(): Promise<any[]> {
    const params = new URLSearchParams({
      app_id: "730",
      currency: "EUR",
      tradable: "1",
    })
    return this.fetchItems(params)
  }

  async fetchNonTradableItems(): Promise<any[]> {
    const params = new URLSearchParams({
      app_id: "730",
      currency: "EUR",
      tradable: "0",
    })
    return this.fetchItems(params)
  }
}
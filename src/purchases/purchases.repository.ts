import { PostgresService } from "../postgres";

export class PurchasesRepository {
  constructor(
    private readonly postgresService: PostgresService
  ) {}

  public async createPurchase(id: string, userId: string, productId: string, totalPrice: number, quantity: number) {
    const [ purchase ] = await this.postgresService.sql`
      INSERT INTO purchases (id, user_id, product_id, total_price, quantity)
      VALUES (${id}, ${userId}, ${productId}, ${totalPrice}, ${quantity}) RETURNING *
    `;

    return purchase;
  }
}
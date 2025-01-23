import { PostgresService } from "../postgres";

export class ProductsRepository {
  constructor(
    private readonly postgresService: PostgresService
  ) {}

  async createProduct(id: string, name: string, description: string, price: number) {
    const [ product ] = await this.postgresService.sql`
      INSERT INTO products (id, name, description, price, updated_at)
      VALUES (${id}, ${name}, ${description}, ${price}, NOW()) RETURNING *
    `;

    return product;
  }

  async getProductById(id: string) {
    const [ product ] = await this.postgresService.sql`
      SELECT * FROM products WHERE id = ${id}
    `;

    return product;
  }
}
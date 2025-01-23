import { randomUUID } from "crypto";
import { ProductsRepository } from "./products.repository";

export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async createProduct(name: string, description: string, price: number) {
    const id = randomUUID();

    return this.productsRepository.createProduct(id, name, description, price);
  }

  async getProductById(id: string) {
    return this.productsRepository.getProductById(id);
  }
}
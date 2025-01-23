import { UsersService } from "../users";
import { PurchasesRepository } from "./purchases.repository";
import { ProductsService } from "../products";
import { randomUUID } from "crypto";

export class PurchasesService {
  constructor(
    private readonly purchaseRepository: PurchasesRepository,
    private readonly usersService: UsersService,
    private readonly productsService: ProductsService,
  ) {}

  public async createPurchase(userId: string, productId: string, quantity: number) {
    const user = await this.usersService.getUserById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const product = await this.productsService.getProductById(productId);

    if (!product) {
      throw new Error("Product not found");
    }

    const totalPrice = product.price * quantity;

    if (totalPrice > user.balance) {
      throw new Error("Insufficient balance");
    }

    try {
      const updatedUser = await this.usersService.updateUserBalance(userId, user.balance - totalPrice);

      const purchaseId = randomUUID();

      const createdPurchase = await this.purchaseRepository.createPurchase(purchaseId, userId, productId, totalPrice, quantity);

      return { updatedUser, createdPurchase };
    } catch (error) {

      await this.usersService.updateUserBalance(userId, user.balance);

      throw error;
    }
  }
}
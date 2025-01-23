import { Router, Request, Response, NextFunction } from "express";
import { Controller } from "../interfaces";
import { PurchasesService } from "./purchases.service";
import { CreatePurchaseDto } from "./dto";
import { isAuthenticated, validation } from "../middlewares";

export class PurchasesController implements Controller {
  public router = Router();
  public path = "/purchases";

  constructor(private readonly purchasesService: PurchasesService) {
    this.initializeRoutes();
  }
  
  private initializeRoutes() {
    this.router.post(`${this.path}`, validation(CreatePurchaseDto), isAuthenticated, this.createPurchase);
  }

  private createPurchase = async (req: Request, res: Response, next: NextFunction) => {
    const createProductDto: CreatePurchaseDto = req.body;

    const { productId, quantity } = createProductDto;
    const userId = req.session.userId;
  
    try {
      const purchase = await this.purchasesService.createPurchase(userId, productId, quantity);
  
      res.status(201).json({
        data: {
          userUpdatedBalance: purchase.updatedUser.balance,
          purchaseId: purchase.createdPurchase.id,
        },
        message: "Purchase created"
      });
    } catch (error) {
      console.log(error);
  
      next(error);
    }
  }
}
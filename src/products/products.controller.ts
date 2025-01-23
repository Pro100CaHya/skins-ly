import { NextFunction, Request, Response, Router } from "express";
import { Controller } from "src/interfaces";
import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dto";
import { isAuthenticated, validation } from "../middlewares";

export class ProductsController implements Controller {
  public router = Router();
  public path = "/products";

  constructor(private readonly productsService: ProductsService) {
    this.initializeRoutes();
  }
  
  private initializeRoutes() {
    this.router.post(`${this.path}`, validation(CreateProductDto), isAuthenticated, this.createProduct);
  }

  private createProduct = async (req: Request, res: Response, next: NextFunction) => {
    const createProductDto: CreateProductDto = req.body;

    const { name, description, price } = createProductDto;
  
    try {
      const product = await this.productsService.createProduct(name, description, price);
  
      res.status(201).json({ data: product, message: "Product created" });
    } catch (error) {
      console.log(error);
  
      next(error);
    }
  }
}
import { NextFunction, Request, Response, Router } from "express";
import { Controller } from "../interfaces";
import { SkinportService } from "./skinport.service";
import { isAuthenticated } from "../middlewares";

export class SkinportController implements Controller {
  public path = "/skinport";
  public router = Router();
  
  constructor(private readonly skinportService: SkinportService) {
    this.initializeRoutes();
  }
  
  private initializeRoutes() {
    this.router.get(`${this.path}/items`, isAuthenticated, this.getSkinport);
  }
  
  private getSkinport = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const skinport = await this.skinportService.fetchSkinportItems();

      res.status(200).json({ data: skinport });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
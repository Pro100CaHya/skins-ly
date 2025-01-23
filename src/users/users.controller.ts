import { NextFunction, Router, Request, Response } from "express";
import { Controller } from "../interfaces/controller";
import { UsersService } from "./users.service";
import { TopupBalanceDto } from "./dto/topup-balance.dto";
import { isAuthenticated } from "../middlewares/is-authenticated";
import { validation } from "../middlewares/validation";

export class UsersController implements Controller {
  public router = Router();
  public path = "/users";

  constructor(private readonly usersService: UsersService) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/topup-balance`, validation(TopupBalanceDto), isAuthenticated, this.topupBalance);
  }

  private topupBalance = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.session.userId;

      const topupBalanceDto: TopupBalanceDto = req.body;

      const { amount } = topupBalanceDto;

      const user = await this.usersService.topupBalance(userId, amount);

      res.status(200).json({ data: user, message: "Balance topped up" });
    } catch (error) {
      console.log(error);

      next(error);
    }
  }
}
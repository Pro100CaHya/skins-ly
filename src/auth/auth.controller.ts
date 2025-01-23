import { Router, Request, Response, NextFunction } from "express";

import { Controller } from "../interfaces/controller";
import { AuthService } from "./auth.service";
import { SignInDto } from "./dto/signin.dto";
import { SignUpDto } from "./dto/signup.dto";
import { validation } from "../middlewares";

export class AuthController implements Controller {
  public router = Router();
  public path = "/auth";

  constructor(private readonly authService: AuthService) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/signup`, validation(SignUpDto), this.signUp);
    this.router.post(`${this.path}/signin`, validation(SignInDto), this.signIn);
  }

  private signUp = async (req: Request, res: Response, next: NextFunction) => {
    const signUpDto: SignUpDto = req.body;
    const { username, email, password } = signUpDto;

    try {
      const createdUser = await this.authService.signUp(username, email, password);

      req.session = { userId: createdUser.id };

      res.status(201).json({ data: createdUser, message: "User created" });
    } catch (error) {
      console.log(error);

      next(error)
    }
  }

  private signIn = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password }: SignInDto = req.body;

    try {
      const user = await this.authService.signIn(email, password);

      req.session = { userId: user.id };

      res.status(200).json({ data: user, message: "User signed in" });
    } catch (error) {
      console.log(error);
      
      next(error);
    }
  }
}
import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { Request, Response, NextFunction } from "express";
import { HttpException } from "../exceptions/http-exception";

function validation(type: any) {
  return (request: Request, response: Response, next: NextFunction) => {
    validate(plainToInstance(type, request.body))
      .then((errors: ValidationError[]) => {
        if (errors.length > 0) {
          const message = errors.map((error: ValidationError) => Object.values(error.constraints)).join(", ");

          next(new HttpException(message, 400));
        } else {
          next();
        }
      });
  }
}

export {
  validation
}
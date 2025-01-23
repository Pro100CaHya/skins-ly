import { Request, Response, NextFunction } from "express";

import { HttpException } from "../exceptions/http-exception";

function httpExceptionMiddleware(error: HttpException, request: Request, response: Response, next: NextFunction) {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Something went wrong";

  response.status(statusCode)
    .json({
      message
    });
}

export {
  httpExceptionMiddleware
}
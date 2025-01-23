import { Request, Response, NextFunction } from "express";

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  console.log("isAuthenticated middleware user ID:", req.session.userId);
  if (req.session && req.session.userId) {
    return next();
  }

  res.status(401).json({ message: "Unauthorized" });
}
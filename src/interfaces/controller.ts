import { Router } from "express";

interface Controller {
    router: Router;
    path: string;
}

export {
  Controller
}
import bodyParser from "body-parser";
import cookieSession from "cookie-session";
import express, { Application } from "express";
import { Controller } from "../interfaces/controller";
import { httpExceptionMiddleware } from "../middlewares/http-exception";

class Server {
  private app: Application
  private port: number;

  constructor(port: number, controllers: Controller[]) {
    this.app = express();
    this.port = port;

    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({
      extended: true
    }));
    this.app.use(
      cookieSession({
        name: "session",
        keys: [process.env.SESSION_KEY || "session-key"],
        maxAge: 24 * 60 * 60 * 1000,
      })
    )
  }

  private initializeErrorHandling() {
    this.app.use(httpExceptionMiddleware);
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use("/api", controller.router);
    });
  }

  public startServer() {
    this.app.listen(this.port, () => console.log(`Server started on port ${this.port}, process PID ${process.pid}`));
  }

  public getAppInstance() {
    return this.app;
  }
}

export {
  Server
}
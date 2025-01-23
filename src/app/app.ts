import { PostgresService } from "../postgres";
import { ConfigService } from "../config";
import { RedisService } from "../redis";
import { UsersRepository, UsersController, UsersService } from "../users";
import { AuthService, AuthController } from "../auth";
import { SkinportRepository, SkinportService, SkinportController } from "../skinport";
import { ProductsRepository, ProductsService, ProductsController } from "../products";
import { PurchasesRepository, PurchasesService, PurchasesController } from "../purchases";

import { Server } from "../server";

export const app = async () => {
  const configService = new ConfigService();
  
  const redisService = new RedisService(configService);

  await redisService.connect();

  const postgresService = new PostgresService(configService);

  const usersRepository = new UsersRepository(postgresService);
  const usersService = new UsersService(usersRepository);
  const usersController = new UsersController(usersService);

  const authService = new AuthService(usersService);
  const authController = new AuthController(authService);

  const skinportRepository = new SkinportRepository(configService);
  const skinportService = new SkinportService(skinportRepository, redisService);
  const skinportController = new SkinportController(skinportService);

  const productsRepository = new ProductsRepository(postgresService);
  const productsService = new ProductsService(productsRepository);
  const productsController = new ProductsController(productsService);

  const purchasesRepository = new PurchasesRepository(postgresService);
  const purchasesService = new PurchasesService(purchasesRepository, usersService, productsService);
  const purchasesController = new PurchasesController(purchasesService);

  const server = new Server(
    configService.get("PORT"),
    [
      usersController,
      authController,
      skinportController,
      productsController,
      purchasesController
    ]
  );

  server.startServer();
}
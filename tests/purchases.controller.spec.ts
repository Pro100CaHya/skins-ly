import request from "supertest";
import { ConfigService } from "src/config";
import { PostgresService } from "src/postgres";
import { Server } from "src/server";
import { ProductsController, ProductsRepository, ProductsService } from "src/products";
import { PurchasesController, PurchasesRepository, PurchasesService } from "src/purchases";
import { UsersRepository, UsersService } from "src/users";
import postgres from "postgres";

// Mocking the `isAuthenticated` middleware
jest.mock("src/middlewares/is-authenticated", () => ({
  isAuthenticated: jest.fn((req, res, next) => {
    req.session = { userId: "9c9ea7fb-3718-4d28-b575-393064f3ceb7" };
    next();
  }),
}));

describe("PurchasesController Integration Test", () => {
  let server: Server;

  let configService: ConfigService;

  let postgresService: PostgresService;

  let usersRepository: UsersRepository;
  let usersService: UsersService;

  let productsRepository: ProductsRepository;
  let productsService: ProductsService;
  let productsController: ProductsController;

  let purchasesRepository: PurchasesRepository;
  let purchasesService: PurchasesService;
  let purchasesController: PurchasesController;

  beforeAll(async () => {
    configService = new ConfigService();
      
    postgresService = new PostgresService(configService);

    usersRepository = new UsersRepository(postgresService);
    usersService = new UsersService(usersRepository);

    productsRepository = new ProductsRepository(postgresService);
    productsService = new ProductsService(productsRepository);

    purchasesRepository = new PurchasesRepository(postgresService);
    purchasesService = new PurchasesService(purchasesRepository, usersService, productsService);
    purchasesController = new PurchasesController(purchasesService);

    server = new Server(3005, [
      purchasesController,
    ]);

    server.startServer();

    await postgresService.sql`
      INSERT INTO users (id, username, email, password, balance)
      VALUES ('9c9ea7fb-3718-4d28-b575-393064f3ceb7', 'test-user', 'testemail@gmail.com', 'test-password', 500);
    `;

    await postgresService.sql`
      INSERT INTO products (id, name, description, price)
      VALUES ('9c9ea7fb-3718-4d28-b575-393064f3ceb8', 'test-product', 'test-product-description', 100);
    `
  });

  afterAll(async () => {
    await postgresService.sql`
      DELETE FROM purchases;
    `;

    await postgresService.sql`
      DELETE FROM users WHERE id = '9c9ea7fb-3718-4d28-b575-393064f3ceb7';
    `;

    await postgresService.sql`
      DELETE FROM products WHERE id = '9c9ea7fb-3718-4d28-b575-393064f3ceb8';
    `;

    jest.clearAllMocks();
  });

  it("should create new purchase", async () => {
    const response = await request(server.getAppInstance())
      .post(`/api/purchases`)
      .send({
        productId: '9c9ea7fb-3718-4d28-b575-393064f3ceb8',
        quantity: 1,
      });
    
    expect(response.status).toBe(201);

    const purchaseCreatedResponseData = response.body.data;

    expect(purchaseCreatedResponseData).toMatchObject({
      userUpdatedBalance: '400',
    });
  });
})
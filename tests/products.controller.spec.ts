import request from "supertest";
import { ConfigService } from "src/config";
import { PostgresService } from "src/postgres";
import { Server } from "src/server";
import { ProductsController, ProductsRepository, ProductsService } from "src/products";

// Mocking the `isAuthenticated` middleware
jest.mock("src/middlewares/is-authenticated", () => ({
  isAuthenticated: jest.fn((req, res, next) => {
    req.session = { userId: "9c9ea7fb-3718-4d28-b575-393064f3ceb7" };
    next();
  }),
}));

describe("ProductsController Integration Test", () => {
  let server: Server;

  let configService: ConfigService;

  let postgresService: PostgresService;

  let productsRepository: ProductsRepository;
  let productsService: ProductsService;
  let productsController: ProductsController;

  beforeAll(async () => {
    configService = new ConfigService();
      
    postgresService = new PostgresService(configService);

    productsRepository = new ProductsRepository(postgresService);
    productsService = new ProductsService(productsRepository);
    productsController = new ProductsController(productsService);

    server = new Server(3004, [
      productsController,
    ]);

    server.startServer();

    await postgresService.sql`
      INSERT INTO users (id, username, email, password)
      VALUES ('9c9ea7fb-3718-4d28-b575-393064f3ceb7', 'test-user', 'testemail@gmail.com', 'test-password');
    `;
  });

  afterAll(async () => {
    await postgresService.sql`
      DELETE FROM users WHERE id = '9c9ea7fb-3718-4d28-b575-393064f3ceb7';
    `;

    await postgresService.sql`
      DELETE FROM products WHERE name = 'Test product';
    `;

    jest.clearAllMocks();
  });

  it("should create new product", async () => {
    const response = await request(server.getAppInstance())
      .post(`/api/products`)
      .send({
        name: 'Test product',
        description: 'Test product description',
        price: 100,
      });
    
    expect(response.status).toBe(201);

    const createdProduct = response.body.data;

    expect(createdProduct).toMatchObject({
      name: 'Test product',
      description: 'Test product description',
      price: '100',
    });
  });

  it("should return 400 error", async () => {
    const response = await request(server.getAppInstance())
      .post(`/api/products`)
      .send({
        name: 123,
        description: 'Test product description',
        price: 100,
      });
    
    expect(response.status).toBe(400);
  });
})
import request from "supertest";
import { Request, Response, NextFunction } from "express";
import { ConfigService } from "src/config";
import { PostgresService } from "src/postgres";
import { RedisService } from "src/redis";
import { Server } from "src/server";
import { UsersController, UsersRepository, UsersService } from "src/users";

// Mocking the `isAuthenticated` middleware
jest.mock("src/middlewares/is-authenticated", () => ({
  isAuthenticated: jest.fn((req, res, next) => {
    req.session = { userId: "9c9ea7fb-3718-4d28-b575-393064f3ceb7" };
    next();
  }),
}));

describe("UsersController Integration Test", () => {
  let server: Server;

  let configService: ConfigService;

  let postgresService: PostgresService;
  let redisService: RedisService;

  let usersRepository: UsersRepository;
  let usersService: UsersService;
  let usersController: UsersController;

  beforeAll(async () => {
    configService = new ConfigService();
      
    postgresService = new PostgresService(configService);
    redisService = new RedisService(configService);

    await redisService.connect();

    usersRepository = new UsersRepository(postgresService);
    usersService = new UsersService(usersRepository);
    usersController = new UsersController(usersService);

    server = new Server(3003, [
      usersController
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
  });

  it("should topup user balance", async () => {
    const response = await request(server.getAppInstance())
      .post(`/api/users/topup-balance`)
      .send({
        amount: 100
      });
    
    expect(response.status).toBe(200);

    const { balance } = response.body.data;

    expect(balance).toBe("100");
  })
})
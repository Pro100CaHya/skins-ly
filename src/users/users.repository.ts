import { PostgresService } from "../postgres/postgres.service";

export class UsersRepository {
  constructor(private readonly postgresService: PostgresService) {
  }

  async createUser(id: string, username: string, email: string, password: string) {
    const [ user ] = await this.postgresService.sql`
      INSERT INTO users (id, username, email, password) VALUES (${id}, ${username}, ${email}, ${password}) RETURNING *
    `;

    return user;
  }

  async getUserByEmail(email: string) {
    const [ user ] = await this.postgresService.sql`
      SELECT * FROM users WHERE email = ${email}
    `;

    return user;
  }

  async getUserById(id: string) {
    const [ user ] = await this.postgresService.sql`
      SELECT * FROM users WHERE id = ${id}
    `;

    return user;
  }

  async updateUserBalance(id: string, balance: number) {
    const [ user ] = await this.postgresService.sql`
      UPDATE users SET balance = ${balance} WHERE id = ${id} RETURNING *
    `;

    return user;
  }
}
import { randomUUID } from "crypto";
import { UsersRepository } from "./users.repository";
import bcrypt from "bcrypt";

export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  public async createUser(username: string, email: string, password: string) {
    const existingUser = await this.usersRepository.getUserByEmail(email);

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const passwordHash = bcrypt.hashSync(password, 10);

    const id = randomUUID();

    return this.usersRepository.createUser(id, username, email, passwordHash);
  }

  public async getUserByEmail(email: string) {
    return this.usersRepository.getUserByEmail(email);
  }

  public async getUserById(id: string) {
    return this.usersRepository.getUserById(id);
  }

  public async updateUserBalance(id: string, balance: number) {
    return this.usersRepository.updateUserBalance(id, balance);
  }

  public async topupBalance(id: string, amount: number) {
    const user = await this.usersRepository.getUserById(id);

    if (!user) {
      throw new Error("User not found");
    }

    return this.usersRepository.updateUserBalance(id, parseFloat(user.balance) + amount);
  }
}
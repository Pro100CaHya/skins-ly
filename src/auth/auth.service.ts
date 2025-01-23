import bcrypt from "bcrypt";

import { UsersService } from "../users/users.service";

export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  public async signUp(username: string, email: string, password: string) {
    return await this.usersService.createUser(username, email, password);
  }

  public async signIn(email: string, password: string) {
    const existingUser = await this.usersService.getUserByEmail(email);

    if (!existingUser) {
      throw new Error("User with this email does not exist");
    }

    const isPasswordValid = bcrypt.compareSync(password, existingUser.password);

    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    return existingUser;
  }
}
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class BaseAuthDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
    email!: string;

  @IsString()
  @IsNotEmpty()
    password!: string;
}
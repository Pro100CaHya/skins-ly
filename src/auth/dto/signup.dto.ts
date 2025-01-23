import { IsNotEmpty, IsString, Length } from "class-validator";
import { BaseAuthDto } from "./base-auth.dto";

export class SignUpDto extends BaseAuthDto {
  @IsString()
  @IsNotEmpty()
  @Length(4, 20)
    username!: string;
}
import { IsNotEmpty, IsNumber } from "class-validator";

export class TopupBalanceDto {
  @IsNumber()
  @IsNotEmpty()
    amount!: number;
}
import { IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";

export class CreatePurchaseDto {
  @IsString()
  @IsUUID()
  @IsNotEmpty()
    productId!: string;

  @IsNumber()
  @IsNotEmpty()
    quantity!: number;
}
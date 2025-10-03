import { IsNotEmpty, IsString } from "class-validator";

export class RegisterValidator {
  // Design Pattern: Decorator

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

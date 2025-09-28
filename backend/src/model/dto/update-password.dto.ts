// src/modules/user/dto/update-password.dto.ts
import { IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsString({ message: 'Password phải là chuỗi' })
  @MinLength(6, { message: 'Password phải có ít nhất 6 ký tự' })
  password: string;
}

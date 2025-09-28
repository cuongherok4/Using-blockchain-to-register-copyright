// src/model/dto/user.dto.ts
import { IsNotEmpty, IsString, IsEmail, IsOptional } from 'class-validator';

export class UserDto {
  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @IsNotEmpty({ message: 'Password không được để trống' })
  @IsString({ message: 'Password phải là chuỗi' })
  password: string;

  @IsNotEmpty({ message: 'Department không được để trống' })
  @IsString({ message: 'Department phải là chuỗi' })
  department: string;

  @IsNotEmpty({ message: 'Name không được để trống' })
  @IsString({ message: 'Name phải là chuỗi' })
  name: string;

  @IsOptional()
  @IsString({ message: 'Role phải là chuỗi' })
  role?: string;
}

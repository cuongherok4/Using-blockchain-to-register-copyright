// src/model/dto/blockchain.dto.ts
// Import các decorator để kiểm tra dữ liệu đầu vào từ thư viện 'class-validator'
import { IsNotEmpty, IsString } from 'class-validator';

// Định nghĩa DTO (Data Transfer Object) dùng khi tạo một NFT
export class CreateNFTDto {
  @IsNotEmpty({ message: 'Title is required' })
  @IsString()
  title: string;

  @IsNotEmpty({ message: 'URI is required' })
  @IsString()
  uri: string;

  @IsNotEmpty({ message: 'Department is required' })
  @IsString()
  department: string;

  @IsString()
  name: string;

  @IsString()
  masv: string;
}

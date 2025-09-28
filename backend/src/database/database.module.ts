import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockChainModel } from 'src/model/entity/blockchain.entity';
import { User } from 'src/model/entity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',                // Loại cơ sở dữ liệu
      host: 'localhost',            // Địa chỉ server DB
      port: 3307,                    // Port MySQL
      username: 'root',              // Tài khoản DB
      password: '123456',            // Mật khẩu DB
      database: 'NCKH_k13',          // Tên database
      entities: [BlockChainModel,User], // Các entity sẽ mapping với bảng DB
      synchronize: false,             // Tự động tạo/đồng bộ bảng (chỉ nên bật ở môi trường dev)
    }),
    TypeOrmModule.forFeature([BlockChainModel,User]), // Cho phép inject repository vào service
  ],
})
export class DatabaseModule {}

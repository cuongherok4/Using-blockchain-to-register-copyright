import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BlockchainController } from './blockchain.controller';
import { BlockchainService } from './blockchain.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockChainModel } from 'src/model/entity/blockchain.entity';

@Module({
  imports: [
    // Import ConfigModule để có thể sử dụng ConfigService trong BlockchainService
    ConfigModule,
    TypeOrmModule.forFeature([BlockChainModel])
  ],
  controllers: [BlockchainController],
  providers: [BlockchainService],
  // Export BlockchainService nếu cần sử dụng ở module khác
  exports: [BlockchainService],
})
export class BlockchainModule {}

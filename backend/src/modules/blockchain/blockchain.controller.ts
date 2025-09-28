import {
  Controller,
  Get,
  Post,
  Body,
  Param,Put,
  HttpException,
  HttpStatus,
  ValidationPipe,
  UsePipes,Res,Delete,
  Query,
  UseGuards
} from '@nestjs/common';

import { Response } from 'express'; // <--- import Response từ express
import { BlockchainService } from './blockchain.service';
import { CreateNFTDto } from 'src/model/dto/blockchain.dto';
import { ApiResponse } from 'src/common/api-response';
import { BlockChainModel } from 'src/model/entity/blockchain.entity';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';

@Controller('blockchain')
@UseGuards(JwtAuthGuard) 
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  @Get('all_nft_db')
  async getAllNFTsFromDB() {
    try {
      const data = await this.blockchainService.getAllNftNoWallet();
      return ApiResponse.success('Fetched NFTs from DB successfully', data);
    } catch (error) {
      throw new HttpException(
        ApiResponse.error(error.message, HttpStatus.INTERNAL_SERVER_ERROR),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('nft')
  @UsePipes(new ValidationPipe())
  async createNFT(@Body() createNFTDto: CreateNFTDto) {
    try {
      const result = await this.blockchainService.createNFT(
        createNFTDto.title,
        createNFTDto.uri,
        createNFTDto.department,
        createNFTDto.name,
        createNFTDto.masv,
      );
      return ApiResponse.success('NFT created successfully', result);
    } catch (error) {
      throw new HttpException(
        ApiResponse.error(error.message, HttpStatus.BAD_REQUEST),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('all_nft')
  async getAllNFTs() {
    try {
      const [nfts, totalNFTs] = await Promise.all([
        this.blockchainService.getAllNFTs(),
        this.blockchainService.getNextId(),
      ]);

      return ApiResponse.success('Fetched NFTs successfully', {
        nfts,
        total: totalNFTs,
      });
    } catch (error) {
      throw new HttpException(
        ApiResponse.error(error.message, HttpStatus.INTERNAL_SERVER_ERROR),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('search_id/:id')
  async getNFTDetail(@Param('id') id: string) {
    try {
      const exists = await this.blockchainService.nftExists(Number(id));
      if (!exists) {
        throw new Error('NFT does not exist');
      }

      const nft = await this.blockchainService.getNFTDetail(Number(id));
      return ApiResponse.success('NFT fetched successfully', nft);
    } catch (error) {
      throw new HttpException(
        ApiResponse.error(error.message, HttpStatus.NOT_FOUND),
        HttpStatus.NOT_FOUND,
      );
    }
  }


  
// API tải file từ Pinata/IPFS theo NFT ID
  @Get('download/:id')
  async downloadNFTFile(@Param('id') id: string, @Res() res: Response) {
    try {
      const fileBuffer = await this.blockchainService.downloadNFTFile(Number(id));
      const fileName = `nft_${id}.pdf`; // bạn có thể lấy từ nft.title nếu muốn
      res.set({
        'Content-Type': 'application/pdf', // hoặc mime type phù hợp
        'Content-Disposition': `attachment; filename="${fileName}"`,
      });
      return res.send(fileBuffer);
    } catch (error) {
      throw new HttpException(
        ApiResponse.error(error.message, HttpStatus.NOT_FOUND),
        HttpStatus.NOT_FOUND,
      );
    }
  }


  // API lấy danh sách đề tài của bản thân đã duyệt
  @Get('my-approved')
  async getMyApprovedNFTs(@Query('masv') masv: string) {
    if (!masv) {
      throw new HttpException(
        ApiResponse.error('Mã sinh viên không được để trống', HttpStatus.BAD_REQUEST),
        HttpStatus.BAD_REQUEST
      );
    }

    try {
      const data = await this.blockchainService.getApprovedNFTsByStudent(masv);
      return ApiResponse.success('Danh sách đề tài đã duyệt', data);
    } catch (error) {
      throw new HttpException(
        ApiResponse.error(error.message, HttpStatus.INTERNAL_SERVER_ERROR),
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // API lấy danh sách đề tài chưa duyệt của sinh viên
  @Get('my-pending')
  async getMyPendingNFTs(@Query('masv') masv: string) {
    if (!masv) {
      throw new HttpException(
        ApiResponse.error('Mã sinh viên không được để trống', HttpStatus.BAD_REQUEST),
        HttpStatus.BAD_REQUEST
      );
    }

    try {
      const data = await this.blockchainService.getMyPendingNFTs(masv);
      return ApiResponse.success('Danh sách đề tài chưa duyệt', data);
    } catch (error) {
      throw new HttpException(
        ApiResponse.error(error.message, HttpStatus.INTERNAL_SERVER_ERROR),
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put('update-pending/:id')
async updatePendingNFT(
  @Param('id') id: string,
  @Body() updateData: Partial<BlockChainModel>
) {
  if (!id) {
    throw new HttpException(
      ApiResponse.error('ID đề tài không được để trống', HttpStatus.BAD_REQUEST),
      HttpStatus.BAD_REQUEST
    );
  }

  try {
    const updatedNFT = await this.blockchainService.updatePendingNFT(Number(id), updateData);
    return ApiResponse.success(`Cập nhật đề tài ID ${id} thành công`, updatedNFT);
  } catch (error) {
    throw new HttpException(
      ApiResponse.error(error.message, HttpStatus.INTERNAL_SERVER_ERROR),
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}

// Xóa đề tài chưa duyệt
  @Delete('delete-pending/:id')
  async deletePendingNFT(@Param('id') id: string) {
    if (!id) {
      throw new HttpException(
        ApiResponse.error('ID đề tài không được để trống', HttpStatus.BAD_REQUEST),
        HttpStatus.BAD_REQUEST
      );
    }

    try {
      await this.blockchainService.deletePendingNFT(Number(id));
      return ApiResponse.success(`Xóa đề tài ID ${id} thành công`, null);
    } catch (error) {
      throw new HttpException(
        ApiResponse.error(error.message, HttpStatus.NOT_FOUND),
        HttpStatus.NOT_FOUND
      );
    }
  }

  // Tìm kiếm đề tài chưa duyệt
  @Get('search-pending')
  async searchPendingNFTs(@Query() query: { title?: string; name?: string; masv?: string }) {
    try {
      const results = await this.blockchainService.searchPendingNFTs(query);
      return ApiResponse.success('Tìm kiếm đề tài thành công', results);
    } catch (error) {
      throw new HttpException(
        ApiResponse.error(error.message, HttpStatus.INTERNAL_SERVER_ERROR),
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }


  @Get('download_pending/:id')
async downloadPendingFile(@Param('id') id: string, @Res() res: Response) {
  try {
    const fileBuffer = await this.blockchainService.downloadPendingNFTFile(Number(id));
    const fileName = `pending_${id}.pdf`; // Hoặc tên theo title nếu muốn
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${fileName}"`,
    });
    return res.send(fileBuffer);
  } catch (error) {
    throw new HttpException(
      ApiResponse.error(error.message, HttpStatus.NOT_FOUND),
      HttpStatus.NOT_FOUND,
    );
  }
}

// src/modules/blockchain/blockchain.controller.ts
@Get('pending/:id')
async getPendingNFTDetail(@Param('id') id: string) {
  try {
    const pendingNFT = await this.blockchainService.getPendingNFTDetail(Number(id));
    return ApiResponse.success('Fetched pending NFT successfully', pendingNFT);
  } catch (error) {
    throw new HttpException(
      ApiResponse.error(error.message, HttpStatus.NOT_FOUND),
      HttpStatus.NOT_FOUND,
    );
  }
}

}

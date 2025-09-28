// src/modules/user/user.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UsePipes,
  ValidationPipe,
  HttpStatus,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from '../../model/dto/user.dto'; // ✅ SỬA THÀNH TƯƠNG ĐỐI
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // ✅ SỬA THÀNH TƯƠNG ĐỐI
import { Req } from '@nestjs/common';

@Controller('api/user')
@UseGuards(JwtAuthGuard) // Bắt buộc phải có token mới được gọi API
export class UserController {
  constructor(private readonly userService: UserService) {}
  // Tạo mới user
  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() userDto: UserDto, @Res() res: Response) {
    try {
      const user = await this.userService.createUser(userDto);
      return res.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        message: 'Tạo user thành công',
        data: user,
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  }

  // Lấy tất cả user
  @Get()
  async findAll(@Res() res: Response) {
    const users = await this.userService.getAllUsers();
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK, // 200
      data: users,
    });
  }

  @Get('search')
  async search(
    @Query()
    query: {
      email?: string;
      name?: string;
      department?: string;
      role?: string;
    },
    @Res() res: Response,
  ) {
    const users = await this.userService.searchUsers(query);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: users,
    });
  }

  @Put('/:id')
  @UsePipes(new ValidationPipe())
  async update(
    @Param('id') id: number,
    @Body() userDto: UserDto,
    @Res() res: Response,
  ) {
    try {
      const updatedUser = await this.userService.updateUser(id, userDto);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: `Cập nhật user ID ${id} thành công`,
        data: updatedUser,
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  }

  @Delete('/:id')
  async delete(@Param('id') id: number, @Res() res: Response) {
    try {
      await this.userService.deleteUser(id);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: `Xóa user ID ${id} thành công`,
      });
    } catch (error) {
      return res.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        message: error.message || `Không tìm thấy user ID ${id}`,
      });
    }
  }

  // EXPORT EXCEL
  @Get('export')
  async exportExcel(@Res() res: Response) {
    return this.userService.exportUsersToExcel(res);
  }

  // ✅ Lấy thông tin cá nhân từ token
  @Get('me')
  async getProfile(@Req() req: Request, @Res() res: Response) {
    try {
      const user = await this.userService.getUserById(req['user'].id);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: user,
      });
    } catch (error) {
      return res.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        message: error.message,
      });
    }
  }

  // ✅ Cập nhật thông tin cá nhân
  @Put('me')
  @UsePipes(new ValidationPipe())
  async updateProfile(
    @Req() req: Request,
    @Body() userDto: Partial<UserDto>,
    @Res() res: Response,
  ) {
    try {
      const updatedUser = await this.userService.updateUser(
        req['user'].id,
        userDto,
      );
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Cập nhật thông tin cá nhân thành công',
        data: updatedUser,
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  }


  
}

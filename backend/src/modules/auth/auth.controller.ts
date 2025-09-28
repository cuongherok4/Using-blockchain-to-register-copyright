import { Controller, Post, Body, HttpStatus, Res, UsePipes, ValidationPipe, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { LoginDto, ResetPasswordDto } from 'src/model/dto/login.dto'; // THÊM DÒNG NÀY

@Controller('api/auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name); // THÊM DÒNG NÀY

  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @UsePipes(new ValidationPipe({ // THÊM DECORATOR NÀY
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true
  }))
  async login(
    @Body() loginDto: LoginDto, // SỬA TỪ @Body('email') email: string, @Body('password') password: string
    @Res() res: Response,
  ) {
    try {
      // Log đầu vào để kiểm tra
      this.logger.log(`Login attempt - Email: ${loginDto.email}`); // SỬA email THÀNH loginDto.email

      const user = await this.authService.login(loginDto.email, loginDto.password); // SỬA THÀNH loginDto
      
      this.logger.log(`Login successful - Email: ${loginDto.email}`);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Đăng nhập thành công',
        token: user.token,
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
          department: user.department,
          role: user.role,
        },
      });
    } catch (err) {
      // Log lỗi chi tiết
      this.logger.error(`Login failed - Email: ${loginDto.email}`, err.stack); // SỬA email THÀNH loginDto.email
      
      return res.status(err.status || HttpStatus.BAD_REQUEST).json({
        statusCode: err.status || HttpStatus.BAD_REQUEST,
        message: err.message || 'Lỗi đăng nhập',
        error: err.response || err.message,
        timestamp: new Date().toISOString(), // THÊM TIMESTAMP
      });
    }
  }

  @Post('reset-password')
  @UsePipes(new ValidationPipe({ // THÊM DECORATOR NÀY
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true
  }))
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto, @Res() res: Response) { // SỬA THÀNH DTO
    try {
      this.logger.log(`Reset password attempt - Email: ${resetPasswordDto.email}`); // SỬA THÀNH resetPasswordDto.email

      const result = await this.authService.resetPassword(resetPasswordDto.email); // SỬA THÀNH resetPasswordDto.email
      
      this.logger.log(`Reset password successful - Email: ${resetPasswordDto.email}`);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: result.message,
      });
    } catch (err) {
      this.logger.error(`Reset password failed - Email: ${resetPasswordDto.email}`, err.stack); // SỬA THÀNH resetPasswordDto.email
      
      return res.status(err.status || HttpStatus.BAD_REQUEST).json({
        statusCode: err.status || HttpStatus.BAD_REQUEST,
        message: err.message || 'Lỗi reset mật khẩu',
        error: err.response || err.message,
        timestamp: new Date().toISOString(), // THÊM TIMESTAMP
      });
    }
  }
}
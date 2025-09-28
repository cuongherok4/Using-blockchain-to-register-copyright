import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/model/entity/user.entity';
import * as nodemailer from 'nodemailer';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) {}

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new BadRequestException('Email không tồn tại');
    if (user.password !== password)
      throw new BadRequestException('Sai mật khẩu');

    const payload = { id: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      department: user.department,
      role: user.role,
      token, // trả token luôn
    };
  }

  async resetPassword(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('Email không tồn tại');

    const newPassword = Math.random().toString(36).slice(-9);
    user.password = newPassword;
    await this.userRepository.save(user);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'cuongherok4@gmail.com',
        pass: 'urxx fqcg hgdf vurp',
      },
    });

    const htmlContent = `
      <h2>Đặt lại mật khẩu</h2>
      <p>Email: ${email}</p>
      <p>Mật khẩu mới: ${newPassword}</p>
    `;

    await transporter.sendMail({
      from: 'your-email@gmail.com',
      to: email,
      subject: 'Mật khẩu mới của bạn',
      html: htmlContent,
    });

    return { message: 'Mật khẩu mới đã được gửi đến email của bạn' };
  }
}

// src/modules/auth/auth.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AuthModule } from './auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/model/entity/user.entity';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [User],
          synchronize: true,
        }),
        AuthModule,
      ],
    })
    .overrideGuard(JwtAuthGuard) // Mock JWT Guard
    .useValue({ canActivate: () => true })
    .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    
    jwtService = moduleFixture.get<JwtService>(JwtService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/auth/login (POST)', () => {
    it('should login successfully with valid credentials', async () => {
      // Tạo user trực tiếp qua repository thay vì API
      const userRepository = app.get('UserRepository');
      await userRepository.save({
        email: 'test@example.com',
        password: 'password123',
        department: 'IT',
        name: 'Test User',
        role: 'user'
      });

      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        })
        .expect(200);

      expect(response.body.message).toBe('Đăng nhập thành công');
      expect(response.body.token).toBeDefined();
    });

    it('should fail with invalid email format', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'invalid-email',
          password: 'password123'
        })
        .expect(400);

      expect(response.body.message).toContain('Email không hợp lệ');
    });

    it('should fail with empty email', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: '',
          password: 'password123'
        })
        .expect(400);

      expect(response.body.message).toContain('Email không được để trống');
    });
  });

  describe('/api/auth/reset-password (POST)', () => {
    it('should reset password for existing email', async () => {
      const userRepository = app.get('UserRepository');
      await userRepository.save({
        email: 'reset@example.com',
        password: 'oldpassword',
        department: 'IT',
        name: 'Reset User'
      });

      const response = await request(app.getHttpServer())
        .post('/api/auth/reset-password')
        .send({
          email: 'reset@example.com'
        })
        .expect(200);

      expect(response.body.message).toContain('Mật khẩu mới đã được gửi');
    });
  });
});
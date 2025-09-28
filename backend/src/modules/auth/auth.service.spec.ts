// src/modules/auth/auth.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/model/entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock-jwt-token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return user and token when credentials are valid', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        department: 'IT',
        role: 'user'
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

      const result = await service.login('test@example.com', 'password123');
      
      expect(result.token).toBe('mock-jwt-token');
      expect(result.email).toBe('test@example.com');
    });

    it('should throw error when user not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(service.login('notfound@example.com', 'password123'))
        .rejects.toThrow('Email không tồn tại');
    });
  });
});
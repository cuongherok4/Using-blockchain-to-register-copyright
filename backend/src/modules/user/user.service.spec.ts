// src/modules/user/user.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from '../../model/entity/user.entity';
import { Repository } from 'typeorm';

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    password: 'password123',
    department: 'IT',
    name: 'Test User',
    role: 'user'
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
            createQueryBuilder: jest.fn(() => ({
              andWhere: jest.fn().mockReturnThis(),
              getMany: jest.fn(),
            })),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue([mockUser]);
      const result = await service.getAllUsers();
      expect(result).toEqual([mockUser]);
    });
  });

  describe('createUser', () => {
    it('should create user successfully', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      jest.spyOn(repository, 'create').mockReturnValue(mockUser as any);
      jest.spyOn(repository, 'save').mockResolvedValue(mockUser as any);

      const result = await service.createUser({
        email: 'test@example.com',
        password: 'password123',
        department: 'IT',
        name: 'Test User'
      } as any);

      expect(result.email).toBe('test@example.com');
    });

    it('should throw error for duplicate email', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockUser as any);

      await expect(service.createUser({
        email: 'existing@example.com',
        password: 'password123',
        department: 'IT',
        name: 'Test User'
      } as any)).rejects.toThrow('Email đã tồn tại');
    });
  });

  describe('getUserById', () => {
    it('should return user by id', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockUser as any);
      const result = await service.getUserById(1);
      expect(result.id).toBe(1);
    });

    it('should throw error for non-existent user', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      await expect(service.getUserById(999)).rejects.toThrow('Không tìm thấy user ID 999');
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      const existingUser = { ...mockUser };
      const updatedData = { name: 'Updated Name' };

      jest.spyOn(repository, 'findOne')
        .mockResolvedValueOnce(existingUser as any)
        .mockResolvedValueOnce(null);
      jest.spyOn(repository, 'save').mockResolvedValue({ ...existingUser, ...updatedData } as any);

      const result = await service.updateUser(1, updatedData as any);
      expect(result.name).toBe('Updated Name');
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 1 } as any);
      await service.deleteUser(1);
      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw error for non-existent user', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 0 } as any);
      await expect(service.deleteUser(999)).rejects.toThrow('Không tìm thấy user với ID 999');
    });
  });
});
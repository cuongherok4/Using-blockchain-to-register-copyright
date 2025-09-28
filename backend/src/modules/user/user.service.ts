// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository, Like } from 'typeorm';
// import { User } from 'src/model/entity/user.entity';
// import { UserDto } from 'src/model/dto/user.dto';
// import * as ExcelJS from 'exceljs';
// import { UpdateUserDto } from 'src/model/dto/update-user.dto';

// @Injectable()
// export class UserService {
//   constructor(
//     @InjectRepository(User)
//     private readonly userRepository: Repository<User>,
//   ) {}

//   async getAllUsers(): Promise<User[]> {
//     return await this.userRepository.find();
//   }

//   async searchUsers(filters: {
//     email?: string;
//     name?: string;
//     department?: string;
//     role?: string;
//   }): Promise<User[]> {
//     const query = this.userRepository.createQueryBuilder('user');

//     if (filters.email)
//       query.andWhere('user.email LIKE :email', { email: `%${filters.email}%` });
//     if (filters.name)
//       query.andWhere('user.name LIKE :name', { name: `%${filters.name}%` });
//     if (filters.department)
//       query.andWhere('user.department LIKE :department', {
//         department: `%${filters.department}%`,
//       });
//     if (filters.role)
//       query.andWhere('user.role = :role', { role: filters.role });

//     return await query.getMany();
//   }

//   async createUser(userDto: UserDto): Promise<User> {
//     // Kiểm tra email đã tồn tại
//     const existingUser = await this.userRepository.findOne({
//       where: { email: userDto.email },
//     });
//     if (existingUser) {
//       throw new Error('Email đã tồn tại, vui lòng nhập lại email');
//     }

//     const newUser = this.userRepository.create(userDto);
//     return await this.userRepository.save(newUser);
//   }

//   async updateUser(id: number, userDto: UpdateUserDto): Promise<User> {
//   const user = await this.userRepository.findOne({ where: { id } });
//   if (!user) throw new NotFoundException(`Không tìm thấy user với ID ${id}`);

//   // Nếu có email và khác với email cũ → check trùng
//   if (userDto.email && user.email !== userDto.email) {
//     const existingUser = await this.userRepository.findOne({
//       where: { email: userDto.email },
//     });
//     if (existingUser) {
//       throw new Error('Email đã tồn tại, vui lòng nhập lại email');
//     }
//   }

//   Object.assign(user, userDto);
//   return await this.userRepository.save(user);
// }

//   async deleteUser(id: number): Promise<void> {
//     const result = await this.userRepository.delete(id);
//     if (result.affected === 0)
//       throw new NotFoundException(`Không tìm thấy user với ID ${id}`);
//   }

//   // ====== EXPORT EXCEL ======
// async exportUsersToExcel(res: any) {
//   const users = await this.getAllUsers();

//   const workbook = new ExcelJS.Workbook();
//   const worksheet = workbook.addWorksheet('Users');

//   worksheet.columns = [
//     { header: 'ID', key: 'id', width: 10 },
//     { header: 'Email', key: 'email', width: 30 },
//     { header: 'Password', key: 'password', width: 20 },
//     { header: 'Department', key: 'department', width: 20 },
//     { header: 'Name', key: 'name', width: 20 },
//     { header: 'Role', key: 'role', width: 15 },
//   ];

//   users.forEach(user => {
//     worksheet.addRow(user);
//   });

//   res.setHeader(
//     'Content-Type',
//     'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//   );
//   res.setHeader('Content-Disposition', 'attachment; filename=users.xlsx');

//   await workbook.xlsx.write(res);
//   res.end();
// }
// // src/modules/user/user.service.ts
// async getUserById(id: number): Promise<User> {
//   const user = await this.userRepository.findOne({ where: { id } });
//   if (!user) throw new NotFoundException(`Không tìm thấy user ID ${id}`);
//   return user;
// }



// }
// src/modules/user/user.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../model/entity/user.entity'; // ✅ ĐÃ SỬA
import { UserDto } from '../../model/dto/user.dto'; // ✅ ĐÃ SỬA
import * as ExcelJS from 'exceljs';
import { UpdateUserDto } from '../../model/dto/update-user.dto'; // ✅ ĐÃ SỬA

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async searchUsers(filters: {
    email?: string;
    name?: string;
    department?: string;
    role?: string;
  }): Promise<User[]> {
    const query = this.userRepository.createQueryBuilder('user');

    if (filters.email)
      query.andWhere('user.email LIKE :email', { email: `%${filters.email}%` });
    if (filters.name)
      query.andWhere('user.name LIKE :name', { name: `%${filters.name}%` });
    if (filters.department)
      query.andWhere('user.department LIKE :department', {
        department: `%${filters.department}%`,
      });
    if (filters.role)
      query.andWhere('user.role = :role', { role: filters.role });

    return await query.getMany();
  }

  async createUser(userDto: UserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: userDto.email },
    });
    if (existingUser) {
      throw new Error('Email đã tồn tại, vui lòng nhập lại email');
    }

    const newUser = this.userRepository.create(userDto);
    return await this.userRepository.save(newUser);
  }

  async updateUser(id: number, userDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`Không tìm thấy user với ID ${id}`);

    if (userDto.email && user.email !== userDto.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: userDto.email },
      });
      if (existingUser) {
        throw new Error('Email đã tồn tại, vui lòng nhập lại email');
      }
    }

    Object.assign(user, userDto);
    return await this.userRepository.save(user);
  }

  async deleteUser(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0)
      throw new NotFoundException(`Không tìm thấy user với ID ${id}`);
  }

  async exportUsersToExcel(res: any) {
    const users = await this.getAllUsers();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Users');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Password', key: 'password', width: 20 },
      { header: 'Department', key: 'department', width: 20 },
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Role', key: 'role', width: 15 },
    ];

    users.forEach(user => {
      worksheet.addRow(user);
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment; filename=users.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`Không tìm thấy user ID ${id}`);
    return user;
  }
}
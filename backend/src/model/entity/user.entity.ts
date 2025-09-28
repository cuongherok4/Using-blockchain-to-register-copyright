// src/model/entity/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  department: string;

  @Column()
  name: string;

  @Column({ default: 'user' }) // thêm role, mặc định là 'user'
  role: string;
}

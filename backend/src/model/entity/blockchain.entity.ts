
//src/model/entity/blockchain.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'Blockchain' })
export class BlockChainModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  uri: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  academicYear: Date;

  @Column()
  department: string;

  @Column()
  name: string;

  @Column()
  masv: string;
}

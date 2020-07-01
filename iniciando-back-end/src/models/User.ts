// Entity = something that will be saved on the database
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('users')
// Define type of data of a User
class User {
  // Primary entry on the table, is generated automatically
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Default type is varchar = string
  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  avatar: string;

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;
}

export default User;

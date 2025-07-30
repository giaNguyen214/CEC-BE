import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async create(email: string, hashedPassword: string, type: string, mssv: string): Promise<User> {
    const user = this.usersRepository.create({ email, password: hashedPassword, type, mssv });
    console.log("user", user)
    return this.usersRepository.save(user);
  }
}

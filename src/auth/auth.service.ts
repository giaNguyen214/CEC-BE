import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(email: string, password: string, role: string, mssv?: string) {
    // If mssv is not provided or is not exactly 7 digits, generate a random one
    if (!mssv || mssv.length !== 7 || !/^\d{7}$/.test(mssv)) {
      mssv = Math.floor(1000000 + Math.random() * 9000000).toString();
    }
    const hash = await bcrypt.hash(password, 10);
    console.log("auth service: ", email, hash, role, mssv)
    return this.usersService.create(email, hash, role, mssv);
  }
}
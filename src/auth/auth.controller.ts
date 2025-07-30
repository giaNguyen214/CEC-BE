import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: { email: string, password: string, role: string, mssv?: string }) {
    let type = "guest"
    if (body.role === "Sinh viên") {
      type = "undergraduate"
    } else if(body.role === "Cán bộ") {
      type = "admin"
    }

    return this.authService.register(body.email, body.password, type, body.mssv);
  }

  @Post('login')
  async login(@Body() body: { email: string, password: string }) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      return { message: 'Invalid credentials' };
    }
    // console.log(user)
    return { access_token: (await this.authService.login(user)).access_token, mssv: user.mssv, type: user.type };
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}

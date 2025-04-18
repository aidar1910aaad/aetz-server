import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string) {
    const user = await this.usersService.findByUsername(username);
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login({ username, password }: { username: string; password: string }) {
    const user = await this.usersService.findByUsername(username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Неверный логин или пароль');
    }
  
    const { password: _, ...safeUser } = user; // удаляем password
  
    const payload = { username: user.username, sub: user.id, role: user.role };
  
    return {
      access_token: this.jwtService.sign(payload),
      user: safeUser, // возвращаем все данные
    };
  }
  
}

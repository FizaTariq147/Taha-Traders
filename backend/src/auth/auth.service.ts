import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../users/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly users: Model<UserDocument>,
    private readonly jwt: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.users.findOne({ email: email.toLowerCase(), active: true });
    if (!user) return null;
    const ok = await bcrypt.compare(password, user.passwordHash);
    return ok ? user : null;
  }

  async signToken(user: UserDocument) {
    return this.jwt.signAsync({
      sub: String(user._id),
      email: user.email,
      role: user.role,
    });
  }

  async findById(id: string) {
    return this.users.findById(id).select('-passwordHash');
  }
}

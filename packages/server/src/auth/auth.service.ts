import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import * as argon2 from "argon2";
import { RequestWithUser } from "./auth.guard";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.usersService.findOneByEmail(email);

    if (!user || !(await argon2.verify(user.password, pass))) {
      throw new UnauthorizedException();
    }

    const payload: RequestWithUser["user"] = {
      sub: user.id,
      email: user.email,
    };

    return { access_token: await this.jwtService.signAsync(payload) };
  }

  async signUp(email: string, pass: string): Promise<{ access_token: string }> {
    const hashedPassword = await argon2.hash(pass);
    await this.usersService.create(email, hashedPassword);
    return this.signIn(email, pass);
  }
}

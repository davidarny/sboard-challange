import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "./auth.guard";
import { AuthService } from "./auth.service";
import { Request as ExpressRequest } from "express";

interface RequestWithUser extends ExpressRequest {
  user: {
    sub: number;
    email: string;
  };
}

class LoginBody {
  email: string;
  password: string;
}

class RegisterBody {
  email: string;
  password: string;
}

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post("login")
  signIn(@Body() body: LoginBody) {
    return this.authService.signIn(body.email, body.password);
  }

  @HttpCode(HttpStatus.OK)
  @Post("register")
  signUp(@Body() body: RegisterBody) {
    return this.authService.signUp(body.email, body.password);
  }

  @UseGuards(AuthGuard)
  @Get("profile")
  getProfile(@Request() req: RequestWithUser) {
    return req.user;
  }
}

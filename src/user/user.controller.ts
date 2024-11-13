import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  BadRequestException,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './create-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  getAllUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'user')
  async getUserById(@Param('id') id: string): Promise<User | undefined> {
    const user = await this.userService.findById(parseInt(id, 10));
    return user;
  }

  @Post('register')
  async registerUser(@Body() createUserDto: CreateUserDto) {
    try {
      const { token, user } = await this.userService.register(createUserDto);
      return { token, user };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('login')
  @HttpCode(200)
  async loginUser(@Body() loginDto: { email: string; password: string }) {
    try {
      const { token, user } = await this.userService.login(
        loginDto.email,
        loginDto.password,
      );
      return { token, user };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

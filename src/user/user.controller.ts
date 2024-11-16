import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  BadRequestException,
  HttpCode,
  UseGuards,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './create-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { Response } from 'express';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('register')
  showRegisterForm(@Res() res: Response) {
    if (process.env.NODE_ENV === 'test') {
      return res.json({ message: 'Register form endpoint for testing' });
    }
    return res.render('register');
  }

  @Get('login')
  showLoginForm(@Res() res: Response) {
    if (process.env.NODE_ENV === 'test') {
      return res.json({ message: 'Login form endpoint for testing' });
    }
    return res.render('login');
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getAllUsers(@Res() res: Response) {
    const users = await this.userService.findAll();
    if (process.env.NODE_ENV === 'test') {
      return res.json(users);
    }
    const isApiRequest =
      res.req.headers['accept']?.includes('application/json');
    if (isApiRequest) {
      return res.json(users);
    }
    return res.render('users', { users });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'user')
  async getUserById(@Param('id') id: string): Promise<User | undefined> {
    const user = await this.userService.findById(parseInt(id, 10));
    return user;
  }

  @Post('register')
  async registerUser(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
  ) {
    try {
      const { token, user } = await this.userService.register(createUserDto);
      if (process.env.NODE_ENV === 'test') {
        return res.json({ token, user });
      }
      const isApiRequest =
        res.req.headers['accept']?.includes('application/json');
      if (isApiRequest) {
        return res.json({
          message: 'User registered successfully',
          token,
          user,
        });
      }
      return res.redirect('/users/login');
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('login')
  @HttpCode(200)
  async loginUser(
    @Body() loginDto: { email: string; password: string },
    @Res() res: Response,
  ) {
    try {
      const { token, user } = await this.userService.login(
        loginDto.email,
        loginDto.password,
      );
      if (process.env.NODE_ENV === 'test') {
        return res.json({ message: 'Login successful', token });
      }
      const isApiRequest =
        res.req.headers['accept']?.includes('application/json');
      if (isApiRequest) {
        return res.json({ message: 'Login successful', token, user });
      }
      res.cookie('jwt', token, { httpOnly: true });
      return res.redirect('/home');
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'user')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: Partial<User>,
  ): Promise<User> {
    return this.userService.update(parseInt(id, 10), updateUserDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'user')
  async partialUpdateUser(
    @Param('id') id: string,
    @Body() updateUserDto: Partial<User>,
  ): Promise<User> {
    return this.userService.update(parseInt(id, 10), updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'user')
  async deleteUser(@Param('id') id: string): Promise<void> {
    return this.userService.delete(parseInt(id, 10));
  }
}

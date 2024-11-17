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
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './create-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { Response, Request } from 'express';
import { tokenBlacklist } from '../token-blacklist';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('register')
  showRegisterForm(@Res() res: Response, @Req() req?: Request) {
    const currentUser = req?.user ?? null;
    if (process.env.NODE_ENV === 'test') {
      return res.json({ message: 'Register form endpoint for testing' });
    }
    return res.render('register', { currentUser });
  }

  @Get('login')
  showLoginForm(@Res() res: Response, @Req() req?: Request) {
    const currentUser = req?.user ?? null;
    if (process.env.NODE_ENV === 'test') {
      return res.json({ message: 'Login form endpoint for testing' });
    }
    return res.render('login', { currentUser });
  }

  @Get('logout')
  async logoutUser(@Res() res: Response, @Req() req?: Request) {
    const token =
      req?.cookies?.jwt ||
      (req?.headers?.authorization &&
      req?.headers?.authorization.startsWith('Bearer ')
        ? req?.headers?.authorization.split(' ')[1]
        : null);
    if (!token) {
      return res.json({ message: 'No token found for logout', success: false });
    }
    console.log(`Adding token to blacklist: ${token}`);
    tokenBlacklist.add(token);
    res.clearCookie('jwt', { httpOnly: true });
    if (process.env.NODE_ENV === 'test') {
      return res.json({ message: 'User logged out successfully' });
    }
    const isPostmanRequest = req?.headers['user-agent']?.includes('Postman');
    if (isPostmanRequest) {
      return res.json({ message: 'Logout successful' });
    }
    return res.redirect('/users/login');
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getAllUsers(@Res() res: Response, @Req() req?: Request) {
    const users = await this.userService.findAll();
    const currentUser = req?.user ?? null;
    if (process.env.NODE_ENV === 'test') {
      return res.json(users);
    }
    const isPostmanRequest = req?.headers['user-agent']?.includes('Postman');
    if (isPostmanRequest) {
      return res.json(users);
    }
    return res.render('users', { users, currentUser });
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
    @Req() req?: Request,
  ) {
    try {
      const { token, user } = await this.userService.register(createUserDto);
      if (process.env.NODE_ENV === 'test') {
        return res.json({ token, user });
      }
      const isPostmanRequest = req?.headers['user-agent']?.includes('Postman');
      if (isPostmanRequest) {
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
    @Req() req?: Request,
  ) {
    try {
      const { token, user } = await this.userService.login(
        loginDto.email,
        loginDto.password,
      );
      if (process.env.NODE_ENV === 'test') {
        return res.json({ message: 'Login successful', token });
      }
      const isPostmanRequest = req?.headers['user-agent']?.includes('Postman');
      if (isPostmanRequest) {
        return res.json({ message: 'Login successful', token, user });
      }
      res.cookie('jwt', token, {
        httpOnly: true,
      });
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

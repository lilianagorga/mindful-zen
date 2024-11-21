import {
  Controller,
  Get,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Res,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../entities/user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { Response, Request } from 'express';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
    return res.render('dashboard', { users, currentUser });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'user')
  async getUserById(@Param('id') id: string): Promise<User | undefined> {
    const user = await this.userService.findById(parseInt(id, 10));
    return user;
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'user')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: Partial<User>,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const user = await this.userService.findById(parseInt(id, 10));
    if (!user) {
      throw new ForbiddenException('User not found');
    }
    if (req.user.role !== 'admin' && user.id !== req.user.id) {
      throw new ForbiddenException('Access denied');
    }

    const updatedUser = await this.userService.update(
      parseInt(id, 10),
      updateUserDto,
    );

    if (
      process.env.NODE_ENV === 'test' ||
      req?.headers['user-agent']?.includes('Postman')
    ) {
      return res.json(updatedUser);
    }
    const redirectPath = req.user.role === 'admin' ? '/dashboard' : '/profile';
    return res.redirect(redirectPath);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'user')
  async partialUpdateUser(
    @Param('id') id: string,
    @Body() updateUserDto: Partial<User>,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const user = await this.userService.findById(parseInt(id, 10));
    if (!user) {
      throw new ForbiddenException('User not found');
    }
    if (req.user.role !== 'admin' && user.id !== req.user.id) {
      throw new ForbiddenException('Access denied');
    }

    const updatedUser = await this.userService.update(
      parseInt(id, 10),
      updateUserDto,
    );

    if (
      process.env.NODE_ENV === 'test' ||
      req?.headers['user-agent']?.includes('Postman')
    ) {
      return res.json(updatedUser);
    }
    const redirectPath = req.user.role === 'admin' ? '/dashboard' : '/profile';
    return res.redirect(redirectPath);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'user')
  async deleteUser(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const user = await this.userService.findById(parseInt(id, 10));
    if (!user) {
      throw new ForbiddenException('User not found');
    }
    if (req.user.role !== 'admin' && user.id !== req.user.id) {
      throw new ForbiddenException('Access denied');
    }

    await this.userService.delete(parseInt(id, 10));

    if (
      process.env.NODE_ENV === 'test' ||
      req?.headers['user-agent']?.includes('Postman')
    ) {
      return res.json({ message: 'User deleted successfully' });
    }
    const redirectPath = req.user.role === 'admin' ? '/dashboard' : '/profile';
    return res.redirect(redirectPath);
  }
}

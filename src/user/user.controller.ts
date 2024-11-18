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
    return res.render('users', { users, currentUser });
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

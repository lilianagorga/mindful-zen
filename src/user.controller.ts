import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAllUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  getUserById(@Param('id') id: string): Promise<User | undefined> {
    return this.userService.findById(parseInt(id, 10));
  }

  @Post()
  createUser(@Body() createUserDto: Partial<User>): Promise<User> {
    return this.userService.create(createUserDto);
  }
}

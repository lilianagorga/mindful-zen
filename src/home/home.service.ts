import { Injectable, ConflictException } from '@nestjs/common';
import { CreateUserDto } from '../user/create-user.dto';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class HomeService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  getWelcomeMessage(): string {
    return 'Welcome to the Mindful Zen API!';
  }

  async register(
    createUserDto: CreateUserDto,
  ): Promise<{ token: string; user: Partial<User> }> {
    try {
      const existingUser = await this.userRepository.findOne({
        where: { email: createUserDto.email },
      });
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }

      const saltOrRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10;
      const hashedPassword = await bcrypt.hash(
        createUserDto.password,
        saltOrRounds,
      );

      let role = 'user';
      if (createUserDto.role && createUserDto.source !== 'frontend') {
        role = createUserDto.role;
      }

      const user = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
        role,
      });

      const savedUser = await this.userRepository.save(user);

      const userWithoutPassword = { ...savedUser };
      delete userWithoutPassword.password;

      const token = jwt.sign(
        { id: savedUser.id, email: savedUser.email, role: savedUser.role },
        process.env.JWT_SECRET as string,
        { expiresIn: process.env.JWT_EXPIRES_IN },
      );

      return { token, user: userWithoutPassword };
    } catch (error) {
      if (process.env.NODE_ENV !== 'test') {
        console.error('Error during user registration:', error);
      }
      throw error;
    }
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ token: string; user: Partial<User> }> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new Error('Invalid email or password');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );
    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;
    return { token, user: userWithoutPassword };
  }
}

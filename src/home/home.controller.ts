import {
  Controller,
  Get,
  Req,
  Res,
  Post,
  BadRequestException,
  HttpCode,
} from '@nestjs/common';
import { HomeService } from './home.service';
import { Throttle } from '@nestjs/throttler';
import { Response, Request } from 'express';
import { CreateUserDto } from '../user/create-user.dto';
import { tokenBlacklist } from '../token-blacklist';
import { Body } from '@nestjs/common';

@Controller('/')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get()
  @Throttle({ default: { limit: 15, ttl: 60000 } })
  getHomePage(@Res() res?: Response, @Req() req?: Request) {
    const message = this.homeService.getWelcomeMessage();
    if (process.env.NODE_ENV === 'test') {
      return res?.json({ message });
    }
    const isApiRequest =
      res?.req?.headers?.['accept']?.includes('application/json');
    if (isApiRequest) {
      return res?.json({ message });
    }
    const currentUser = req?.user ?? null;
    return res?.render('index', { message, currentUser });
  }

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
    return res.redirect('/login');
  }

  @Post('register')
  async registerUser(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
    @Req() req?: Request,
  ) {
    try {
      const { token, user } = await this.homeService.register(createUserDto);
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
      return res.redirect('/login');
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
      const { token, user } = await this.homeService.login(
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
      return res.redirect('/');
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

import {
  Injectable,
  ForbiddenException,
  UnauthorizedException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from 'src/v1/users/users.service';
import { ConfigService } from '@nestjs/config';
import { verify } from 'jsonwebtoken';
import { ITokenPayload } from './interfaces/ITokenPayload';
import { RegisterDTO } from './interfaces/register.dto';
import { LoginDTO } from './interfaces/login.dto';
import generateToken from './utils';
import { Request, Response } from 'express';
import { ForgotPasswordDTO } from './interfaces/forgot-password.dto';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private ATSecret: string;
  private RTSecret: string;
  private CKPath: string;

  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
    private mailService: MailService,
  ) {
    this.ATSecret = this.configService.get('AT_SECRET');
    this.RTSecret = this.configService.get('RT_SECRET');
    this.CKPath = this.configService.get('CK_PATH');
  }

  async verifyRefreshToken(refreshToken: string) {
    return this.verifyToken(refreshToken, this.RTSecret);
  }

  async verifyToken(token: string, secret: string) {
    try {
      // verify AT
      const decoded = verify(token, secret) as Partial<ITokenPayload>;
      // find user
      const user = await this.usersService.getUserById(decoded._id);

      if (!user) {
        throw new ForbiddenException();
      }

      return user;
      //
    } catch (error) {
      throw error;
    }
  }

  async verifyAccessToken(accessToken: string): Promise<any> {
    try {
      const user = await this.verifyToken(accessToken, this.ATSecret);
      return user;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException();
      }

      throw error;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async isTokenExpired(accessToken: string) {
    try {
      // verify AT
      return false;
      //
    } catch (error) {
      if (error && error.name === 'TokenExpiredError') {
        return true;
      }
      throw error;
    }
  }

  async register(registerDTO: RegisterDTO) {
    try {
      // if (registerDTO.role === RoleUserEnum.admin) {
      //   throw new Error('Role Must Be User');
      // }
      return this.usersService.createOneUser(registerDTO);
    } catch (error) {
      throw error;
    }
  }

  async generaTokens(data: ITokenPayload) {
    try {
      const [AT, RT] = await Promise.all([
        generateToken(data, this.ATSecret, { expiresIn: '7d' }),
        generateToken({ _id: data._id }, this.RTSecret, { expiresIn: '7d' }),
      ]);

      return {
        accessToken: AT,
        refreshToken: RT,
      };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  storeRefreshToken(res: Response, refreshToken: string) {
    res.cookie('rt', refreshToken, {
      sameSite: 'none',
      signed: true,
      httpOnly: true,
      secure: true,
      path: this.CKPath,
    });
  }

  async login(loginDTO: LoginDTO, res: Response) {
    try {
      const user = await this.usersService.findAndVerify(loginDTO);
      const { accessToken, refreshToken } = await this.generaTokens({
        _id: user._id,
        username: user.username,
      });

      this.storeRefreshToken(res, refreshToken);

      const { password, ...tempUser } = user['_doc'];

      return { accessToken, user: tempUser };
    } catch (error) {
      throw error;
    }
  }

  extractRefreshToken(req: Request) {
    try {
      const { rt } = req.signedCookies;
      if (!rt) {
        throw new ForbiddenException();
      }

      return rt as string;
      //
    } catch (error) {
      throw error;
    }
  }

  async processRefreshToken(req: Request) {
    try {
      // don't need to check the access token anymore. the guard did
      const refreshToken = this.extractRefreshToken(req);
      const user = await this.verifyRefreshToken(refreshToken);
      const accessToken = await generateToken(
        {
          _id: user._id,
          username: user.username,
        },
        this.ATSecret,
        { expiresIn: '7d' },
      );

      return { accessToken };
      //
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async forgotPassword(forgotPasswordDTO: ForgotPasswordDTO) {
    try {
      // don't need to check the access token anymore. the guard did
      const user = await this.usersService.getUserByCondition({
        username: forgotPasswordDTO.username,
      });
      if (!user || !user.email)
        throw new BadRequestException('User not found or User dont have email');
      const randomPassword = Math.random().toString(36).slice(-8);
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(randomPassword, salt);
      await this.usersService.updateUserByCondition(
        { username: user.username },
        { password: hashedPassword },
      );
      await this.mailService.sendMail(user, randomPassword);
      return { Message: 'Sucess' };
      //
    } catch (error) {
      throw error;
    }
  }
}

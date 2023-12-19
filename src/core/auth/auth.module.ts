import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/v1/users/users.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [forwardRef(() => UsersModule), MailModule],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}

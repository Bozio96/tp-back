import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesion y obtener un JWT' })
  @Public()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}

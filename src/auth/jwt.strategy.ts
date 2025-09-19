import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'YOUR_SECRET_KEY', // TODO: Move this to environment variables
    });
  }

  async validate(payload: any) {
    // The payload is the decoded JWT.
    // Passport will build a user object based on the return value of this method,
    // and attach it to the Request object.
    return {
      userId: payload.sub,
      username: payload.username,
      role: payload.role,
    };
  }
}

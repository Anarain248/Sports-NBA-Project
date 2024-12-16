import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from '../constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    try {
      
      if (!payload) {
        throw new UnauthorizedException('No payload');
      }

      const user = { 
        sub: payload.sub,
        username: payload.username,
        role: payload.role
      };
      
      return user;
    } catch (error) {
      throw error;
    }
  }
} 
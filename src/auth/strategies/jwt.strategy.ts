import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuarios } from 'src/usuarios/entities/usuarios.entity';
import { Repository } from 'typeorm';
import { Roles } from 'src/datos-us/roles/entities/roles.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    @InjectRepository(Usuarios)
    private readonly usuariosRepository: Repository<Usuarios>,
    @InjectRepository(Roles)
    private readonly rolesRepository: Repository<Roles>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:  process.env.JWT_SECRET,
    });
    console.log('JWT_SECRET:', process.env.JWT_SECRET); // Debug

  }

  async validate(payload: any) {
    console.log('Payload recibido:', payload); // Debug
    return { userId: payload.sub, rol: payload.rol };
  }
}

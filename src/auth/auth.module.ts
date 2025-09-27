import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RolesModule } from 'src/datos-us/roles/roles.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosHasRoles } from 'src/datos-us/roles/entities/usuarios_has_roles.entity';
import { Roles } from 'src/datos-us/roles/entities/roles.entity';
import { Usuarios } from 'src/usuarios/entities/usuarios.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuarios, Roles, UsuariosHasRoles]),
    ConfigModule,
    forwardRef(() => UsuariosModule),
    forwardRef(() => RolesModule),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      useFactory: async (configService: ConfigService) => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '8h' },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService, PassportModule],
})
export class AuthModule {}

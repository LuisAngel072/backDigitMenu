import { Body, Controller, Get } from '@nestjs/common';
import { Usuarios } from 'src/usuarios/entities/usuarios.entity';
import { RolesService } from './roles.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Roles_validos } from 'src/usuarios/interfaces/roles_validos.enum';

@Controller('roles')
export class RolesController {

    constructor(private readonly rolesService: RolesService) {}

    @Auth(Roles_validos.admin)
    @Get('getUsYrol')
    async getRolesByUsuario(@Body() usuario: Usuarios) {
        return await this.rolesService.getRolesByUsuario(usuario);
    }

    @Auth(Roles_validos.admin)
    @Get('getUsuarios')
    async getUsuariosConRoles() {
        return await this.rolesService.obtenerUsuariosYRoles();
    }
    
    @Auth(Roles_validos.admin)
    @Get()
    async getRoles() {
        return await this.rolesService.getRoles();
    }
}

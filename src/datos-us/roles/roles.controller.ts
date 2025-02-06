import { Body, Controller, Get } from '@nestjs/common';
import { Usuarios } from 'src/usuarios/entities/usuarios.entity';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {

    constructor(private readonly rolesService: RolesService) {}

    @Get('getUsYrol')
    async getRolesByUsuario(@Body() usuario: Usuarios) {
        return await this.rolesService.getRolesByUsuario(usuario);
    }

    @Get('getUsuarios')
    async getUsuariosConRoles() {
        return await this.rolesService.obtenerUsuariosYRoles();
    }
}

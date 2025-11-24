import { IsNotEmpty } from 'class-validator';
import { Usuarios } from 'src/usuarios/entities/usuarios.entity';

export class CreateUsHRolDTO {
  @IsNotEmpty()
  usuario_id: Usuarios;

  @IsNotEmpty()
  rol_id: Usuarios;
}

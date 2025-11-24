import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ExtrasService } from './extras.service';
import { CrExtrasDto } from './dtos/cr-extra.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Roles_validos } from 'src/usuarios/interfaces/roles_validos.enum';
import { UpExtrasDTO } from './dtos/up-extra.dto';

@Controller('extras')
export class ExtrasController {
  constructor(private readonly extrasService: ExtrasService) {}

  @Get()
  async getExtras() {
    return await this.extrasService.getExtras();
  }

  @Get(':id_extra')
  async getExtra(@Param('id_extra', ParseIntPipe) id_extra: number) {
    return await this.extrasService.getExtra(id_extra);
  }

  @Auth(Roles_validos.admin)
  @Post('registrar')
  async crExtra(@Body() crExtraDto: CrExtrasDto) {
    console.log(crExtraDto);
    return await this.extrasService.crExtra(crExtraDto);
  }

  @Auth(Roles_validos.admin)
  @Patch('actualizar/:id_extra')
  async upExtra(
    @Param('id_extra', ParseIntPipe) id_extra: number,
    @Body() upExtrasDTO: UpExtrasDTO,
  ) {
    return await this.extrasService.upExtra(id_extra, upExtrasDTO);
  }

  @Auth(Roles_validos.admin)
  @Delete('eliminar/:id_extra')
  async delExtra(@Param('id_extra', ParseIntPipe) id_extra: number) {
    return await this.extrasService.delExtra(id_extra);
  }
}

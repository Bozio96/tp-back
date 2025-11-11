import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@ApiTags('clients')
@ApiBearerAuth()
@Controller('api/clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un cliente' })
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar clientes' })
  findAll() {
    return this.clientsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener cliente por id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.clientsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un cliente' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    return this.clientsService.update(id, updateClientDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un cliente' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.clientsService.remove(id);
    return { success: true };
  }
}

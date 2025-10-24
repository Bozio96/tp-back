import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
  ) {}

  async create(createClientDto: CreateClientDto): Promise<Client> {
    const payload: Partial<Client> = {
      ...createClientDto,
      dni: this.normalizeNullableString(createClientDto.dni),
      cuil: this.normalizeNullableString(createClientDto.cuil),
    };

    await this.ensureUniqueFields(
      payload.dni,
      payload.cuil,
      undefined,
    );

    const newClient = this.clientsRepository.create(payload);
    return this.clientsRepository.save(newClient);
  }

  findAll() {
    return this.clientsRepository.find();
  }

  async findOne(id: number) {
    const client = await this.clientsRepository.findOneBy({ id });
    if (!client) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }
    return client;
  }

  async update(
    id: number,
    updateClientDto: UpdateClientDto,
  ): Promise<Client> {
    const existingClient = await this.clientsRepository.findOneBy({ id });
    if (!existingClient) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }

    const normalizedDto: Partial<Client> = { ...updateClientDto };

    if (Object.prototype.hasOwnProperty.call(updateClientDto, 'dni')) {
      normalizedDto.dni = this.normalizeNullableString(updateClientDto.dni);
    }

    if (Object.prototype.hasOwnProperty.call(updateClientDto, 'cuil')) {
      normalizedDto.cuil = this.normalizeNullableString(updateClientDto.cuil);
    }

    if (
      normalizedDto.dni &&
      normalizedDto.dni !== existingClient.dni
    ) {
      await this.ensureUniqueFields(normalizedDto.dni, null, id);
    }

    if (
      normalizedDto.cuil &&
      normalizedDto.cuil !== existingClient.cuil
    ) {
      await this.ensureUniqueFields(null, normalizedDto.cuil, id);
    }

    const merged = this.clientsRepository.merge(existingClient, normalizedDto);
    return this.clientsRepository.save(merged);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.clientsRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }
    return true;
  }

  private normalizeNullableString(
    value?: string | null,
  ): string | null {
    if (value === undefined || value === null) {
      return null;
    }

    if (typeof value !== 'string') {
      return null;
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  private async ensureUniqueFields(
    dni: string | null | undefined,
    cuil: string | null | undefined,
    excludeClientId?: number,
  ): Promise<void> {
    if (dni) {
      const existingDni = await this.clientsRepository.findOne({
        where: { dni },
        select: ['id'],
      });
      if (existingDni && existingDni.id !== excludeClientId) {
        throw new ConflictException(`Ya existe un cliente con el DNI "${dni}"`);
      }
    }

    if (cuil) {
      const existingCuil = await this.clientsRepository.findOne({
        where: { cuil },
        select: ['id'],
      });
      if (existingCuil && existingCuil.id !== excludeClientId) {
        throw new ConflictException(
          `Ya existe un cliente con el CUIL "${cuil}"`,
        );
      }
    }
  }
}

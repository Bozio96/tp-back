import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BrandsService } from './brands.service';
import { Brand } from './entities/brand.entity';
import { CreateBrandDto } from './dto/create-brand.dto';
import { ConflictException } from '@nestjs/common';

describe('BrandsService - create', () => {
  let service: BrandsService;
  let repo: jest.Mocked<Repository<Brand>>;

  const repoMock: Partial<jest.Mocked<Repository<Brand>>> = {
    findOne: jest.fn(),
    create: jest.fn(),
    merge: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BrandsService,
        { provide: getRepositoryToken(Brand), useValue: repoMock },
      ],
    }).compile();

    service = module.get<BrandsService>(BrandsService);
    repo = module.get(getRepositoryToken(Brand));
    jest.clearAllMocks();
  });

  it('crea una nueva marca cuando no existe', async () => {
    const dto: CreateBrandDto = { name: 'Acme' };
    const created: Brand = { id: 1, name: dto.name, isDeleted: false } as any;

    repo.findOne!.mockResolvedValue(null as any);
    repo.create!.mockReturnValue(created);
    repo.save!.mockResolvedValue(created);

    const result = await service.create(dto);

    expect(repo.findOne).toHaveBeenCalledWith({ where: { name: dto.name } });
    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({ name: dto.name, isDeleted: false }),
    );
    expect(repo.save).toHaveBeenCalledWith(created);
    expect(result).toEqual(created);
  });

  it('lanza ConflictException si ya existe activa con el mismo nombre', async () => {
    const dto: CreateBrandDto = { name: 'Acme' };
    repo.findOne!.mockResolvedValue({ id: 2, name: dto.name, isDeleted: false } as any);

    await expect(service.create(dto)).rejects.toBeInstanceOf(ConflictException);
    expect(repo.create).not.toHaveBeenCalled();
    expect(repo.save).not.toHaveBeenCalled();
  });

  it('revive una marca soft-deleted con el mismo nombre', async () => {
    const dto: CreateBrandDto = { name: 'Acme' };
    const existing: Brand = { id: 5, name: 'Acme', isDeleted: true } as any;
    const revived: Brand = { id: 5, name: 'Acme', isDeleted: false } as any;

    repo.findOne!.mockResolvedValue(existing);
    repo.merge!.mockReturnValue(revived);
    repo.save!.mockResolvedValue(revived);

    const result = await service.create(dto);

    expect(repo.merge).toHaveBeenCalledWith(
      existing,
      expect.objectContaining({ isDeleted: false, name: dto.name }),
    );
    expect(repo.save).toHaveBeenCalledWith(revived);
    expect(result).toEqual(revived);
  });
});


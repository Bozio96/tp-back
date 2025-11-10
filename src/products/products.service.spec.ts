import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { PriceChange } from './entities/price-change.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { ConflictException } from '@nestjs/common';

describe('ProductsService - create', () => {
  let service: ProductsService;
  let productRepo: jest.Mocked<Repository<Product>>;

  const productRepoMock: Partial<jest.Mocked<Repository<Product>>> = {
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  // PriceChange repository is not used in create, but must be provided
  const priceChangeRepoMock: Partial<jest.Mocked<Repository<PriceChange>>> = {
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: productRepoMock,
        },
        {
          provide: getRepositoryToken(PriceChange),
          useValue: priceChangeRepoMock,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    productRepo = module.get(getRepositoryToken(Product));
    jest.clearAllMocks();
  });

  it('crea y devuelve el producto cuando el SKU no existe', async () => {
    const dto: CreateProductDto = {
      sku: 'SKU-TEST-001',
      name: 'Producto Test',
      price: 100,
      stock: 10,
      minStock: 1,
      costBase: 80,
      discounts: 0,
      includeIVA: false,
      utilityPercentage: 20,
      salePrice: 120,
      brand: { id: 1 },
      category: { id: 1 },
      supplier: { id: 1 },
      department: { id: 1 },
    } as any;

    const entity: Product = { id: 1, isDeleted: false, ...dto } as any;

    productRepo.findOneBy!.mockResolvedValue(null as any);
    productRepo.create!.mockReturnValue(entity);
    productRepo.save!.mockResolvedValue(entity);

    const result = await service.create(dto);

    expect(productRepo.findOneBy).toHaveBeenCalledWith({ sku: dto.sku });
    expect(productRepo.create).toHaveBeenCalledWith(dto as unknown as Product);
    expect(productRepo.save).toHaveBeenCalledWith(entity);
    expect(result).toEqual(entity);
  });

  it('lanza ConflictException cuando ya existe un SKU duplicado', async () => {
    const dto: CreateProductDto = {
      sku: 'SKU-TEST-001',
      name: 'Producto Test',
      price: 100,
      stock: 10,
      minStock: 1,
      costBase: 80,
      discounts: 0,
      includeIVA: false,
      utilityPercentage: 20,
      salePrice: 120,
      brand: { id: 1 },
      category: { id: 1 },
      supplier: { id: 1 },
      department: { id: 1 },
    } as any;

    productRepo.findOneBy!.mockResolvedValue({ id: 99, sku: dto.sku } as any);

    await expect(service.create(dto)).rejects.toBeInstanceOf(ConflictException);
    expect(productRepo.create).not.toHaveBeenCalled();
    expect(productRepo.save).not.toHaveBeenCalled();
  });
});

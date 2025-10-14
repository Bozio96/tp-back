import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Sale } from './entities/sale.entity';
import { SaleDetail } from './entities/sale-detail.entity';
import { CreateSaleDto } from './dto/create-sale.dto';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private readonly salesRepository: Repository<Sale>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createSaleDto: CreateSaleDto): Promise<Sale> {
    return this.dataSource.transaction(async (manager) => {
      const isQuote = createSaleDto.type === 'quote';
      const customer = createSaleDto.customer ?? ({} as any);
      const totals = createSaleDto.totals;
      const invoiceType = isQuote
        ? 'X'
        : (createSaleDto.invoiceType ?? '').trim().toUpperCase() || 'X';
      const { pointOfSale, invoiceNumber } = await this.resolveInvoiceIdentifiers(
        manager,
        createSaleDto,
        isQuote,
        invoiceType,
      );

      const sale = manager.create(Sale, {
        pointOfSale,
        invoiceNumber,
        invoiceType,
        paymentMethod: isQuote ? null : createSaleDto.paymentMethod,
        type: isQuote ? 'presupuesto' : 'venta',
        customerType: customer.type,
        customerId: customer.id ?? null,
        customerName: customer.name ?? null,
        customerDocument: customer.document ?? null,
        customerCuit: customer.cuit ?? null,
        customerDni: customer.dni ?? null,
        customerAddress: customer.address ?? null,
        customerPhone: customer.phone ?? null,
        invoiceDate: new Date(createSaleDto.invoiceDate),
        totalNet: totals.net,
        totalIva: totals.iva,
        totalDiscount: totals.discounts,
        totalFinal: totals.final,
        isQuote,
      });

      const savedSale = await manager.save(Sale, sale);
      const detailEntities: SaleDetail[] = [];

      for (const item of createSaleDto.items) {
        const product = await manager.findOne(Product, {
          where: { id: item.productId },
        });

        if (!product) {
          throw new NotFoundException(
            `Producto con ID ${item.productId} no encontrado`,
          );
        }

        if (!isQuote) {
          if (product.stock < item.quantity) {
            throw new BadRequestException(
              `Stock insuficiente para el producto ${product.name}`,
            );
          }
          await manager.decrement(
            Product,
            { id: product.id },
            'stock',
            item.quantity,
          );
        }

        const detail = manager.create(SaleDetail, {
          lineNumber: item.line,
          sale: savedSale,
          product,
          internalCode: item.internalCode,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discountRate: item.discountRate,
          ivaRate: item.ivaRate,
          netAmount: item.summary?.net ?? 0,
          ivaAmount: item.summary?.iva ?? 0,
          discountAmount: item.summary?.discount ?? 0,
          totalAmount: item.summary?.total ?? 0,
        });
        detailEntities.push(detail);
      }

      await manager.save(SaleDetail, detailEntities);

      return manager.findOne(Sale, {
        where: { id: savedSale.id },
        relations: ['details'],
      }) as Promise<Sale>;
    });
  }

  findAll(): Promise<Sale[]> {
    return this.salesRepository.find({
      relations: ['details'],
      order: {
        createdAt: 'DESC',
        details: {
          lineNumber: 'ASC',
        },
      },
    });
  }

  async findOne(id: number): Promise<Sale> {
    const sale = await this.salesRepository.findOne({
      where: { id },
      relations: ['details'],
      order: {
        details: {
          lineNumber: 'ASC',
        },
      },
    });
    if (!sale) {
      throw new NotFoundException(`Venta con ID ${id} no encontrada`);
    }
    return sale;
  }

  private normalizeInvoiceNumber(value?: string | null): string | null {
    if (value === null || value === undefined) {
      return null;
    }
    const digits = String(value).replace(/\D+/g, '');
    if (!digits) {
      return null;
    }
    const trimmed = digits.slice(-8);
    return trimmed.padStart(8, '0');
  }

  private resolvePointOfSale(type: 'sale' | 'quote', invoiceType: string): string {
    if (type === 'quote') {
      return '0001';
    }
    return invoiceType === 'B' ? '0003' : '0001';
  }

  private async resolveInvoiceIdentifiers(
    manager: EntityManager,
    dto: CreateSaleDto,
    isQuote: boolean,
    invoiceType: string,
  ): Promise<{ pointOfSale: string; invoiceNumber: string }> {
    const pointOfSale = this.resolvePointOfSale(dto.type, invoiceType);
    const providedNumber = this.normalizeInvoiceNumber(dto.invoiceNumber);
    if (providedNumber) {
      return { pointOfSale, invoiceNumber: providedNumber };
    }

    const invoiceNumber = await this.findNextInvoiceNumber(
      manager,
      pointOfSale,
      isQuote,
      invoiceType,
    );

    return { pointOfSale, invoiceNumber };
  }

  async previewNextInvoiceIdentifiers(
    type: 'sale' | 'quote',
    invoiceType?: string,
  ): Promise<{ pointOfSale: string; invoiceNumber: string; invoiceType: string }> {
    const normalizedInvoiceType =
      type === 'quote'
        ? 'X'
        : (invoiceType ?? '').trim().toUpperCase() || 'X';
    const isQuote = type === 'quote';
    const pointOfSale = this.resolvePointOfSale(type, normalizedInvoiceType);
    const invoiceNumber = await this.findNextInvoiceNumber(
      this.salesRepository.manager,
      pointOfSale,
      isQuote,
      normalizedInvoiceType,
    );

    return {
      pointOfSale,
      invoiceNumber,
      invoiceType: normalizedInvoiceType,
    };
  }

  private async findNextInvoiceNumber(
    manager: EntityManager,
    pointOfSale: string,
    isQuote: boolean,
    invoiceType: string,
  ): Promise<string> {
    const lastSale = await manager
      .createQueryBuilder(Sale, 'sale')
      .select('sale.invoiceNumber', 'invoiceNumber')
      .where('sale.pointOfSale = :pointOfSale', { pointOfSale })
      .andWhere('sale.isQuote = :isQuote', { isQuote })
      .andWhere('sale.invoiceType = :invoiceType', { invoiceType })
      .orderBy('sale.invoiceNumber', 'DESC')
      .limit(1)
      .getRawOne<{ invoiceNumber: string | null }>();

    const lastNormalized = this.normalizeInvoiceNumber(
      lastSale?.invoiceNumber ?? null,
    );
    const lastNumeric =
      lastNormalized !== null ? Number.parseInt(lastNormalized, 10) : NaN;
    const nextNumeric =
      Number.isFinite(lastNumeric) && lastNumeric >= 0 ? lastNumeric + 1 : 0;

    return nextNumeric.toString().padStart(8, '0');
  }
}

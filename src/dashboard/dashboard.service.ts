import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Client } from "src/clients/entities/client.entity";
import { Sale } from "src/sales/entities/sale.entity";
import { Repository } from "typeorm";


@Injectable()
export class DashboardService {
 
    constructor(
    @InjectRepository(Sale) private readonly salesRepo: Repository<Sale>,
     @InjectRepository(Client) private readonly clientsRepo: Repository<Client>,
  ) {}

  // === 1️⃣ CARDS RESUMEN ===
  async getCards() {
    // Total vendido (mes actual)
    const totalVendido = await this.salesRepo.query(`
      SELECT IFNULL(SUM(total_final), 0) AS total
      FROM sales
      WHERE tipo = 'venta'
        AND MONTH(invoice_date) = MONTH(CURDATE())
        AND YEAR(invoice_date) = YEAR(CURDATE());
    `);

    // Total clientes registrados
    const totalClientes = await this.clientsRepo.count();

    // Total de productos vendidos (cantidad)
    const productosVendidos = await this.salesRepo.query(`
      SELECT IFNULL(SUM(sd.quantity), 0) AS total
      FROM sale_details sd
      JOIN sales s ON s.id = sd.sale_id
      WHERE s.tipo = 'venta'
        AND MONTH(s.invoice_date) = MONTH(CURDATE())
        AND YEAR(s.invoice_date) = YEAR(CURDATE());
    `);

    const totalVendidoValor = Number(totalVendido?.[0]?.total ?? 0);
    const productosVendidosValor = Number(productosVendidos?.[0]?.total ?? 0);

    return {
      totalVendido: totalVendidoValor,
      clientes: totalClientes,
      productosVendidos: productosVendidosValor,
    };
  }

  // === 2️⃣ EVOLUCIÓN MENSUAL DE VENTAS ===
  async getVentasMensuales() {
    return this.salesRepo.query(`
      SELECT 
        MONTH(invoice_date) AS mes,
        IFNULL(SUM(total_final), 0) AS total_ventas
      FROM sales
      WHERE tipo = 'venta'
        AND YEAR(invoice_date) = YEAR(CURDATE())
      GROUP BY MONTH(invoice_date)
      ORDER BY mes;
    `);
  }

  // === 3️⃣ DISTRIBUCIÓN VENTAS VS PRESUPUESTOS ===
  async getDistribucion() {
    return this.salesRepo.query(`
      SELECT 
        tipo AS type, 
        COUNT(*) AS cantidad
      FROM sales
      GROUP BY tipo;
    `);
  }

  // === 4️⃣ TOP 5 PRODUCTOS MÁS VENDIDOS ===
  async getProductosTop() {
    return this.salesRepo.query(`
      SELECT 
        p.name AS producto,
        SUM(sd.quantity) AS cantidad
      FROM sale_details sd
      JOIN products p ON p.id = sd.product_id
      JOIN sales s ON s.id = sd.sale_id
      WHERE s.tipo = 'venta'
      GROUP BY p.name
      ORDER BY cantidad DESC
      LIMIT 5;
    `);
  }

  // === 5️⃣ EVOLUCIÓN DIARIA DE VENTAS (últimos 30 días) ===
  async getVentasDiarias() {
    return this.salesRepo.query(`
      SELECT 
        DATE(invoice_date) AS fecha,
        IFNULL(SUM(total_final), 0) AS total_dia
      FROM sales
      WHERE tipo = 'venta'
        AND invoice_date >= CURDATE() - INTERVAL 30 DAY
      GROUP BY DATE(invoice_date)
      ORDER BY fecha;
    `);
  }
}

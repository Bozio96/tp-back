import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Sale } from "src/sales/entities/sale.entity";
import { Repository } from "typeorm";


@Injectable()
export class DashboardService {
 
    constructor(
    @InjectRepository(Sale) private readonly salesRepo: Repository<Sale>,
    
  ) {}

  // === 1️⃣ CARDS RESUMEN ===
  async getCards() {
    // Total vendido (mes actual)
    const totalVendido = await this.salesRepo.query(`
      SELECT IFNULL(SUM(total_final), 0) AS total
      FROM sales
      WHERE tipo = 'venta'
        AND is_quote = 0
        AND MONTH(invoice_date) = MONTH(CURDATE())
        AND YEAR(invoice_date) = YEAR(CURDATE());
    `);

    // Total presupuestos emitidos
    const presupuestos = await this.salesRepo.query(`
      SELECT COUNT(*) AS total
      FROM sales
      WHERE tipo = 'presupuesto'
        OR is_quote = 1;
    `);

    // Total de productos vendidos (cantidad)
    const productosVendidos = await this.salesRepo.query(`
      SELECT IFNULL(SUM(sd.quantity), 0) AS total
      FROM sale_details sd
      JOIN sales s ON s.id = sd.sale_id
      WHERE s.tipo = 'venta'
        AND s.is_quote = 0
        AND MONTH(s.invoice_date) = MONTH(CURDATE())
        AND YEAR(s.invoice_date) = YEAR(CURDATE());
    `);

    return {
      totalVendido: totalVendido[0].total,
      presupuestos: presupuestos[0].total,
      productosVendidos: productosVendidos[0].total,
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
        AND is_quote = 0
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
        AND s.is_quote = 0
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
        AND is_quote = 0
        AND invoice_date >= CURDATE() - INTERVAL 30 DAY
      GROUP BY DATE(invoice_date)
      ORDER BY fecha;
    `);
  }
}

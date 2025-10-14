import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  /**
   * 🔹 KPIs principales: total vendido, presupuestos, productos vendidos
   * Endpoint: GET /dashboard/cards
   */
  @Get('cards')
  async getCards() {
    return await this.dashboardService.getCards();
  }

  /**
   * 🔹 Ventas mensuales (gráfico de barras)
   * Endpoint: GET /dashboard/ventas-mensuales
   */
  @Get('ventas-mensuales')
  async getVentasMensuales() {
    return await this.dashboardService.getVentasMensuales();
  }

  /**
   * 🔹 Distribución de operaciones (ventas vs presupuestos)
   * Endpoint: GET /dashboard/distribucion
   */
  @Get('distribucion')
  async getDistribucion() {
    return await this.dashboardService.getDistribucion();
  }

  /**
   * 🔹 Productos más vendidos (Top 5)
   * Endpoint: GET /dashboard/productos-top
   */
  @Get('productos-top')
  async getProductosTop() {
    return await this.dashboardService.getProductosTop();
  }

  /**
   * 🔹 Evolución diaria de ventas (últimos 30 días)
   * Endpoint: GET /dashboard/ventas-diarias
   */
  @Get('ventas-diarias')
  async getVentasDiarias() {
    return await this.dashboardService.getVentasDiarias();
  }
}

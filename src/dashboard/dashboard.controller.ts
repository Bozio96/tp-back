import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';

@ApiTags('dashboard')
@ApiBearerAuth()
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  /**
   * 🔹 KPIs principales: total vendido, presupuestos, productos vendidos
   * Endpoint: GET /dashboard/cards
   */
  @Get('cards')
  @ApiOperation({ summary: 'Obtener metricas generales del dashboard' })
  async getCards() {
    return await this.dashboardService.getCards();
  }

  /**
   * 🔹 Ventas mensuales (gráfico de barras)
   * Endpoint: GET /dashboard/ventas-mensuales
   */
  @Get('ventas-mensuales')
  @ApiOperation({ summary: 'Obtener ventas agrupadas por mes' })
  async getVentasMensuales() {
    return await this.dashboardService.getVentasMensuales();
  }

  /**
   * 🔹 Distribución de operaciones (ventas vs presupuestos)
   * Endpoint: GET /dashboard/distribucion
   */
  @Get('distribucion')
  @ApiOperation({ summary: 'Obtener distribucion de operaciones' })
  async getDistribucion() {
    return await this.dashboardService.getDistribucion();
  }

  /**
   * 🔹 Productos más vendidos (Top 5)
   * Endpoint: GET /dashboard/productos-top
   */
  @Get('productos-top')
  @ApiOperation({ summary: 'Consultar los productos mas vendidos' })
  async getProductosTop() {
    return await this.dashboardService.getProductosTop();
  }

  /**
   * 🔹 Evolución diaria de ventas (últimos 30 días)
   * Endpoint: GET /dashboard/ventas-diarias
   */
  @Get('ventas-diarias')
  @ApiOperation({ summary: 'Obtener evolucion diaria de ventas' })
  async getVentasDiarias() {
    return await this.dashboardService.getVentasDiarias();
  }
}

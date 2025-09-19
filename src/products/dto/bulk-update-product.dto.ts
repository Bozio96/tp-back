// src/products/dto/bulk-update-product.dto.ts
export class BulkUpdateProductDto {
  id: number;

  // Campos opcionales: solo se actualizan si vienen
  costBase?: number;
  salePrice?: number;
  utilityPercentage?: number;
}

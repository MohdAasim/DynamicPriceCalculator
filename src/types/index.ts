export interface Product {
  id: string;
  name: string;
  basePrice: number;
  sizes: ProductSize[];
  colors: ProductColor[];
  addOns: ProductAddOn[];
  bulkDiscounts: BulkDiscount[];
}

export interface ProductSize {
  id: string;
  name: string;
  priceAdjustment: number;
}

export interface ProductColor {
  id: string;
  name: string;
  priceAdjustment: number;
}

export interface ProductAddOn {
  id: string;
  name: string;
  price: number;
}

export interface BulkDiscount {
  minQuantity: number;
  discountPercentage: number;
}

export interface PriceHistory {
  date: string;
  price: number;
}

export interface ProductConfiguration {
  productId: string;
  sizeId: string;
  colorId: string;
  addOnIds: string[];
  quantity: number;
}

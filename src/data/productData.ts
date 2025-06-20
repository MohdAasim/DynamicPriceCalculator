import type { Product, PriceHistory } from '../types';

export const tShirtProduct: Product = {
  id: 'tshirt-001',
  name: 'Custom T-Shirt',
  basePrice: 10.99,
  sizes: [
    { id: 'size-s', name: 'S', priceAdjustment: 0 },
    { id: 'size-m', name: 'M', priceAdjustment: 2.0 },
    { id: 'size-l', name: 'L', priceAdjustment: 4.0 },
  ],
  colors: [
    { id: 'color-white', name: 'White', priceAdjustment: 0 },
    { id: 'color-red', name: 'Red', priceAdjustment: 2.0 },
    { id: 'color-blue', name: 'Blue', priceAdjustment: 2.0 },
    { id: 'color-black', name: 'Black', priceAdjustment: 2.5 },
  ],
  addOns: [
    { id: 'addon-logo', name: 'Logo Print', price: 5.0 },
    { id: 'addon-premium', name: 'Premium Cotton', price: 3.5 },
    { id: 'addon-express', name: 'Express Ship', price: 8.99 },
  ],
  bulkDiscounts: [
    { minQuantity: 10, discountPercentage: 5 },
    { minQuantity: 25, discountPercentage: 20 },
    { minQuantity: 50, discountPercentage: 30 },
  ],
};

export const priceHistoryData: PriceHistory[] = [
  { date: '2025-05-21', price: 15.99 },
  { date: '2025-05-28', price: 21.99 },
  { date: '2025-06-04', price: 18.99 },
  { date: '2025-06-11', price: 15.5 },
  { date: '2025-06-18', price: 12.99 },
  { date: '2025-06-20', price: 25.99 },
];

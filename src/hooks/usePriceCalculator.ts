import { useState, useMemo, useEffect } from 'react';
import type { Product, ProductConfiguration } from '../types';

export const usePriceCalculator = (
  product: Product,
  initialConfig?: ProductConfiguration | null,
) => {
  const [config, setConfig] = useState<ProductConfiguration>(() => {
    return {
      productId: product.id,
      sizeId: product.sizes[0].id,
      colorId: product.colors[0].id,
      addOnIds: [],
      quantity: 1,
    };
  });

  // Use useEffect to update config when initialConfig changes
  useEffect(() => {
    // If initialConfig exists and has the same productId, use it
    if (initialConfig && initialConfig.productId === product.id) {
      setConfig({
        productId: initialConfig.productId,
        sizeId: initialConfig.sizeId,
        colorId: initialConfig.colorId,
        addOnIds: [...initialConfig.addOnIds],
        quantity: initialConfig.quantity,
      });
    }
  }, [initialConfig, product.id]);

  const updateSize = (sizeId: string) => {
    setConfig({ ...config, sizeId });
  };

  const updateColor = (colorId: string) => {
    setConfig({ ...config, colorId });
  };

  const toggleAddOn = (addOnId: string) => {
    const newAddOns = config.addOnIds.includes(addOnId)
      ? config.addOnIds.filter((id) => id !== addOnId)
      : [...config.addOnIds, addOnId];
    setConfig({ ...config, addOnIds: newAddOns });
  };

  const updateQuantity = (quantity: number) => {
    setConfig({ ...config, quantity: Math.max(1, quantity) });
  };

  const priceBreakdown = useMemo(() => {
    // Get size price
    const selectedSize = product.sizes.find((size) => size.id === config.sizeId);
    const sizePrice = selectedSize ? selectedSize.priceAdjustment : 0;

    // Get color price
    const selectedColor = product.colors.find((color) => color.id === config.colorId);
    const colorPrice = selectedColor ? selectedColor.priceAdjustment : 0;

    // Get add-ons price
    const addOnsPrice = product.addOns
      .filter((addon) => config.addOnIds.includes(addon.id))
      .reduce((sum, addon) => sum + addon.price, 0);

    // Calculate subtotal
    const subtotal = product.basePrice + sizePrice + colorPrice + addOnsPrice;

    // Calculate bulk discount
    const applicableDiscount = product.bulkDiscounts
      .filter((discount) => config.quantity >= discount.minQuantity)
      .sort((a, b) => b.discountPercentage - a.discountPercentage)[0];

    const discountPercentage = applicableDiscount ? applicableDiscount.discountPercentage : 0;
    const discountAmount = subtotal * config.quantity * (discountPercentage / 100);

    // Calculate total
    const total = subtotal * config.quantity - discountAmount;
    const unitPrice = total / config.quantity;

    return {
      basePrice: product.basePrice,
      sizePrice,
      colorPrice,
      addOnsPrice,
      subtotal,
      quantity: config.quantity,
      discountPercentage,
      discountAmount,
      total,
      unitPrice,
      selectedSize,
      selectedColor,
      selectedAddOns: product.addOns.filter((addon) => config.addOnIds.includes(addon.id)),
    };
  }, [config, product]);

  return {
    config,
    updateSize,
    updateColor,
    toggleAddOn,
    updateQuantity,
    priceBreakdown,
  };
};

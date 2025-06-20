import { useState } from 'react';
import { ConfigPanel } from './ConfigPanel/ConfigPanel';
import { PriceBreakdown } from './PriceBreakdown/PriceBreakdown';
import { PriceHistoryChart } from './PriceHistory/PriceHistoryChart';
import { ComparisonPanel } from './Comparison/ComparisonPanel';
import { usePriceCalculator } from '../../hooks/usePriceCalculator';
import type { Product, PriceHistory, ProductConfiguration } from '../../types';
import './PriceCalculator.css';

interface PriceCalculatorProps {
  product: Product;
  priceHistory: PriceHistory[];
  initialConfig?: ProductConfiguration | null;
}

type SavedConfiguration = {
  config: ProductConfiguration;
  priceInfo: {
    subtotal: number;
    discountPercentage: number;
    discountAmount: number;
    total: number;
    unitPrice: number;
  };
};

export const PriceCalculator: React.FC<PriceCalculatorProps> = ({
  product,
  priceHistory,
  initialConfig,
}) => {
  const [savedConfigs, setSavedConfigs] = useState<SavedConfiguration[]>([]);

  const { config, updateSize, updateColor, toggleAddOn, updateQuantity, priceBreakdown } =
    usePriceCalculator(product, initialConfig);

  // Update the saveConfiguration function
  const saveConfiguration = () => {
    try {
      // Create a complete copy of the configuration
      const configToSave = {
        productId: config.productId,
        sizeId: config.sizeId,
        colorId: config.colorId,
        addOnIds: [...config.addOnIds],
        quantity: config.quantity,
      };

      // Stringify and encode the configuration
      const configData = JSON.stringify(configToSave);
      const encoded = btoa(encodeURIComponent(configData));

      // Generate shareable URL
      const url = `${window.location.origin}${window.location.pathname}?config=${encoded}`;

      // Copy to clipboard
      navigator.clipboard
        .writeText(url)
        .then(() => {
          alert('Configuration link copied to clipboard!');
        })
        .catch(() => {
          alert('Failed to copy link. Your configuration is saved though!');
        });
    } catch (error) {
      console.error('Error saving configuration:', error);
      alert('Failed to save configuration. Please try again.');
    }
  };

  const addToComparison = () => {
    // Extract relevant price info from priceBreakdown
    const priceInfo = {
      subtotal: priceBreakdown.subtotal,
      discountPercentage: priceBreakdown.discountPercentage,
      discountAmount: priceBreakdown.discountAmount,
      total: priceBreakdown.total,
      unitPrice: priceBreakdown.unitPrice,
    };

    // Check if this configuration is already in the comparison
    const configExists = savedConfigs.some(
      (saved) =>
        saved.config.sizeId === config.sizeId &&
        saved.config.colorId === config.colorId &&
        saved.config.quantity === config.quantity &&
        JSON.stringify(saved.config.addOnIds.sort()) ===
          JSON.stringify([...config.addOnIds].sort()),
    );

    if (configExists) {
      alert('This configuration is already in your comparison.');
      return;
    }

    // Add to saved configurations
    setSavedConfigs([...savedConfigs, { config: { ...config }, priceInfo }]);
  };

  const removeFromComparison = (index: number) => {
    const newConfigs = [...savedConfigs];
    newConfigs.splice(index, 1);
    setSavedConfigs(newConfigs);
  };

  const clearAllComparisons = () => {
    setSavedConfigs([]);
  };

  return (
    <div className='price-calculator'>
      <div className='calculator-header'>
        <h1>💰 {product.name} Pricing Calculator</h1>
        <div className='header-buttons'>
          <button
            className='compare-button'
            onClick={addToComparison}
            title='Add current configuration to comparison'
          >
            Compare
          </button>
          <button className='save-button' onClick={saveConfiguration}>
            Save Config
          </button>
        </div>
      </div>

      <div className='calculator-content'>
        <div className='config-section'>
          <ConfigPanel
            product={product}
            selectedSizeId={config.sizeId}
            selectedColorId={config.colorId}
            selectedAddOnIds={config.addOnIds}
            quantity={config.quantity}
            bulkDiscountPercentage={priceBreakdown.discountPercentage}
            onSizeChange={updateSize}
            onColorChange={updateColor}
            onAddOnToggle={toggleAddOn}
            onQuantityChange={updateQuantity}
          />
        </div>

        <div className='price-section'>
          <PriceBreakdown
            basePrice={priceBreakdown.basePrice}
            sizePrice={priceBreakdown.sizePrice}
            sizeName={priceBreakdown.selectedSize?.name || ''}
            colorPrice={priceBreakdown.colorPrice}
            colorName={priceBreakdown.selectedColor?.name || ''}
            addOns={priceBreakdown.selectedAddOns.map((addon) => ({
              name: addon.name,
              price: addon.price,
            }))}
            subtotal={priceBreakdown.subtotal}
            quantity={priceBreakdown.quantity}
            discountPercentage={priceBreakdown.discountPercentage}
            discountAmount={priceBreakdown.discountAmount}
            total={priceBreakdown.total}
            unitPrice={priceBreakdown.unitPrice}
          />
        </div>
      </div>

      <div className='chart-section'>
        <PriceHistoryChart priceHistory={priceHistory} />
      </div>

      {/* Comparison Panel */}
      <ComparisonPanel
        product={product}
        configurations={savedConfigs}
        onRemoveConfig={removeFromComparison}
        onClearAll={clearAllComparisons}
      />
    </div>
  );
};

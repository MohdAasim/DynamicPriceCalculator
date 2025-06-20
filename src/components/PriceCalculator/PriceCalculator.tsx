import { useState, useEffect } from 'react';
import { ConfigPanel } from './ConfigPanel/ConfigPanel';
import { PriceBreakdown } from './PriceBreakdown/PriceBreakdown';
import { PriceHistoryChart } from './PriceHistory/PriceHistoryChart';
import { ComparisonPanel } from './Comparison/ComparisonPanel';
import { usePriceCalculator } from '../../hooks/usePriceCalculator';
import type { Product, PriceHistory, ProductConfiguration } from '../../types';
import {
  saveConfigurationToStorage,
  getSavedConfigurations,
  deleteConfigurationFromStorage,
  type SavedConfigurationEntry,
} from '../../utils/storageUtils';
import './PriceCalculator.css';
import { SaveConfigDialog } from './SavedConfigurations/SaveConfigDialog';
import { SavedConfigurationsPanel } from './SavedConfigurations/SavedConfigurationsPanel';

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
  const [storedConfigurations, setStoredConfigurations] = useState<SavedConfigurationEntry[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const {
    config,
    updateSize,
    updateColor,
    toggleAddOn,
    updateQuantity,
    updateFullConfig,
    priceBreakdown,
  } = usePriceCalculator(product, initialConfig);

  // Load saved configurations from localStorage on component mount
  useEffect(() => {
    const loadedConfigurations = getSavedConfigurations();
    setStoredConfigurations(loadedConfigurations);
  }, []);

  const generateShareableUrl = () => {
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
      return `${window.location.origin}${window.location.pathname}?config=${encoded}`;
    } catch (error) {
      console.error('Error generating URL:', error);
      return null;
    }
  };

  const saveConfiguration = () => {
    // Show the save dialog to get a name
    setShowSaveDialog(true);
  };

  const handleSaveWithName = (name: string) => {
    try {
      // Save to localStorage
      const configToSave = {
        productId: config.productId,
        sizeId: config.sizeId,
        colorId: config.colorId,
        addOnIds: [...config.addOnIds],
        quantity: config.quantity,
      };

      const savedEntry = saveConfigurationToStorage(configToSave, name);

      // Update the stored configurations state
      setStoredConfigurations((prev) => [...prev, savedEntry]);

      // Generate a shareable URL
      const url = generateShareableUrl();

      // Copy to clipboard if possible
      if (url) {
        navigator.clipboard
          .writeText(url)
          .then(() => {
            alert(`Configuration "${name}" saved! Shareable link copied to clipboard.`);
          })
          .catch(() => {
            alert(`Configuration "${name}" saved! (Failed to copy link to clipboard)`);
          });
      } else {
        alert(`Configuration "${name}" saved!`);
      }

      // Close the dialog
      setShowSaveDialog(false);
    } catch (error) {
      console.error('Error saving configuration:', error);
      alert('Failed to save configuration. Please try again.');
    }
  };

  const loadSavedConfiguration = (savedConfig: ProductConfiguration) => {
    updateFullConfig(savedConfig);
  };

  const deleteSavedConfiguration = (configId: string) => {
    if (window.confirm('Are you sure you want to delete this configuration?')) {
      const success = deleteConfigurationFromStorage(configId);
      if (success) {
        setStoredConfigurations((prev) => prev.filter((config) => config.id !== configId));
      } else {
        alert('Failed to delete configuration. Please try again.');
      }
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

      {/* Saved Configurations Panel */}
      <SavedConfigurationsPanel
        savedConfigurations={storedConfigurations}
        onLoadConfiguration={loadSavedConfiguration}
        onDeleteConfiguration={deleteSavedConfiguration}
        product={product}
      />

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

      {/* Save Configuration Dialog */}
      {showSaveDialog && (
        <SaveConfigDialog
          onSave={handleSaveWithName}
          onCancel={() => setShowSaveDialog(false)}
          existingNames={storedConfigurations.map((config) => config.name)}
        />
      )}
    </div>
  );
};

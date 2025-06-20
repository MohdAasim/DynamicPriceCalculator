import { useEffect, useState } from 'react';
import { PriceCalculator } from './components/PriceCalculator/PriceCalculator';
import { tShirtProduct, priceHistoryData } from './data/productData';
import type { ProductConfiguration } from './types';
import './App.css';

function App() {
  const [savedConfig, setSavedConfig] = useState<ProductConfiguration | null>(null);

  // Load configuration from URL if present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const configParam = params.get('config');

    if (configParam) {
      try {
        // Decode and parse the configuration
        const decoded = decodeURIComponent(atob(configParam));
        const config = JSON.parse(decoded);

        // Validate the configuration structure
        if (
          config &&
          typeof config === 'object' &&
          config.productId &&
          config.sizeId &&
          config.colorId &&
          Array.isArray(config.addOnIds) &&
          typeof config.quantity === 'number'
        ) {
          setSavedConfig(config);
        } else {
          throw new Error('Invalid configuration structure');
        }
      } catch (e) {
        console.error('Failed to parse configuration from URL:', e);
        alert('The configuration in the URL is invalid or corrupted.');
      }
    }
  }, []);

  return (
    <div className='app'>
      <PriceCalculator
        product={tShirtProduct}
        priceHistory={priceHistoryData}
        initialConfig={savedConfig}
      />
    </div>
  );
}

export default App;

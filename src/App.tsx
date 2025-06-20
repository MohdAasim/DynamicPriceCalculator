import { useEffect, useState } from 'react';
import { PriceCalculator } from './components/PriceCalculator/PriceCalculator';
import { tShirtProduct, priceHistoryData } from './data/productData';
import type { ProductConfiguration } from './types';
import './App.css';

function App() {
  const [, setSavedConfig] = useState<ProductConfiguration | null>(null);

  // Load configuration from URL if present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const configParam = params.get('config');

    if (configParam) {
      try {
        const decoded = atob(configParam);
        const config = JSON.parse(decoded);
        setSavedConfig(config);
      } catch (e) {
        console.error('Failed to parse configuration from URL', e);
      }
    }
  }, []);

  return (
    <div className='app'>
      <PriceCalculator product={tShirtProduct} priceHistory={priceHistoryData} />
    </div>
  );
}

export default App;

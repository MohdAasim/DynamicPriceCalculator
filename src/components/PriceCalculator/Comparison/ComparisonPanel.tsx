import { ComparisonItem } from './ComparisonItem';
import type { Product, ProductConfiguration } from '../../../types';
import './ComparisonPanel.css';

interface ComparisonPanelProps {
  product: Product;
  configurations: Array<{
    config: ProductConfiguration;
    priceInfo: {
      subtotal: number;
      discountPercentage: number;
      discountAmount: number;
      total: number;
      unitPrice: number;
    };
  }>;
  onRemoveConfig: (index: number) => void;
  onClearAll: () => void;
}

export const ComparisonPanel: React.FC<ComparisonPanelProps> = ({
  product,
  configurations,
  onRemoveConfig,
  onClearAll,
}) => {
  if (configurations.length === 0) {
    return null;
  }

  return (
    <div className='comparison-panel'>
      <div className='comparison-header'>
        <h2>Configuration Comparison</h2>
        <button className='clear-all-btn' onClick={onClearAll}>
          Clear All
        </button>
      </div>

      <div className='comparison-container'>
        {configurations.map((item, index) => (
          <ComparisonItem
            key={index}
            product={product}
            config={item.config}
            priceInfo={item.priceInfo}
            onRemove={() => onRemoveConfig(index)}
          />
        ))}
      </div>
    </div>
  );
};

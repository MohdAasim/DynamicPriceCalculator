import type { Product } from '../../../types';
import './ConfigPanel.css';

interface ConfigPanelProps {
  product: Product;
  selectedSizeId: string;
  selectedColorId: string;
  selectedAddOnIds: string[];
  quantity: number;
  bulkDiscountPercentage: number;
  onSizeChange: (sizeId: string) => void;
  onColorChange: (colorId: string) => void;
  onAddOnToggle: (addOnId: string) => void;
  onQuantityChange: (quantity: number) => void;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({
  product,
  selectedSizeId,
  selectedColorId,
  selectedAddOnIds,
  quantity,
  bulkDiscountPercentage,
  onSizeChange,
  onColorChange,
  onAddOnToggle,
  onQuantityChange,
}) => {
  return (
    <div className='config-panel'>
      <h2>Configuration</h2>

      {/* Size Selection */}
      <div className='config-section'>
        <div className='section-title'>Size:</div>
        <div className='size-options'>
          {product.sizes.map((size) => (
            <label key={size.id} className='size-option'>
              <input
                type='radio'
                name='size'
                checked={selectedSizeId === size.id}
                onChange={() => onSizeChange(size.id)}
              />
              {size.name}
            </label>
          ))}
        </div>
      </div>

      {/* Color Selection */}
      <div className='config-section'>
        <div className='section-title'>Color:</div>
        <div className='color-options'>
          {product.colors.map((color) => (
            <label key={color.id} className='color-option'>
              <input
                type='radio'
                name='color'
                checked={selectedColorId === color.id}
                onChange={() => onColorChange(color.id)}
              />
              {color.name}
            </label>
          ))}
        </div>
      </div>

      {/* Add-ons */}
      <div className='config-section'>
        <div className='section-title'>Add-ons:</div>
        <div className='addon-options'>
          {product.addOns.map((addon) => (
            <label key={addon.id} className='addon-option'>
              <input
                type='checkbox'
                checked={selectedAddOnIds.includes(addon.id)}
                onChange={() => onAddOnToggle(addon.id)}
              />
              {addon.name} (+${addon.price.toFixed(2)})
            </label>
          ))}
        </div>
      </div>

      {/* Quantity */}
      <div className='config-section'>
        <div className='section-title'>Quantity:</div>
        <div className='quantity-control'>
          <input
            type='number'
            min='1'
            value={quantity}
            onChange={(e) => onQuantityChange(parseInt(e.target.value) || 1)}
          />
          <span className='quantity-icon'>📦</span>
        </div>
        <div className='discount-indicator'>
          <div className='discount-bar'>
            <div className='discount-fill' style={{ width: `${bulkDiscountPercentage}%` }}></div>
          </div>
          <div className='discount-text'>{bulkDiscountPercentage}% bulk discount</div>
        </div>
      </div>
    </div>
  );
};

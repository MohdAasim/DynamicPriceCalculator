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
  const incrementQuantity = () => {
    onQuantityChange(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      onQuantityChange(quantity - 1);
    }
  };

  return (
    <div className='config-panel'>
      <h2>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='20'
          height='20'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <path d='M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z'></path>
          <path d='M7 7h.01'></path>
        </svg>
        Product Configuration
      </h2>

      {/* Size Selection */}
      <div className='config-section'>
        <div className='section-title'>Size</div>
        <div className='size-options'>
          {product.sizes.map((size) => (
            <label key={size.id} className='size-option'>
              <input
                type='radio'
                name='size'
                checked={selectedSizeId === size.id}
                onChange={() => onSizeChange(size.id)}
              />
              <span>
                {size.name}
                {size.priceAdjustment > 0 ? ` (+$${size.priceAdjustment.toFixed(2)})` : ''}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Color Selection */}
      <div className='config-section'>
        <div className='section-title'>Color</div>
        <div className='color-options'>
          {product.colors.map((color) => (
            <label key={color.id} className='color-option'>
              <input
                type='radio'
                name='color'
                checked={selectedColorId === color.id}
                onChange={() => onColorChange(color.id)}
              />
              <span>
                {color.name}
                {color.priceAdjustment > 0 ? ` (+$${color.priceAdjustment.toFixed(2)})` : ''}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Add-ons */}
      <div className='config-section'>
        <div className='section-title'>Add-ons</div>
        <div className='addon-options'>
          {product.addOns.map((addon) => (
            <label key={addon.id} className='addon-option'>
              <div className='addon-checkbox'>
                <input
                  type='checkbox'
                  checked={selectedAddOnIds.includes(addon.id)}
                  onChange={() => onAddOnToggle(addon.id)}
                />
                <span className='checkmark'></span>
              </div>
              <div className='addon-label'>
                <span>{addon.name}</span>
                <span className='addon-price'>+${addon.price.toFixed(2)}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Quantity */}
      <div className='config-section'>
        <div className='section-title'>Quantity</div>
        <div className='quantity-control'>
          <div className='quantity-input'>
            <input
              type='number'
              min='1'
              value={quantity}
              onChange={(e) => onQuantityChange(parseInt(e.target.value) || 1)}
            />
            <span className='quantity-icon'>📦</span>
          </div>
          <div className='quantity-buttons'>
            <button
              className='quantity-btn'
              onClick={incrementQuantity}
              aria-label='Increase quantity'
            >
              +
            </button>
            <button
              className='quantity-btn'
              onClick={decrementQuantity}
              aria-label='Decrease quantity'
            >
              -
            </button>
          </div>
        </div>

        <div className='discount-indicator'>
          <div className='discount-bar'>
            <div className='discount-fill' style={{ width: `${bulkDiscountPercentage}%` }}></div>
          </div>
          <div className='discount-text'>
            <span>Bulk discount</span>
            <span className='discount-percentage'>{bulkDiscountPercentage}% off</span>
          </div>
        </div>
      </div>
    </div>
  );
};

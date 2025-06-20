import type { Product } from '../../../types';
import './ComparisonItem.css';

interface ComparisonItemProps {
  product: Product;
  config: {
    sizeId: string;
    colorId: string;
    addOnIds: string[];
    quantity: number;
  };
  priceInfo: {
    subtotal: number;
    discountPercentage: number;
    discountAmount: number;
    total: number;
    unitPrice: number;
  };
  onRemove: () => void;
}

export const ComparisonItem: React.FC<ComparisonItemProps> = ({
  product,
  config,
  priceInfo,
  onRemove,
}) => {
  const selectedSize = product.sizes.find((s) => s.id === config.sizeId);
  const selectedColor = product.colors.find((c) => c.id === config.colorId);
  const selectedAddOns = product.addOns.filter((a) => config.addOnIds.includes(a.id));

  return (
    <div className='comparison-item'>
      <div className='comparison-header'>
        <h3>{product.name}</h3>
        <button className='remove-btn' onClick={onRemove}>
          ×
        </button>
      </div>

      <div className='comparison-details'>
        <div className='comparison-row'>
          <span className='label'>Size:</span>
          <span className='value'>{selectedSize?.name}</span>
        </div>

        <div className='comparison-row'>
          <span className='label'>Color:</span>
          <span className='value'>{selectedColor?.name}</span>
        </div>

        <div className='comparison-row'>
          <span className='label'>Add-ons:</span>
          <span className='value'>
            {selectedAddOns.length ? selectedAddOns.map((a) => a.name).join(', ') : 'None'}
          </span>
        </div>

        <div className='comparison-row'>
          <span className='label'>Quantity:</span>
          <span className='value'>{config.quantity}</span>
        </div>
      </div>

      <div className='comparison-price'>
        <div className='comparison-row subtotal'>
          <span className='label'>Subtotal:</span>
          <span className='value'>${priceInfo.subtotal.toFixed(2)}</span>
        </div>

        {priceInfo.discountPercentage > 0 && (
          <div className='comparison-row discount'>
            <span className='label'>Discount:</span>
            <span className='value'>
              -${priceInfo.discountAmount.toFixed(2)} ({priceInfo.discountPercentage}%)
            </span>
          </div>
        )}

        <div className='comparison-row total'>
          <span className='label'>Total:</span>
          <span className='value'>${priceInfo.total.toFixed(2)}</span>
        </div>

        <div className='comparison-row unit-price'>
          <span className='label'>Per unit:</span>
          <span className='value'>${priceInfo.unitPrice.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

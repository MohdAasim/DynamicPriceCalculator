import './PriceBreakdown.css';

interface PriceBreakdownProps {
  basePrice: number;
  sizePrice: number;
  sizeName: string;
  colorPrice: number;
  colorName: string;
  addOns: Array<{ name: string; price: number }>;
  subtotal: number;
  quantity: number;
  discountPercentage: number;
  discountAmount: number;
  total: number;
  unitPrice: number;
}

export const PriceBreakdown: React.FC<PriceBreakdownProps> = ({
  basePrice,
  sizePrice,
  sizeName,
  colorPrice,
  colorName,
  addOns,
  subtotal,
  quantity,
  discountPercentage,
  discountAmount,
  total,
  unitPrice,
}) => {
  return (
    <div className='price-breakdown'>
      <h2>Price Breakdown</h2>

      <div className='breakdown-item'>
        <span className='item-label'>Base Price ({sizeName}):</span>
        <span className='item-value'>${(basePrice + sizePrice).toFixed(2)}</span>
      </div>

      <div className='breakdown-item'>
        <span className='item-label'>Color ({colorName}):</span>
        <span className='item-value'>+${colorPrice.toFixed(2)}</span>
      </div>

      {addOns.map((addon, index) => (
        <div key={index} className='breakdown-item'>
          <span className='item-label'>{addon.name}:</span>
          <span className='item-value'>+${addon.price.toFixed(2)}</span>
        </div>
      ))}

      <div className='breakdown-divider'></div>

      <div className='breakdown-item'>
        <span className='item-label'>Subtotal:</span>
        <span className='item-value'>${subtotal.toFixed(2)}</span>
      </div>

      <div className='breakdown-item'>
        <span className='item-label'>Quantity: {quantity}</span>
        <span className='item-value'>x{quantity}</span>
      </div>

      <div className='breakdown-divider'></div>

      {discountPercentage > 0 && (
        <div className='breakdown-item discount'>
          <span className='item-label'>Bulk Discount ({discountPercentage}%):</span>
          <span className='item-value'>-${discountAmount.toFixed(2)}</span>
        </div>
      )}

      <div className='breakdown-divider'></div>

      <div className='breakdown-item total'>
        <span className='item-label'>🎯 Total:</span>
        <span className='item-value'>${total.toFixed(2)}</span>
      </div>

      <div className='per-item-price'>(${unitPrice.toFixed(2)} per shirt)</div>
    </div>
  );
};

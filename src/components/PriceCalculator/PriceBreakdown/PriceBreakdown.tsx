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
          <circle cx='12' cy='12' r='10'></circle>
          <path d='M12 17v.01'></path>
          <path d='M7 10a5 5 0 0 1 10 0v2a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2z'></path>
        </svg>
        Price Breakdown
      </h2>

      <div className='breakdown-items'>
        <div className='breakdown-item'>
          <span className='item-label'>Base Price ({sizeName})</span>
          <span className='item-value'>${(basePrice + sizePrice).toFixed(2)}</span>
        </div>

        <div className='breakdown-item'>
          <span className='item-label'>Color ({colorName})</span>
          <span className='item-value'>+${colorPrice.toFixed(2)}</span>
        </div>

        {addOns.map((addon, index) => (
          <div key={index} className='breakdown-item'>
            <span className='item-label'>{addon.name}</span>
            <span className='item-value'>+${addon.price.toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className='breakdown-divider'></div>

      <div className='breakdown-item'>
        <span className='item-label'>Subtotal (per item)</span>
        <span className='item-value'>${subtotal.toFixed(2)}</span>
      </div>

      <div className='breakdown-item'>
        <span className='item-label'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='16'
            height='16'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <rect width='6' height='16' x='4' y='4' rx='1'></rect>
            <rect width='6' height='9' x='14' y='11' rx='1'></rect>
          </svg>
          Quantity
        </span>
        <span className='item-value'>× {quantity}</span>
      </div>

      <div className='breakdown-divider'></div>

      {discountPercentage > 0 && (
        <div className='breakdown-item discount'>
          <span className='item-label'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='16'
              height='16'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <line x1='19' y1='5' x2='5' y2='19'></line>
              <circle cx='6.5' cy='6.5' r='2.5'></circle>
              <circle cx='17.5' cy='17.5' r='2.5'></circle>
            </svg>
            Bulk Discount ({discountPercentage}%)
          </span>
          <span className='item-value'>-${discountAmount.toFixed(2)}</span>
        </div>
      )}

      <div className='total-section'>
        <div className='breakdown-item total'>
          <span className='item-label'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='18'
              height='18'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <path d='M12 2v3'></path>
              <path d='m19.13 5.09-2.12 2.12'></path>
              <path d='M22 12h-3'></path>
              <path d='m19.13 18.91-2.12-2.12'></path>
              <path d='M12 22v-3'></path>
              <path d='m4.87 18.91 2.12-2.12'></path>
              <path d='M2 12h3'></path>
              <path d='m4.87 5.09 2.12 2.12'></path>
              <circle cx='12' cy='12' r='4'></circle>
            </svg>
            Total
          </span>
          <span className='item-value'>${total.toFixed(2)}</span>
        </div>

        <div className='per-item-price'>(${unitPrice.toFixed(2)} per shirt)</div>
      </div>
    </div>
  );
};

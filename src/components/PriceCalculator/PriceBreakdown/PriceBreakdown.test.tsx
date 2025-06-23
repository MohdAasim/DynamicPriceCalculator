import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PriceBreakdown } from './PriceBreakdown';

describe('PriceBreakdown', () => {
  const defaultProps = {
    basePrice: 50,
    sizePrice: 10,
    sizeName: 'Medium',
    colorPrice: 5,
    colorName: 'Blue',
    addOns: [
      { name: 'Extra Feature', price: 15 },
      { name: 'Premium Support', price: 20 },
    ],
    subtotal: 100,
    quantity: 3,
    discountPercentage: 10,
    discountAmount: 30,
    total: 270,
    unitPrice: 90,
  };

  it('renders component with title', () => {
    render(<PriceBreakdown {...defaultProps} />);
    expect(screen.getByText('Price Breakdown')).toBeInTheDocument();
  });

  it('displays base price with size correctly', () => {
    render(<PriceBreakdown {...defaultProps} />);
    expect(screen.getByText('Base Price (Medium)')).toBeInTheDocument();
    expect(screen.getByText('$60.00')).toBeInTheDocument(); // basePrice + sizePrice
  });

  it('displays color price correctly', () => {
    render(<PriceBreakdown {...defaultProps} />);
    expect(screen.getByText('Color (Blue)')).toBeInTheDocument();
    expect(screen.getByText('+$5.00')).toBeInTheDocument();
  });

  it('displays add-ons correctly', () => {
    render(<PriceBreakdown {...defaultProps} />);

    expect(screen.getByText('Extra Feature')).toBeInTheDocument();
    expect(screen.getByText('+$15.00')).toBeInTheDocument();

    expect(screen.getByText('Premium Support')).toBeInTheDocument();
    expect(screen.getByText('+$20.00')).toBeInTheDocument();
  });

  it('displays subtotal correctly', () => {
    render(<PriceBreakdown {...defaultProps} />);
    expect(screen.getByText('Subtotal (per item)')).toBeInTheDocument();
    expect(screen.getByText('$100.00')).toBeInTheDocument();
  });

  it('displays quantity correctly', () => {
    render(<PriceBreakdown {...defaultProps} />);
    expect(screen.getByText('Quantity')).toBeInTheDocument();
    expect(screen.getByText('× 3')).toBeInTheDocument();
  });

  it('displays discount when discount percentage is greater than 0', () => {
    render(<PriceBreakdown {...defaultProps} />);
    expect(screen.getByText('Bulk Discount (10%)')).toBeInTheDocument();
    expect(screen.getByText('-$30.00')).toBeInTheDocument();
  });

  it('does not display discount when discount percentage is 0', () => {
    const propsWithNoDiscount = {
      ...defaultProps,
      discountPercentage: 0,
      discountAmount: 0,
    };
    render(<PriceBreakdown {...propsWithNoDiscount} />);
    expect(screen.queryByText(/Bulk Discount/)).not.toBeInTheDocument();
  });

  it('displays total correctly', () => {
    render(<PriceBreakdown {...defaultProps} />);
    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getByText('$270.00')).toBeInTheDocument();
  });

  it('displays per-item price correctly', () => {
    render(<PriceBreakdown {...defaultProps} />);
    expect(screen.getByText('($90.00 per shirt)')).toBeInTheDocument();
  });

  it('handles empty add-ons array', () => {
    const propsWithNoAddOns = {
      ...defaultProps,
      addOns: [],
    };
    render(<PriceBreakdown {...propsWithNoAddOns} />);

    // Should still render correctly without add-ons
    expect(screen.getByText('Base Price (Medium)')).toBeInTheDocument();
    expect(screen.getByText('Color (Blue)')).toBeInTheDocument();
    expect(screen.queryByText('Extra Feature')).not.toBeInTheDocument();
  });
});

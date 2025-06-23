import { render, screen, fireEvent } from '@testing-library/react';
import { ComparisonItem } from './ComparisonItem';
import '@testing-library/jest-dom';

describe('ComparisonItem', () => {
  const mockProduct = {
    id: 'product1',
    name: 'Test Product',
    basePrice: 100,
    sizes: [
      { id: 'size1', name: 'Small', priceAdjustment: 0 },
      { id: 'size2', name: 'Medium', priceAdjustment: 20 },
    ],
    colors: [
      { id: 'color1', name: 'Red', priceAdjustment: 0 },
      { id: 'color2', name: 'Blue', priceAdjustment: 10 },
    ],
    addOns: [
      { id: 'addon1', name: 'Extra Feature', price: 10 },
      { id: 'addon2', name: 'Premium Support', price: 15 },
    ],
    bulkDiscounts: [],
  };

  const mockConfig = {
    sizeId: 'size2',
    colorId: 'color1',
    addOnIds: ['addon1', 'addon2'],
    quantity: 2,
  };

  const mockPriceInfo = {
    subtotal: 250,
    discountPercentage: 10,
    discountAmount: 25,
    total: 225,
    unitPrice: 112.5,
  };

  const mockOnRemove = jest.fn();

  it('renders product details correctly', () => {
    render(
      <ComparisonItem
        product={mockProduct}
        config={mockConfig}
        priceInfo={mockPriceInfo}
        onRemove={mockOnRemove}
      />,
    );

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Medium')).toBeInTheDocument();
    expect(screen.getByText('Red')).toBeInTheDocument();
    expect(screen.getByText('Extra Feature, Premium Support')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('renders price information correctly', () => {
    render(
      <ComparisonItem
        product={mockProduct}
        config={mockConfig}
        priceInfo={mockPriceInfo}
        onRemove={mockOnRemove}
      />,
    );

    expect(screen.getByText('$250.00')).toBeInTheDocument();
    expect(screen.getByText('-$25.00 (10%)')).toBeInTheDocument();
    expect(screen.getByText('$225.00')).toBeInTheDocument();
    expect(screen.getByText('$112.50')).toBeInTheDocument();
  });

  it('calls onRemove when remove button is clicked', () => {
    render(
      <ComparisonItem
        product={mockProduct}
        config={mockConfig}
        priceInfo={mockPriceInfo}
        onRemove={mockOnRemove}
      />,
    );

    fireEvent.click(screen.getByText('×'));
    expect(mockOnRemove).toHaveBeenCalledTimes(1);
  });

  it('does not show discount row when no discount is applied', () => {
    const priceInfoNoDiscount = {
      ...mockPriceInfo,
      discountPercentage: 0,
      discountAmount: 0,
    };

    render(
      <ComparisonItem
        product={mockProduct}
        config={mockConfig}
        priceInfo={priceInfoNoDiscount}
        onRemove={mockOnRemove}
      />,
    );

    expect(screen.queryByText(/-\$\d+\.\d+ \(\d+%\)/)).not.toBeInTheDocument();
  });

  it('displays "None" when no add-ons are selected', () => {
    const configNoAddons = {
      ...mockConfig,
      addOnIds: [],
    };

    render(
      <ComparisonItem
        product={mockProduct}
        config={configNoAddons}
        priceInfo={mockPriceInfo}
        onRemove={mockOnRemove}
      />,
    );

    expect(screen.getByText('None')).toBeInTheDocument();
  });
});

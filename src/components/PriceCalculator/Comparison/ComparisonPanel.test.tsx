import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ComparisonPanel } from './ComparisonPanel';

describe('ComparisonPanel', () => {
  const mockProduct = {
    id: 'product1',
    name: 'Test Product',
    basePrice: 100,
    sizes: [{ id: 'size1', name: 'Small', priceAdjustment: 0 }],
    colors: [{ id: 'color1', name: 'Red', priceAdjustment: 0 }],
    addOns: [{ id: 'addon1', name: 'Extra Feature', price: 10 }],
    bulkDiscounts: [],
  };

  const mockConfigurations = [
    {
      config: {
        productId: 'product1',
        sizeId: 'size1',
        colorId: 'color1',
        addOnIds: ['addon1'],
        quantity: 2,
      },
      priceInfo: {
        subtotal: 220,
        discountPercentage: 0,
        discountAmount: 0,
        total: 220,
        unitPrice: 110,
      },
    },
    {
      config: {
        productId: 'product1',
        sizeId: 'size1',
        colorId: 'color1',
        addOnIds: [],
        quantity: 1,
      },
      priceInfo: {
        subtotal: 100,
        discountPercentage: 10,
        discountAmount: 10,
        total: 90,
        unitPrice: 90,
      },
    },
  ];

  const mockOnRemoveConfig = jest.fn();
  const mockOnClearAll = jest.fn();

  it('renders comparison panel with configurations', () => {
    render(
      <ComparisonPanel
        product={mockProduct}
        configurations={mockConfigurations}
        onRemoveConfig={mockOnRemoveConfig}
        onClearAll={mockOnClearAll}
      />,
    );

    expect(screen.getByText('Configuration Comparison')).toBeInTheDocument();
    expect(screen.getByText('Clear All')).toBeInTheDocument();
    expect(screen.getAllByText('Test Product')).toHaveLength(2);
  });

  it('calls onClearAll when clear all button is clicked', () => {
    render(
      <ComparisonPanel
        product={mockProduct}
        configurations={mockConfigurations}
        onRemoveConfig={mockOnRemoveConfig}
        onClearAll={mockOnClearAll}
      />,
    );

    fireEvent.click(screen.getByText('Clear All'));
    expect(mockOnClearAll).toHaveBeenCalledTimes(1);
  });

  it('renders correct number of ComparisonItem components', () => {
    render(
      <ComparisonPanel
        product={mockProduct}
        configurations={mockConfigurations}
        onRemoveConfig={mockOnRemoveConfig}
        onClearAll={mockOnClearAll}
      />,
    );

    expect(screen.getAllByText('Test Product')).toHaveLength(mockConfigurations.length);
  });

  it('does not render when configurations array is empty', () => {
    const { container } = render(
      <ComparisonPanel
        product={mockProduct}
        configurations={[]}
        onRemoveConfig={mockOnRemoveConfig}
        onClearAll={mockOnClearAll}
      />,
    );

    expect(container.firstChild).toBeNull();
  });
});

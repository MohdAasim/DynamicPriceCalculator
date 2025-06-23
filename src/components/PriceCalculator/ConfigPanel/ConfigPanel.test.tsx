import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ConfigPanel } from './ConfigPanel';

describe('ConfigPanel', () => {
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

  // Create mock functions
  const mockOnSizeChange = jest.fn();
  const mockOnColorChange = jest.fn();
  const mockOnAddOnToggle = jest.fn();
  const mockOnQuantityChange = jest.fn();

  // Reset all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    product: mockProduct,
    selectedSizeId: 'size1',
    selectedColorId: 'color1',
    selectedAddOnIds: ['addon1'],
    quantity: 2,
    bulkDiscountPercentage: 10,
    onSizeChange: mockOnSizeChange,
    onColorChange: mockOnColorChange,
    onAddOnToggle: mockOnAddOnToggle,
    onQuantityChange: mockOnQuantityChange,
  };

  it('renders component with all sections', () => {
    render(<ConfigPanel {...defaultProps} />);

    expect(screen.getByText('Product Configuration')).toBeInTheDocument();
    expect(screen.getByText('Size')).toBeInTheDocument();
    expect(screen.getByText('Color')).toBeInTheDocument();
    expect(screen.getByText('Add-ons')).toBeInTheDocument();
    expect(screen.getByText('Quantity')).toBeInTheDocument();
  });

  it('displays sizes with price adjustments', () => {
    render(<ConfigPanel {...defaultProps} />);

    expect(screen.getByText('Small')).toBeInTheDocument();
    expect(screen.getByText(/Medium \(\+\$20.00\)/)).toBeInTheDocument();
  });

  it('displays colors with price adjustments', () => {
    render(<ConfigPanel {...defaultProps} />);

    expect(screen.getByText('Red')).toBeInTheDocument();
    expect(screen.getByText(/Blue \(\+\$10.00\)/)).toBeInTheDocument();
  });

  it('displays add-ons with prices', () => {
    render(<ConfigPanel {...defaultProps} />);

    expect(screen.getByText('Extra Feature')).toBeInTheDocument();
    expect(screen.getByText('+$10.00')).toBeInTheDocument();
    expect(screen.getByText('Premium Support')).toBeInTheDocument();
    expect(screen.getByText('+$15.00')).toBeInTheDocument();
  });

  it('calls onSizeChange when size is selected', () => {
    render(<ConfigPanel {...defaultProps} />);

    const mediumSizeInput = screen.getAllByRole('radio')[1]; // Second size radio button
    fireEvent.click(mediumSizeInput);

    expect(mockOnSizeChange).toHaveBeenCalledWith('size2');
  });

  it('calls onColorChange when color is selected', () => {
    render(<ConfigPanel {...defaultProps} />);

    const blueColorInput = screen.getAllByRole('radio')[3]; // Second color radio button (after 2 size options)
    fireEvent.click(blueColorInput);

    expect(mockOnColorChange).toHaveBeenCalledWith('color2');
  });

  it('calls onAddOnToggle when add-on is toggled', () => {
    render(<ConfigPanel {...defaultProps} />);

    const premiumSupportCheckbox = screen.getAllByRole('checkbox')[1]; // Second add-on checkbox
    fireEvent.click(premiumSupportCheckbox);

    expect(mockOnAddOnToggle).toHaveBeenCalledWith('addon2');
  });

  it('displays correct quantity value', () => {
    render(<ConfigPanel {...defaultProps} />);

    const quantityInput = screen.getByRole('spinbutton');
    expect(quantityInput).toHaveValue(2);
  });

  it('calls onQuantityChange when increment button is clicked', () => {
    render(<ConfigPanel {...defaultProps} />);

    const incrementButton = screen.getByLabelText('Increase quantity');
    fireEvent.click(incrementButton);

    expect(mockOnQuantityChange).toHaveBeenCalledWith(3);
  });

  it('calls onQuantityChange when decrement button is clicked', () => {
    render(<ConfigPanel {...defaultProps} />);

    const decrementButton = screen.getByLabelText('Decrease quantity');
    fireEvent.click(decrementButton);

    expect(mockOnQuantityChange).toHaveBeenCalledWith(1);
  });

  it('does not decrement quantity below 1', () => {
    render(<ConfigPanel {...defaultProps} quantity={1} />);

    const decrementButton = screen.getByLabelText('Decrease quantity');
    fireEvent.click(decrementButton);

    expect(mockOnQuantityChange).not.toHaveBeenCalled();
  });

  it('calls onQuantityChange when quantity input is changed directly', () => {
    render(<ConfigPanel {...defaultProps} />);

    const quantityInput = screen.getByRole('spinbutton');
    fireEvent.change(quantityInput, { target: { value: '5' } });

    expect(mockOnQuantityChange).toHaveBeenCalledWith(5);
  });

  it('displays bulk discount percentage', () => {
    render(<ConfigPanel {...defaultProps} />);

    expect(screen.getByText('10% off')).toBeInTheDocument();
  });
});

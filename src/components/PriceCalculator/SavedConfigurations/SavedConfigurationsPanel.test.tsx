import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SavedConfigurationsPanel } from './SavedConfigurationsPanel';

describe('SavedConfigurationsPanel', () => {
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

  const mockSavedConfigurations = [
    {
      id: 'config1',
      name: 'My First Config',
      dateCreated: '2025-06-20T14:30:00.000Z',
      config: {
        productId: 'product1',
        sizeId: 'size1',
        colorId: 'color1',
        addOnIds: ['addon1'],
        quantity: 2,
      },
    },
    {
      id: 'config2',
      name: 'Premium Setup',
      dateCreated: '2025-06-21T09:15:00.000Z',
      config: {
        productId: 'product1',
        sizeId: 'size2',
        colorId: 'color2',
        addOnIds: ['addon1', 'addon2'],
        quantity: 1,
      },
    },
  ];

  const mockOnLoadConfiguration = jest.fn();
  const mockOnDeleteConfiguration = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not render when there are no saved configurations', () => {
    const { container } = render(
      <SavedConfigurationsPanel
        savedConfigurations={[]}
        onLoadConfiguration={mockOnLoadConfiguration}
        onDeleteConfiguration={mockOnDeleteConfiguration}
        product={mockProduct}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders header with correct count when there are saved configurations', () => {
    render(
      <SavedConfigurationsPanel
        savedConfigurations={mockSavedConfigurations}
        onLoadConfiguration={mockOnLoadConfiguration}
        onDeleteConfiguration={mockOnDeleteConfiguration}
        product={mockProduct}
      />,
    );

    expect(
      screen.getByText(`Saved Configurations (${mockSavedConfigurations.length})`),
    ).toBeInTheDocument();
  });

  it('initially renders in collapsed state', () => {
    render(
      <SavedConfigurationsPanel
        savedConfigurations={mockSavedConfigurations}
        onLoadConfiguration={mockOnLoadConfiguration}
        onDeleteConfiguration={mockOnDeleteConfiguration}
        product={mockProduct}
      />,
    );

    expect(screen.queryByText('My First Config')).not.toBeInTheDocument();
    expect(screen.getByText('►')).toBeInTheDocument();
  });

  it('expands when clicked on header', () => {
    render(
      <SavedConfigurationsPanel
        savedConfigurations={mockSavedConfigurations}
        onLoadConfiguration={mockOnLoadConfiguration}
        onDeleteConfiguration={mockOnDeleteConfiguration}
        product={mockProduct}
      />,
    );

    fireEvent.click(screen.getByText(`Saved Configurations (${mockSavedConfigurations.length})`));

    expect(screen.getByText('My First Config')).toBeInTheDocument();
    expect(screen.getByText('Premium Setup')).toBeInTheDocument();
    expect(screen.getByText('▼')).toBeInTheDocument();
  });

  it('displays configuration details correctly', () => {
    render(
      <SavedConfigurationsPanel
        savedConfigurations={mockSavedConfigurations}
        onLoadConfiguration={mockOnLoadConfiguration}
        onDeleteConfiguration={mockOnDeleteConfiguration}
        product={mockProduct}
      />,
    );

    fireEvent.click(screen.getByText(`Saved Configurations (${mockSavedConfigurations.length})`));

    expect(screen.getByText('Size: Small, Color: Red, Add-ons: 1, Qty: 2')).toBeInTheDocument();
    expect(screen.getByText('Size: Medium, Color: Blue, Add-ons: 2, Qty: 1')).toBeInTheDocument();
  });

  it('formats dates correctly', () => {
    // Mock the date formatting functions to return different values for each config
    const originalDateToLocaleDateString = Date.prototype.toLocaleDateString;
    const originalDateToLocaleTimeString = Date.prototype.toLocaleTimeString;

    // Use a counter to return different values for each call
    let dateCounter = 0;
    Date.prototype.toLocaleDateString = jest.fn().mockImplementation(() => {
      return dateCounter++ === 0 ? '6/20/2025' : '6/21/2025';
    });

    let timeCounter = 0;
    Date.prototype.toLocaleTimeString = jest.fn().mockImplementation(() => {
      return timeCounter++ === 0 ? '2:30 PM' : '9:15 AM';
    });

    render(
      <SavedConfigurationsPanel
        savedConfigurations={mockSavedConfigurations}
        onLoadConfiguration={mockOnLoadConfiguration}
        onDeleteConfiguration={mockOnDeleteConfiguration}
        product={mockProduct}
      />,
    );

    fireEvent.click(screen.getByText(`Saved Configurations (${mockSavedConfigurations.length})`));

    // Check each date separately
    expect(screen.getByText('6/20/2025 2:30 PM')).toBeInTheDocument();
    expect(screen.getByText('6/21/2025 9:15 AM')).toBeInTheDocument();

    // Restore original methods
    Date.prototype.toLocaleDateString = originalDateToLocaleDateString;
    Date.prototype.toLocaleTimeString = originalDateToLocaleTimeString;
  });

  it('calls onLoadConfiguration when Load button is clicked', () => {
    render(
      <SavedConfigurationsPanel
        savedConfigurations={mockSavedConfigurations}
        onLoadConfiguration={mockOnLoadConfiguration}
        onDeleteConfiguration={mockOnDeleteConfiguration}
        product={mockProduct}
      />,
    );

    fireEvent.click(screen.getByText(`Saved Configurations (${mockSavedConfigurations.length})`));
    fireEvent.click(screen.getAllByText('Load')[0]);

    expect(mockOnLoadConfiguration).toHaveBeenCalledWith(mockSavedConfigurations[0].config);
  });

  it('calls onDeleteConfiguration when Delete button is clicked', () => {
    render(
      <SavedConfigurationsPanel
        savedConfigurations={mockSavedConfigurations}
        onLoadConfiguration={mockOnLoadConfiguration}
        onDeleteConfiguration={mockOnDeleteConfiguration}
        product={mockProduct}
      />,
    );

    fireEvent.click(screen.getByText(`Saved Configurations (${mockSavedConfigurations.length})`));
    fireEvent.click(screen.getAllByText('Delete')[1]);

    expect(mockOnDeleteConfiguration).toHaveBeenCalledWith(mockSavedConfigurations[1].id);
  });
});

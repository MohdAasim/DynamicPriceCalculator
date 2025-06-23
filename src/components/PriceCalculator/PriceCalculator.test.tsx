import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PriceCalculator } from './PriceCalculator';
import { usePriceCalculator } from '../../hooks/usePriceCalculator';
import {
  saveConfigurationToStorage,
  getSavedConfigurations,
  deleteConfigurationFromStorage,
  type SavedConfigurationEntry,
} from '../../utils/storageUtils';
import { toast } from 'react-toastify';
import type { Product, ProductConfiguration } from '../../types';

// Properly type the mocks
jest.mock('../../hooks/usePriceCalculator');
jest.mock('../../utils/storageUtils');
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
  },
  ToastContainer: () => <div data-testid='toast-container' />,
}));

// Mock the child components
jest.mock('./ConfigPanel/ConfigPanel', () => ({
  ConfigPanel: () => <div data-testid='config-panel' />,
}));

jest.mock('./PriceBreakdown/PriceBreakdown', () => ({
  PriceBreakdown: () => <div data-testid='price-breakdown' />,
}));

jest.mock('./PriceHistory/PriceHistoryChart', () => ({
  PriceHistoryChart: () => <div data-testid='price-history-chart' />,
}));

// Type the ComparisonPanel mock
jest.mock('./Comparison/ComparisonPanel', () => ({
  ComparisonPanel: ({
    configurations,
    onRemoveConfig,
    onClearAll,
  }: {
    configurations: Array<{
      config: ProductConfiguration;
      priceInfo: {
        subtotal: number;
        discountPercentage: number;
        discountAmount: number;
        total: number;
        unitPrice: number;
      };
    }>;
    onRemoveConfig: (index: number) => void;
    onClearAll: () => void;
    product: Product;
  }) => (
    <div data-testid='comparison-panel'>
      {configurations.length > 0 && (
        <>
          <button onClick={() => onRemoveConfig(0)}>Remove Item</button>
          <button onClick={onClearAll}>Clear All</button>
        </>
      )}
    </div>
  ),
}));

// Type the SaveConfigDialog mock
jest.mock('./SavedConfigurations/SaveConfigDialog', () => ({
  SaveConfigDialog: ({
    onSave,
    onCancel,
  }: {
    onSave: (name: string) => void;
    onCancel: () => void;
    existingNames: string[];
  }) => (
    <div data-testid='save-dialog'>
      <button onClick={() => onSave('Test Config')}>Save</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  ),
}));

// Type the SavedConfigurationsPanel mock
jest.mock('./SavedConfigurations/SavedConfigurationsPanel', () => ({
  SavedConfigurationsPanel: ({
    onLoadConfiguration,
    onDeleteConfiguration,
  }: {
    savedConfigurations: SavedConfigurationEntry[];
    onLoadConfiguration: (config: ProductConfiguration) => void;
    onDeleteConfiguration: (configId: string) => void;
    product: Product;
  }) => (
    <div data-testid='saved-configurations-panel'>
      <button
        onClick={() =>
          onLoadConfiguration({
            productId: 'product1',
            sizeId: 'size1',
            colorId: 'color1',
            addOnIds: [],
            quantity: 1,
          })
        }
      >
        Load Config
      </button>
      <button onClick={() => onDeleteConfiguration('config1')}>Delete Config</button>
    </div>
  ),
}));

// Add proper types to the clipboard mock
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockResolvedValue(undefined) as jest.Mock,
  },
});

// Type the window.confirm mock
window.confirm = jest.fn().mockReturnValue(true) as jest.Mock<boolean, [message?: string]>;

describe('PriceCalculator', () => {
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
    bulkDiscounts: [
      { minQuantity: 5, discountPercentage: 10 },
      { minQuantity: 10, discountPercentage: 15 },
    ],
  };

  const mockPriceHistory = [
    { date: '2025-05-01', price: 95 },
    { date: '2025-05-15', price: 100 },
    { date: '2025-06-01', price: 105 },
  ];

  const mockConfig = {
    productId: 'product1',
    sizeId: 'size1',
    colorId: 'color1',
    addOnIds: ['addon1'],
    quantity: 2,
  };

  const mockPriceBreakdown = {
    basePrice: 100,
    sizePrice: 0,
    colorPrice: 0,
    selectedSize: { id: 'size1', name: 'Small', priceAdjustment: 0 },
    selectedColor: { id: 'color1', name: 'Red', priceAdjustment: 0 },
    selectedAddOns: [{ id: 'addon1', name: 'Extra Feature', price: 10 }],
    subtotal: 110,
    quantity: 2,
    discountPercentage: 0,
    discountAmount: 0,
    total: 220,
    unitPrice: 110,
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
  ];

  // Setup mock for usePriceCalculator
  const mockUpdateSize = jest.fn();
  const mockUpdateColor = jest.fn();
  const mockToggleAddOn = jest.fn();
  const mockUpdateQuantity = jest.fn();
  const mockUpdateFullConfig = jest.fn();

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Setup mock implementations
    (usePriceCalculator as jest.Mock).mockReturnValue({
      config: mockConfig,
      updateSize: mockUpdateSize,
      updateColor: mockUpdateColor,
      toggleAddOn: mockToggleAddOn,
      updateQuantity: mockUpdateQuantity,
      updateFullConfig: mockUpdateFullConfig,
      priceBreakdown: mockPriceBreakdown,
    });

    (getSavedConfigurations as jest.Mock).mockReturnValue(mockSavedConfigurations);
    (saveConfigurationToStorage as jest.Mock).mockReturnValue({
      id: 'new-config-id',
      name: 'Test Config',
      dateCreated: new Date().toISOString(),
      config: mockConfig,
    });
    (deleteConfigurationFromStorage as jest.Mock).mockReturnValue(true);
  });

  it('renders calculator with correct title', () => {
    render(<PriceCalculator product={mockProduct} priceHistory={mockPriceHistory} />);

    expect(screen.getByText(`💰 ${mockProduct.name} Pricing Calculator`)).toBeInTheDocument();
  });

  it('renders all main components', () => {
    render(<PriceCalculator product={mockProduct} priceHistory={mockPriceHistory} />);

    expect(screen.getByTestId('config-panel')).toBeInTheDocument();
    expect(screen.getByTestId('price-breakdown')).toBeInTheDocument();
    expect(screen.getByTestId('price-history-chart')).toBeInTheDocument();
    expect(screen.getByTestId('comparison-panel')).toBeInTheDocument();
    expect(screen.getByTestId('saved-configurations-panel')).toBeInTheDocument();
  });

  it('adds configuration to comparison when Compare button is clicked', () => {
    render(<PriceCalculator product={mockProduct} priceHistory={mockPriceHistory} />);

    const compareButton = screen.getByText('Compare');
    fireEvent.click(compareButton);

    expect(toast.success).toHaveBeenCalledWith('Item added to comparison!');
  });

  it('shows warning when trying to add duplicate configuration to comparison', () => {
    render(<PriceCalculator product={mockProduct} priceHistory={mockPriceHistory} />);

    // Add the config once
    const compareButton = screen.getByText('Compare');
    fireEvent.click(compareButton);

    // Try to add it again
    fireEvent.click(compareButton);

    expect(toast.warning).toHaveBeenCalledWith('This configuration is already in your comparison.');
  });

  it('removes configuration from comparison', async () => {
    render(<PriceCalculator product={mockProduct} priceHistory={mockPriceHistory} />);

    // Add a config first
    const compareButton = screen.getByText('Compare');
    fireEvent.click(compareButton);

    // Now there should be a remove button in the comparison panel
    const removeButton = await screen.findByText('Remove Item');
    fireEvent.click(removeButton);

    expect(toast.info).toHaveBeenCalledWith('Item removed from comparison');
  });

  it('clears all comparisons', async () => {
    render(<PriceCalculator product={mockProduct} priceHistory={mockPriceHistory} />);

    // Add a config first
    const compareButton = screen.getByText('Compare');
    fireEvent.click(compareButton);

    // Now there should be a clear all button
    const clearButton = await screen.findByText('Clear All');
    fireEvent.click(clearButton);

    expect(toast.info).toHaveBeenCalledWith('All comparisons cleared');
  });

  it('shows save dialog when Save Config button is clicked', () => {
    render(<PriceCalculator product={mockProduct} priceHistory={mockPriceHistory} />);

    const saveButton = screen.getByText('Save Config');
    fireEvent.click(saveButton);

    expect(screen.getByTestId('save-dialog')).toBeInTheDocument();
  });

  it('closes save dialog when Cancel button is clicked', () => {
    render(<PriceCalculator product={mockProduct} priceHistory={mockPriceHistory} />);

    // Open the save dialog
    const saveButton = screen.getByText('Save Config');
    fireEvent.click(saveButton);

    // Verify dialog is shown
    expect(screen.getByTestId('save-dialog')).toBeInTheDocument();

    // Click the cancel button
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    // Verify dialog is closed
    expect(screen.queryByTestId('save-dialog')).not.toBeInTheDocument();
  });

  it('loads saved configuration when Load Config button is clicked', () => {
    render(<PriceCalculator product={mockProduct} priceHistory={mockPriceHistory} />);

    const loadButton = screen.getByText('Load Config');
    fireEvent.click(loadButton);

    expect(mockUpdateFullConfig).toHaveBeenCalled();
    expect(toast.info).toHaveBeenCalledWith('Configuration loaded successfully!');
  });

  it('deletes saved configuration after confirmation', () => {
    render(<PriceCalculator product={mockProduct} priceHistory={mockPriceHistory} />);

    const deleteButton = screen.getByText('Delete Config');
    fireEvent.click(deleteButton);

    expect(window.confirm).toHaveBeenCalledWith(
      'Are you sure you want to delete this configuration?',
    );
    expect(deleteConfigurationFromStorage).toHaveBeenCalledWith('config1');
    expect(toast.info).toHaveBeenCalledWith('Configuration deleted successfully');
  });

  it('handles deletion error properly', () => {
    (deleteConfigurationFromStorage as jest.Mock).mockReturnValue(false);

    render(<PriceCalculator product={mockProduct} priceHistory={mockPriceHistory} />);

    const deleteButton = screen.getByText('Delete Config');
    fireEvent.click(deleteButton);

    expect(toast.error).toHaveBeenCalledWith('Failed to delete configuration. Please try again.');
  });

  it('loads initial configuration if provided', () => {
    const initialConfig = {
      productId: 'product1',
      sizeId: 'size2',
      colorId: 'color2',
      addOnIds: ['addon2'],
      quantity: 3,
    };

    render(
      <PriceCalculator
        product={mockProduct}
        priceHistory={mockPriceHistory}
        initialConfig={initialConfig}
      />,
    );

    expect(usePriceCalculator).toHaveBeenCalledWith(mockProduct, initialConfig);
  });

  it('handles clipboard error gracefully when saving configuration', async () => {
    // Mock clipboard to fail
    (navigator.clipboard.writeText as jest.Mock).mockRejectedValue(new Error('Clipboard failed'));

    render(<PriceCalculator product={mockProduct} priceHistory={mockPriceHistory} />);

    // Open the save dialog
    const saveButton = screen.getByText('Save Config');
    fireEvent.click(saveButton);

    // Click the save button in the dialog
    const dialogSaveButton = screen.getByText('Save');
    fireEvent.click(dialogSaveButton);

    await waitFor(() => {
      expect(toast.info).toHaveBeenCalledWith(
        'Configuration "Test Config" saved! (Failed to copy link to clipboard)',
      );
    });
  });
});

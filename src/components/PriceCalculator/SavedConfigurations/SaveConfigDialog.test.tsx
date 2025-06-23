import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SaveConfigDialog } from './SaveConfigDialog';

describe('SaveConfigDialog', () => {
  const mockOnSave = jest.fn();
  const mockOnCancel = jest.fn();
  const existingNames = ['Configuration 1', 'My Favorite Setup'];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the dialog with title and input field', () => {
    render(
      <SaveConfigDialog
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        existingNames={existingNames}
      />,
    );

    expect(screen.getByText('Save Configuration')).toBeInTheDocument();
    expect(screen.getByLabelText(/Configuration Name:/i)).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('has default value in the input field', () => {
    render(
      <SaveConfigDialog
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        existingNames={existingNames}
      />,
    );

    const inputField = screen.getByLabelText(/Configuration Name:/i);
    expect(inputField).toHaveValue('My Configuration');
  });

  it('calls onCancel when Cancel button is clicked', () => {
    render(
      <SaveConfigDialog
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        existingNames={existingNames}
      />,
    );

    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('updates input value when user types', () => {
    render(
      <SaveConfigDialog
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        existingNames={existingNames}
      />,
    );

    const inputField = screen.getByLabelText(/Configuration Name:/i);
    fireEvent.change(inputField, { target: { value: 'New Config Name' } });
    expect(inputField).toHaveValue('New Config Name');
  });

  it('shows error when trying to save with empty name', () => {
    render(
      <SaveConfigDialog
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        existingNames={existingNames}
      />,
    );

    const inputField = screen.getByLabelText(/Configuration Name:/i);
    fireEvent.change(inputField, { target: { value: '   ' } });
    fireEvent.click(screen.getByText('Save'));

    expect(screen.getByText('Configuration name cannot be empty.')).toBeInTheDocument();
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('shows error when trying to save with duplicate name', () => {
    render(
      <SaveConfigDialog
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        existingNames={existingNames}
      />,
    );

    const inputField = screen.getByLabelText(/Configuration Name:/i);
    fireEvent.change(inputField, { target: { value: 'Configuration 1' } });
    fireEvent.click(screen.getByText('Save'));

    expect(screen.getByText(/A configuration with this name already exists/i)).toBeInTheDocument();
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('calls onSave with trimmed name when form is submitted with valid name', () => {
    render(
      <SaveConfigDialog
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        existingNames={existingNames}
      />,
    );

    const inputField = screen.getByLabelText(/Configuration Name:/i);
    fireEvent.change(inputField, { target: { value: '  New Valid Name  ' } });
    fireEvent.click(screen.getByText('Save'));

    expect(mockOnSave).toHaveBeenCalledWith('New Valid Name');
  });

  it('clears error message when user types after error', () => {
    render(
      <SaveConfigDialog
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        existingNames={existingNames}
      />,
    );

    const inputField = screen.getByLabelText(/Configuration Name:/i);

    // First trigger an error
    fireEvent.change(inputField, { target: { value: '' } });
    fireEvent.click(screen.getByText('Save'));
    expect(screen.getByText('Configuration name cannot be empty.')).toBeInTheDocument();

    // Then type something and check if error is cleared
    fireEvent.change(inputField, { target: { value: 'New Input' } });
    expect(screen.queryByText('Configuration name cannot be empty.')).not.toBeInTheDocument();
  });
});

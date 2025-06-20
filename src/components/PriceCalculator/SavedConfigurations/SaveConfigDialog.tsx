import { useState } from 'react';
import './SaveConfigDialog.css';

interface SaveConfigDialogProps {
  onSave: (name: string) => void;
  onCancel: () => void;
  existingNames: string[]; // Add this prop to check for duplicates
}

export const SaveConfigDialog: React.FC<SaveConfigDialogProps> = ({
  onSave,
  onCancel,
  existingNames,
}) => {
  const [configName, setConfigName] = useState('My Configuration');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = configName.trim();

    // Check if name is empty
    if (!trimmedName) {
      setError('Configuration name cannot be empty.');
      return;
    }

    // Check if name already exists
    if (existingNames.includes(trimmedName)) {
      setError('A configuration with this name already exists. Please choose a different name.');
      return;
    }

    // If validation passes, save the configuration
    onSave(trimmedName);
  };

  return (
    <div className='save-config-dialog-overlay'>
      <div className='save-config-dialog'>
        <h3>Save Configuration</h3>
        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label htmlFor='configName'>Configuration Name:</label>
            <input
              type='text'
              id='configName'
              value={configName}
              onChange={(e) => {
                setConfigName(e.target.value);
                setError(null); // Clear error when user types
              }}
              placeholder='Enter a name for this configuration'
              autoFocus
              className={error ? 'input-error' : ''}
            />
            {error && <div className='error-message'>{error}</div>}
          </div>
          <div className='dialog-buttons'>
            <button type='button' className='cancel-button' onClick={onCancel}>
              Cancel
            </button>
            <button type='submit' className='save-button'>
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import { useState } from 'react';
import type { Product, ProductConfiguration } from '../../../types';
import type { SavedConfigurationEntry } from '../../../utils/storageUtils';
import './SavedConfigurationsPanel.css';

interface SavedConfigurationsPanelProps {
  savedConfigurations: SavedConfigurationEntry[];
  onLoadConfiguration: (config: ProductConfiguration) => void;
  onDeleteConfiguration: (configId: string) => void;
  product: Product;
}

export const SavedConfigurationsPanel: React.FC<SavedConfigurationsPanelProps> = ({
  savedConfigurations,
  onLoadConfiguration,
  onDeleteConfiguration,
  product,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (savedConfigurations.length === 0) {
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      ' ' +
      date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    );
  };

  const getConfigSummary = (config: ProductConfiguration) => {
    const size = product.sizes.find((s) => s.id === config.sizeId)?.name || '';
    const color = product.colors.find((c) => c.id === config.colorId)?.name || '';
    const addOnsCount = config.addOnIds.length;

    return `Size: ${size}, Color: ${color}, Add-ons: ${addOnsCount}, Qty: ${config.quantity}`;
  };

  return (
    <div className='saved-configurations-panel'>
      <div className='saved-configurations-header' onClick={() => setIsExpanded(!isExpanded)}>
        <h3>
          <span className='saved-config-icon'>💾</span>
          Saved Configurations ({savedConfigurations.length})
        </h3>
        <span className='toggle-icon'>{isExpanded ? '▼' : '►'}</span>
      </div>

      {isExpanded && (
        <div className='saved-configurations-list'>
          {savedConfigurations.map((entry) => (
            <div key={entry.id} className='saved-configuration-item'>
              <div className='saved-config-info'>
                <div className='saved-config-name'>{entry.name}</div>
                <div className='saved-config-date'>{formatDate(entry.dateCreated)}</div>
                <div className='saved-config-summary'>{getConfigSummary(entry.config)}</div>
              </div>
              <div className='saved-config-actions'>
                <button
                  className='load-config-btn'
                  onClick={() => onLoadConfiguration(entry.config)}
                  title='Load this configuration'
                >
                  Load
                </button>
                <button
                  className='delete-config-btn'
                  onClick={() => onDeleteConfiguration(entry.id)}
                  title='Delete this configuration'
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

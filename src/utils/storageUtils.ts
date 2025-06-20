import type { ProductConfiguration } from '../types';

export interface SavedConfigurationEntry {
  id: string;
  name: string;
  dateCreated: string;
  config: ProductConfiguration;
}

const STORAGE_KEY = 'dynamicPriceCalculator.savedConfigurations';

/**
 * Save a configuration to localStorage
 */
export const saveConfigurationToStorage = (
  config: ProductConfiguration,
  name: string = 'Unnamed Configuration',
): SavedConfigurationEntry => {
  try {
    // Create new configuration entry
    const newEntry: SavedConfigurationEntry = {
      id: `config-${Date.now()}`,
      name,
      dateCreated: new Date().toISOString(),
      config,
    };

    // Get existing configurations
    const existingConfigs = getSavedConfigurations();

    // Add new configuration
    const updatedConfigs = [...existingConfigs, newEntry];

    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedConfigs));

    return newEntry;
  } catch (error) {
    console.error('Failed to save configuration to localStorage:', error);
    throw error;
  }
};

/**
 * Get all saved configurations from localStorage
 */
export const getSavedConfigurations = (): SavedConfigurationEntry[] => {
  try {
    const storedConfigs = localStorage.getItem(STORAGE_KEY);
    if (!storedConfigs) {
      return [];
    }

    return JSON.parse(storedConfigs);
  } catch (error) {
    console.error('Failed to retrieve configurations from localStorage:', error);
    return [];
  }
};

/**
 * Delete a configuration from localStorage
 */
export const deleteConfigurationFromStorage = (configId: string): boolean => {
  try {
    const configurations = getSavedConfigurations();
    const filteredConfigs = configurations.filter((config) => config.id !== configId);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredConfigs));
    return true;
  } catch (error) {
    console.error('Failed to delete configuration from localStorage:', error);
    return false;
  }
};

/**
 * Clear all saved configurations from localStorage
 */
export const clearAllSavedConfigurations = (): boolean => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear configurations from localStorage:', error);
    return false;
  }
};

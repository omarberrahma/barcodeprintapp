import localforage from 'localforage';

// Initialize the database store
const db = localforage.createInstance({
  name: 'BarcodePrinterDB',
  storeName: 'products'
});

const configDb = localforage.createInstance({
  name: 'BarcodePrinterDB',
  storeName: 'config'
});

export const saveData = async (data) => {
  try {
    await db.setItem('productsData', data);
    return true;
  } catch (error) {
    console.error('Error saving data:', error);
    return false;
  }
};

export const loadData = async () => {
  try {
    const data = await db.getItem('productsData');
    return data || [];
  } catch (error) {
    console.error('Error loading data:', error);
    return [];
  }
};

export const clearData = async () => {
    try {
      await db.removeItem('productsData');
      return true;
    } catch (error) {
      console.error('Error clearing data:', error);
      return false;
    }
}

export const saveConfig = async (config) => {
  try {
    await configDb.setItem('printConfig', config);
    return true;
  } catch (error) {
    console.error('Error saving config:', error);
    return false;
  }
};

export const loadConfig = async () => {
  try {
    const config = await configDb.getItem('printConfig');
    return config || { showName: true, showBarcode: true, showPrice: true };
  } catch (error) {
    console.error('Error loading config:', error);
    return { showName: true, showBarcode: true, showPrice: true };
  }
};

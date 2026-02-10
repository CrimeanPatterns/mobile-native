import StorageSync from '../services/storageSync';

export const useForceUpdate = () => () => StorageSync.forceUpdate();

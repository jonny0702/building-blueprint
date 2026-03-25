import { AssetHistoryEntry } from '@/types/assetHistory';

export const mockAssetHistory: Record<string, AssetHistoryEntry[]> = {
  'asset-001': [
    { id: 'h1', assetCode: 'DH123478', status: 'operative', changeDate: '2025-11-06', userId: 'u1', userInitials: 'GM' },
    { id: 'h2', assetCode: 'DH123478', status: 'operative', changeDate: '2025-07-30', field: 'Descripción', description: 'Se hizo mantenimiento regular', userId: 'u1', userInitials: 'GM' },
    { id: 'h3', assetCode: 'DH123478', status: 'operative', changeDate: '2025-07-25', field: 'Estado', description: 'Cambio de detector', userId: 'u1', userInitials: 'GM' },
    { id: 'h4', assetCode: 'DH123456', status: 'retired', changeDate: '2025-07-25', field: 'Estado', description: 'El dispositivo tuvo un daño y se inactivó', userId: 'u1', userInitials: 'GM' },
    { id: 'h5', assetCode: 'DH123456', status: 'operative', changeDate: '2025-07-25', userId: 'u1', userInitials: 'GM' },
    { id: 'h6', assetCode: 'DH123456', status: 'operative', changeDate: '2025-06-01', userId: 'u1', userInitials: 'GM' },
    { id: 'h7', assetCode: 'DH123456', status: 'operative', changeDate: '2025-05-25', userId: 'u1', userInitials: 'GM' },
  ],
  'asset-002': [
    { id: 'h8', assetCode: 'DH1236789', status: 'operative', changeDate: '2025-06-15', userId: 'u1', userInitials: 'GM' },
  ],
  'asset-003': [
    { id: 'h9', assetCode: 'EXT001', status: 'operative', changeDate: '2025-03-15', field: 'Estado', description: 'Recarga completada', userId: 'u1', userInitials: 'GM' },
  ],
};

export const getAssetHistory = (assetId: string): AssetHistoryEntry[] => {
  return mockAssetHistory[assetId] || [];
};

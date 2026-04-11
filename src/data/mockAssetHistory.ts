import { AssetHistoryEntry, AssetHistoryDetail } from '@/types/assetHistory';

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

const mockHistoryDetails: Record<string, AssetHistoryDetail> = {
  h1: {
    logId: 'h1',
    action: 'CREATED',
    changeSource: 'INITIAL_REGISTRATION',
    details: 'Activo registrado inicialmente en el sistema',
    assetCode: 'DH123478',
    status: 'OPERATIONAL',
    changeDate: '2025-11-06T14:30:00.000',
    userName: 'Guillermo Morales',
    assetSnapshot: JSON.stringify({ id: 'asset-001', name: 'Detector de Humo Piso 3', code: 'DH123478', manufacturer: 'Firelite', model: 'FL-SD365', status: 'operative', serialNumber: 'SN-00123' }),
  },
  h2: {
    logId: 'h2',
    action: 'UPDATED',
    changeSource: 'MANUAL_EDIT',
    details: 'Se hizo mantenimiento regular',
    assetCode: 'DH123478',
    status: 'OPERATIONAL',
    changeDate: '2025-07-30T10:15:00.000',
    userName: 'Guillermo Morales',
    assetSnapshot: JSON.stringify({ id: 'asset-001', name: 'Detector de Humo Piso 3', code: 'DH123478', manufacturer: 'Firelite', model: 'FL-SD365', status: 'operative', serialNumber: 'SN-00123' }),
  },
  h3: {
    logId: 'h3',
    action: 'UPDATED',
    changeSource: 'WORK_ORDER',
    details: 'Cambio de detector',
    assetCode: 'DH123478',
    status: 'OPERATIONAL',
    changeDate: '2025-07-25T09:00:00.000',
    userName: 'Guillermo Morales',
    assetSnapshot: JSON.stringify({ id: 'asset-001', name: 'Detector de Humo Piso 3', code: 'DH123478', manufacturer: 'Firelite', model: 'FL-SD365', status: 'operative', serialNumber: 'SN-00123' }),
  },
  h4: {
    logId: 'h4',
    action: 'STATUS_CHANGE',
    changeSource: 'MANUAL_EDIT',
    details: 'El dispositivo tuvo un daño y se inactivó',
    assetCode: 'DH123456',
    status: 'RETIRED',
    changeDate: '2025-07-25T11:45:00.000',
    userName: 'Guillermo Morales',
    assetSnapshot: JSON.stringify({ id: 'asset-001', name: 'Detector de Humo Piso 1', code: 'DH123456', manufacturer: 'Edwards', model: 'IO1000', status: 'retired', serialNumber: 'SN-00456' }),
  },
  h5: {
    logId: 'h5',
    action: 'CREATED',
    changeSource: 'INITIAL_REGISTRATION',
    details: 'Activo registrado inicialmente en el sistema',
    assetCode: 'DH123456',
    status: 'OPERATIONAL',
    changeDate: '2025-07-25T08:00:00.000',
    userName: 'Guillermo Morales',
    assetSnapshot: JSON.stringify({ id: 'asset-001', name: 'Detector de Humo Piso 1', code: 'DH123456', manufacturer: 'Edwards', model: 'IO1000', status: 'operative', serialNumber: 'SN-00456' }),
  },
  h6: {
    logId: 'h6',
    action: 'UPDATED',
    changeSource: 'SYSTEM',
    details: 'Actualización automática por mantenimiento programado',
    assetCode: 'DH123456',
    status: 'OPERATIONAL',
    changeDate: '2025-06-01T12:00:00.000',
    userName: 'Guillermo Morales',
    assetSnapshot: JSON.stringify({ id: 'asset-001', name: 'Detector de Humo Piso 1', code: 'DH123456', manufacturer: 'Edwards', model: 'IO1000', status: 'operative', serialNumber: 'SN-00456' }),
  },
  h7: {
    logId: 'h7',
    action: 'CREATED',
    changeSource: 'INITIAL_REGISTRATION',
    details: 'Activo registrado inicialmente en el sistema',
    assetCode: 'DH123456',
    status: 'OPERATIONAL',
    changeDate: '2025-05-25T16:30:00.000',
    userName: 'Guillermo Morales',
    assetSnapshot: JSON.stringify({ id: 'asset-001', name: 'Detector de Humo Piso 1', code: 'DH123456', manufacturer: 'Edwards', model: 'IO1000', status: 'operative', serialNumber: 'SN-00456' }),
  },
};

export const getAssetHistoryDetail = (logId: string): AssetHistoryDetail | null => {
  return mockHistoryDetails[logId] || null;
};

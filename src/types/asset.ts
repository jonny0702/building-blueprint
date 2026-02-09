// Tipos para el sistema de activos

export interface Asset {
  id: string;
  code: string;
  name: string;
  type: string;
  classification: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  year: number;
  status: 'operative' | 'maintenance' | 'out_of_service' | 'retired';
  supplier: string;
  maintenanceDate: string;
  description: string;
  imageUrl?: string;
  locationId: string;
  categoryId: string;
}

export interface AssetCategory {
  id: string;
  name: string;
  icon: string;
  assets: Asset[];
}

// Nodo del árbol que combina ubicaciones y activos
export interface AssetTreeNode {
  id: string;
  name: string;
  code?: string;
  type: 'location' | 'category' | 'asset';
  children?: AssetTreeNode[];
  // Para ubicaciones
  locationType?: 'building' | 'tower' | 'floor' | 'basement' | 'area';
  // Para activos
  asset?: Asset;
}

// Estructura que viene del backend
export interface LocationWithAssets {
  id: string;
  name: string;
  code: string;
  type: 'building' | 'tower' | 'floor' | 'basement' | 'area';
  parentId?: string;
  children?: LocationWithAssets[];
  assetCategories?: AssetCategory[];
}

export const assetStatusLabels: Record<Asset['status'], string> = {
  operative: 'Operativo',
  maintenance: 'En Mantenimiento',
  out_of_service: 'Fuera de Servicio',
  retired: 'Retirado'
};

export const assetStatusColors: Record<Asset['status'], string> = {
  operative: 'bg-green-100 text-green-800',
  maintenance: 'bg-yellow-100 text-yellow-800',
  out_of_service: 'bg-red-100 text-red-800',
  retired: 'bg-gray-100 text-gray-800'
};

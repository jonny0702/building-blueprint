import { LocationWithAssets, Asset } from '@/types/asset';

// Mock de activos individuales
export const mockAssets: Asset[] = [
  {
    id: 'asset-001',
    code: 'DH123456',
    name: 'Detector de Humo',
    type: 'DH',
    classification: 'Detectores',
    manufacturer: 'FireStar',
    model: 'M2-356',
    serialNumber: '0409E2346790C81',
    year: 2025,
    status: 'operative',
    supplier: 'FireStrar',
    maintenanceDate: '2025-07-02',
    description: 'Detector de humo instalado en pasillo principal del piso 1, Torre A.',
    imageUrl: '/placeholder.svg',
    locationId: 'ta-floor-1',
    categoryId: 'cat-smoke-detectors'
  },
  {
    id: 'asset-002',
    code: 'DH1236789',
    name: 'Detector de Humo',
    type: 'DH',
    classification: 'Detectores',
    manufacturer: 'FireStar',
    model: 'M2-356',
    serialNumber: '0409E2346790C82',
    year: 2025,
    status: 'operative',
    supplier: 'FireStrar',
    maintenanceDate: '2025-07-02',
    description: 'Detector de humo instalado en pasillo principal del piso 1, Torre A.',
    imageUrl: '/placeholder.svg',
    locationId: 'ta-floor-1',
    categoryId: 'cat-smoke-detectors'
  },
  {
    id: 'asset-003',
    code: 'EXT001',
    name: 'Extintor',
    type: 'EXT',
    classification: 'Extintores',
    manufacturer: 'Kidde',
    model: 'Pro 210',
    serialNumber: 'KID2024001',
    year: 2024,
    status: 'operative',
    supplier: 'Seguridad Total',
    maintenanceDate: '2025-03-15',
    description: 'Extintor de polvo químico seco ABC.',
    imageUrl: '/placeholder.svg',
    locationId: 'ta-floor-2',
    categoryId: 'cat-extinguishers'
  },
  {
    id: 'asset-004',
    code: 'DH789012',
    name: 'Detector de Humo',
    type: 'DH',
    classification: 'Detectores',
    manufacturer: 'FireStar',
    model: 'M2-356',
    serialNumber: '0409E2346790C83',
    year: 2025,
    status: 'maintenance',
    supplier: 'FireStrar',
    maintenanceDate: '2025-08-10',
    description: 'Detector de humo en mantenimiento, Torre B piso 1.',
    imageUrl: '/placeholder.svg',
    locationId: 'tb-floor-1',
    categoryId: 'cat-smoke-detectors'
  },
  {
    id: 'asset-005',
    code: 'EXT002',
    name: 'Extintor',
    type: 'EXT',
    classification: 'Extintores',
    manufacturer: 'Kidde',
    model: 'Pro 340',
    serialNumber: 'KID2024002',
    year: 2024,
    status: 'operative',
    supplier: 'Seguridad Total',
    maintenanceDate: '2025-06-20',
    description: 'Extintor CO2 ubicado en Torre B, piso 2.',
    imageUrl: '/placeholder.svg',
    locationId: 'tb-floor-2',
    categoryId: 'cat-extinguishers'
  },
  {
    id: 'asset-006',
    code: 'PANEL-ACI-01',
    name: 'Panel ACI',
    type: 'PANEL',
    classification: 'Paneles',
    manufacturer: 'Edwards',
    model: 'IO1000',
    serialNumber: 'EDW2024001',
    year: 2024,
    status: 'operative',
    supplier: 'Edwards CO',
    maintenanceDate: '2025-09-01',
    description: 'Panel de alarma contra incendios central, Torre A piso 1.',
    imageUrl: '/placeholder.svg',
    locationId: 'ta-floor-1',
    categoryId: 'cat-fire-panels'
  },
];

// Mock de la estructura de ubicaciones con activos (con torres)
export const mockLocationWithAssets: LocationWithAssets = {
  id: 'building-1',
  name: 'P.H. Brisas de Miraflores',
  code: 'PP-001',
  type: 'building',
  children: [
    {
      id: 'tower-a',
      name: 'Torre A',
      code: 'TA',
      type: 'tower',
      parentId: 'building-1',
      children: [
        {
          id: 'ta-floor-1',
          name: 'Piso 1',
          code: 'TA-P1',
          type: 'floor',
          parentId: 'tower-a',
          assetCategories: [
            {
              id: 'cat-smoke-detectors',
              name: 'Detectores de Humo',
              icon: 'shield',
              assets: [mockAssets[0], mockAssets[1]],
            },
            {
              id: 'cat-fire-panels',
              name: 'Paneles ACI',
              icon: 'monitor',
              assets: [mockAssets[5]],
            },
          ],
        },
        {
          id: 'ta-floor-2',
          name: 'Piso 2',
          code: 'TA-P2',
          type: 'floor',
          parentId: 'tower-a',
          assetCategories: [
            {
              id: 'cat-extinguishers',
              name: 'Extintores',
              icon: 'flame',
              assets: [mockAssets[2]],
            },
          ],
        },
        {
          id: 'ta-floor-3',
          name: 'Piso 3',
          code: 'TA-P3',
          type: 'floor',
          parentId: 'tower-a',
          assetCategories: [],
        },
      ],
    },
    {
      id: 'tower-b',
      name: 'Torre B',
      code: 'TB',
      type: 'tower',
      parentId: 'building-1',
      children: [
        {
          id: 'tb-floor-1',
          name: 'Piso 1',
          code: 'TB-P1',
          type: 'floor',
          parentId: 'tower-b',
          assetCategories: [
            {
              id: 'cat-smoke-detectors',
              name: 'Detectores de Humo',
              icon: 'shield',
              assets: [mockAssets[3]],
            },
          ],
        },
        {
          id: 'tb-floor-2',
          name: 'Piso 2',
          code: 'TB-P2',
          type: 'floor',
          parentId: 'tower-b',
          assetCategories: [
            {
              id: 'cat-extinguishers',
              name: 'Extintores',
              icon: 'flame',
              assets: [mockAssets[4]],
            },
          ],
        },
      ],
    },
  ],
};

// Función helper para obtener un activo por ID
export const getAssetById = (id: string): Asset | undefined => {
  return mockAssets.find(asset => asset.id === id);
};

// Función helper para obtener todos los assets flat del árbol
export const getAllAssetsFromTree = (location: LocationWithAssets): Asset[] => {
  const assets: Asset[] = [];
  if (location.assetCategories) {
    for (const cat of location.assetCategories) {
      assets.push(...cat.assets);
    }
  }
  if (location.children) {
    for (const child of location.children) {
      assets.push(...getAllAssetsFromTree(child));
    }
  }
  return assets;
};

// Función helper para obtener la ruta de ubicación de un activo
export const getAssetLocationPath = (assetId: string): string => {
  const asset = getAssetById(assetId);
  if (!asset) return '';
  
  const paths: Record<string, string> = {
    'asset-001': '/PH Brisas de Miraflores/Torre A/Piso 1/DH/DH123456',
    'asset-002': '/PH Brisas de Miraflores/Torre A/Piso 1/DH/DH1236789',
    'asset-003': '/PH Brisas de Miraflores/Torre A/Piso 2/EXT/EXT001',
    'asset-004': '/PH Brisas de Miraflores/Torre B/Piso 1/DH/DH789012',
    'asset-005': '/PH Brisas de Miraflores/Torre B/Piso 2/EXT/EXT002',
    'asset-006': '/PH Brisas de Miraflores/Torre A/Piso 1/PANEL/PANEL-ACI-01',
  };
  
  return paths[assetId] || `/Ubicación/${asset.code}`;
};

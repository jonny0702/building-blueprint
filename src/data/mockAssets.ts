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
    description: 'Buenas tardes. Como técnico encargado, le confirmo que he completado el mantenimiento preventivo de su detector de humo.\n\nPrueba de funcionamiento: Presioné el botón de "Test" para simular la presencia de humo. La alarma sonora se activó de inmediato con el volumen correcto, confirmando que la circuitería y el altavoz funcionan.\n\nReemplazo de batería: Abrí el compartimento y retiré la batería existente. Instalé una batería alcalina de 9V (o tipo AA/AAA, según el modelo) completamente nueva para garantizar la operación continua durante el próximo año.\n\nLimpieza de sensores: Realicé una limpieza minuciosa de la unidad. Utilicé aire comprimido y una aspiradora de mano.',
    imageUrl: '/placeholder.svg',
    locationId: 'floor-1',
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
    description: 'Detector de humo instalado en pasillo principal.',
    imageUrl: '/placeholder.svg',
    locationId: 'floor-1',
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
    locationId: 'floor-2',
    categoryId: 'cat-extinguishers'
  }
];

// Mock de la estructura de ubicaciones con activos
// Esta es la estructura que vendría del backend
export const mockLocationWithAssets: LocationWithAssets = {
  id: 'building-1',
  name: 'P.H. Brisas de Miraflores',
  code: 'PP-001',
  type: 'building',
  children: [
    {
      id: 'floor-1',
      name: 'Piso 1',
      code: 'P1',
      type: 'floor',
      parentId: 'building-1',
      assetCategories: [
        {
          id: 'cat-smoke-detectors',
          name: 'Detectores de Humo',
          icon: 'shield',
          assets: [
            mockAssets[0],
            mockAssets[1]
          ]
        }
      ]
    },
    {
      id: 'floor-2',
      name: 'Piso 2',
      code: 'P2',
      type: 'floor',
      parentId: 'building-1',
      assetCategories: [
        {
          id: 'cat-extinguishers',
          name: 'Extintores',
          icon: 'flame',
          assets: [
            mockAssets[2]
          ]
        }
      ]
    },
    {
      id: 'floor-3',
      name: 'Piso 3',
      code: 'P3',
      type: 'floor',
      parentId: 'building-1',
      assetCategories: []
    },
    {
      id: 'floor-4',
      name: 'Piso 4',
      code: 'P4',
      type: 'floor',
      parentId: 'building-1',
      assetCategories: []
    },
    {
      id: 'floor-5',
      name: 'Piso 5',
      code: 'P5',
      type: 'floor',
      parentId: 'building-1',
      assetCategories: []
    }
  ]
};

// Función helper para obtener un activo por ID
export const getAssetById = (id: string): Asset | undefined => {
  return mockAssets.find(asset => asset.id === id);
};

// Función helper para obtener la ruta de ubicación de un activo
export const getAssetLocationPath = (assetId: string): string => {
  const asset = getAssetById(assetId);
  if (!asset) return '';
  
  // En una implementación real, esto vendría del backend
  // Por ahora construimos la ruta manualmente
  const paths: Record<string, string> = {
    'asset-001': '/Ph- Brisas de Miraflores/Torre-C/Piso 1/Apartamento 1A/DH/DH123456',
    'asset-002': '/Ph- Brisas de Miraflores/Torre-C/Piso 1/Apartamento 1B/DH/DH1236789',
    'asset-003': '/Ph- Brisas de Miraflores/Torre-C/Piso 2/Pasillo/EXT/EXT001'
  };
  
  return paths[assetId] || `/Ubicación/${asset.code}`;
};

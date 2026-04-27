// Catálogo de categorías predefinidas que el usuario puede elegir
// al crear una nueva subcategoría dentro de una ubicación.

export interface CategoryCatalogItem {
  id: string;        // identificador del catálogo (no del nodo creado)
  name: string;
  icon: string;      // nombre del icono lucide (lowercase)
  description?: string;
  group: 'Seguridad' | 'Mecánica' | 'Eléctrica' | 'Sanitaria' | 'Climatización' | 'Otros';
}

export const ASSET_CATEGORY_CATALOG: CategoryCatalogItem[] = [
  // Seguridad / Contra incendios
  { id: 'cat-fire-alarms', name: 'Alarmas Contra Incendios', icon: 'bell-ring', group: 'Seguridad', description: 'Sistema central de alarma de incendios.' },
  { id: 'cat-smoke-detectors', name: 'Detectores de Humo', icon: 'shield', group: 'Seguridad', description: 'Sensores de detección temprana de humo.' },
  { id: 'cat-fire-panels', name: 'Paneles ACI', icon: 'monitor', group: 'Seguridad', description: 'Paneles de alarma contra incendios.' },
  { id: 'cat-extinguishers', name: 'Extintores', icon: 'flame', group: 'Seguridad', description: 'Extintores portátiles.' },
  { id: 'cat-sprinklers', name: 'Rociadores', icon: 'droplets', group: 'Seguridad' },
  { id: 'cat-emergency-lights', name: 'Luces de Emergencia', icon: 'lightbulb', group: 'Seguridad' },
  { id: 'cat-cctv', name: 'Cámaras de Seguridad', icon: 'video', group: 'Seguridad' },
  { id: 'cat-access-control', name: 'Control de Acceso', icon: 'key-round', group: 'Seguridad' },

  // Mecánica
  { id: 'cat-elevators', name: 'Ascensores', icon: 'arrow-up-down', group: 'Mecánica' },
  { id: 'cat-pumps', name: 'Bombas', icon: 'gauge', group: 'Mecánica' },
  { id: 'cat-generators', name: 'Generadores', icon: 'zap', group: 'Mecánica' },

  // Eléctrica
  { id: 'cat-electrical-panels', name: 'Tableros Eléctricos', icon: 'plug-zap', group: 'Eléctrica' },
  { id: 'cat-transformers', name: 'Transformadores', icon: 'bolt', group: 'Eléctrica' },
  { id: 'cat-lighting', name: 'Iluminación', icon: 'lightbulb', group: 'Eléctrica' },

  // Climatización
  { id: 'cat-hvac', name: 'Aire Acondicionado', icon: 'wind', group: 'Climatización' },
  { id: 'cat-ventilation', name: 'Ventilación', icon: 'fan', group: 'Climatización' },

  // Sanitaria
  { id: 'cat-water-tanks', name: 'Tanques de Agua', icon: 'droplet', group: 'Sanitaria' },
  { id: 'cat-plumbing', name: 'Plomería', icon: 'pipette', group: 'Sanitaria' },

  // Otros
  { id: 'cat-custom', name: 'Personalizada', icon: 'shield', group: 'Otros', description: 'Crear una categoría con un nombre personalizado.' },
];

export const CATEGORY_GROUPS = ['Seguridad', 'Mecánica', 'Eléctrica', 'Climatización', 'Sanitaria', 'Otros'] as const;

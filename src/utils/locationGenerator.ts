import { BuildingConfig, Location } from '@/types/building';

export const generateLocations = (config: BuildingConfig): Location[] => {
  const locations: Location[] = [];
  
  // Create building root
  const building: Location = {
    id: 'building-1',
    name: config.name,
    type: 'building',
    children: []
  };

  // Generate towers
  for (let t = 1; t <= config.towerCount; t++) {
    const tower: Location = {
      id: `tower-${t}`,
      name: `${config.towerPrefix} ${t}`,
      type: 'tower',
      parentId: building.id,
      children: []
    };

    // Generate basements
    for (let b = config.basementCount; b >= 1; b--) {
      const basement: Location = {
        id: `tower-${t}-basement-${b}`,
        name: `Sótano ${b}`,
        type: 'basement',
        parentId: tower.id,
        children: []
      };
      tower.children!.push(basement);
    }

    // Generate floors
    for (let f = config.floorStart; f <= config.floorEnd; f++) {
      const floor: Location = {
        id: `tower-${t}-floor-${f}`,
        name: `Piso ${f}`,
        type: 'floor',
        parentId: tower.id,
        children: []
      };

      // Add common areas to floor
      const commonAreasList = [];
      if (config.commonAreas.electricRoom) {
        commonAreasList.push({
          id: `tower-${t}-floor-${f}-electric`,
          name: 'Cuarto Eléctrico',
          type: 'area' as const,
          parentId: floor.id
        });
      }
      if (config.commonAreas.trashRoom) {
        commonAreasList.push({
          id: `tower-${t}-floor-${f}-trash`,
          name: 'Cuarto de Basura',
          type: 'area' as const,
          parentId: floor.id
        });
      }
      if (config.commonAreas.waterRoom) {
        commonAreasList.push({
          id: `tower-${t}-floor-${f}-water`,
          name: 'Cuarto de Agua',
          type: 'area' as const,
          parentId: floor.id
        });
      }
      if (config.commonAreas.emergencyExit) {
        commonAreasList.push({
          id: `tower-${t}-floor-${f}-emergency`,
          name: 'Salida de Emergencia',
          type: 'area' as const,
          parentId: floor.id
        });
      }

      floor.children = commonAreasList;
      tower.children!.push(floor);
    }

    building.children!.push(tower);
  }

  locations.push(building);
  return locations;
};

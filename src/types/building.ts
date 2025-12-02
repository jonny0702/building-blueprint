export interface BuildingConfig {
  name: string;
  ruc?: string;
  towerCount: number;
  towerPrefix: string;
  floorStart: number;
  floorEnd: number;
  basementCount: number;
  commonAreas: {
    electricRoom: boolean;
    trashRoom: boolean;
    waterRoom: boolean;
    emergencyExit: boolean;
  };
}

export interface Location {
  id: string;
  name: string;
  type: 'building' | 'tower' | 'floor' | 'basement' | 'area';
  parentId?: string;
  children?: Location[];
}

export interface AssetTemplate {
  id: string;
  name: string;
  category: string;
  industry: 'residential' | 'commercial' | 'industrial';
  attributes: {
    [key: string]: string | number | boolean;
  };
}

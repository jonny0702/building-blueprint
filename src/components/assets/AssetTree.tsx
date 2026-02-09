import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronRight, MapPin, Shield, Settings, Plus, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LocationWithAssets, AssetCategory, Asset } from '@/types/asset';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AssetTreeProps {
  location: LocationWithAssets;
  searchTerm?: string;
}

export const AssetTree = ({ location, searchTerm = '' }: AssetTreeProps) => {
  const navigate = useNavigate();
  // Inicialmente expandimos el nodo raíz
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set([location.id]));

  const toggleNode = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleAddAsset = (locationId: string, categoryId?: string) => {
    navigate(`/activos/nuevo?locationId=${locationId}${categoryId ? `&categoryId=${categoryId}` : ''}`);
  };

  const handleAssetClick = (assetId: string) => {
    navigate(`/activos/${assetId}`);
  };

  // Función para filtrar por término de búsqueda
  const matchesSearch = (text: string): boolean => {
    if (!searchTerm) return true;
    return text.toLowerCase().includes(searchTerm.toLowerCase());
  };

  // Renderizar un activo individual
  const renderAsset = (asset: Asset, level: number) => {
    if (!matchesSearch(asset.name) && !matchesSearch(asset.code)) return null;

    return (
      <div
        key={asset.id}
        className="flex items-center gap-3 py-2.5 px-3 hover:bg-accent/50 rounded-md cursor-pointer group"
        style={{ marginLeft: `${level * 24}px` }}
        onClick={() => handleAssetClick(asset.id)}
      >
        <span className="w-5" /> {/* Spacer para alinear con los que tienen chevron */}
        <Settings className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm">{asset.code}</span>
      </div>
    );
  };

  // Renderizar una categoría de activos
  const renderCategory = (category: AssetCategory, locationId: string, level: number) => {
    const isExpanded = expandedNodes.has(category.id);
    const hasAssets = category.assets && category.assets.length > 0;

    // Filtrar activos que coinciden con la búsqueda
    const filteredAssets = category.assets.filter(
      asset => matchesSearch(asset.name) || matchesSearch(asset.code)
    );

    // Si hay búsqueda y no hay coincidencias, no mostrar la categoría
    if (searchTerm && filteredAssets.length === 0 && !matchesSearch(category.name)) {
      return null;
    }

    return (
      <div key={category.id}>
        <div
          className="flex items-center gap-2 py-2.5 px-3 hover:bg-accent/50 rounded-md group"
          style={{ marginLeft: `${level * 24}px` }}
        >
          <button
            onClick={(e) => toggleNode(category.id, e)}
            className="p-0.5 hover:bg-accent rounded"
          >
            {hasAssets ? (
              isExpanded ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )
            ) : (
              <span className="w-4" />
            )}
          </button>
          
          <Shield className="h-4 w-4 text-primary" />
          <span className="flex-1 font-medium text-sm">{category.name}</span>
          
          <Button
            variant="default"
            size="icon"
            className="h-7 w-7 opacity-0 group-hover:opacity-100 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              handleAddAsset(locationId, category.id);
            }}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {hasAssets && isExpanded && (
          <div>
            {filteredAssets.map(asset => renderAsset(asset, level + 1))}
          </div>
        )}
      </div>
    );
  };

  // Renderizar una ubicación
  const renderLocation = (loc: LocationWithAssets, level: number = 0) => {
    const isExpanded = expandedNodes.has(loc.id);
    const hasChildren = (loc.children && loc.children.length > 0) || 
                        (loc.assetCategories && loc.assetCategories.length > 0);

    // Verificar si hay coincidencias en hijos
    const hasMatchingContent = (): boolean => {
      if (matchesSearch(loc.name)) return true;
      if (loc.children?.some(child => matchesSearch(child.name))) return true;
      if (loc.assetCategories?.some(cat => 
        matchesSearch(cat.name) || 
        cat.assets.some(a => matchesSearch(a.name) || matchesSearch(a.code))
      )) return true;
      return false;
    };

    if (searchTerm && !hasMatchingContent()) return null;

    return (
      <div key={loc.id}>
        <div
          className="flex items-center gap-2 py-2.5 px-3 hover:bg-accent/50 rounded-md group"
          style={{ marginLeft: `${level * 24}px` }}
        >
          <button
            onClick={(e) => toggleNode(loc.id, e)}
            className="p-0.5 hover:bg-accent rounded"
          >
            {hasChildren ? (
              isExpanded ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )
            ) : (
              <span className="w-4" />
            )}
          </button>
          
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium text-sm">{loc.name}</span>
        </div>

        {isExpanded && (
          <div>
            {/* Renderizar categorías de activos */}
            {loc.assetCategories?.map(category => 
              renderCategory(category, loc.id, level + 1)
            )}
            {/* Renderizar ubicaciones hijas */}
            {loc.children?.map(child => renderLocation(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="border rounded-lg bg-card">
      {/* Header con información de ubicación */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
          <MapPin className="h-4 w-4" />
          <span>Locación</span>
        </div>
        <h2 className="text-lg font-semibold">{location.name}</h2>
        <p className="text-sm text-muted-foreground">{location.code}</p>
      </div>

      {/* Árbol de ubicaciones y activos */}
      <div className="p-4">
        {location.children?.map(child => renderLocation(child))}
      </div>
    </div>
  );
};

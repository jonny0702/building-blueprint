import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { LocationWithAssets } from '@/types/asset';
import { LocationNode } from './AssetTreeNode';

interface AssetTreeProps {
  tree: LocationWithAssets;
  searchTerm?: string;
  onAddLocation: (parentId: string) => void;
  onDeleteLocation: (locationId: string, parentId?: string) => void;
  onRenameLocation: (locationId: string, newName: string) => void;
  onAddCategory: (locationId: string) => void;
  onDeleteCategory: (categoryId: string, locationId: string) => void;
  onRenameCategory: (categoryId: string, locationId: string, newName: string) => void;
  onAddAsset: (locationId: string, categoryId: string) => void;
  onDeleteAsset: (assetId: string, categoryId: string, locationId: string) => void;
  onRenameAsset: (assetId: string, newName: string) => void;
}

export const AssetTree = ({
  tree,
  searchTerm = '',
  onAddLocation,
  onDeleteLocation,
  onRenameLocation,
  onAddCategory,
  onDeleteCategory,
  onRenameCategory,
  onAddAsset,
  onDeleteAsset,
  onRenameAsset,
}: AssetTreeProps) => {
  const navigate = useNavigate();
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set([tree.id]));

  const toggleNode = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedNodes(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const matchesSearch = useCallback((text: string): boolean => {
    if (!searchTerm) return true;
    return text.toLowerCase().includes(searchTerm.toLowerCase());
  }, [searchTerm]);

  const handleAssetClick = useCallback((assetId: string) => {
    navigate(`/activos/${assetId}`);
  }, [navigate]);

  return (
    <div className="border rounded-lg bg-card">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
          <MapPin className="h-4 w-4" />
          <span>Locación</span>
        </div>
        <h2 className="text-lg font-semibold">{tree.name}</h2>
        <p className="text-sm text-muted-foreground">{tree.code}</p>
      </div>

      <div className="p-4">
        {tree.children?.map(child => (
          <LocationNode
            key={child.id}
            location={child}
            level={0}
            expandedNodes={expandedNodes}
            onToggle={toggleNode}
            onAddLocation={onAddLocation}
            onAddCategory={onAddCategory}
            onDeleteLocation={onDeleteLocation}
            onRenameLocation={onRenameLocation}
            onAddAsset={onAddAsset}
            onDeleteCategory={onDeleteCategory}
            onRenameCategory={onRenameCategory}
            onAssetClick={handleAssetClick}
            onDeleteAsset={onDeleteAsset}
            onRenameAsset={onRenameAsset}
            matchesSearch={matchesSearch}
            searchTerm={searchTerm}
          />
        ))}
      </div>
    </div>
  );
};

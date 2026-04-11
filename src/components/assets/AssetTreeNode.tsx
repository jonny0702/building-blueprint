import { useState } from 'react';
import { ChevronDown, ChevronRight, MapPin, Shield, Settings, Plus, Trash2, Pencil, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LocationWithAssets, AssetCategory, Asset } from '@/types/asset';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AssetNodeProps {
  asset: Asset;
  level: number;
  onAssetClick: (id: string) => void;
  onDeleteAsset: (assetId: string, categoryId: string, locationId: string) => void;
  onRenameAsset: (assetId: string, newName: string) => void;
  locationId: string;
  categoryId: string;
  matchesSearch: (text: string) => boolean;
}

export const AssetNode = ({ asset, level, onAssetClick, onDeleteAsset, onRenameAsset, locationId, categoryId, matchesSearch }: AssetNodeProps) => {
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(asset.name);

  if (!matchesSearch(asset.name) && !matchesSearch(asset.code)) return null;

  const handleSave = () => {
    if (editName.trim()) {
      onRenameAsset(asset.id, editName.trim());
      setEditing(false);
    }
  };

  return (
    <div
      className="flex items-center gap-3 py-2.5 px-3 hover:bg-accent/50 rounded-md group"
      style={{ marginLeft: `${level * 24}px` }}
    >
      <span className="w-5" />
      <Settings className="h-4 w-4 text-muted-foreground shrink-0" />
      
      {editing ? (
        <div className="flex items-center gap-1 flex-1">
          <Input
            value={editName}
            onChange={e => setEditName(e.target.value)}
            className="h-7 text-sm"
            autoFocus
            onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setEditing(false); }}
          />
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleSave}><Check className="h-3 w-3" /></Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditing(false)}><X className="h-3 w-3" /></Button>
        </div>
      ) : (
        <>
          <span
            className="text-sm flex-1 cursor-pointer hover:underline"
            onClick={() => onAssetClick(asset.id)}
          >
            {asset.name}
          </span>
          <span className="text-xs text-muted-foreground">({asset.code})</span>
          <div className="opacity-0 group-hover:opacity-100 flex gap-0.5">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditName(asset.name); setEditing(true); }}>
              <Pencil className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => onDeleteAsset(asset.id, categoryId, locationId)}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

interface CategoryNodeProps {
  category: AssetCategory;
  locationId: string;
  level: number;
  expandedNodes: Set<string>;
  onToggle: (id: string, e: React.MouseEvent) => void;
  onAddAsset: (locationId: string, categoryId: string) => void;
  onDeleteCategory: (categoryId: string, locationId: string) => void;
  onRenameCategory: (categoryId: string, locationId: string, newName: string) => void;
  onAssetClick: (id: string) => void;
  onDeleteAsset: (assetId: string, categoryId: string, locationId: string) => void;
  onRenameAsset: (assetId: string, newName: string) => void;
  matchesSearch: (text: string) => boolean;
  searchTerm: string;
}

export const CategoryNode = ({
  category, locationId, level, expandedNodes, onToggle,
  onAddAsset, onDeleteCategory, onRenameCategory,
  onAssetClick, onDeleteAsset, onRenameAsset,
  matchesSearch, searchTerm
}: CategoryNodeProps) => {
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(category.name);

  const isExpanded = expandedNodes.has(category.id);
  const hasAssets = category.assets && category.assets.length > 0;
  const filteredAssets = category.assets.filter(a => matchesSearch(a.name) || matchesSearch(a.code));

  if (searchTerm && filteredAssets.length === 0 && !matchesSearch(category.name)) return null;

  const handleSave = () => {
    if (editName.trim()) {
      onRenameCategory(category.id, locationId, editName.trim());
      setEditing(false);
    }
  };

  return (
    <div>
      <div
        className="flex items-center gap-2 py-2.5 px-3 hover:bg-accent/50 rounded-md group"
        style={{ marginLeft: `${level * 24}px` }}
      >
        <button onClick={e => onToggle(category.id, e)} className="p-0.5 hover:bg-accent rounded">
          {hasAssets ? (
            isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />
          ) : <span className="w-4" />}
        </button>

        <Shield className="h-4 w-4 text-primary shrink-0" />

        {editing ? (
          <div className="flex items-center gap-1 flex-1">
            <Input value={editName} onChange={e => setEditName(e.target.value)} className="h-7 text-sm" autoFocus
              onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setEditing(false); }} />
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleSave}><Check className="h-3 w-3" /></Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditing(false)}><X className="h-3 w-3" /></Button>
          </div>
        ) : (
          <>
            <span className="flex-1 font-medium text-sm">{category.name}</span>
            <div className="opacity-0 group-hover:opacity-100 flex gap-0.5">
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditName(category.name); setEditing(true); }}>
                <Pencil className="h-3 w-3" />
              </Button>
              <Button variant="default" size="icon" className="h-7 w-7 rounded-full"
                onClick={e => { e.stopPropagation(); onAddAsset(locationId, category.id); }}>
                <Plus className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"
                onClick={() => onDeleteCategory(category.id, locationId)}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </>
        )}
      </div>

      {hasAssets && isExpanded && filteredAssets.map(asset => (
        <AssetNode
          key={asset.id}
          asset={asset}
          level={level + 1}
          onAssetClick={onAssetClick}
          onDeleteAsset={onDeleteAsset}
          onRenameAsset={onRenameAsset}
          locationId={locationId}
          categoryId={category.id}
          matchesSearch={matchesSearch}
        />
      ))}
    </div>
  );
};

interface LocationNodeProps {
  location: LocationWithAssets;
  level: number;
  expandedNodes: Set<string>;
  onToggle: (id: string, e: React.MouseEvent) => void;
  onAddLocation: (parentId: string) => void;
  onAddCategory: (locationId: string) => void;
  onDeleteLocation: (locationId: string, parentId?: string) => void;
  onRenameLocation: (locationId: string, newName: string) => void;
  onAddAsset: (locationId: string, categoryId: string) => void;
  onDeleteCategory: (categoryId: string, locationId: string) => void;
  onRenameCategory: (categoryId: string, locationId: string, newName: string) => void;
  onAssetClick: (id: string) => void;
  onDeleteAsset: (assetId: string, categoryId: string, locationId: string) => void;
  onRenameAsset: (assetId: string, newName: string) => void;
  matchesSearch: (text: string) => boolean;
  searchTerm: string;
}

export const LocationNode = ({
  location, level, expandedNodes, onToggle,
  onAddLocation, onAddCategory, onDeleteLocation, onRenameLocation,
  onAddAsset, onDeleteCategory, onRenameCategory,
  onAssetClick, onDeleteAsset, onRenameAsset,
  matchesSearch, searchTerm
}: LocationNodeProps) => {
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(location.name);

  const isExpanded = expandedNodes.has(location.id);
  const hasChildren = (location.children && location.children.length > 0) ||
    (location.assetCategories && location.assetCategories.length > 0);

  const hasMatchingContent = (): boolean => {
    if (matchesSearch(location.name)) return true;
    if (location.children?.some(c => matchesSearch(c.name))) return true;
    if (location.assetCategories?.some(cat =>
      matchesSearch(cat.name) || cat.assets.some(a => matchesSearch(a.name) || matchesSearch(a.code))
    )) return true;
    return false;
  };

  if (searchTerm && !hasMatchingContent()) return null;

  const handleSave = () => {
    if (editName.trim()) {
      onRenameLocation(location.id, editName.trim());
      setEditing(false);
    }
  };

  return (
    <div>
      <div
        className="flex items-center gap-2 py-2.5 px-3 hover:bg-accent/50 rounded-md group"
        style={{ marginLeft: `${level * 24}px` }}
      >
        <button onClick={e => onToggle(location.id, e)} className="p-0.5 hover:bg-accent rounded">
          {hasChildren ? (
            isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />
          ) : <span className="w-4" />}
        </button>

        <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />

        {editing ? (
          <div className="flex items-center gap-1 flex-1">
            <Input value={editName} onChange={e => setEditName(e.target.value)} className="h-7 text-sm" autoFocus
              onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setEditing(false); }} />
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleSave}><Check className="h-3 w-3" /></Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditing(false)}><X className="h-3 w-3" /></Button>
          </div>
        ) : (
          <>
            <span className="font-medium text-sm flex-1">{location.name}</span>
            <div className="opacity-0 group-hover:opacity-100 flex gap-0.5">
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditName(location.name); setEditing(true); }}>
                <Pencil className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" title="Agregar sub-ubicación"
                onClick={() => onAddLocation(location.id)}>
                <Plus className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" title="Agregar categoría"
                onClick={() => onAddCategory(location.id)}>
                <Shield className="h-3 w-3" />
              </Button>
              {level > 0 && (
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"
                  onClick={() => onDeleteLocation(location.id, location.parentId)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          </>
        )}
      </div>

      {isExpanded && (
        <div>
          {location.assetCategories?.map(category => (
            <CategoryNode
              key={category.id}
              category={category}
              locationId={location.id}
              level={level + 1}
              expandedNodes={expandedNodes}
              onToggle={onToggle}
              onAddAsset={onAddAsset}
              onDeleteCategory={onDeleteCategory}
              onRenameCategory={onRenameCategory}
              onAssetClick={onAssetClick}
              onDeleteAsset={onDeleteAsset}
              onRenameAsset={onRenameAsset}
              matchesSearch={matchesSearch}
              searchTerm={searchTerm}
            />
          ))}
          {location.children?.map(child => (
            <LocationNode
              key={child.id}
              location={child}
              level={level + 1}
              expandedNodes={expandedNodes}
              onToggle={onToggle}
              onAddLocation={onAddLocation}
              onAddCategory={onAddCategory}
              onDeleteLocation={onDeleteLocation}
              onRenameLocation={onRenameLocation}
              onAddAsset={onAddAsset}
              onDeleteCategory={onDeleteCategory}
              onRenameCategory={onRenameCategory}
              onAssetClick={onAssetClick}
              onDeleteAsset={onDeleteAsset}
              onRenameAsset={onRenameAsset}
              matchesSearch={matchesSearch}
              searchTerm={searchTerm}
            />
          ))}
        </div>
      )}
    </div>
  );
};

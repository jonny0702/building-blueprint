import { useState, useMemo, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Asset, LocationWithAssets } from '@/types/asset';
import { mockLocationWithAssets } from '@/data/mockAssets';
import { X } from 'lucide-react';

interface AssetLinkSelectorProps {
  selectedAssetIds: Set<string>;
  onSelectionChange: (ids: Set<string>) => void;
}

const getTowers = (root: LocationWithAssets): LocationWithAssets[] =>
  root.children?.filter((c) => c.type === 'tower') ?? [];

const getFloors = (tower: LocationWithAssets): LocationWithAssets[] =>
  tower.children?.filter((c) => c.type === 'floor') ?? [];

const getAssetsFromFloor = (floor: LocationWithAssets): Asset[] => {
  const assets: Asset[] = [];
  if (floor.assetCategories) {
    for (const cat of floor.assetCategories) {
      assets.push(...cat.assets);
    }
  }
  return assets;
};

export const AssetLinkSelector = ({ selectedAssetIds, onSelectionChange }: AssetLinkSelectorProps) => {
  const [selectedTowerId, setSelectedTowerId] = useState('');
  const [selectedFloorId, setSelectedFloorId] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadedAssets, setLoadedAssets] = useState<Asset[]>([]);

  const towers = useMemo(() => getTowers(mockLocationWithAssets), []);

  const floors = useMemo(() => {
    if (!selectedTowerId) return [];
    const tower = towers.find((t) => t.id === selectedTowerId);
    return tower ? getFloors(tower) : [];
  }, [selectedTowerId, towers]);

  // Simulate async fetch when floor changes
  useEffect(() => {
    if (!selectedFloorId || !selectedTowerId) {
      setLoadedAssets([]);
      return;
    }

    setLoading(true);
    setLoadedAssets([]);

    // Simulated API call — replace with React Query + real endpoint
    const timeout = setTimeout(() => {
      const tower = towers.find((t) => t.id === selectedTowerId);
      const floor = tower?.children?.find((f) => f.id === selectedFloorId);
      setLoadedAssets(floor ? getAssetsFromFloor(floor) : []);
      setLoading(false);
    }, 600);

    return () => clearTimeout(timeout);
  }, [selectedTowerId, selectedFloorId, towers]);

  const toggleAsset = (assetId: string) => {
    const next = new Set(selectedAssetIds);
    if (next.has(assetId)) next.delete(assetId);
    else next.add(assetId);
    onSelectionChange(next);
  };

  const removeAsset = (assetId: string) => {
    const next = new Set(selectedAssetIds);
    next.delete(assetId);
    onSelectionChange(next);
  };

  // Resolve all selected assets for chip display
  const allSelectedAssets = useMemo(() => {
    const all: Asset[] = [];
    for (const tower of towers) {
      for (const floor of getFloors(tower)) {
        for (const asset of getAssetsFromFloor(floor)) {
          if (selectedAssetIds.has(asset.id)) all.push(asset);
        }
      }
    }
    return all;
  }, [selectedAssetIds, towers]);

  return (
    <div className="border rounded-lg p-3 space-y-3 bg-muted/30">
      <div className="grid grid-cols-2 gap-3">
        {/* Torre */}
        <div>
          <Label className="text-xs">Torre</Label>
          <Select
            value={selectedTowerId}
            onValueChange={(v) => {
              setSelectedTowerId(v);
              setSelectedFloorId('');
            }}
          >
            <SelectTrigger><SelectValue placeholder="Seleccionar torre" /></SelectTrigger>
            <SelectContent>
              {towers.map((t) => (
                <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Piso */}
        <div>
          <Label className="text-xs">Piso</Label>
          <Select
            value={selectedFloorId}
            onValueChange={setSelectedFloorId}
            disabled={!selectedTowerId}
          >
            <SelectTrigger><SelectValue placeholder="Seleccionar piso" /></SelectTrigger>
            <SelectContent>
              {floors.map((f) => (
                <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Asset list with skeleton loading */}
      {selectedFloorId && (
        <div className="space-y-1">
          <Label className="text-xs">Activos disponibles</Label>
          {loading ? (
            <div className="space-y-2 border rounded-md p-2 bg-background">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2 py-1.5 px-2">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-14 ml-auto rounded-full" />
                </div>
              ))}
            </div>
          ) : loadedAssets.length === 0 ? (
            <p className="text-xs text-muted-foreground py-2">No hay activos en esta ubicación.</p>
          ) : (
            <div className="max-h-[140px] overflow-y-auto space-y-1 border rounded-md p-2 bg-background">
              {loadedAssets.map((asset) => (
                <label
                  key={asset.id}
                  className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-muted cursor-pointer text-sm"
                >
                  <Checkbox
                    checked={selectedAssetIds.has(asset.id)}
                    onCheckedChange={() => toggleAsset(asset.id)}
                  />
                  <span className="font-mono text-xs">{asset.code}</span>
                  <span className="text-muted-foreground text-xs">—</span>
                  <span className="text-xs truncate">{asset.name}</span>
                  <Badge variant="outline" className="ml-auto text-[10px] bg-green-100 text-green-700 border-green-200">
                    {asset.status === 'operative' ? 'Operativo' : asset.status}
                  </Badge>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Selected chips */}
      {allSelectedAssets.length > 0 && (
        <div>
          <Label className="text-xs">Activos seleccionados ({allSelectedAssets.length})</Label>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {allSelectedAssets.map((a) => (
              <Badge key={a.id} variant="secondary" className="gap-1 pr-1">
                {a.code}
                <button
                  type="button"
                  onClick={() => removeAsset(a.id)}
                  className="ml-0.5 rounded-full hover:bg-muted-foreground/20 p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

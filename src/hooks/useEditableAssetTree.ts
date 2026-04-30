import { useState, useCallback } from 'react';
import { LocationWithAssets, AssetCategory, Asset } from '@/types/asset';
import { useToast } from '@/hooks/use-toast';

// Deep clone helper
const cloneTree = (loc: LocationWithAssets): LocationWithAssets => JSON.parse(JSON.stringify(loc));

// Recursively find and mutate a location
const findLocation = (root: LocationWithAssets, id: string): LocationWithAssets | null => {
  if (root.id === id) return root;
  for (const child of root.children || []) {
    const found = findLocation(child, id);
    if (found) return found;
  }
  return null;
};

// Remove a child location from parent
const removeChildLocation = (root: LocationWithAssets, targetId: string): boolean => {
  if (root.children) {
    const idx = root.children.findIndex(c => c.id === targetId);
    if (idx !== -1) { root.children.splice(idx, 1); return true; }
    for (const child of root.children) {
      if (removeChildLocation(child, targetId)) return true;
    }
  }
  return false;
};

// Find asset across tree
const findAssetInTree = (root: LocationWithAssets, assetId: string): Asset | null => {
  for (const cat of root.assetCategories || []) {
    const asset = cat.assets.find(a => a.id === assetId);
    if (asset) return asset;
  }
  for (const child of root.children || []) {
    const found = findAssetInTree(child, assetId);
    if (found) return found;
  }
  return null;
};

let counter = 0;
const uid = (prefix: string) => `${prefix}-${Date.now()}-${++counter}`;

export const useEditableAssetTree = (initial: LocationWithAssets) => {
  const [tree, setTree] = useState<LocationWithAssets>(() => cloneTree(initial));
  const { toast } = useToast();

  const mutate = useCallback((fn: (draft: LocationWithAssets) => void) => {
    setTree(prev => {
      const draft = cloneTree(prev);
      fn(draft);
      return draft;
    });
  }, []);

  const addLocation = useCallback(
    (parentId: string, data?: { name?: string; type?: LocationWithAssets['type'] }) => {
      mutate(draft => {
        const parent = findLocation(draft, parentId);
        if (!parent) return;
        if (!parent.children) parent.children = [];
        const newLoc: LocationWithAssets = {
          id: uid('loc'),
          name: data?.name?.trim() || 'Nueva Ubicación',
          code: '',
          type: data?.type ?? 'area',
          parentId,
          children: [],
          assetCategories: [],
        };
        parent.children.push(newLoc);
      });
      toast({ title: 'Ubicación agregada', description: data?.name });
    },
    [mutate, toast]
  );

  const deleteLocation = useCallback((locationId: string) => {
    mutate(draft => { removeChildLocation(draft, locationId); });
    toast({ title: 'Ubicación eliminada', variant: 'destructive' });
  }, [mutate, toast]);

  const renameLocation = useCallback((locationId: string, newName: string) => {
    mutate(draft => {
      const loc = findLocation(draft, locationId);
      if (loc) loc.name = newName;
    });
  }, [mutate]);

  const addCategory = useCallback(
    (locationId: string, data?: { name?: string; icon?: string }) => {
      mutate(draft => {
        const loc = findLocation(draft, locationId);
        if (!loc) return;
        if (!loc.assetCategories) loc.assetCategories = [];
        loc.assetCategories.push({
          id: uid('cat'),
          name: data?.name?.trim() || 'Nueva Categoría',
          icon: data?.icon || 'shield',
          assets: [],
        });
      });
      toast({ title: 'Categoría agregada', description: data?.name });
    },
    [mutate, toast]
  );

  const deleteCategory = useCallback((categoryId: string, locationId: string) => {
    mutate(draft => {
      const loc = findLocation(draft, locationId);
      if (!loc || !loc.assetCategories) return;
      loc.assetCategories = loc.assetCategories.filter(c => c.id !== categoryId);
    });
    toast({ title: 'Categoría eliminada', variant: 'destructive' });
  }, [mutate, toast]);

  const renameCategory = useCallback((categoryId: string, locationId: string, newName: string) => {
    mutate(draft => {
      const loc = findLocation(draft, locationId);
      const cat = loc?.assetCategories?.find(c => c.id === categoryId);
      if (cat) cat.name = newName;
    });
  }, [mutate]);

  const addAsset = useCallback((locationId: string, categoryId: string) => {
    mutate(draft => {
      const loc = findLocation(draft, locationId);
      const cat = loc?.assetCategories?.find(c => c.id === categoryId);
      if (!cat) return;
      const newAsset: Asset = {
        id: uid('asset'),
        code: `EQ-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        name: 'Nuevo Activo',
        type: '',
        classification: '',
        manufacturer: '',
        model: '',
        serialNumber: '',
        year: new Date().getFullYear(),
        status: 'operative',
        supplier: '',
        maintenanceDate: '',
        description: '',
        locationId,
        categoryId,
      };
      cat.assets.push(newAsset);
    });
    toast({ title: 'Activo agregado' });
  }, [mutate, toast]);

  const deleteAsset = useCallback((assetId: string, categoryId: string, locationId: string) => {
    mutate(draft => {
      const loc = findLocation(draft, locationId);
      const cat = loc?.assetCategories?.find(c => c.id === categoryId);
      if (!cat) return;
      cat.assets = cat.assets.filter(a => a.id !== assetId);
    });
    toast({ title: 'Activo eliminado', variant: 'destructive' });
  }, [mutate, toast]);

  const renameAsset = useCallback((assetId: string, newName: string) => {
    mutate(draft => {
      const asset = findAssetInTree(draft, assetId);
      if (asset) asset.name = newName;
    });
  }, [mutate]);

  // ---- Lookup helpers (read-only) ----

  const getLocation = useCallback(
    (locationId: string) => findLocation(tree, locationId),
    [tree]
  );

  const getCategoryNamesIn = useCallback(
    (locationId: string): string[] => {
      const loc = findLocation(tree, locationId);
      return loc?.assetCategories?.map(c => c.name) ?? [];
    },
    [tree]
  );

  const getChildLocationNamesIn = useCallback(
    (locationId: string): string[] => {
      const loc = findLocation(tree, locationId);
      return loc?.children?.map(c => c.name) ?? [];
    },
    [tree]
  );

  const countLocationDescendants = useCallback(
    (locationId: string): number => {
      const loc = findLocation(tree, locationId);
      if (!loc) return 0;
      let count = 0;
      const walk = (node: typeof loc) => {
        for (const child of node.children || []) {
          count += 1;
          walk(child);
        }
        for (const cat of node.assetCategories || []) {
          count += 1 + cat.assets.length;
        }
      };
      walk(loc);
      return count;
    },
    [tree]
  );

  const countCategoryAssets = useCallback(
    (categoryId: string, locationId: string): number => {
      const loc = findLocation(tree, locationId);
      const cat = loc?.assetCategories?.find(c => c.id === categoryId);
      return cat?.assets.length ?? 0;
    },
    [tree]
  );

  const getAsset = useCallback(
    (assetId: string) => findAssetInTree(tree, assetId),
    [tree]
  );

  const getCategory = useCallback(
    (categoryId: string, locationId: string) => {
      const loc = findLocation(tree, locationId);
      return loc?.assetCategories?.find(c => c.id === categoryId) ?? null;
    },
    [tree]
  );

  return {
    tree,
    addLocation,
    deleteLocation,
    renameLocation,
    addCategory,
    deleteCategory,
    renameCategory,
    addAsset,
    deleteAsset,
    renameAsset,
    // helpers
    getLocation,
    getCategory,
    getAsset,
    getCategoryNamesIn,
    getChildLocationNamesIn,
    countLocationDescendants,
    countCategoryAssets,
  };
};

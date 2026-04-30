import { useState } from 'react';
import { Search } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { AssetTree } from '@/components/assets/AssetTree';
import { Input } from '@/components/ui/input';
import { mockLocationWithAssets } from '@/data/mockAssets';
import { useEditableAssetTree } from '@/hooks/useEditableAssetTree';
import { CategoryPickerModal, CategorySelection } from '@/components/assets/CategoryPickerModal';
import { DeleteConfirmModal, DeleteTargetKind } from '@/components/assets/DeleteConfirmModal';
import { LocationPickerModal, LocationSelection } from '@/components/assets/LocationPickerModal';

type DeleteTarget =
  | { kind: 'location'; id: string; name: string; childCount: number }
  | { kind: 'category'; id: string; locationId: string; name: string; childCount: number }
  | { kind: 'asset'; id: string; categoryId: string; locationId: string; name: string };

const Assets = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const {
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
    getLocation,
    getCategory,
    getAsset,
    getCategoryNamesIn,
    getChildLocationNamesIn,
    countLocationDescendants,
    countCategoryAssets,
  } = useEditableAssetTree(mockLocationWithAssets);

  // Modal state: agregar ubicación
  const [locationPicker, setLocationPicker] = useState<{ parentId: string } | null>(null);

  // Modal state: agregar categoría
  const [categoryPicker, setCategoryPicker] = useState<{ locationId: string } | null>(null);

  // Modal state: confirmar eliminación
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);

  // ----- Handlers de creación de categoría -----
  const handleOpenCategoryPicker = (locationId: string) => {
    setCategoryPicker({ locationId });
  };

  const handleConfirmCategory = (selection: CategorySelection) => {
    if (!categoryPicker) return;
    addCategory(categoryPicker.locationId, selection);
    setCategoryPicker(null);
  };

  // ----- Handlers de eliminación con confirmación -----
  const handleRequestDeleteLocation = (locationId: string) => {
    const loc = getLocation(locationId);
    if (!loc) return;
    setDeleteTarget({
      kind: 'location',
      id: locationId,
      name: loc.name,
      childCount: countLocationDescendants(locationId),
    });
  };

  const handleRequestDeleteCategory = (categoryId: string, locationId: string) => {
    const cat = getCategory(categoryId, locationId);
    if (!cat) return;
    setDeleteTarget({
      kind: 'category',
      id: categoryId,
      locationId,
      name: cat.name,
      childCount: countCategoryAssets(categoryId, locationId),
    });
  };

  const handleRequestDeleteAsset = (assetId: string, categoryId: string, locationId: string) => {
    const asset = getAsset(assetId);
    if (!asset) return;
    setDeleteTarget({
      kind: 'asset',
      id: assetId,
      categoryId,
      locationId,
      name: asset.name,
    });
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.kind === 'location') deleteLocation(deleteTarget.id);
    else if (deleteTarget.kind === 'category') deleteCategory(deleteTarget.id, deleteTarget.locationId);
    else deleteAsset(deleteTarget.id, deleteTarget.categoryId, deleteTarget.locationId);
    setDeleteTarget(null);
  };

  // ----- Handlers de creación de ubicación -----
  const handleOpenLocationPicker = (parentId: string) => {
    setLocationPicker({ parentId });
  };

  const handleConfirmLocation = (selection: LocationSelection) => {
    if (!locationPicker) return;
    addLocation(locationPicker.parentId, selection);
    setLocationPicker(null);
  };

  const pickerLocation = categoryPicker ? getLocation(categoryPicker.locationId) : null;
  const parentLocation = locationPicker ? getLocation(locationPicker.parentId) : null;

  return (
    <MainLayout title="Activos" organizationName="PH. Brisas de Miraflores">
      <div className="max-w-4xl">
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={`Buscar activos por nombre o código...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <AssetTree
          tree={tree}
          searchTerm={searchTerm}
          onAddLocation={handleOpenLocationPicker}
          onDeleteLocation={handleRequestDeleteLocation}
          onRenameLocation={renameLocation}
          onAddCategory={handleOpenCategoryPicker}
          onDeleteCategory={handleRequestDeleteCategory}
          onRenameCategory={renameCategory}
          onAddAsset={addAsset}
          onDeleteAsset={handleRequestDeleteAsset}
          onRenameAsset={renameAsset}
        />
      </div>

      <CategoryPickerModal
        open={!!categoryPicker}
        onClose={() => setCategoryPicker(null)}
        onConfirm={handleConfirmCategory}
        locationName={pickerLocation?.name}
        existingCategoryNames={
          categoryPicker ? getCategoryNamesIn(categoryPicker.locationId) : []
        }
      />

      <DeleteConfirmModal
        open={!!deleteTarget}
        kind={(deleteTarget?.kind ?? 'asset') as DeleteTargetKind}
        itemName={deleteTarget?.name ?? ''}
        childCount={
          deleteTarget && 'childCount' in deleteTarget ? deleteTarget.childCount : 0
        }
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />
    </MainLayout>
  );
};

export default Assets;

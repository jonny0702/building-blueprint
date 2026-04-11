import { useState } from 'react';
import { Search } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { AssetTree } from '@/components/assets/AssetTree';
import { Input } from '@/components/ui/input';
import { mockLocationWithAssets } from '@/data/mockAssets';
import { useEditableAssetTree } from '@/hooks/useEditableAssetTree';

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
  } = useEditableAssetTree(mockLocationWithAssets);

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
          onAddLocation={addLocation}
          onDeleteLocation={deleteLocation}
          onRenameLocation={renameLocation}
          onAddCategory={addCategory}
          onDeleteCategory={deleteCategory}
          onRenameCategory={renameCategory}
          onAddAsset={addAsset}
          onDeleteAsset={deleteAsset}
          onRenameAsset={renameAsset}
        />
      </div>
    </MainLayout>
  );
};

export default Assets;

import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit, Plus, Trash2 } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { getAssetById, getAssetLocationPath } from '@/data/mockAssets';
import { Asset, assetStatusLabels, assetStatusColors } from '@/types/asset';
import AssetGeneralView from '@/components/assets/AssetGeneralView';
import { toast } from 'sonner';

const AssetDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isEditing, setIsEditing] = useState(false);

  const asset = getAssetById(id || '');
  const locationPath = getAssetLocationPath(id || '');

  if (!asset) {
    return (
      <MainLayout title="Activos" organizationName="PH. Brisas de Miraflores">
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-muted-foreground">Activo no encontrado</p>
          <Button variant="link" onClick={() => navigate('/activos')}>
            Volver al listado
          </Button>
        </div>
      </MainLayout>
    );
  }

  const handleSave = (updatedAsset: Asset) => {
    // TODO: Guardar en backend
    console.log('Asset actualizado:', updatedAsset);
    setIsEditing(false);
    toast.success('Activo actualizado correctamente');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  return (
    <MainLayout title="Activos" organizationName="PH. Brisas de Miraflores">
      <div className="max-w-5xl">
        {/* Header con breadcrumb y acciones */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-primary"
                onClick={() => navigate('/activos')}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Volver al listado
              </Button>
              <span className="text-muted-foreground">|</span>
              <span className="text-sm text-primary">{locationPath}</span>
            </div>

            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-sm">Activo</span>
                  <Badge className={assetStatusColors[asset.status]}>
                    {assetStatusLabels[asset.status]}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={isEditing ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  {isEditing ? 'Editando...' : 'Editar'}
                </Button>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Crear Orden
                </Button>
                <Button variant="destructive" size="icon" className="h-9 w-9">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <h1 className="text-2xl font-bold mt-2">{asset.name}</h1>
            <p className="text-muted-foreground">{asset.code}</p>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="general">Vista General</TabsTrigger>
            <TabsTrigger value="history">Historial de Activo</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <AssetGeneralView
              asset={asset}
              isEditing={isEditing}
              onSave={handleSave}
              onCancel={handleCancelEdit}
            />
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Historial de Activo</h2>
                <p className="text-muted-foreground">
                  No hay registros de historial para este activo.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default AssetDetail;

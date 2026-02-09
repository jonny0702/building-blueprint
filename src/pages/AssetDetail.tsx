import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit, Plus, Trash2, Camera } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getAssetById, getAssetLocationPath } from '@/data/mockAssets';
import { assetStatusLabels, assetStatusColors } from '@/types/asset';

const AssetDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
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

  return (
    <MainLayout title="Activos" organizationName="PH. Brisas de Miraflores">
      <div className="max-w-5xl">
        {/* Header con breadcrumb y acciones */}
        <Card className="mb-6">
          <CardContent className="p-4">
            {/* Breadcrumb */}
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

            {/* Título y acciones */}
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
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
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
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-6">Vista General</h2>
                
                <div className="grid grid-cols-[200px_1fr] gap-8">
                  {/* Imagen del activo */}
                  <div className="relative">
                    <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                      <img 
                        src={asset.imageUrl || '/placeholder.svg'} 
                        alt={asset.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Button 
                      variant="secondary" 
                      size="icon" 
                      className="absolute bottom-2 right-2 rounded-full"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Campos del formulario */}
                  <div className="space-y-6">
                    {/* Fila 1: Nombre y Código */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Nombre</Label>
                        <Input value={asset.name} readOnly />
                      </div>
                      <div className="space-y-2">
                        <Label>Codigo</Label>
                        <Input value={asset.code} readOnly />
                      </div>
                    </div>

                    {/* Fila 2: Fabricante y Modelo */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Fabricante</Label>
                        <Input value={asset.manufacturer} readOnly />
                      </div>
                      <div className="space-y-2">
                        <Label>Modelo</Label>
                        <Input value={asset.model} readOnly />
                      </div>
                    </div>

                    {/* Fila 3: Número Serial y Año */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Número Serial</Label>
                        <Input value={asset.serialNumber} readOnly />
                      </div>
                      <div className="space-y-2">
                        <Label>Año</Label>
                        <Input value={asset.year.toString()} readOnly />
                      </div>
                    </div>

                    {/* Fila 4: Tipo, Clasificación y Estado */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Tipo</Label>
                        <Input value={asset.type} readOnly />
                      </div>
                      <div className="space-y-2">
                        <Label>Clasificación</Label>
                        <Input value={asset.classification} readOnly />
                      </div>
                      <div className="space-y-2">
                        <Label>Estado</Label>
                        <Select defaultValue={asset.status} disabled>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(assetStatusLabels).map(([value, label]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Fila 5: Proveedor y Fecha de Mantenimiento */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Proveedor</Label>
                        <Input value={asset.supplier} readOnly />
                      </div>
                      <div className="space-y-2">
                        <Label>Fecha de Mantenimiento</Label>
                        <Input type="date" value={asset.maintenanceDate} readOnly />
                      </div>
                    </div>

                    {/* Descripción */}
                    <div className="space-y-2">
                      <Label>Descripción</Label>
                      <Textarea 
                        value={asset.description} 
                        readOnly 
                        rows={6}
                        className="resize-none"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
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

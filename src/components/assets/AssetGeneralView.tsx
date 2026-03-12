import { useState } from 'react';
import { Camera, Save, X } from 'lucide-react';
import AssetImageUploadModal from './AssetImageUploadModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Asset, assetStatusLabels } from '@/types/asset';

interface AssetGeneralViewProps {
  asset: Asset;
  isEditing: boolean;
  onSave: (updatedAsset: Asset) => void;
  onCancel: () => void;
}

const AssetGeneralView = ({ asset, isEditing, onSave, onCancel }: AssetGeneralViewProps) => {
  const [formData, setFormData] = useState<Asset>(asset);
  const [imageModalOpen, setImageModalOpen] = useState(false);

  const handleChange = (field: keyof Asset, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  const handleCancel = () => {
    setFormData(asset);
    onCancel();
  };

  // Reset form data when asset changes or editing starts
  if (!isEditing && formData !== asset) {
    setFormData(asset);
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Vista General</h2>
          {isEditing && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleCancel}>
                <X className="h-4 w-4 mr-1" />
                Cancelar
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-1" />
                Guardar
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-[200px_1fr] gap-8">
          {/* Imagen del activo */}
          <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center overflow-hidden relative">
            <img
              src={formData.imageUrl || '/placeholder.svg'}
              alt={formData.name}
              className="w-full h-full object-cover"
            />
            {isEditing && (
              <Button
                variant="secondary"
                size="icon"
                className="absolute bottom-2 right-2 rounded-full"
                onClick={() => setImageModalOpen(true)}
              >
                <Camera className="h-4 w-4" />
              </Button>
            )}
          </div>

          <AssetImageUploadModal
            open={imageModalOpen}
            onOpenChange={setImageModalOpen}
            currentImage={formData.imageUrl}
            onImageSelect={(url) => handleChange('imageUrl', url)}
          </div>

          {/* Campos del formulario */}
          <div className="space-y-6">
            {/* Fila 1: Nombre y Código */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input
                  value={formData.name}
                  readOnly={!isEditing}
                  onChange={e => handleChange('name', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Codigo</Label>
                <Input
                  value={formData.code}
                  readOnly={!isEditing}
                  onChange={e => handleChange('code', e.target.value)}
                />
              </div>
            </div>

            {/* Fila 2: Fabricante y Modelo */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Fabricante</Label>
                <Input
                  value={formData.manufacturer}
                  readOnly={!isEditing}
                  onChange={e => handleChange('manufacturer', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Modelo</Label>
                <Input
                  value={formData.model}
                  readOnly={!isEditing}
                  onChange={e => handleChange('model', e.target.value)}
                />
              </div>
            </div>

            {/* Fila 3: Número Serial y Año */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Número Serial</Label>
                <Input
                  value={formData.serialNumber}
                  readOnly={!isEditing}
                  onChange={e => handleChange('serialNumber', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Año</Label>
                <Input
                  value={formData.year.toString()}
                  readOnly={!isEditing}
                  onChange={e => handleChange('year', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>

            {/* Fila 4: Tipo, Clasificación y Estado */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Input
                  value={formData.type}
                  readOnly={!isEditing}
                  onChange={e => handleChange('type', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Clasificación</Label>
                <Input
                  value={formData.classification}
                  readOnly={!isEditing}
                  onChange={e => handleChange('classification', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Estado</Label>
                <Select
                  value={formData.status}
                  disabled={!isEditing}
                  onValueChange={val => handleChange('status', val)}
                >
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
                <Input
                  value={formData.supplier}
                  readOnly={!isEditing}
                  onChange={e => handleChange('supplier', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Fecha de Mantenimiento</Label>
                <Input
                  type="date"
                  value={formData.maintenanceDate}
                  readOnly={!isEditing}
                  onChange={e => handleChange('maintenanceDate', e.target.value)}
                />
              </div>
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <Label>Descripción</Label>
              <Textarea
                value={formData.description}
                readOnly={!isEditing}
                rows={6}
                className="resize-none"
                onChange={e => handleChange('description', e.target.value)}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssetGeneralView;

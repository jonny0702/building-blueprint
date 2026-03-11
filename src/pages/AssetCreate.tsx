import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Camera } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
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
import { assetStatusLabels } from '@/types/asset';
import { useToast } from '@/hooks/use-toast';

const AssetCreate = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const locationId = searchParams.get('locationId');
  const categoryId = searchParams.get('categoryId');

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    manufacturer: '',
    model: '',
    serialNumber: '',
    year: new Date().getFullYear().toString(),
    type: '',
    classification: '',
    status: 'operative',
    supplier: '',
    maintenanceDate: '',
    description: ''
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Aquí iría la lógica para guardar el activo
    console.log('Guardando activo:', { ...formData, locationId, categoryId });
    
    toast({
      title: "Activo creado",
      description: "El activo se ha creado exitosamente.",
    });
    
    navigate('/activos');
  };

  return (
    <MainLayout title="Activos" organizationName="PH. Brisas de Miraflores">
      <div className="max-w-5xl">
        {/* Header con breadcrumb */}
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
              <span className="text-sm text-muted-foreground">
                Ubicación ID: {locationId || 'No especificada'}
              </span>
            </div>

            <h1 className="text-2xl font-bold">Crear Nuevo Activo</h1>
            <p className="text-muted-foreground">
              Complete la información del activo para agregarlo al sistema.
            </p>
          </CardContent>
        </Card>

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-6">Información del Activo</h2>
              
              <div>
                <div className="space-y-6">
                  {/* Fila 1: Nombre y Código */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre *</Label>
                      <Input 
                        id="name"
                        value={formData.name} 
                        onChange={(e) => handleChange('name', e.target.value)}
                        placeholder="Ej: Detector de Humo"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="code">Código *</Label>
                      <Input 
                        id="code"
                        value={formData.code} 
                        onChange={(e) => handleChange('code', e.target.value)}
                        placeholder="Ej: DH123456"
                        required
                      />
                    </div>
                  </div>

                  {/* Fila 2: Fabricante y Modelo */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="manufacturer">Fabricante</Label>
                      <Input 
                        id="manufacturer"
                        value={formData.manufacturer} 
                        onChange={(e) => handleChange('manufacturer', e.target.value)}
                        placeholder="Ej: FireStar"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="model">Modelo</Label>
                      <Input 
                        id="model"
                        value={formData.model} 
                        onChange={(e) => handleChange('model', e.target.value)}
                        placeholder="Ej: M2-356"
                      />
                    </div>
                  </div>

                  {/* Fila 3: Número Serial y Año */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="serialNumber">Número Serial</Label>
                      <Input 
                        id="serialNumber"
                        value={formData.serialNumber} 
                        onChange={(e) => handleChange('serialNumber', e.target.value)}
                        placeholder="Ej: 0409E2346790C81"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="year">Año</Label>
                      <Input 
                        id="year"
                        type="number"
                        value={formData.year} 
                        onChange={(e) => handleChange('year', e.target.value)}
                        placeholder="Ej: 2025"
                      />
                    </div>
                  </div>

                  {/* Fila 4: Tipo, Clasificación y Estado */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Tipo</Label>
                      <Input 
                        id="type"
                        value={formData.type} 
                        onChange={(e) => handleChange('type', e.target.value)}
                        placeholder="Ej: DH"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="classification">Clasificación</Label>
                      <Input 
                        id="classification"
                        value={formData.classification} 
                        onChange={(e) => handleChange('classification', e.target.value)}
                        placeholder="Ej: Detectores"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Estado</Label>
                      <Select 
                        value={formData.status} 
                        onValueChange={(value) => handleChange('status', value)}
                      >
                        <SelectTrigger id="status">
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
                      <Label htmlFor="supplier">Proveedor</Label>
                      <Input 
                        id="supplier"
                        value={formData.supplier} 
                        onChange={(e) => handleChange('supplier', e.target.value)}
                        placeholder="Ej: FireStrar"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maintenanceDate">Fecha de Mantenimiento</Label>
                      <Input 
                        id="maintenanceDate"
                        type="date" 
                        value={formData.maintenanceDate}
                        onChange={(e) => handleChange('maintenanceDate', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Descripción */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea 
                      id="description"
                      value={formData.description} 
                      onChange={(e) => handleChange('description', e.target.value)}
                      placeholder="Descripción detallada del activo..."
                      rows={6}
                      className="resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => navigate('/activos')}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  Crear Activo
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </MainLayout>
  );
};

export default AssetCreate;

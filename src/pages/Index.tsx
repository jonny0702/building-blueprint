import { useState } from 'react';
import { WizardLayout } from '@/components/wizard/WizardLayout';
import { BuildingInfoStep } from '@/components/wizard/BuildingInfoStep';
import { FloorsConfigStep } from '@/components/wizard/FloorsConfigStep';
import { AssetTemplatesStep } from '@/components/wizard/AssetTemplatesStep';
import { LocationTree } from '@/components/LocationTree';
import { BuildingConfig, Location, AssetTemplate } from '@/types/building';
import { generateLocations } from '@/utils/locationGenerator';
import { useToast } from '@/hooks/use-toast';

type WizardStep = 'building-info' | 'floors-config' | 'asset-templates' | 'review';

const Index = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<WizardStep>('building-info');
  const [buildingConfig, setBuildingConfig] = useState<Partial<BuildingConfig>>({});
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedTemplates, setSelectedTemplates] = useState<AssetTemplate[]>([]);

  const handleBuildingInfo = (data: Partial<BuildingConfig>) => {
    setBuildingConfig(prev => ({ ...prev, ...data }));
    setCurrentStep('floors-config');
  };

  const handleFloorsConfig = (data: Partial<BuildingConfig>) => {
    setBuildingConfig(prev => ({ ...prev, ...data }));
    setCurrentStep('asset-templates');
  };

  const handleAssetTemplates = (templates: AssetTemplate[]) => {
    setSelectedTemplates(templates);
    const fullConfig = { ...buildingConfig } as BuildingConfig;
    const generatedLocations = generateLocations(fullConfig);
    setLocations(generatedLocations);
    setCurrentStep('review');
    
    toast({
      title: '¡Estructura generada!',
      description: `Se crearon ${countLocations(generatedLocations)} ubicaciones automáticamente.`,
    });
  };

  const countLocations = (locs: Location[]): number => {
    let count = 0;
    const countRecursive = (loc: Location) => {
      count++;
      if (loc.children) {
        loc.children.forEach(countRecursive);
      }
    };
    locs.forEach(countRecursive);
    return count;
  };

  const handleSave = () => {
    toast({
      title: 'Configuración guardada',
      description: 'Tu edificio ha sido creado exitosamente.',
    });
    console.log('Building Config:', buildingConfig);
    console.log('Locations:', locations);
    console.log('Asset Templates:', selectedTemplates);
  };

  const handleAddLocation = (parentId: string) => {
    toast({
      title: 'Agregar ubicación',
      description: 'Funcionalidad en desarrollo',
    });
  };

  const handleDeleteLocation = (id: string) => {
    toast({
      title: 'Eliminar ubicación',
      description: 'Funcionalidad en desarrollo',
    });
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'building-info':
        return 'Información del PH';
      case 'floors-config':
        return 'Configuración de Pisos';
      case 'asset-templates':
        return 'Plantillas de Assets';
      case 'review':
        return 'Revisar y Confirmar';
      default:
        return '';
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 'building-info':
        return 'Escoge si tu negocio es de tipo PH o Proveedor';
      case 'floors-config':
        return 'Define la estructura de pisos y áreas comunes';
      case 'asset-templates':
        return 'Selecciona plantillas predefinidas para tus equipos';
      case 'review':
        return 'Revisa y edita la estructura generada antes de guardar';
      default:
        return '';
    }
  };

  if (currentStep === 'review') {
    return (
      <div className="min-h-screen bg-secondary p-8">
        <div className="max-w-6xl mx-auto">
          <LocationTree
            locations={locations}
            onAddLocation={handleAddLocation}
            onDeleteLocation={handleDeleteLocation}
            onSave={handleSave}
          />
        </div>
      </div>
    );
  }

  return (
    <WizardLayout title={getStepTitle()} description={getStepDescription()}>
      {currentStep === 'building-info' && (
        <BuildingInfoStep
          onNext={handleBuildingInfo}
          initialData={buildingConfig}
        />
      )}
      {currentStep === 'floors-config' && (
        <FloorsConfigStep
          onNext={handleFloorsConfig}
          onBack={() => setCurrentStep('building-info')}
          initialData={buildingConfig}
        />
      )}
      {currentStep === 'asset-templates' && (
        <AssetTemplatesStep
          onNext={handleAssetTemplates}
          onBack={() => setCurrentStep('floors-config')}
        />
      )}
    </WizardLayout>
  );
};

export default Index;

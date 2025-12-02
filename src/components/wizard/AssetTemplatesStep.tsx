import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { AssetTemplate } from '@/types/building';

interface AssetTemplatesStepProps {
  onNext: (templates: AssetTemplate[]) => void;
  onBack: () => void;
}

const MOCK_TEMPLATES: AssetTemplate[] = [
  {
    id: '1',
    name: 'Alarma de Incendios',
    category: 'Seguridad',
    industry: 'residential',
    attributes: {
      brand: 'Simplex',
      model: 'TrueAlert',
      certificacion: 'UL Listed',
    }
  },
  {
    id: '2',
    name: 'Filtro de Piscina',
    category: 'Piscina',
    industry: 'residential',
    attributes: {
      brand: 'Pentair',
      model: 'Clean & Clear',
      tipo: 'Cartucho',
    }
  },
  {
    id: '3',
    name: 'Bomba de Agua',
    category: 'Plomería',
    industry: 'residential',
    attributes: {
      brand: 'Grundfos',
      hp: 1.5,
      tipo: 'Centrífuga',
    }
  },
  {
    id: '4',
    name: 'Sistema HVAC',
    category: 'Climatización',
    industry: 'residential',
    attributes: {
      brand: 'Carrier',
      capacidad: '36000 BTU',
      tipo: 'Split',
    }
  },
  {
    id: '5',
    name: 'Generador Eléctrico',
    category: 'Energía',
    industry: 'residential',
    attributes: {
      brand: 'Cummins',
      potencia: '100 KW',
      combustible: 'Diesel',
    }
  },
  {
    id: '6',
    name: 'Ascensor',
    category: 'Transporte',
    industry: 'residential',
    attributes: {
      brand: 'Otis',
      capacidad: '8 personas',
      tipo: 'Eléctrico',
    }
  },
];

export const AssetTemplatesStep = ({ onNext, onBack }: AssetTemplatesStepProps) => {
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);

  const toggleTemplate = (id: string) => {
    setSelectedTemplates(prev => 
      prev.includes(id) 
        ? prev.filter(t => t !== id)
        : [...prev, id]
    );
  };

  const handleNext = () => {
    const selected = MOCK_TEMPLATES.filter(t => selectedTemplates.includes(t.id));
    onNext(selected);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Plantillas de Assets</h3>
        <p className="text-sm text-muted-foreground">
          Selecciona los tipos de equipos que deseas incluir en tu edificio. 
          Estas plantillas te ayudarán a crear assets más rápido.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_TEMPLATES.map((template) => (
          <Card
            key={template.id}
            className={`p-4 cursor-pointer transition-all hover:shadow-md ${
              selectedTemplates.includes(template.id)
                ? 'border-primary bg-primary/5'
                : 'border-border'
            }`}
            onClick={() => toggleTemplate(template.id)}
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold">{template.name}</h4>
              {selectedTemplates.includes(template.id) && (
                <Badge variant="default" className="bg-accent-green">
                  Seleccionado
                </Badge>
              )}
            </div>
            <Badge variant="secondary" className="mb-2">
              {template.category}
            </Badge>
            <div className="text-xs text-muted-foreground space-y-1 mt-2">
              {Object.entries(template.attributes).map(([key, value]) => (
                <div key={key}>
                  <span className="font-medium">{key}:</span> {value}
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>
          Atrás
        </Button>
        <Button onClick={handleNext} size="lg">
          Generar Estructura
        </Button>
      </div>
    </div>
  );
};

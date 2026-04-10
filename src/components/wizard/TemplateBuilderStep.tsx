import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { PackageData, SubcategoryConfig, DistributionRule } from '@/types/building';

const mockPackageData: PackageData = {
  packageId: 'cat-fire',
  packageName: 'Sistemas Contra Incendio',
  subcategories: [
    {
      subcategoryId: 'cat-fire-sensor',
      subcategoryName: 'Sensores de Humo y Calor',
      models: [
        { id: 'mod-01', brand: 'Firelite', model: 'FL-SD365' },
        { id: 'mod-02', brand: 'Edwards', model: 'IO1000' },
      ],
    },
    {
      subcategoryId: 'cat-fire-panel',
      subcategoryName: 'Paneles de Control',
      models: [
        { id: 'mod-03', brand: 'Firelite', model: 'FL-MS-9200UDLS' },
      ],
    },
  ],
};

const distributionLabels: Record<DistributionRule, string> = {
  PER_FLOOR: 'Por Piso',
  PER_TOWER: 'Por Torre',
  CUSTOM: 'Manual / Único',
};

const quantityLabels: Record<DistributionRule, string> = {
  PER_FLOOR: 'Cantidad por piso',
  PER_TOWER: 'Cantidad por torre',
  CUSTOM: 'Cantidad total',
};

interface TemplateBuilderStepProps {
  onNext: (output: TemplateBuilderOutput) => void;
  onBack: () => void;
}

export interface TemplateBuilderOutput {
  packageId: string;
  configurations: Array<{
    subcategoryId: string;
    modelCatalogId: string | null;
    distributionRule: DistributionRule;
    quantity: number;
  }>;
}

export const TemplateBuilderStep = ({ onNext, onBack }: TemplateBuilderStepProps) => {
  const [configs, setConfigs] = useState<Record<string, SubcategoryConfig>>({});

  const toggleSubcategory = (id: string, enabled: boolean) => {
    setConfigs((prev) => {
      if (!enabled) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return {
        ...prev,
        [id]: {
          subcategoryId: id,
          modelCatalogId: null,
          distributionRule: 'PER_FLOOR',
          quantity: 1,
        },
      };
    });
  };

  const updateConfig = (id: string, patch: Partial<SubcategoryConfig>) => {
    setConfigs((prev) => ({
      ...prev,
      [id]: { ...prev[id], ...patch },
    }));
  };

  const handleApply = () => {
    const output: TemplateBuilderOutput = {
      packageId: mockPackageData.packageId,
      configurations: Object.values(configs),
    };
    console.log(JSON.stringify(output, null, 2));
    onNext(output);
  };

  const hasConfigs = Object.keys(configs).length > 0;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">
          Constructor de Plantilla: {mockPackageData.packageName}
        </h3>
        <p className="text-sm text-muted-foreground">
          Configura las subcategorías que deseas incluir en tu edificio. Activa cada una y define el modelo, la regla de distribución y la cantidad.
        </p>
      </div>

      <Accordion type="multiple" className="w-full">
        {mockPackageData.subcategories.map((sub) => {
          const isEnabled = !!configs[sub.subcategoryId];
          const config = configs[sub.subcategoryId];

          return (
            <AccordionItem key={sub.subcategoryId} value={sub.subcategoryId}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3 w-full pr-2">
                  <Switch
                    checked={isEnabled}
                    onCheckedChange={(checked) =>
                      toggleSubcategory(sub.subcategoryId, checked)
                    }
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className="font-medium">{sub.subcategoryName}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {!isEnabled ? (
                  <p className="text-sm text-muted-foreground italic">
                    Activa el switch para configurar esta subcategoría.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    {/* A. Select Marca/Modelo */}
                    <div className="space-y-2">
                      <Label>Marca / Modelo</Label>
                      <Select
                        value={config.modelCatalogId ?? 'generic'}
                        onValueChange={(v) =>
                          updateConfig(sub.subcategoryId, {
                            modelCatalogId: v === 'generic' ? null : v,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar modelo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="generic">
                            Genérico / Lo desconozco
                          </SelectItem>
                          {sub.models.map((m) => (
                            <SelectItem key={m.id} value={m.id}>
                              {m.brand} — {m.model}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* B. Regla de distribución */}
                    <div className="space-y-2">
                      <Label>Regla de Distribución</Label>
                      <RadioGroup
                        value={config.distributionRule}
                        onValueChange={(v) =>
                          updateConfig(sub.subcategoryId, {
                            distributionRule: v as DistributionRule,
                          })
                        }
                        className="space-y-1 pt-1"
                      >
                        {(
                          Object.keys(distributionLabels) as DistributionRule[]
                        ).map((rule) => (
                          <div key={rule} className="flex items-center gap-2">
                            <RadioGroupItem value={rule} id={`${sub.subcategoryId}-${rule}`} />
                            <Label
                              htmlFor={`${sub.subcategoryId}-${rule}`}
                              className="font-normal cursor-pointer"
                            >
                              {distributionLabels[rule]}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    {/* C. Cantidad */}
                    <div className="space-y-2">
                      <Label>{quantityLabels[config.distributionRule]}</Label>
                      <Input
                        type="number"
                        min={1}
                        value={config.quantity}
                        onChange={(e) =>
                          updateConfig(sub.subcategoryId, {
                            quantity: Math.max(1, parseInt(e.target.value) || 1),
                          })
                        }
                      />
                    </div>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>
          Atrás
        </Button>
        <Button onClick={handleApply} size="lg" disabled={!hasConfigs}>
          Aplicar Plantilla
        </Button>
      </div>
    </div>
  );
};

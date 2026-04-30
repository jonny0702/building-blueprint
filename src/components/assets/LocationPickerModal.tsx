import { useEffect, useMemo, useState } from 'react';
import { Building2, Layers, Home, Warehouse, MapPin, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LocationWithAssets } from '@/types/asset';

export type LocationType = LocationWithAssets['type'];

export interface LocationSelection {
  name: string;
  type: LocationType;
}

interface TypeOption {
  type: LocationType;
  label: string;
  description: string;
  icon: React.ElementType;
  defaultName: string;
}

const ALL_TYPES: Record<LocationType, TypeOption> = {
  building: {
    type: 'building',
    label: 'Edificio',
    description: 'Estructura principal de la propiedad.',
    icon: Building2,
    defaultName: 'Nuevo Edificio',
  },
  tower: {
    type: 'tower',
    label: 'Torre',
    description: 'Bloque vertical dentro del edificio.',
    icon: Layers,
    defaultName: 'Torre',
  },
  floor: {
    type: 'floor',
    label: 'Piso',
    description: 'Nivel habitable de una torre.',
    icon: Home,
    defaultName: 'Piso',
  },
  basement: {
    type: 'basement',
    label: 'Sótano',
    description: 'Nivel subterráneo (parqueos, depósitos).',
    icon: Warehouse,
    defaultName: 'Sótano',
  },
  area: {
    type: 'area',
    label: 'Área común',
    description: 'Espacio funcional (cuarto de bombas, lobby, etc).',
    icon: MapPin,
    defaultName: 'Nueva Área',
  },
};

// Reglas jerárquicas: qué tipos puede contener cada tipo padre
const ALLOWED_CHILDREN: Record<LocationType, LocationType[]> = {
  building: ['tower', 'basement', 'floor', 'area'],
  tower: ['floor', 'area'],
  floor: ['area'],
  basement: ['area'],
  area: ['area'],
};

interface LocationPickerModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (selection: LocationSelection) => void;
  parentName?: string;
  parentType?: LocationType;
  existingNames?: string[];
}

export const LocationPickerModal = ({
  open,
  onClose,
  onConfirm,
  parentName,
  parentType = 'building',
  existingNames = [],
}: LocationPickerModalProps) => {
  const allowed = ALLOWED_CHILDREN[parentType] ?? ['area'];
  const options = useMemo(() => allowed.map(t => ALL_TYPES[t]), [parentType]);

  const [selectedType, setSelectedType] = useState<LocationType | null>(null);
  const [name, setName] = useState('');

  // Reset al abrir
  useEffect(() => {
    if (open) {
      const first = options[0]?.type ?? null;
      setSelectedType(first);
      setName(first ? ALL_TYPES[first].defaultName : '');
    }
  }, [open, parentType]);

  // Cuando cambia el tipo, sugerir nombre por defecto si el actual está vacío o coincide con otro default
  const handleSelectType = (t: LocationType) => {
    setSelectedType(t);
    const isDefault = Object.values(ALL_TYPES).some(o => o.defaultName === name.trim());
    if (!name.trim() || isDefault) {
      setName(ALL_TYPES[t].defaultName);
    }
  };

  const trimmed = name.trim();
  const isDuplicate = !!trimmed && existingNames
    .map(n => n.trim().toLowerCase())
    .includes(trimmed.toLowerCase());

  const canConfirm = !!selectedType && trimmed.length > 0 && !isDuplicate;

  const handleConfirm = () => {
    if (!canConfirm || !selectedType) return;
    onConfirm({ name: trimmed, type: selectedType });
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Agregar ubicación</DialogTitle>
          <DialogDescription>
            {parentName ? (
              <>Crea una nueva ubicación dentro de <span className="font-medium text-foreground">{parentName}</span>.</>
            ) : (
              'Crea una nueva ubicación.'
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Tipo de ubicación
          </label>
          <div className="grid grid-cols-2 gap-2">
            {options.map(opt => {
              const Icon = opt.icon;
              const active = selectedType === opt.type;
              return (
                <button
                  key={opt.type}
                  type="button"
                  onClick={() => handleSelectType(opt.type)}
                  className={cn(
                    'text-left rounded-md border p-3 transition-colors hover:bg-accent/50 relative',
                    active ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border'
                  )}
                >
                  <div className="flex items-start gap-2">
                    <Icon className={cn('h-4 w-4 mt-0.5 shrink-0', active ? 'text-primary' : 'text-muted-foreground')} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium leading-tight">{opt.label}</span>
                        {active && <Check className="h-4 w-4 text-primary shrink-0" />}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                        {opt.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Nombre
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Torre A, Piso 5, Cuarto de bombas"
            onKeyDown={(e) => { if (e.key === 'Enter' && canConfirm) handleConfirm(); }}
            autoFocus
          />
          {isDuplicate && (
            <p className="text-xs text-destructive">
              Ya existe una ubicación con ese nombre aquí.
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleConfirm} disabled={!canConfirm}>
            Agregar ubicación
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

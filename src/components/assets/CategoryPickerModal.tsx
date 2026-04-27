import { useMemo, useState } from 'react';
import { Search, Check } from 'lucide-react';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
  ASSET_CATEGORY_CATALOG,
  CATEGORY_GROUPS,
  CategoryCatalogItem,
} from '@/data/assetCategoryCatalog';

export interface CategorySelection {
  name: string;
  icon: string;
}

interface CategoryPickerModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (selection: CategorySelection) => void;
  locationName?: string;
  existingCategoryNames?: string[];
}

export const CategoryPickerModal = ({
  open,
  onClose,
  onConfirm,
  locationName,
  existingCategoryNames = [],
}: CategoryPickerModalProps) => {
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [customName, setCustomName] = useState('');

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return ASSET_CATEGORY_CATALOG;
    return ASSET_CATEGORY_CATALOG.filter(c =>
      c.name.toLowerCase().includes(term) || c.group.toLowerCase().includes(term)
    );
  }, [search]);

  const grouped = useMemo(() => {
    const map: Record<string, CategoryCatalogItem[]> = {};
    for (const g of CATEGORY_GROUPS) map[g] = [];
    for (const item of filtered) map[item.group].push(item);
    return map;
  }, [filtered]);

  const selected = ASSET_CATEGORY_CATALOG.find(c => c.id === selectedId) ?? null;
  const isCustom = selected?.id === 'cat-custom';

  const reset = () => {
    setSearch('');
    setSelectedId(null);
    setCustomName('');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleConfirm = () => {
    if (!selected) return;
    const finalName = isCustom ? customName.trim() : selected.name;
    if (!finalName) return;
    onConfirm({ name: finalName, icon: selected.icon });
    reset();
  };

  const isDuplicate =
    !!selected &&
    existingCategoryNames
      .map(n => n.trim().toLowerCase())
      .includes((isCustom ? customName : selected.name).trim().toLowerCase());

  const canConfirm = !!selected && (isCustom ? customName.trim().length > 0 : true) && !isDuplicate;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Agregar categoría de activos</DialogTitle>
          <DialogDescription>
            {locationName
              ? <>Selecciona qué tipo de categoría quieres agregar a <span className="font-medium text-foreground">{locationName}</span>.</>
              : 'Selecciona qué tipo de categoría quieres agregar.'}
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar categoría…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            autoFocus
          />
        </div>

        <ScrollArea className="h-[340px] pr-3 -mr-3">
          <div className="space-y-4">
            {CATEGORY_GROUPS.map(group => {
              const items = grouped[group];
              if (!items || items.length === 0) return null;
              return (
                <div key={group}>
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                    {group}
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {items.map(item => {
                      const active = selectedId === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSelectedId(item.id)}
                          className={cn(
                            'text-left rounded-md border p-3 transition-colors hover:bg-accent/50 relative',
                            active
                              ? 'border-primary bg-primary/5 ring-1 ring-primary'
                              : 'border-border'
                          )}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-sm font-medium leading-tight">{item.name}</span>
                            {active && <Check className="h-4 w-4 text-primary shrink-0" />}
                          </div>
                          {item.description && (
                            <p className="text-xs text-muted-foreground mt-1 leading-snug">
                              {item.description}
                            </p>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-6">
                Sin resultados. Prueba con otro término o usa “Personalizada”.
              </p>
            )}
          </div>
        </ScrollArea>

        {isCustom && (
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              Nombre de la categoría personalizada
            </label>
            <Input
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="Ej: Sistema de control de plagas"
              autoFocus
            />
          </div>
        )}

        {isDuplicate && (
          <p className="text-xs text-destructive">
            Ya existe una categoría con ese nombre en esta ubicación.
          </p>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleConfirm} disabled={!canConfirm}>
            Agregar categoría
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

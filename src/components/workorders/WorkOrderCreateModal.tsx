import { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  WorkOrder,
  WorkOrderStatus,
  WorkOrderPriority,
  WorkOrderTask,
  ActivityType,
  activityTypeLabels,
  workOrderPriorityLabels,
  workOrderStatusLabels,
  assetCategoryOptions,
} from '@/types/workOrder';
import { Asset, LocationWithAssets } from '@/types/asset';
import { mockLocationWithAssets } from '@/data/mockAssets';
import { CheckSquare, Settings, User, X } from 'lucide-react';

interface WorkOrderCreateModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (wo: Omit<WorkOrder, 'id' | 'code' | 'createdAt' | 'commentsCount' | 'attachmentsCount' | 'transitions'>) => void;
}

// Helper: get towers from the building tree
const getTowers = (root: LocationWithAssets): LocationWithAssets[] => {
  return root.children?.filter((c) => c.type === 'tower') ?? [];
};

// Helper: get floors from a tower
const getFloors = (tower: LocationWithAssets): LocationWithAssets[] => {
  return tower.children?.filter((c) => c.type === 'floor') ?? [];
};

// Helper: get all assets from a floor
const getAssetsFromFloor = (floor: LocationWithAssets): Asset[] => {
  const assets: Asset[] = [];
  if (floor.assetCategories) {
    for (const cat of floor.assetCategories) {
      assets.push(...cat.assets);
    }
  }
  return assets;
};

export const WorkOrderCreateModal = ({ open, onClose, onCreate }: WorkOrderCreateModalProps) => {
  const [status, setStatus] = useState<WorkOrderStatus>('todo');
  const [activityType, setActivityType] = useState<ActivityType>('task');
  const [priority, setPriority] = useState<WorkOrderPriority>('low');
  const [assignedTo, setAssignedTo] = useState('');
  const [assetCategory, setAssetCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  // Asset linking
  const [linkAssets, setLinkAssets] = useState(false);
  const [selectedTowerId, setSelectedTowerId] = useState('');
  const [selectedFloorId, setSelectedFloorId] = useState('');
  const [selectedAssetIds, setSelectedAssetIds] = useState<Set<string>>(new Set());

  const towers = useMemo(() => getTowers(mockLocationWithAssets), []);

  const floors = useMemo(() => {
    if (!selectedTowerId) return [];
    const tower = towers.find((t) => t.id === selectedTowerId);
    return tower ? getFloors(tower) : [];
  }, [selectedTowerId, towers]);

  const availableAssets = useMemo(() => {
    if (!selectedFloorId) return [];
    const tower = towers.find((t) => t.id === selectedTowerId);
    if (!tower) return [];
    const floor = tower.children?.find((f) => f.id === selectedFloorId);
    if (!floor) return [];
    return getAssetsFromFloor(floor);
  }, [selectedTowerId, selectedFloorId, towers]);

  const toggleAsset = (assetId: string) => {
    setSelectedAssetIds((prev) => {
      const next = new Set(prev);
      if (next.has(assetId)) next.delete(assetId);
      else next.add(assetId);
      return next;
    });
  };

  const removeAsset = (assetId: string) => {
    setSelectedAssetIds((prev) => {
      const next = new Set(prev);
      next.delete(assetId);
      return next;
    });
  };

  // Collect all selected assets across all filters for display
  const allSelectedAssets = useMemo(() => {
    const allAssets: Asset[] = [];
    for (const tower of towers) {
      for (const floor of getFloors(tower)) {
        for (const asset of getAssetsFromFloor(floor)) {
          if (selectedAssetIds.has(asset.id)) allAssets.push(asset);
        }
      }
    }
    return allAssets;
  }, [selectedAssetIds, towers]);

  const buildTasks = (): WorkOrderTask[] => {
    return allSelectedAssets.map((asset) => ({
      id: `task-${asset.id}-${Date.now()}`,
      assetCode: asset.code,
      assetId: asset.id,
      assetStatus: asset.status,
      description: title || 'Tarea pendiente',
      status: 'pending' as const,
    }));
  };

  const handleSubmit = () => {
    if (!title || !description || !assignedTo || !assetCategory || !dueDate) return;
    onCreate({
      title,
      description,
      status,
      priority,
      activityType,
      assetCategory,
      assignedTo,
      reporter: 'PH Brisas de Miraflores',
      location: '',
      dueDate,
      tasks: linkAssets ? buildTasks() : [],
    });
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setStatus('todo');
    setActivityType('task');
    setPriority('low');
    setAssignedTo('');
    setAssetCategory('');
    setTitle('');
    setDescription('');
    setDueDate('');
    setLinkAssets(false);
    setSelectedTowerId('');
    setSelectedFloorId('');
    setSelectedAssetIds(new Set());
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Orden de Trabajo</DialogTitle>
          <DialogDescription>Los campos obligatorios están marcados con un asterisco</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Estado */}
          <div>
            <Label>Estado</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as WorkOrderStatus)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {(Object.entries(workOrderStatusLabels) as [WorkOrderStatus, string][]).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tipo de actividad & Prioridad */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Tipo de actividad <span className="text-destructive">*</span></Label>
              <Select value={activityType} onValueChange={(v) => setActivityType(v as ActivityType)}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-primary" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {(Object.entries(activityTypeLabels) as [ActivityType, string][]).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Prioridad <span className="text-destructive">*</span></Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as WorkOrderPriority)}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4 text-muted-foreground" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {(Object.entries(workOrderPriorityLabels) as [WorkOrderPriority, string][]).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Persona & Tipo de activo */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Persona Asignada <span className="text-destructive">*</span></Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Nombre del técnico"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label>Tipo de activo <span className="text-destructive">*</span></Label>
              <Select value={assetCategory} onValueChange={setAssetCategory}>
                <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                <SelectContent>
                  {assetCategoryOptions.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Switch: Vincular assets individualmente */}
          <div className="flex items-center justify-between border rounded-lg p-3">
            <div>
              <Label className="text-sm font-medium">Vincular activos como subtareas</Label>
              <p className="text-xs text-muted-foreground">Selecciona activos específicos para esta orden</p>
            </div>
            <Switch checked={linkAssets} onCheckedChange={setLinkAssets} />
          </div>

          {/* Asset selector */}
          {linkAssets && (
            <div className="border rounded-lg p-3 space-y-3 bg-muted/30">
              <div className="grid grid-cols-2 gap-3">
                {/* Torre */}
                <div>
                  <Label className="text-xs">Torre</Label>
                  <Select
                    value={selectedTowerId}
                    onValueChange={(v) => {
                      setSelectedTowerId(v);
                      setSelectedFloorId('');
                    }}
                  >
                    <SelectTrigger><SelectValue placeholder="Seleccionar torre" /></SelectTrigger>
                    <SelectContent>
                      {towers.map((t) => (
                        <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* Piso */}
                <div>
                  <Label className="text-xs">Piso</Label>
                  <Select
                    value={selectedFloorId}
                    onValueChange={setSelectedFloorId}
                    disabled={!selectedTowerId}
                  >
                    <SelectTrigger><SelectValue placeholder="Seleccionar piso" /></SelectTrigger>
                    <SelectContent>
                      {floors.map((f) => (
                        <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Asset list */}
              {selectedFloorId && (
                <div className="space-y-1">
                  <Label className="text-xs">Activos disponibles</Label>
                  {availableAssets.length === 0 ? (
                    <p className="text-xs text-muted-foreground py-2">No hay activos en esta ubicación.</p>
                  ) : (
                    <div className="max-h-[140px] overflow-y-auto space-y-1 border rounded-md p-2 bg-background">
                      {availableAssets.map((asset) => (
                        <label
                          key={asset.id}
                          className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-muted cursor-pointer text-sm"
                        >
                          <Checkbox
                            checked={selectedAssetIds.has(asset.id)}
                            onCheckedChange={() => toggleAsset(asset.id)}
                          />
                          <span className="font-mono text-xs">{asset.code}</span>
                          <span className="text-muted-foreground text-xs">—</span>
                          <span className="text-xs truncate">{asset.name}</span>
                          <Badge variant="outline" className="ml-auto text-[10px] bg-green-100 text-green-700 border-green-200">
                            {asset.status === 'operative' ? 'Operativo' : asset.status}
                          </Badge>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Selected chips */}
              {allSelectedAssets.length > 0 && (
                <div>
                  <Label className="text-xs">Activos seleccionados ({allSelectedAssets.length})</Label>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {allSelectedAssets.map((a) => (
                      <Badge key={a.id} variant="secondary" className="gap-1 pr-1">
                        {a.code}
                        <button
                          type="button"
                          onClick={() => removeAsset(a.id)}
                          className="ml-0.5 rounded-full hover:bg-muted-foreground/20 p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Resumen */}
          <div>
            <Label>Resumen <span className="text-destructive">*</span></Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          {/* Descripción */}
          <div>
            <Label>Descripción <span className="text-destructive">*</span></Label>
            <Textarea
              className="min-h-[120px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Fecha */}
          <div className="w-1/2">
            <Label>Fecha de vencimiento <span className="text-destructive">*</span></Label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit}>Crear</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

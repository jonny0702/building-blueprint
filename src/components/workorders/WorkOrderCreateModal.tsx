import { useState } from 'react';
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
  ActivityType,
  activityTypeLabels,
  workOrderPriorityLabels,
  workOrderStatusLabels,
  assetCategoryOptions,
} from '@/types/workOrder';
import { CheckSquare, Settings, User } from 'lucide-react';

interface WorkOrderCreateModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (wo: Omit<WorkOrder, 'id' | 'code' | 'createdAt' | 'commentsCount' | 'attachmentsCount' | 'tasks' | 'transitions'>) => void;
}

export const WorkOrderCreateModal = ({ open, onClose, onCreate }: WorkOrderCreateModalProps) => {
  const [status, setStatus] = useState<WorkOrderStatus>('todo');
  const [activityType, setActivityType] = useState<ActivityType>('task');
  const [priority, setPriority] = useState<WorkOrderPriority>('low');
  const [assignedTo, setAssignedTo] = useState('');
  const [assetCategory, setAssetCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

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
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear tipo de orden de trabajo</DialogTitle>
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

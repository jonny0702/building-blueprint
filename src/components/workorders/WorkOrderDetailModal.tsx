import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  WorkOrder,
  WorkOrderStatus,
  workOrderStatusLabels,
  workOrderStatusColors,
  workOrderPriorityLabels,
  workOrderPriorityColors,
} from '@/types/workOrder';
import { Settings, Calendar, ChevronDown, User, MessageSquare, ArrowRight, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface WorkOrderDetailModalProps {
  workOrder: WorkOrder | null;
  open: boolean;
  onClose: () => void;
  onStatusChange: (woId: string, newStatus: WorkOrderStatus) => void;
  onTaskStatusChange?: (woId: string, taskId: string, newStatus: 'pending' | 'in_progress' | 'done') => void;
}

const taskStatusLabels: Record<string, string> = {
  pending: 'Pendiente',
  in_progress: 'Progreso',
  done: 'Listo',
};

const taskStatusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  in_progress: 'bg-blue-100 text-blue-700',
  done: 'bg-green-100 text-green-700',
};

const assetStatusLabels: Record<string, string> = {
  operative: 'Operativo',
  maintenance: 'En Mantenimiento',
  out_of_service: 'Fuera de Servicio',
  retired: 'Retirado',
};

export const WorkOrderDetailModal = ({
  workOrder,
  open,
  onClose,
  onStatusChange,
}: WorkOrderDetailModalProps) => {
  const [detailsOpen, setDetailsOpen] = useState(true);
  const [tasksOpen, setTasksOpen] = useState(true);
  const [historyOpen, setHistoryOpen] = useState(true);
  const navigate = useNavigate();

  if (!workOrder) return null;

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const handleTaskClick = (task: typeof workOrder.tasks[0]) => {
    if (task.assetId) {
      onClose();
      navigate(`/activos/${task.assetId}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-0">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <Settings className="w-3.5 h-3.5" />
            <span>{workOrder.code}</span>
          </div>
          <div className="flex items-start justify-between gap-4">
            <DialogTitle className="text-xl">{workOrder.title}</DialogTitle>
            <Select
              value={workOrder.status}
              onValueChange={(v) => onStatusChange(workOrder.id, v as WorkOrderStatus)}
            >
              <SelectTrigger className={`w-auto gap-2 text-white border-0 ${workOrderStatusColors[workOrder.status]} hover:opacity-90`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.entries(workOrderStatusLabels) as [WorkOrderStatus, string][]).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </DialogHeader>

        <div className="flex flex-col lg:flex-row gap-6 px-6 pb-6 pt-4">
          {/* Left: Details, Tasks & History */}
          <div className="flex-1 space-y-4">
            {/* Detalles clave */}
            <Collapsible open={detailsOpen} onOpenChange={setDetailsOpen}>
              <CollapsibleTrigger className="flex items-center gap-1 font-semibold text-sm hover:text-primary transition-colors">
                <ChevronDown className={`w-4 h-4 transition-transform ${detailsOpen ? '' : '-rotate-90'}`} />
                Detalles clave
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-2">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Descripción</p>
                  <p className="text-sm leading-relaxed">{workOrder.description}</p>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Tareas */}
            {workOrder.tasks.length > 0 && (
              <Collapsible open={tasksOpen} onOpenChange={setTasksOpen}>
                <CollapsibleTrigger className="flex items-center gap-1 font-semibold text-sm hover:text-primary transition-colors">
                  <ChevronDown className={`w-4 h-4 transition-transform ${tasksOpen ? '' : '-rotate-90'}`} />
                  Tareas ({workOrder.tasks.length})
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-2">
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs">Codigo de Activo</TableHead>
                          <TableHead className="text-xs">Estado - Activo</TableHead>
                          <TableHead className="text-xs">Descripción</TableHead>
                          <TableHead className="text-xs">Estado</TableHead>
                          <TableHead className="text-xs w-[40px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {workOrder.tasks.map((task) => (
                          <TableRow
                            key={task.id}
                            className={task.assetId ? 'cursor-pointer hover:bg-muted/50' : ''}
                            onClick={() => handleTaskClick(task)}
                          >
                            <TableCell className="text-xs font-medium">{task.assetCode}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-[10px] bg-green-100 text-green-700 border-green-200">
                                {assetStatusLabels[task.assetStatus]}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-xs">{task.description}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={`text-[10px] ${taskStatusColors[task.status]}`}>
                                {taskStatusLabels[task.status]}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {task.assetId && (
                                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}

            {/* Historial de cambios */}
            <Collapsible open={historyOpen} onOpenChange={setHistoryOpen}>
              <CollapsibleTrigger className="flex items-center gap-1 font-semibold text-sm hover:text-primary transition-colors">
                <ChevronDown className={`w-4 h-4 transition-transform ${historyOpen ? '' : '-rotate-90'}`} />
                <MessageSquare className="w-4 h-4 mr-1" />
                Historial de Comentarios ({workOrder.transitions.length})
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-2">
                {workOrder.transitions.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-4 text-center">No hay comentarios de transición aún.</p>
                ) : (
                  <div className="space-y-3">
                    {[...workOrder.transitions].reverse().map((t) => (
                      <div key={t.id} className="border rounded-lg p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                              <User className="w-3.5 h-3.5 text-primary" />
                            </div>
                            <span className="text-sm font-medium">{t.author}</span>
                          </div>
                          <span className="text-[10px] text-muted-foreground">{formatDate(t.timestamp)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <Badge variant="outline" className="text-[10px]">{workOrderStatusLabels[t.fromStatus]}</Badge>
                          <ArrowRight className="w-3 h-3 text-muted-foreground" />
                          <Badge variant="outline" className="text-[10px]">{workOrderStatusLabels[t.toStatus]}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{t.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Right sidebar */}
          <div className="w-full lg:w-[220px] space-y-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Persona Asignada</p>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="font-medium text-sm">{workOrder.assignedTo}</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Informador</p>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">
                  PH
                </div>
                <span className="font-medium text-sm">{workOrder.reporter}</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Tipo de Activo</p>
              <div className="border rounded-md px-3 py-2 text-sm">{workOrder.assetCategory}</div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Fecha de entrega</p>
              <div className="border rounded-md px-3 py-2 text-sm flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                {workOrder.dueDate}
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Prioridad</p>
              <Badge variant="outline" className={`${workOrderPriorityColors[workOrder.priority]}`}>
                <Settings className="w-3 h-3 mr-1" />
                {workOrderPriorityLabels[workOrder.priority]}
              </Badge>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

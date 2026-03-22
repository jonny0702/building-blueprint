import { WorkOrder, workOrderPriorityLabels, workOrderPriorityColors } from '@/types/workOrder';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Paperclip, Calendar } from 'lucide-react';

interface KanbanCardProps {
  workOrder: WorkOrder;
  onClick: (wo: WorkOrder) => void;
  onDragStart: (e: React.DragEvent, woId: string) => void;
}

const priorityDotColors: Record<string, string> = {
  critical: 'bg-red-500',
  high: 'bg-orange-500',
  medium: 'bg-yellow-500',
  low: 'bg-green-500',
};

export const KanbanCard = ({ workOrder, onClick, onDragStart }: KanbanCardProps) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, workOrder.id)}
      onClick={() => onClick(workOrder)}
      className="bg-card rounded-lg border p-4 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow space-y-3"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground font-medium">{workOrder.code}</span>
        <Badge variant="outline" className={`text-[10px] px-2 py-0.5 ${workOrderPriorityColors[workOrder.priority]}`}>
          <span className={`w-1.5 h-1.5 rounded-full mr-1 ${priorityDotColors[workOrder.priority]}`} />
          {workOrderPriorityLabels[workOrder.priority]}
        </Badge>
      </div>

      {/* Title */}
      <h4 className="font-semibold text-sm leading-tight">{workOrder.title}</h4>

      {/* Location */}
      <p className="text-[11px] text-muted-foreground line-clamp-1">
        Ubicación: {workOrder.location}
      </p>

      {/* Description */}
      <p className="text-xs text-muted-foreground line-clamp-3">{workOrder.description}</p>

      {/* Assigned & Date */}
      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
        <span>Asignado:</span>
        <div className="flex items-center gap-1">
          <span>{workOrder.assignedTo}</span>
          <span className={`w-2 h-2 rounded-full ${priorityDotColors.low}`} />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t text-[11px] text-muted-foreground">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          <span>{new Date(workOrder.dueDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <MessageSquare className="w-3 h-3" />
            <span>{workOrder.commentsCount} Comentarios</span>
          </div>
          <div className="flex items-center gap-1">
            <Paperclip className="w-3 h-3" />
            <span>{workOrder.attachmentsCount} Archivos</span>
          </div>
        </div>
      </div>
    </div>
  );
};

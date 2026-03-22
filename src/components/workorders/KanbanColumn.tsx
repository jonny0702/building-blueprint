import { WorkOrder, WorkOrderStatus, workOrderStatusLabels, workOrderStatusColors } from '@/types/workOrder';
import { KanbanCard } from './KanbanCard';
import { Plus, MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface KanbanColumnProps {
  status: WorkOrderStatus;
  workOrders: WorkOrder[];
  onCardClick: (wo: WorkOrder) => void;
  onDragStart: (e: React.DragEvent, woId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, status: WorkOrderStatus) => void;
  onAddClick?: () => void;
}

export const KanbanColumn = ({
  status,
  workOrders,
  onCardClick,
  onDragStart,
  onDragOver,
  onDrop,
  onAddClick,
}: KanbanColumnProps) => {
  return (
    <div
      className="flex flex-col min-w-[300px] w-full bg-secondary/50 rounded-xl"
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, status)}
    >
      {/* Column header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${workOrderStatusColors[status]}`} />
          <h3 className="font-semibold text-sm">{workOrderStatusLabels[status]}</h3>
          <Badge variant="secondary" className="text-xs rounded-full px-2 py-0 h-5 bg-primary text-primary-foreground">
            {workOrders.length}
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          {onAddClick && (
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onAddClick}>
              <Plus className="w-4 h-4" />
            </Button>
          )}
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Cards */}
      <ScrollArea className="flex-1 px-3 pb-3">
        <div className="space-y-3">
          {workOrders.map((wo) => (
            <KanbanCard
              key={wo.id}
              workOrder={wo}
              onClick={onCardClick}
              onDragStart={onDragStart}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

import { WorkOrder, WorkOrderStatus } from '@/types/workOrder';
import { KanbanColumn } from './KanbanColumn';

const columns: WorkOrderStatus[] = ['todo', 'in_progress', 'certification', 'done'];

interface KanbanBoardProps {
  workOrders: WorkOrder[];
  onCardClick: (wo: WorkOrder) => void;
  onStatusChange: (woId: string, newStatus: WorkOrderStatus) => void;
  onAddClick: () => void;
}

export const KanbanBoard = ({ workOrders, onCardClick, onStatusChange, onAddClick }: KanbanBoardProps) => {

  const handleDragStart = (e: React.DragEvent, woId: string) => {
    e.dataTransfer.setData('text/plain', woId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, status: WorkOrderStatus) => {
    e.preventDefault();
    const woId = e.dataTransfer.getData('text/plain');
    if (woId) {
      onStatusChange(woId, status);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 h-[calc(100vh-220px)]">
      {columns.map((status) => (
        <KanbanColumn
          key={status}
          status={status}
          workOrders={workOrders.filter((wo) => wo.status === status)}
          onCardClick={onCardClick}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onAddClick={status === 'todo' ? onAddClick : undefined}
        />
      ))}
    </div>
  );
};

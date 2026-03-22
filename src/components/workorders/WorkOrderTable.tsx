import {
  WorkOrder,
  workOrderStatusLabels,
  workOrderStatusColors,
  workOrderPriorityLabels,
  workOrderPriorityColors,
  activityTypeLabels,
  WorkOrderStatus,
} from '@/types/workOrder';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface WorkOrderTableProps {
  workOrders: WorkOrder[];
  onRowClick: (wo: WorkOrder) => void;
  onStatusChange: (woId: string, newStatus: WorkOrderStatus) => void;
}

export const WorkOrderTable = ({ workOrders, onRowClick, onStatusChange }: WorkOrderTableProps) => {
  return (
    <div className="border rounded-lg bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Título</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Prioridad</TableHead>
            <TableHead className="hidden md:table-cell">Tipo</TableHead>
            <TableHead className="hidden lg:table-cell">Asignado</TableHead>
            <TableHead className="hidden lg:table-cell">Fecha</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {workOrders.map((wo) => (
            <TableRow key={wo.id} className="cursor-pointer" onClick={() => onRowClick(wo)}>
              <TableCell className="font-medium text-xs">{wo.code}</TableCell>
              <TableCell className="text-sm max-w-[200px] truncate">{wo.title}</TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Select
                  value={wo.status}
                  onValueChange={(v) => onStatusChange(wo.id, v as WorkOrderStatus)}
                >
                  <SelectTrigger className={`h-7 text-[11px] w-auto gap-1 text-white border-0 ${workOrderStatusColors[wo.status]}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.entries(workOrderStatusLabels) as [WorkOrderStatus, string][]).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={`text-[10px] ${workOrderPriorityColors[wo.priority]}`}>
                  {workOrderPriorityLabels[wo.priority]}
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell text-xs">{activityTypeLabels[wo.activityType]}</TableCell>
              <TableCell className="hidden lg:table-cell text-xs">{wo.assignedTo}</TableCell>
              <TableCell className="hidden lg:table-cell text-xs">{wo.dueDate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

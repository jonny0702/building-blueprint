import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { KanbanBoard } from '@/components/workorders/KanbanBoard';
import { WorkOrderTable } from '@/components/workorders/WorkOrderTable';
import { WorkOrderCreateModal } from '@/components/workorders/WorkOrderCreateModal';
import { WorkOrderDetailModal } from '@/components/workorders/WorkOrderDetailModal';
import { WorkOrderCertificationModal } from '@/components/workorders/WorkOrderCertificationModal';
import { mockWorkOrders } from '@/data/mockWorkOrders';
import { WorkOrder, WorkOrderStatus } from '@/types/workOrder';
import { Button } from '@/components/ui/button';
import { Plus, LayoutGrid, List } from 'lucide-react';

const WorkOrders = () => {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(mockWorkOrders);
  const [view, setView] = useState<'kanban' | 'table'>('kanban');
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedWO, setSelectedWO] = useState<WorkOrder | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [pendingCertWoId, setPendingCertWoId] = useState<string | null>(null);

  const applyStatusChange = (woId: string, newStatus: WorkOrderStatus) => {
    setWorkOrders((prev) =>
      prev.map((wo) => (wo.id === woId ? { ...wo, status: newStatus } : wo))
    );
    if (selectedWO?.id === woId) {
      setSelectedWO((prev) => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const handleStatusChange = (woId: string, newStatus: WorkOrderStatus) => {
    if (newStatus === 'done') {
      setPendingCertWoId(woId);
      setCertModalOpen(true);
      return;
    }
    applyStatusChange(woId, newStatus);
  };

  const handleCertConfirm = (justification: string) => {
    if (pendingCertWoId) {
      applyStatusChange(pendingCertWoId, 'done');
      console.log('Certification justification:', justification);
    }
    setCertModalOpen(false);
    setPendingCertWoId(null);
  };

  const handleCreate = (data: Omit<WorkOrder, 'id' | 'code' | 'createdAt' | 'commentsCount' | 'attachmentsCount' | 'tasks'>) => {
    const newWO: WorkOrder = {
      ...data,
      id: `wo-${Date.now()}`,
      code: `OT#${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: new Date().toISOString().split('T')[0],
      commentsCount: 0,
      attachmentsCount: 0,
      tasks: [],
    };
    setWorkOrders((prev) => [newWO, ...prev]);
  };

  const handleCardClick = (wo: WorkOrder) => {
    setSelectedWO(wo);
    setDetailOpen(true);
  };

  return (
    <MainLayout title="Ordenes de Trabajo" organizationName="PH. Brisas de Miraflores">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Ordenes de Trabajo</h1>
          <p className="text-sm text-muted-foreground">Manten trazabilidad de tus mantenimientos!</p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex border rounded-lg overflow-hidden">
            <Button
              variant={view === 'kanban' ? 'default' : 'ghost'}
              size="sm"
              className="rounded-none"
              onClick={() => setView('kanban')}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              variant={view === 'table' ? 'default' : 'ghost'}
              size="sm"
              className="rounded-none"
              onClick={() => setView('table')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="w-4 h-4 mr-1" />
            Crear Orden
          </Button>
        </div>
      </div>

      {/* Content */}
      {view === 'kanban' ? (
        <KanbanBoard
          workOrders={workOrders}
          onCardClick={handleCardClick}
          onStatusChange={handleStatusChange}
          onAddClick={() => setCreateOpen(true)}
        />
      ) : (
        <WorkOrderTable
          workOrders={workOrders}
          onRowClick={handleCardClick}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Modals */}
      <WorkOrderCreateModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreate}
      />
      <WorkOrderDetailModal
        workOrder={selectedWO}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        onStatusChange={handleStatusChange}
      />
      <WorkOrderCertificationModal
        open={certModalOpen}
        workOrderTitle={workOrders.find((wo) => wo.id === pendingCertWoId)?.title}
        onClose={() => { setCertModalOpen(false); setPendingCertWoId(null); }}
        onConfirm={handleCertConfirm}
      />
    </MainLayout>
  );
};

export default WorkOrders;

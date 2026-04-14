import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { KanbanBoard } from '@/components/workorders/KanbanBoard';
import { WorkOrderTable } from '@/components/workorders/WorkOrderTable';
import { WorkOrderCreateModal } from '@/components/workorders/WorkOrderCreateModal';
import { WorkOrderDetailModal } from '@/components/workorders/WorkOrderDetailModal';
import { WorkOrderCertificationModal } from '@/components/workorders/WorkOrderCertificationModal';
import { StatusChangeCommentModal } from '@/components/workorders/StatusChangeCommentModal';
import { mockWorkOrders } from '@/data/mockWorkOrders';
import { WorkOrder, WorkOrderStatus, StatusTransition } from '@/types/workOrder';
import { currentUser } from '@/data/mockUsers';
import { Button } from '@/components/ui/button';
import { Plus, LayoutGrid, List } from 'lucide-react';
import { toast } from 'sonner';

const isPHUser = currentUser.role === 'PH_ADMIN' || currentUser.role === 'PH_ASSISTANT';

const WorkOrders = () => {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(mockWorkOrders);
  const [view, setView] = useState<'kanban' | 'table'>('kanban');
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedWO, setSelectedWO] = useState<WorkOrder | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [pendingCertWoId, setPendingCertWoId] = useState<string | null>(null);

  // Comment modal state
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [pendingTransition, setPendingTransition] = useState<{ woId: string; fromStatus: WorkOrderStatus; toStatus: WorkOrderStatus } | null>(null);

  const addTransition = (woId: string, fromStatus: WorkOrderStatus, toStatus: WorkOrderStatus, comment: string) => {
    const transition: StatusTransition = {
      id: `tr-${Date.now()}`,
      workOrderId: woId,
      fromStatus,
      toStatus,
      comment,
      author: `${currentUser.firstName} ${currentUser.lastName}`,
      authorRole: currentUser.role,
      timestamp: new Date().toISOString(),
    };
    setWorkOrders((prev) =>
      prev.map((wo) =>
        wo.id === woId
          ? { ...wo, status: toStatus, transitions: [...wo.transitions, transition] }
          : wo
      )
    );
    if (selectedWO?.id === woId) {
      setSelectedWO((prev) =>
        prev ? { ...prev, status: toStatus, transitions: [...prev.transitions, transition] } : null
      );
    }
  };

  const handleStatusChange = (woId: string, newStatus: WorkOrderStatus) => {
    const wo = workOrders.find((w) => w.id === woId);
    if (!wo) return;

    // Only PH users can set to done
    if (newStatus === 'done' && !isPHUser) {
      toast.error('Solo los usuarios de PH pueden marcar una orden como completada.');
      return;
    }

    // If going to done, show certification modal first
    if (newStatus === 'done') {
      setPendingCertWoId(woId);
      setPendingTransition({ woId, fromStatus: wo.status, toStatus: newStatus });
      setCertModalOpen(true);
      return;
    }

    // For all other transitions, show comment modal
    setPendingTransition({ woId, fromStatus: wo.status, toStatus: newStatus });
    setCommentModalOpen(true);
  };

  const handleCommentConfirm = (comment: string) => {
    if (pendingTransition) {
      addTransition(pendingTransition.woId, pendingTransition.fromStatus, pendingTransition.toStatus, comment);
    }
    setCommentModalOpen(false);
    setPendingTransition(null);
  };

  const handleCertConfirm = (justification: string) => {
    if (pendingCertWoId && pendingTransition) {
      addTransition(pendingTransition.woId, pendingTransition.fromStatus, 'done', justification);
    }
    setCertModalOpen(false);
    setPendingCertWoId(null);
    setPendingTransition(null);
  };

  const handleCreate = (data: Omit<WorkOrder, 'id' | 'code' | 'createdAt' | 'commentsCount' | 'attachmentsCount' | 'transitions'>) => {
    const newWO: WorkOrder = {
      ...data,
      id: `wo-${Date.now()}`,
      code: `OT#${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: new Date().toISOString().split('T')[0],
      commentsCount: 0,
      attachmentsCount: 0,
      transitions: [],
    };
    setWorkOrders((prev) => [newWO, ...prev]);
  };

  const handleTaskStatusChange = (woId: string, taskId: string, newStatus: 'pending' | 'in_progress' | 'done') => {
    setWorkOrders((prev) =>
      prev.map((wo) =>
        wo.id === woId
          ? { ...wo, tasks: wo.tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)) }
          : wo
      )
    );
    if (selectedWO?.id === woId) {
      setSelectedWO((prev) =>
        prev ? { ...prev, tasks: prev.tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)) } : null
      );
    }
  };

  const handleCardClick = (wo: WorkOrder) => {
    setSelectedWO(wo);
    setDetailOpen(true);
  };

  return (
    <MainLayout title="Ordenes de Trabajo" organizationName="PH. Brisas de Miraflores">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Ordenes de Trabajo</h1>
          <p className="text-sm text-muted-foreground">Manten trazabilidad de tus mantenimientos!</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex border rounded-lg overflow-hidden">
            <Button variant={view === 'kanban' ? 'default' : 'ghost'} size="sm" className="rounded-none" onClick={() => setView('kanban')}>
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button variant={view === 'table' ? 'default' : 'ghost'} size="sm" className="rounded-none" onClick={() => setView('table')}>
              <List className="w-4 h-4" />
            </Button>
          </div>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="w-4 h-4 mr-1" />
            Crear Orden
          </Button>
        </div>
      </div>

      {view === 'kanban' ? (
        <KanbanBoard workOrders={workOrders} onCardClick={handleCardClick} onStatusChange={handleStatusChange} onAddClick={() => setCreateOpen(true)} />
      ) : (
        <WorkOrderTable workOrders={workOrders} onRowClick={handleCardClick} onStatusChange={handleStatusChange} />
      )}

      <WorkOrderCreateModal open={createOpen} onClose={() => setCreateOpen(false)} onCreate={handleCreate} />
      <WorkOrderDetailModal workOrder={selectedWO} open={detailOpen} onClose={() => setDetailOpen(false)} onStatusChange={handleStatusChange} />
      <WorkOrderCertificationModal
        open={certModalOpen}
        workOrderTitle={workOrders.find((wo) => wo.id === pendingCertWoId)?.title}
        onClose={() => { setCertModalOpen(false); setPendingCertWoId(null); setPendingTransition(null); }}
        onConfirm={handleCertConfirm}
      />
      {pendingTransition && !certModalOpen && (
        <StatusChangeCommentModal
          open={commentModalOpen}
          fromStatus={pendingTransition.fromStatus}
          toStatus={pendingTransition.toStatus}
          onClose={() => { setCommentModalOpen(false); setPendingTransition(null); }}
          onConfirm={handleCommentConfirm}
        />
      )}
    </MainLayout>
  );
};

export default WorkOrders;

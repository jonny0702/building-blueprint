import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AssetHistoryDetail } from '@/types/assetHistory';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AssetHistoryDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  detail: AssetHistoryDetail | null;
}

const actionLabels: Record<string, string> = {
  CREATED: 'Creación',
  UPDATED: 'Actualización',
  STATUS_CHANGE: 'Cambio de Estado',
  DELETED: 'Eliminación',
};

const actionColors: Record<string, string> = {
  CREATED: 'bg-green-100 text-green-800 border-green-200',
  UPDATED: 'bg-blue-100 text-blue-800 border-blue-200',
  STATUS_CHANGE: 'bg-amber-100 text-amber-800 border-amber-200',
  DELETED: 'bg-red-100 text-red-800 border-red-200',
};

const sourceLabels: Record<string, string> = {
  INITIAL_REGISTRATION: 'Registro Inicial',
  MANUAL_EDIT: 'Edición Manual',
  WORK_ORDER: 'Orden de Trabajo',
  SYSTEM: 'Sistema',
};

const AssetHistoryDetailModal = ({ open, onOpenChange, detail }: AssetHistoryDetailModalProps) => {
  if (!detail) return null;

  let snapshot: Record<string, unknown> = {};
  try {
    snapshot = JSON.parse(detail.assetSnapshot);
  } catch {
    snapshot = {};
  }

  const snapshotLabels: Record<string, string> = {
    id: 'ID',
    name: 'Nombre',
    code: 'Código',
    manufacturer: 'Fabricante',
    model: 'Modelo',
    status: 'Estado',
    serialNumber: 'Número Serial',
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Detalle del Cambio</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Info general */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-muted-foreground">Acción</p>
              <Badge variant="outline" className={actionColors[detail.action]}>
                {actionLabels[detail.action] || detail.action}
              </Badge>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Origen</p>
              <p className="text-sm font-medium">{sourceLabels[detail.changeSource] || detail.changeSource}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Código de Activo</p>
              <p className="text-sm font-medium">{detail.assetCode}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Estado</p>
              <p className="text-sm font-medium">{detail.status}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Fecha</p>
              <p className="text-sm font-medium">{new Date(detail.changeDate).toLocaleString('es-CO')}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Usuario</p>
              <p className="text-sm font-medium">{detail.userName}</p>
            </div>
          </div>

          {/* Detalle / descripción */}
          <div>
            <p className="text-xs text-muted-foreground mb-1">Descripción</p>
            <p className="text-sm bg-muted rounded-md p-3">{detail.details}</p>
          </div>

          <Separator />

          {/* Snapshot del activo */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">Snapshot del Activo al momento del cambio</p>
            <ScrollArea className="max-h-48">
              <div className="bg-muted rounded-md p-3 space-y-1">
                {Object.entries(snapshot).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{snapshotLabels[key] || key}</span>
                    <span className="font-medium">{String(value)}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssetHistoryDetailModal;

import { AlertTriangle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export type DeleteTargetKind = 'location' | 'category' | 'asset';

const KIND_LABEL: Record<DeleteTargetKind, string> = {
  location: 'ubicación',
  category: 'categoría',
  asset: 'activo',
};

interface DeleteConfirmModalProps {
  open: boolean;
  kind: DeleteTargetKind;
  itemName: string;
  childCount?: number; // nº de elementos hijos que también se eliminarán
  onCancel: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal = ({
  open,
  kind,
  itemName,
  childCount = 0,
  onCancel,
  onConfirm,
}: DeleteConfirmModalProps) => {
  const label = KIND_LABEL[kind];

  return (
    <AlertDialog open={open} onOpenChange={(o) => !o && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Eliminar {label}
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-2">
              <p>
                ¿Seguro que quieres eliminar la {label}{' '}
                <span className="font-semibold text-foreground">“{itemName}”</span>?
              </p>
              {childCount > 0 && (
                <p className="text-destructive">
                  Esta acción también eliminará <strong>{childCount}</strong>{' '}
                  elemento{childCount === 1 ? '' : 's'} contenido{childCount === 1 ? '' : 's'}.
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Esta acción no se puede deshacer.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

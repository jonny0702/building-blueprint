import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { WorkOrderStatus, workOrderStatusLabels } from '@/types/workOrder';
import { ArrowRight } from 'lucide-react';

interface StatusChangeCommentModalProps {
  open: boolean;
  fromStatus: WorkOrderStatus;
  toStatus: WorkOrderStatus;
  onClose: () => void;
  onConfirm: (comment: string) => void;
}

export const StatusChangeCommentModal = ({
  open,
  fromStatus,
  toStatus,
  onClose,
  onConfirm,
}: StatusChangeCommentModalProps) => {
  const [comment, setComment] = useState('');

  const handleConfirm = () => {
    onConfirm(comment);
    setComment('');
  };

  const handleClose = () => {
    setComment('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Cambio de Estado</DialogTitle>
          <DialogDescription>
            Agrega un comentario para justificar el cambio de estado.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-center gap-3 py-3">
          <span className="text-sm font-medium px-3 py-1 rounded-md bg-muted">
            {workOrderStatusLabels[fromStatus]}
          </span>
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium px-3 py-1 rounded-md bg-primary text-primary-foreground">
            {workOrderStatusLabels[toStatus]}
          </span>
        </div>

        <Textarea
          placeholder="Escribe un comentario sobre este cambio de estado..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
        />

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={!comment.trim()}>
            Confirmar Cambio
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

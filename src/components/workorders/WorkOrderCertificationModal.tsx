import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ShieldCheck } from 'lucide-react';

interface WorkOrderCertificationModalProps {
  open: boolean;
  workOrderTitle?: string;
  onClose: () => void;
  onConfirm: (justification: string) => void;
}

export const WorkOrderCertificationModal = ({
  open,
  workOrderTitle,
  onClose,
  onConfirm,
}: WorkOrderCertificationModalProps) => {
  const [justification, setJustification] = useState('');

  const handleConfirm = () => {
    if (justification.trim()) {
      onConfirm(justification.trim());
      setJustification('');
    }
  };

  const handleClose = () => {
    setJustification('');
    onClose();
  };

  return (
    <AlertDialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <AlertDialogContent className="sm:max-w-[480px]">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <AlertDialogTitle>Certificar Orden de Trabajo</AlertDialogTitle>
              <AlertDialogDescription className="mt-1">
                Estás a punto de marcar como completada la orden{' '}
                <span className="font-semibold text-foreground">{workOrderTitle}</span>.
                Por favor, proporciona una justificación.
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        <div className="space-y-2 py-2">
          <Label htmlFor="justification">Justificación de certificación *</Label>
          <Textarea
            id="justification"
            placeholder="Describa el motivo de la certificación y validación de esta orden..."
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
            rows={4}
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleClose}>Cancelar</AlertDialogCancel>
          <Button onClick={handleConfirm} disabled={!justification.trim()}>
            <ShieldCheck className="w-4 h-4 mr-1" />
            Certificar y Completar
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

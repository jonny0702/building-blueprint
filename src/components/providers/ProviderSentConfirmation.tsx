import { Button } from '@/components/ui/button';
import { ArrowLeft, Send } from 'lucide-react';

interface ProviderSentConfirmationProps {
  onBack: () => void;
  message?: string;
}

export const ProviderSentConfirmation = ({ onBack, message }: ProviderSentConfirmationProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-secondary px-4">
      <h1 className="text-2xl font-bold text-foreground mb-2">Fixly</h1>
      <p className="text-muted-foreground mb-8 text-center">
        Primer Sistema de Gestión de Mantenimiento de PHs
      </p>

      <div className="bg-card rounded-xl shadow-md p-8 max-w-md w-full text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
          <Send className="h-7 w-7 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Correo Enviado!</h2>
        <p className="text-muted-foreground text-sm">
          {message ?? 'Se ha enviado el correo de enlace exitosamente'}
        </p>
        <Button onClick={onBack} className="w-full" size="lg">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al Inicio
        </Button>
      </div>

      <p className="mt-8 text-xs text-muted-foreground">
        © 2025 Fixly. Todos los derechos reservados.
      </p>
    </div>
  );
};

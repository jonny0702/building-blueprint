import { ReactNode } from 'react';

interface WizardLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
}

export const WizardLayout = ({ title, description, children }: WizardLayoutProps) => {
  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Sales/Info */}
      <div className="hidden lg:flex lg:w-1/3 bg-primary p-12 flex-col justify-center text-white">
        <div className="space-y-6">
          <h1 className="text-4xl font-bold leading-tight">
            Gestión Inteligente de Propiedades
          </h1>
          <p className="text-lg text-primary-foreground/90">
            Crea tu estructura de ubicaciones en minutos. 
            Nuestro asistente genera automáticamente todo el árbol de tu edificio.
          </p>
          <ul className="space-y-4 text-primary-foreground/80">
            <li className="flex items-start gap-3">
              <span className="text-2xl">🏢</span>
              <span>Múltiples torres y pisos</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">⚡</span>
              <span>Áreas comunes automáticas</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">📊</span>
              <span>Plantillas de assets por industria</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 bg-secondary p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">{title}</h2>
            <p className="text-muted-foreground">{description}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

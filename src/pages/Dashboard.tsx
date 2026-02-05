import { useNavigate } from 'react-router-dom';
import { Home, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MainLayout } from '@/components/layout/MainLayout';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <MainLayout title="Dashboard" organizationName="PH Vista Mar">
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <Card className="max-w-md w-full shadow-lg">
          <CardContent className="pt-8 pb-8 px-8 text-center space-y-6">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="w-16 h-16 border-2 border-primary/30 rounded-2xl flex items-center justify-center">
                <Home className="h-8 w-8 text-primary" />
              </div>
            </div>

            {/* Title and Description */}
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">
                ¡Bienvenido a PH Vista Mar!
              </h2>
              <p className="text-muted-foreground text-sm">
                Para comenzar a gestionar su edificio, primero necesitamos configurar la estructura del PH.
              </p>
            </div>

            {/* CTA Button */}
            <Button
              size="lg"
              className="w-full gap-2"
              onClick={() => navigate('/wizard')}
            >
              ¡Comienza a gestionar tu edificio aquí!
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Dashboard;

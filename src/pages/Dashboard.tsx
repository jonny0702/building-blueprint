import { useNavigate } from 'react-router-dom';
import { ArrowRight, FileText, Settings, FileBarChart, Heart, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MainLayout } from '@/components/layout/MainLayout';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

// Mock data
const statsCards = [
  {
    title: 'Órdenes de trabajo abiertas',
    value: '41',
    icon: FileText,
    footer: { type: 'trend' as const, value: '+20.0%', label: 'Esta semana' },
  },
  {
    title: 'Mantenimientos Pendientes',
    value: '2',
    icon: Settings,
    footer: { type: 'link' as const, label: 'ver detalle' },
  },
  {
    title: 'Informes nuevos',
    value: '5',
    icon: FileBarChart,
    footer: { type: 'link' as const, label: 'ver detalle' },
  },
  {
    title: 'Salud de activos',
    value: '95%',
    icon: Heart,
    valueColor: 'text-[hsl(var(--accent-green))]',
    footer: { type: 'trend' as const, value: '+5.0%', label: 'Saludable' },
  },
];

const orderStatusData = [
  { name: 'Completas', value: 60, color: 'hsl(var(--accent-green))' },
  { name: 'En proceso', value: 35, color: 'hsl(var(--accent-orange))' },
  { name: 'Retrasadas', value: 5, color: 'hsl(var(--accent-red))' },
];

const upcomingMaintenance = [
  { day: '17', month: 'Jan', title: 'Mantenimiento de bomba de agua', location: 'Area social - piscina', time: '10:00 Am - 1:00 Pm' },
  { day: '20', month: 'Jan', title: 'Mantenimiento de Alarmas Incendio', location: 'Apartamentos - torre A', time: '10:00 Am - 5:00 Pm' },
  { day: '30', month: 'May', title: 'Mantenimiento de Extintor', location: 'Pasillos - torre B', time: '10:00 Am - 1:00 Pm' },
  { day: '30', month: 'Ago', title: 'Prueba de Hermeticidad', location: 'Apartamentos - PH', time: '10:00 Am - 1:00 Pm' },
];

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <MainLayout title="Dashboard" organizationName="PH Brisas de Miraflores">
      <div className="space-y-6">
        {/* Welcome Header */}
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Buen dia, Jonathan Vergara</h2>
              <p className="text-muted-foreground mt-1">Te comparto el resumen operativo</p>
            </div>
            <Button size="lg" className="gap-2" onClick={() => navigate('/ordenes/nueva')}>
              Crear una orden de trabajo
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-5 flex flex-col justify-between h-full">
                <div className="flex items-start justify-between mb-4">
                  <p className="text-sm font-semibold text-foreground leading-tight max-w-[70%]">{stat.title}</p>
                  <stat.icon className="h-5 w-5 text-primary shrink-0" />
                </div>
                <p className={`text-3xl font-bold ${stat.valueColor || 'text-foreground'}`}>{stat.value}</p>
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  {stat.footer.type === 'trend' && (
                    <>
                      <TrendingUp className="h-4 w-4 text-[hsl(var(--accent-green))]" />
                      <span className="text-[hsl(var(--accent-green))] font-medium">{stat.footer.value}</span>
                      <span>{stat.footer.label}</span>
                    </>
                  )}
                  {stat.footer.type === 'link' && (
                    <button className="text-primary font-medium flex items-center gap-1 hover:underline">
                      {stat.footer.label} <ArrowRight className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Donut Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Estado de ordenes</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center gap-8">
              <div className="relative w-52 h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={orderStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      dataKey="value"
                      startAngle={90}
                      endAngle={-270}
                      strokeWidth={0}
                    >
                      {orderStatusData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-[hsl(var(--accent-green))]">85%</span>
                  <span className="text-xs text-muted-foreground text-center leading-tight">Efectividad de<br/>cumplimiento</span>
                </div>
              </div>
              <div className="space-y-3">
                {orderStatusData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2 text-sm">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-foreground">{item.name} {item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Maintenance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Proximos Mantenimientos</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {upcomingMaintenance.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 px-6 py-3">
                    <div className="w-12 h-12 rounded-lg border border-border flex flex-col items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-foreground leading-none">{item.day}</span>
                      <span className="text-xs text-muted-foreground">{item.month}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.location}</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{item.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;

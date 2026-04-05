import { 
  LayoutDashboard, 
  Tags, 
  ClipboardList, 
  History, 
  FileText, 
  Users, 
  Building, 
  Settings,
  LucideIcon
} from 'lucide-react';

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const navigationConfig: NavGroup[] = [
  {
    label: 'Main Menu',
    items: [
      { title: 'Dashboard', url: '/', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Gestión',
    items: [
      { title: 'Activos', url: '/activos', icon: Tags },
      { title: 'Ordenes de Trabajo', url: '/ordenes', icon: ClipboardList },
      { title: 'Historial', url: '/historial', icon: History },
    ],
  },
  {
    label: 'Documentación',
    items: [
      { title: 'Informes', url: '/informes', icon: FileText },
    ],
  },
  {
    label: 'Sistema',
    items: [
      { title: 'Usuarios', url: '/usuarios', icon: Users },
      { title: 'Permisos - Roles', url: '/permisos', icon: Shield },
      { title: 'Configuración', url: '/configuracion', icon: Settings },
    ],
  },
];

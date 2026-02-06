import { NavLink, useLocation } from 'react-router-dom';
import { Building2, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { navigationConfig } from '@/config/navigation';
import { Button } from '@/components/ui/button';

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export const AppSidebar = ({ collapsed, onToggle }: AppSidebarProps) => {
  const location = useLocation();

  return (
    <aside
      className={cn(
        'h-full bg-card border-r border-border flex flex-col transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo and Toggle */}
      <div className={cn(
        'h-16 flex items-center border-b border-border px-4',
        collapsed ? 'justify-center' : 'justify-between'
      )}>
        <div className={cn('flex items-center', collapsed ? '' : 'gap-3')}>
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <Building2 className="h-5 w-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="font-bold text-lg text-foreground">Fixly</span>
          )}
        </div>
        {!collapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="text-muted-foreground hover:text-foreground"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
      </div>
      
      {/* Collapsed toggle button */}
      {collapsed && (
        <div className="flex justify-center py-3 border-b border-border">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="text-muted-foreground hover:text-foreground"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {navigationConfig.map((group) => (
          <div key={group.label} className="mb-4">
            {!collapsed && (
              <p className="px-4 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {group.label}
              </p>
            )}
            <ul className="space-y-1 px-2">
              {group.items.map((item) => {
                const isActive = location.pathname === item.url;
                const Icon = item.icon;

                return (
                  <li key={item.title}>
                    <NavLink
                      to={item.url}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
                        collapsed && 'justify-center px-2'
                      )}
                      title={collapsed ? item.title : undefined}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
};

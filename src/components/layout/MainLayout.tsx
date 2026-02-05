import { useState, ReactNode } from 'react';
import { AppSidebar } from './AppSidebar';
import { TopMenuBar } from './TopMenuBar';

interface MainLayoutProps {
  children: ReactNode;
  title: string;
  organizationName?: string;
}

export const MainLayout = ({ children, title, organizationName }: MainLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  return (
    <div className="min-h-screen flex w-full bg-secondary">
      {/* Sidebar */}
      <AppSidebar collapsed={sidebarCollapsed} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Menu Bar */}
        <TopMenuBar
          title={title}
          organizationName={organizationName}
          onToggleSidebar={toggleSidebar}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

import { Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface TopMenuBarProps {
  title: string;
  organizationName?: string;
  onToggleSidebar: () => void;
}

export const TopMenuBar = ({ title, organizationName = 'PH Vista Mar', onToggleSidebar }: TopMenuBarProps) => {
  const navigate = useNavigate();

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="text-muted-foreground hover:text-foreground"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground hidden sm:block">
          {organizationName}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={() => navigate('/profile')}
        >
          <Avatar className="h-9 w-9">
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-sm">
              CM
            </AvatarFallback>
          </Avatar>
        </Button>
      </div>
    </header>
  );
};

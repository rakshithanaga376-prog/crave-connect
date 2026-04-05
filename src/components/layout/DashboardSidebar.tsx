import { NavLink as RouterNavLink, useLocation } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarLinkProps {
  to: string;
  icon: LucideIcon;
  label: string;
}

export function DashboardSidebar({ links, title }: { links: SidebarLinkProps[]; title: string }) {
  const location = useLocation();

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-border/50 bg-card/30 min-h-[calc(100vh-4rem)]">
      <div className="p-6">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{title}</h2>
      </div>
      <nav className="flex-1 px-3 space-y-1">
        {links.map(link => {
          const isActive = location.pathname === link.to;
          return (
            <RouterNavLink
              key={link.to}
              to={link.to}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all',
                isActive
                  ? 'bg-primary/10 text-primary neon-glow-green font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              <link.icon className="w-5 h-5" />
              {link.label}
            </RouterNavLink>
          );
        })}
      </nav>
    </aside>
  );
}

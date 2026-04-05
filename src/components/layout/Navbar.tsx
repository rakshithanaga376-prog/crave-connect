import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, User, LogOut, ChevronDown, UtensilsCrossed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

const roleLabels = {
  customer: 'Customer',
  restaurant: 'Restaurant Owner',
  delivery: 'Delivery Partner',
  admin: 'Admin',
};

const roleColors = {
  customer: 'bg-neon-green/20 text-neon-green',
  restaurant: 'bg-neon-orange/20 text-neon-orange',
  delivery: 'bg-neon-cyan/20 text-neon-cyan',
  admin: 'bg-neon-purple/20 text-neon-purple',
};

export function Navbar() {
  const { user, logout, switchRole, isAuthenticated } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  if (!isAuthenticated) return null;

  const dashboardPath = user?.role === 'customer' ? '/' : `/${user?.role}`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to={dashboardPath} className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg gradient-neon flex items-center justify-center neon-glow-green">
            <UtensilsCrossed className="w-5 h-5 text-background" />
          </div>
          <span className="text-xl font-bold neon-text-green">NeonEats</span>
        </Link>

        {user?.role === 'customer' && (
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className={`text-sm transition-colors hover:text-primary ${location.pathname === '/' ? 'text-primary font-medium' : 'text-muted-foreground'}`}>Home</Link>
            <Link to="/restaurants" className={`text-sm transition-colors hover:text-primary ${location.pathname === '/restaurants' ? 'text-primary font-medium' : 'text-muted-foreground'}`}>Restaurants</Link>
            <Link to="/orders" className={`text-sm transition-colors hover:text-primary ${location.pathname === '/orders' ? 'text-primary font-medium' : 'text-muted-foreground'}`}>Orders</Link>
            <Link to="/favorites" className={`text-sm transition-colors hover:text-primary ${location.pathname === '/favorites' ? 'text-primary font-medium' : 'text-muted-foreground'}`}>Favorites</Link>
          </nav>
        )}

        <div className="flex items-center gap-3">
          {user?.role === 'customer' && (
            <Button variant="ghost" size="icon" className="relative" onClick={() => navigate('/cart')}>
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-secondary text-secondary-foreground text-xs flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <span className="hidden md:inline text-sm">{user?.name}</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-card border-border">
              <DropdownMenuLabel>
                <div className="flex flex-col gap-1">
                  <span>{user?.name}</span>
                  <Badge className={`w-fit text-xs ${roleColors[user?.role || 'customer']}`}>
                    {roleLabels[user?.role || 'customer']}
                  </Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs text-muted-foreground">Switch Role (Demo)</DropdownMenuLabel>
              {(['customer', 'restaurant', 'delivery', 'admin'] as const).map(role => (
                <DropdownMenuItem
                  key={role}
                  onClick={() => { switchRole(role); navigate(role === 'customer' ? '/' : `/${role}`); }}
                  className={user?.role === role ? 'bg-muted' : ''}
                >
                  {roleLabels[role]}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => { logout(); navigate('/login'); }} className="text-destructive">
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

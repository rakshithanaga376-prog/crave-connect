import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const sizeClass = size === 'sm' ? 'w-3.5 h-3.5' : 'w-5 h-5';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <Star
          key={star}
          className={cn(sizeClass, star <= Math.round(rating) ? 'fill-neon-orange text-neon-orange' : 'text-muted-foreground/30')}
        />
      ))}
    </div>
  );
}

export function StatCard({ title, value, subtitle, icon: Icon, glowColor = 'green' }: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  glowColor?: 'green' | 'orange' | 'cyan';
}) {
  const glowClass = {
    green: 'neon-glow-green border-neon-green/20',
    orange: 'neon-glow-orange border-neon-orange/20',
    cyan: 'neon-glow-cyan border-neon-cyan/20',
  }[glowColor];

  const iconBg = {
    green: 'bg-neon-green/10 text-neon-green',
    orange: 'bg-neon-orange/10 text-neon-orange',
    cyan: 'bg-neon-cyan/10 text-neon-cyan',
  }[glowColor];

  return (
    <div className={cn('glass-card p-6', glowClass)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', iconBg)}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

export function OrderStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    placed: 'bg-neon-cyan/20 text-neon-cyan',
    confirmed: 'bg-neon-purple/20 text-neon-purple',
    preparing: 'bg-neon-orange/20 text-neon-orange',
    out_for_delivery: 'bg-neon-green/20 text-neon-green animate-pulse-neon',
    delivered: 'bg-primary/20 text-primary',
    cancelled: 'bg-destructive/20 text-destructive',
  };

  const labels: Record<string, string> = {
    placed: 'Placed',
    confirmed: 'Confirmed',
    preparing: 'Preparing',
    out_for_delivery: 'Out for Delivery',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  };

  return (
    <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium', styles[status] || 'bg-muted text-muted-foreground')}>
      {labels[status] || status}
    </span>
  );
}

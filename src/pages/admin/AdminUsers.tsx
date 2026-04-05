import { mockUsers } from '@/data/mock-data';
import { Badge } from '@/components/ui/badge';
import { User, Shield, Truck, UtensilsCrossed } from 'lucide-react';

const roleIcons = { customer: User, restaurant: UtensilsCrossed, delivery: Truck, admin: Shield };
const roleColors = { customer: 'bg-neon-green/20 text-neon-green', restaurant: 'bg-neon-orange/20 text-neon-orange', delivery: 'bg-neon-cyan/20 text-neon-cyan', admin: 'bg-neon-purple/20 text-neon-purple' };

export default function AdminUsers() {
  return (
    <div className="container px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      <div className="glass-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left p-4 font-medium text-muted-foreground">User</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Email</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Phone</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Role</th>
            </tr>
          </thead>
          <tbody>
            {mockUsers.map(u => {
              const Icon = roleIcons[u.role];
              return (
                <tr key={u.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"><Icon className="w-4 h-4" /></div>
                    <span className="font-medium">{u.name}</span>
                  </td>
                  <td className="p-4 text-muted-foreground">{u.email}</td>
                  <td className="p-4 text-muted-foreground">{u.phone}</td>
                  <td className="p-4"><Badge className={roleColors[u.role]}>{u.role}</Badge></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

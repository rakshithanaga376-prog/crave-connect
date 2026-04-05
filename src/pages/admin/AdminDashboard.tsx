import { useOrders } from '@/contexts/OrderContext';
import { mockUsers, mockRestaurants } from '@/data/mock-data';
import { StatCard, OrderStatusBadge } from '@/components/shared/SharedComponents';
import { Users, ShoppingBag, DollarSign, Store, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const COLORS = ['hsl(142, 71%, 45%)', 'hsl(24, 95%, 53%)', 'hsl(187, 94%, 43%)', 'hsl(330, 80%, 60%)', 'hsl(270, 70%, 60%)'];

export default function AdminDashboard() {
  const { orders } = useOrders();

  const totalRevenue = orders.filter(o => o.paymentStatus === 'paid').reduce((s, o) => s + o.totalAmount, 0);
  const totalUsers = mockUsers.length;
  const totalRestaurants = mockRestaurants.length;

  const ordersByStatus = [
    { name: 'Delivered', value: orders.filter(o => o.status === 'delivered').length },
    { name: 'Preparing', value: orders.filter(o => o.status === 'preparing').length },
    { name: 'In Transit', value: orders.filter(o => o.status === 'out_for_delivery').length },
    { name: 'Placed', value: orders.filter(o => o.status === 'placed').length },
    { name: 'Cancelled', value: orders.filter(o => o.status === 'cancelled').length },
  ].filter(d => d.value > 0);

  const hourlyData = Array.from({ length: 12 }, (_, i) => ({
    hour: `${i + 10}:00`,
    orders: Math.floor(Math.random() * 15) + 3,
  }));

  const cuisineData = mockRestaurants.reduce((acc, r) => {
    const existing = acc.find(a => a.cuisine === r.cuisine);
    if (existing) existing.count++;
    else acc.push({ cuisine: r.cuisine, count: 1 });
    return acc;
  }, [] as { cuisine: string; count: number }[]);

  return (
    <div className="container px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Revenue" value={`₹${totalRevenue.toLocaleString('en-IN')}`} icon={DollarSign} glowColor="green" />
        <StatCard title="Total Orders" value={orders.length} icon={ShoppingBag} glowColor="orange" />
        <StatCard title="Total Users" value={totalUsers} icon={Users} glowColor="cyan" />
        <StatCard title="Restaurants" value={totalRestaurants} icon={Store} glowColor="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="glass-card p-6">
          <h3 className="font-semibold mb-4">Order Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={ordersByStatus} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {ordersByStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: 'hsl(0 0% 7%)', border: '1px solid hsl(0 0% 15%)', borderRadius: '8px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-6">
          <h3 className="font-semibold mb-4">Peak Order Hours</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 15%)" />
              <XAxis dataKey="hour" stroke="hsl(0 0% 55%)" fontSize={10} />
              <YAxis stroke="hsl(0 0% 55%)" fontSize={12} />
              <Tooltip contentStyle={{ background: 'hsl(0 0% 7%)', border: '1px solid hsl(0 0% 15%)', borderRadius: '8px' }} />
              <Line type="monotone" dataKey="orders" stroke="hsl(142 71% 45%)" strokeWidth={2} dot={{ fill: 'hsl(142 71% 45%)' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="glass-card p-6 mb-8">
        <h3 className="font-semibold mb-4">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 text-muted-foreground font-medium">Order ID</th>
                <th className="text-left py-2 text-muted-foreground font-medium">Restaurant</th>
                <th className="text-left py-2 text-muted-foreground font-medium">Amount</th>
                <th className="text-left py-2 text-muted-foreground font-medium">Status</th>
                <th className="text-left py-2 text-muted-foreground font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 10).map(order => {
                const rest = mockRestaurants.find(r => r.id === order.restaurantId);
                return (
                  <tr key={order.id} className="border-b border-border/50">
                    <td className="py-3 font-medium">#{order.id.slice(-4)}</td>
                    <td className="py-3">{rest?.name}</td>
                    <td className="py-3 text-primary font-medium">₹{order.totalAmount}</td>
                    <td className="py-3"><OrderStatusBadge status={order.status} /></td>
                    <td className="py-3 text-muted-foreground">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Users by Role */}
      <div className="glass-card p-6">
        <h3 className="font-semibold mb-4">Users by Role</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(['customer', 'restaurant', 'delivery', 'admin'] as const).map(role => {
            const count = mockUsers.filter(u => u.role === role).length;
            const colors = { customer: 'neon-green', restaurant: 'neon-orange', delivery: 'neon-cyan', admin: 'neon-purple' };
            return (
              <div key={role} className="glass-card p-4 text-center">
                <p className={`text-2xl font-bold text-${colors[role]}`}>{count}</p>
                <p className="text-xs text-muted-foreground capitalize mt-1">{role === 'restaurant' ? 'Restaurant Owners' : `${role}s`}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

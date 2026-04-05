import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/contexts/OrderContext';
import { mockRestaurants, mockFoodItems } from '@/data/mock-data';
import { StatCard } from '@/components/shared/SharedComponents';
import { ShoppingBag, DollarSign, UtensilsCrossed, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function RestaurantDashboard() {
  const { user } = useAuth();
  const { orders } = useOrders();

  const myRestaurants = mockRestaurants.filter(r => r.ownerId === user?.id);
  const myRestaurantIds = myRestaurants.map(r => r.id);
  const myOrders = orders.filter(o => myRestaurantIds.includes(o.restaurantId));
  const myItems = mockFoodItems.filter(f => myRestaurantIds.includes(f.restaurantId));

  const totalRevenue = myOrders.filter(o => o.paymentStatus === 'paid').reduce((s, o) => s + o.totalAmount, 0);
  const todayOrders = myOrders.filter(o => o.createdAt.startsWith('2026-04-05')).length;
  const activeOrders = myOrders.filter(o => !['delivered', 'cancelled'].includes(o.status)).length;

  const chartData = [
    { day: 'Mon', orders: 12, revenue: 4500 },
    { day: 'Tue', orders: 18, revenue: 6800 },
    { day: 'Wed', orders: 15, revenue: 5200 },
    { day: 'Thu', orders: 22, revenue: 8100 },
    { day: 'Fri', orders: 28, revenue: 10500 },
    { day: 'Sat', orders: 35, revenue: 13200 },
    { day: 'Sun', orders: 30, revenue: 11400 },
  ];

  return (
    <div className="container px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Restaurant Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Revenue" value={`₹${totalRevenue.toLocaleString('en-IN')}`} icon={DollarSign} glowColor="green" />
        <StatCard title="Today's Orders" value={todayOrders} icon={ShoppingBag} glowColor="orange" />
        <StatCard title="Active Orders" value={activeOrders} icon={TrendingUp} glowColor="cyan" />
        <StatCard title="Menu Items" value={myItems.length} icon={UtensilsCrossed} glowColor="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="font-semibold mb-4">Weekly Orders</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 15%)" />
              <XAxis dataKey="day" stroke="hsl(0 0% 55%)" fontSize={12} />
              <YAxis stroke="hsl(0 0% 55%)" fontSize={12} />
              <Tooltip contentStyle={{ background: 'hsl(0 0% 7%)', border: '1px solid hsl(0 0% 15%)', borderRadius: '8px' }} />
              <Bar dataKey="orders" fill="hsl(142 71% 45%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-6">
          <h3 className="font-semibold mb-4">Weekly Revenue</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 15%)" />
              <XAxis dataKey="day" stroke="hsl(0 0% 55%)" fontSize={12} />
              <YAxis stroke="hsl(0 0% 55%)" fontSize={12} />
              <Tooltip contentStyle={{ background: 'hsl(0 0% 7%)', border: '1px solid hsl(0 0% 15%)', borderRadius: '8px' }} formatter={(v: number) => [`₹${v}`, 'Revenue']} />
              <Bar dataKey="revenue" fill="hsl(24 95% 53%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* My Restaurants */}
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">My Restaurants</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myRestaurants.map(r => (
            <div key={r.id} className="glass-card p-4 flex items-center gap-4">
              <img src={r.image} alt={r.name} className="w-16 h-16 rounded-lg object-cover" />
              <div>
                <h4 className="font-semibold">{r.name}</h4>
                <p className="text-sm text-muted-foreground">{r.cuisine} • {r.location}</p>
                <p className="text-xs text-primary mt-1">⭐ {r.rating} ({r.reviewCount} reviews)</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

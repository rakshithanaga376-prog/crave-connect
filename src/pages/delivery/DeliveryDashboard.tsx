import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/contexts/OrderContext';
import { mockDeliveryPartners, mockRestaurants } from '@/data/mock-data';
import { StatCard, OrderStatusBadge } from '@/components/shared/SharedComponents';
import { Truck, DollarSign, Package, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function DeliveryDashboard() {
  const { user } = useAuth();
  const { orders, updateOrderStatus } = useOrders();

  const partner = mockDeliveryPartners.find(dp => dp.userId === user?.id) || mockDeliveryPartners[0];
  const myOrders = orders.filter(o => o.deliveryPartnerId === user?.id);
  const activeDeliveries = myOrders.filter(o => o.status === 'out_for_delivery');
  const completedToday = myOrders.filter(o => o.status === 'delivered' && o.updatedAt.startsWith('2026-04-05'));

  const handleUpdateStatus = (orderId: string, status: 'out_for_delivery' | 'delivered') => {
    updateOrderStatus(orderId, status);
    toast.success(status === 'delivered' ? 'Delivery completed! 🎉' : 'Picked up!');
  };

  return (
    <div className="container px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Delivery Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Earnings" value={`₹${partner.totalEarnings.toLocaleString('en-IN')}`} icon={DollarSign} glowColor="green" />
        <StatCard title="Total Deliveries" value={partner.totalDeliveries} icon={Package} glowColor="orange" />
        <StatCard title="Active Deliveries" value={activeDeliveries.length} icon={Truck} glowColor="cyan" />
        <StatCard title="Completed Today" value={completedToday.length} icon={Package} glowColor="green" />
      </div>

      {/* Active Deliveries */}
      <h2 className="text-xl font-bold mb-4">Active Deliveries</h2>
      {activeDeliveries.length === 0 ? (
        <div className="glass-card p-8 text-center text-muted-foreground mb-8">No active deliveries</div>
      ) : (
        <div className="space-y-4 mb-8">
          {activeDeliveries.map(order => {
            const restaurant = mockRestaurants.find(r => r.id === order.restaurantId);
            return (
              <div key={order.id} className="glass-card p-5 border-neon-cyan/20 neon-glow-cyan">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold">Order #{order.id.slice(-4)}</p>
                    <p className="text-sm text-muted-foreground">{restaurant?.name}</p>
                  </div>
                  <OrderStatusBadge status={order.status} />
                </div>
                <div className="space-y-2 text-sm mb-4">
                  <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-neon-orange" /> <strong>Pickup:</strong> {restaurant?.location}</p>
                  <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-neon-green" /> <strong>Deliver to:</strong> {order.deliveryAddress}</p>
                  {order.scheduledTime && <p className="text-neon-cyan">📅 Scheduled: {new Date(order.scheduledTime).toLocaleString('en-IN')}</p>}
                </div>
                <div className="space-y-1 text-sm mb-4">
                  {order.items.map(i => <p key={i.foodItemId} className="text-muted-foreground">{i.name} × {i.quantity}</p>)}
                  <p className="font-bold text-primary">Total: ₹{order.totalAmount} • {order.paymentMethod.toUpperCase()}</p>
                </div>
                <Button onClick={() => handleUpdateStatus(order.id, 'delivered')} className="w-full gradient-neon text-background neon-glow-green">
                  ✅ Mark as Delivered
                </Button>
              </div>
            );
          })}
        </div>
      )}

      {/* All Orders */}
      <h2 className="text-xl font-bold mb-4">All Assigned Orders</h2>
      <div className="space-y-3">
        {myOrders.map(order => {
          const restaurant = mockRestaurants.find(r => r.id === order.restaurantId);
          return (
            <div key={order.id} className="glass-card p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">Order #{order.id.slice(-4)} - {restaurant?.name}</p>
                <p className="text-xs text-muted-foreground">{order.deliveryAddress}</p>
                <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleString('en-IN')}</p>
              </div>
              <div className="text-right">
                <OrderStatusBadge status={order.status} />
                <p className="text-sm font-bold text-primary mt-1">₹{order.totalAmount}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

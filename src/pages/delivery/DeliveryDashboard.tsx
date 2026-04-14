import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/contexts/OrderContext';
import { mockDeliveryPartners, mockRestaurants } from '@/data/mock-data';
import { StatCard, OrderStatusBadge } from '@/components/shared/SharedComponents';
import { Truck, DollarSign, Package, MapPin, Navigation, Phone, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { sounds } from '@/utils/sounds';

export default function DeliveryDashboard() {
  const { user } = useAuth();
  const { orders, updateOrderStatus } = useOrders();

  const partner = mockDeliveryPartners.find(dp => dp.userId === user?.id) || mockDeliveryPartners[0];
  const myOrders = orders.filter(o => o.deliveryPartnerId === user?.id);
  const activeDeliveries = myOrders.filter(o => o.status === 'out_for_delivery');
  const completedToday = myOrders.filter(o => o.status === 'delivered');
  
  // Show all placed/confirmed/preparing orders that are assigned to this delivery partner
  const upcomingOrders = myOrders.filter(o => ['placed', 'confirmed', 'preparing'].includes(o.status));
  
  // Also show unassigned orders that need delivery (for the partner to pick up)
  const unassignedOrders = orders.filter(o => !o.deliveryPartnerId && ['placed', 'confirmed', 'preparing', 'out_for_delivery'].includes(o.status));

  // Delivery partner gets 15% of order total
  const todayEarnings = myOrders
    .filter(o => o.status === 'delivered')
    .reduce((s, o) => s + Math.round(o.totalAmount * 0.15), 0);

  const handleUpdateStatus = (orderId: string, status: 'out_for_delivery' | 'delivered') => {
    updateOrderStatus(orderId, status);
    if (status === 'delivered') { sounds.deliveryComplete(); toast.success('Delivery completed! 🎉'); }
    else { sounds.statusUpdate(); toast.success('Picked up!'); }
  };

  const openInMaps = (address: string) => {
    const encoded = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encoded}`, '_blank');
  };

  return (
    <div className="container px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Delivery Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Earnings" value={`₹${partner.totalEarnings.toLocaleString('en-IN')}`} icon={DollarSign} glowColor="green" />
        <StatCard title="Today's Earnings (15%)" value={`₹${todayEarnings.toLocaleString('en-IN')}`} icon={DollarSign} glowColor="orange" />
        <StatCard title="Active Deliveries" value={activeDeliveries.length} icon={Truck} glowColor="cyan" />
        <StatCard title="Completed" value={completedToday.length} icon={Package} glowColor="green" />
      </div>

      {/* Active Deliveries */}
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Truck className="w-5 h-5 text-neon-cyan" /> Active Deliveries
      </h2>
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
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-neon-orange mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Pickup from</p>
                      <p className="font-medium">{restaurant?.name} — {restaurant?.location}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Navigation className="w-4 h-4 text-neon-green mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Deliver to</p>
                      <p className="font-medium">{order.deliveryAddress}</p>
                    </div>
                  </div>
                  {order.scheduledTime && (
                    <p className="flex items-center gap-2 text-neon-cyan">
                      <Clock className="w-4 h-4" /> Scheduled: {new Date(order.scheduledTime).toLocaleString('en-IN')}
                    </p>
                  )}
                </div>
                <div className="space-y-1 text-sm mb-4">
                  {order.items.map(i => <p key={i.foodItemId} className="text-muted-foreground">{i.name} × {i.quantity}</p>)}
                  <p className="font-bold text-primary">Total: ₹{order.totalAmount} • {order.paymentMethod.toUpperCase()}</p>
                  <p className="text-xs text-neon-green">Your earning: ₹{Math.round(order.totalAmount * 0.15)}</p>
                </div>
                {/* Embedded Map */}
                <div className="rounded-lg overflow-hidden border border-border mb-4">
                  <iframe
                    title={`Map for ${order.deliveryAddress}`}
                    width="100%"
                    height="200"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(order.deliveryAddress)}&output=embed`}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => handleUpdateStatus(order.id, 'delivered')} className="flex-1 gradient-neon text-background neon-glow-green">
                    ✅ Mark as Delivered
                  </Button>
                  <Button variant="outline" className="border-neon-cyan/30 text-neon-cyan" onClick={() => openInMaps(order.deliveryAddress)}>
                    <Navigation className="w-4 h-4 mr-1" /> Navigate
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upcoming Orders (assigned but not yet out for delivery) */}
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Package className="w-5 h-5 text-neon-orange" /> Upcoming Orders
      </h2>
      {upcomingOrders.length === 0 ? (
        <div className="glass-card p-8 text-center text-muted-foreground mb-8">No upcoming orders</div>
      ) : (
        <div className="space-y-4 mb-8">
          {upcomingOrders.map(order => {
            const restaurant = mockRestaurants.find(r => r.id === order.restaurantId);
            return (
              <div key={order.id} className="glass-card p-5 border-neon-orange/20">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold">Order #{order.id.slice(-4)}</p>
                    <p className="text-sm text-muted-foreground">{restaurant?.name}</p>
                  </div>
                  <OrderStatusBadge status={order.status} />
                </div>
                <div className="space-y-2 text-sm mb-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-neon-orange mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Pickup</p>
                      <p>{restaurant?.name} — {restaurant?.location}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Navigation className="w-4 h-4 text-neon-green mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Deliver to</p>
                      <p>{order.deliveryAddress}</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">{order.items.map(i => `${i.name} × ${i.quantity}`).join(', ')}</p>
                    <p className="text-sm font-bold text-primary">₹{order.totalAmount} • Earning: ₹{Math.round(order.totalAmount * 0.15)}</p>
                  </div>
                  <Button variant="outline" size="sm" className="border-neon-orange/30 text-neon-orange" onClick={() => openInMaps(restaurant?.location || '')}>
                    <Navigation className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* All Completed Orders */}
      <h2 className="text-xl font-bold mb-4">Completed Deliveries</h2>
      <div className="space-y-3">
        {completedToday.map(order => {
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
                <p className="text-sm font-bold text-neon-green mt-1">+₹{Math.round(order.totalAmount * 0.15)}</p>
              </div>
            </div>
          );
        })}
        {completedToday.length === 0 && (
          <div className="glass-card p-8 text-center text-muted-foreground">No completed deliveries yet</div>
        )}
      </div>
    </div>
  );
}

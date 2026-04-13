import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/contexts/OrderContext';
import { mockRestaurants } from '@/data/mock-data';
import { OrderStatusBadge } from '@/components/shared/SharedComponents';
import { Button } from '@/components/ui/button';
import { Check, X, ChefHat, Truck, Bell } from 'lucide-react';
import { toast } from 'sonner';

export default function RestaurantOrders() {
  const { user } = useAuth();
  const { orders, updateOrderStatus, newOrderIds, clearNewOrder } = useOrders();

  const myRestaurants = mockRestaurants.filter(r => r.ownerId === user?.id);
  const myRestaurantIds = myRestaurants.map(r => r.id);
  const myOrders = orders.filter(o => myRestaurantIds.includes(o.restaurantId)).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  const newOrders = myOrders.filter(o => newOrderIds.includes(o.id));
  const pendingOrders = myOrders.filter(o => o.status === 'placed' && !newOrderIds.includes(o.id));
  const activeOrders = myOrders.filter(o => ['confirmed', 'preparing', 'out_for_delivery'].includes(o.status));
  const completedOrders = myOrders.filter(o => ['delivered', 'cancelled'].includes(o.status));

  // Calculate income
  const totalIncome = myOrders
    .filter(o => o.paymentStatus === 'paid' && o.status !== 'cancelled')
    .reduce((sum, o) => sum + Math.round(o.totalAmount * 0.75), 0); // Restaurant gets 75% of order total

  useEffect(() => {
    if (newOrders.length > 0) {
      // Play notification sound effect via toast
      toast.info(`🔔 ${newOrders.length} new order(s) waiting!`, { duration: 3000 });
    }
  }, [newOrders.length]);

  const handleAction = (orderId: string, status: 'confirmed' | 'preparing' | 'out_for_delivery' | 'cancelled') => {
    updateOrderStatus(orderId, status);
    clearNewOrder(orderId);
    toast.success(`Order ${status === 'cancelled' ? 'rejected' : 'updated'}`);
  };

  const renderOrderCard = (order: typeof myOrders[0], isNew: boolean = false) => {
    const restaurant = mockRestaurants.find(r => r.id === order.restaurantId);
    return (
      <div key={order.id} className={`glass-card p-5 transition-all ${isNew ? 'border-neon-green/50 neon-glow-green animate-pulse' : ''}`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {isNew && <Bell className="w-5 h-5 text-neon-green animate-bounce" />}
            <div>
              <p className="font-semibold">Order #{order.id.slice(-4)}</p>
              <p className="text-xs text-muted-foreground">{restaurant?.name} • {new Date(order.createdAt).toLocaleString('en-IN')}</p>
            </div>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        <div className="space-y-1 mb-3">
          {order.items.map(item => (
            <div key={item.foodItemId} className="flex justify-between text-sm">
              <span>{item.name} × {item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
          <div className="border-t border-border pt-1 flex justify-between font-bold text-sm">
            <span>Total</span><span className="text-primary">₹{order.totalAmount}</span>
          </div>
          <div className="flex justify-between text-xs text-neon-green">
            <span>Your earnings (75%)</span><span>₹{Math.round(order.totalAmount * 0.75)}</span>
          </div>
        </div>

        <div className="text-xs text-muted-foreground mb-3">
          📍 {order.deliveryAddress} • 💳 {order.paymentMethod.toUpperCase()}
          {order.scheduledTime && <span> • 📅 Scheduled: {new Date(order.scheduledTime).toLocaleString('en-IN')}</span>}
        </div>

        <div className="flex gap-2">
          {(order.status === 'placed') && (
            <>
              <Button size="sm" onClick={() => handleAction(order.id, 'confirmed')} className="gradient-neon text-background"><Check className="w-4 h-4 mr-1" /> Accept</Button>
              <Button size="sm" variant="outline" className="border-destructive/30 text-destructive" onClick={() => handleAction(order.id, 'cancelled')}><X className="w-4 h-4 mr-1" /> Reject</Button>
            </>
          )}
          {order.status === 'confirmed' && (
            <Button size="sm" onClick={() => handleAction(order.id, 'preparing')} className="bg-neon-orange text-background hover:bg-neon-orange/90"><ChefHat className="w-4 h-4 mr-1" /> Start Preparing</Button>
          )}
          {order.status === 'preparing' && (
            <Button size="sm" onClick={() => handleAction(order.id, 'out_for_delivery')} className="bg-neon-cyan text-background hover:bg-neon-cyan/90"><Truck className="w-4 h-4 mr-1" /> Ready for Pickup</Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="container px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Orders Received</h1>
        <div className="glass-card px-4 py-2 border-neon-green/30">
          <p className="text-xs text-muted-foreground">Total Earnings</p>
          <p className="text-lg font-bold text-neon-green">₹{totalIncome.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* New Orders - highlighted */}
      {newOrders.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-neon-green flex items-center gap-2 mb-3">
            <Bell className="w-5 h-5 animate-bounce" /> New Orders ({newOrders.length})
          </h2>
          <div className="space-y-4">
            {newOrders.map(order => renderOrderCard(order, true))}
          </div>
        </div>
      )}

      {/* Pending Orders */}
      {pendingOrders.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3">Pending Orders ({pendingOrders.length})</h2>
          <div className="space-y-4">
            {pendingOrders.map(order => renderOrderCard(order))}
          </div>
        </div>
      )}

      {/* Active Orders */}
      {activeOrders.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3">Active Orders ({activeOrders.length})</h2>
          <div className="space-y-4">
            {activeOrders.map(order => renderOrderCard(order))}
          </div>
        </div>
      )}

      {/* Completed Orders */}
      {completedOrders.length > 0 && (
        <div>
          <h2 className="text-lg font-bold mb-3 text-muted-foreground">Completed ({completedOrders.length})</h2>
          <div className="space-y-4">
            {completedOrders.map(order => renderOrderCard(order))}
          </div>
        </div>
      )}

      {myOrders.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">No orders yet</div>
      )}
    </div>
  );
}

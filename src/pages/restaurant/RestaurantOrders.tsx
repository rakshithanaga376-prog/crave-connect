import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/contexts/OrderContext';
import { mockRestaurants } from '@/data/mock-data';
import { OrderStatusBadge } from '@/components/shared/SharedComponents';
import { Button } from '@/components/ui/button';
import { Check, X, ChefHat, Truck } from 'lucide-react';
import { toast } from 'sonner';

export default function RestaurantOrders() {
  const { user } = useAuth();
  const { orders, updateOrderStatus } = useOrders();

  const myRestaurants = mockRestaurants.filter(r => r.ownerId === user?.id);
  const myRestaurantIds = myRestaurants.map(r => r.id);
  const myOrders = orders.filter(o => myRestaurantIds.includes(o.restaurantId)).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleAction = (orderId: string, status: 'confirmed' | 'preparing' | 'out_for_delivery' | 'cancelled') => {
    updateOrderStatus(orderId, status);
    toast.success(`Order ${status === 'cancelled' ? 'rejected' : 'updated'}`);
  };

  return (
    <div className="container px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Orders Received</h1>

      {myOrders.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">No orders yet</div>
      ) : (
        <div className="space-y-4">
          {myOrders.map(order => {
            const restaurant = mockRestaurants.find(r => r.id === order.restaurantId);
            return (
              <div key={order.id} className="glass-card p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold">Order #{order.id.slice(-4)}</p>
                    <p className="text-xs text-muted-foreground">{restaurant?.name} • {new Date(order.createdAt).toLocaleString('en-IN')}</p>
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
                </div>

                <div className="text-xs text-muted-foreground mb-3">
                  📍 {order.deliveryAddress} • 💳 {order.paymentMethod.toUpperCase()}
                  {order.scheduledTime && <span> • 📅 Scheduled: {new Date(order.scheduledTime).toLocaleString('en-IN')}</span>}
                </div>

                <div className="flex gap-2">
                  {order.status === 'placed' && (
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
          })}
        </div>
      )}
    </div>
  );
}

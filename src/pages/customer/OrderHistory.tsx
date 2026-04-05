import { Link } from 'react-router-dom';
import { useOrders } from '@/contexts/OrderContext';
import { useAuth } from '@/contexts/AuthContext';
import { mockRestaurants } from '@/data/mock-data';
import { OrderStatusBadge } from '@/components/shared/SharedComponents';
import { Package } from 'lucide-react';

export default function OrderHistory() {
  const { user } = useAuth();
  const { getOrdersByUser } = useOrders();

  const orders = getOrdersByUser(user!.id);

  if (orders.length === 0) {
    return (
      <div className="container px-4 py-20 text-center">
        <Package className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">No orders yet</h2>
        <p className="text-muted-foreground">Your order history will appear here</p>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Order History</h1>
      <div className="space-y-3">
        {orders.map(order => {
          const restaurant = mockRestaurants.find(r => r.id === order.restaurantId);
          return (
            <Link key={order.id} to={`/order/${order.id}`} className="glass-card p-4 block hover:border-primary/20 transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {restaurant && <img src={restaurant.image} alt={restaurant.name} className="w-12 h-12 rounded-lg object-cover" />}
                  <div>
                    <p className="font-semibold">{restaurant?.name}</p>
                    <p className="text-xs text-muted-foreground">{order.items.map(i => `${i.name} ×${i.quantity}`).join(', ')}</p>
                    <p className="text-xs text-muted-foreground mt-1">{new Date(order.createdAt).toLocaleString('en-IN')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <OrderStatusBadge status={order.status} />
                  <p className="text-sm font-bold text-primary mt-2">₹{order.totalAmount}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

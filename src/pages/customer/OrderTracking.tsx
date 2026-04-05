import { useParams, useNavigate } from 'react-router-dom';
import { useOrders } from '@/contexts/OrderContext';
import { mockRestaurants } from '@/data/mock-data';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Phone, CheckCircle2, Clock, ChefHat, Truck, Package } from 'lucide-react';
import { motion } from 'framer-motion';

const statusSteps = [
  { key: 'placed', label: 'Order Placed', icon: Package },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle2 },
  { key: 'preparing', label: 'Preparing', icon: ChefHat },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle2 },
];

export default function OrderTracking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders } = useOrders();

  const order = orders.find(o => o.id === id);
  if (!order) return <div className="container py-20 text-center text-muted-foreground">Order not found</div>;

  const restaurant = mockRestaurants.find(r => r.id === order.restaurantId);
  const currentStepIndex = statusSteps.findIndex(s => s.key === order.status);

  return (
    <div className="container px-4 py-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="w-5 h-5" /></Button>
        <h1 className="text-2xl font-bold">Order #{order.id.slice(-4)}</h1>
      </div>

      {/* Status Timeline */}
      <div className="glass-card p-6 mb-6">
        <h3 className="font-semibold mb-6">Order Status</h3>
        <div className="space-y-0">
          {statusSteps.map((step, i) => {
            const isCompleted = i <= currentStepIndex;
            const isCurrent = i === currentStepIndex;
            return (
              <div key={step.key} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={false}
                    animate={isCompleted ? { scale: [1, 1.2, 1] } : {}}
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${isCompleted ? 'gradient-neon neon-glow-green' : 'bg-muted'}`}
                  >
                    <step.icon className={`w-5 h-5 ${isCompleted ? 'text-background' : 'text-muted-foreground'}`} />
                  </motion.div>
                  {i < statusSteps.length - 1 && (
                    <div className={`w-0.5 h-8 ${isCompleted && i < currentStepIndex ? 'bg-primary' : 'bg-border'}`} />
                  )}
                </div>
                <div className="pt-2">
                  <p className={`font-medium ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>{step.label}</p>
                  {isCurrent && <p className="text-xs text-primary animate-pulse-neon">In progress...</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Details */}
      <div className="glass-card p-5 mb-4">
        <h3 className="font-semibold mb-3">Order Details</h3>
        {restaurant && (
          <div className="flex items-center gap-3 mb-3 pb-3 border-b border-border">
            <img src={restaurant.image} alt={restaurant.name} className="w-10 h-10 rounded-lg object-cover" />
            <div>
              <p className="font-medium text-sm">{restaurant.name}</p>
              <p className="text-xs text-muted-foreground">{restaurant.location}</p>
            </div>
          </div>
        )}
        {order.items.map(item => (
          <div key={item.foodItemId} className="flex justify-between text-sm py-1">
            <span>{item.name} × {item.quantity}</span>
            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}
        <div className="border-t border-border mt-2 pt-2 flex justify-between font-bold">
          <span>Total</span><span className="text-primary">₹{order.totalAmount}</span>
        </div>
      </div>

      <div className="glass-card p-5">
        <h3 className="font-semibold mb-2">Delivery Address</h3>
        <p className="text-sm text-muted-foreground flex items-center gap-2"><MapPin className="w-4 h-4" /> {order.deliveryAddress}</p>
        {order.scheduledTime && (
          <p className="text-sm text-neon-cyan mt-2 flex items-center gap-2"><Clock className="w-4 h-4" /> Scheduled: {new Date(order.scheduledTime).toLocaleString('en-IN')}</p>
        )}
      </div>
    </div>
  );
}

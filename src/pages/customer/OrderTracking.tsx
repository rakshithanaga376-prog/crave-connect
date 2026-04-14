import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrders } from '@/contexts/OrderContext';
import { mockRestaurants } from '@/data/mock-data';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, CheckCircle2, Clock, ChefHat, Truck, Package, Timer } from 'lucide-react';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';

const statusSteps = [
  { key: 'placed', label: 'Order Placed', icon: Package },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle2 },
  { key: 'preparing', label: 'Preparing', icon: ChefHat },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle2 },
];

function CountdownTimer({ createdAt, deliveryTimeMin = 35 }: { createdAt: string; deliveryTimeMin?: number }) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const totalMs = deliveryTimeMin * 60 * 1000;
    const orderTime = new Date(createdAt).getTime();
    const endTime = orderTime + totalMs;

    const tick = () => {
      const now = Date.now();
      const remaining = Math.max(0, endTime - now);
      const elapsed = totalMs - remaining;
      setTimeLeft(remaining);
      setProgress(Math.min(100, (elapsed / totalMs) * 100));
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [createdAt, deliveryTimeMin]);

  const mins = Math.floor(timeLeft / 60000);
  const secs = Math.floor((timeLeft % 60000) / 1000);

  return (
    <div className="glass-card p-5 mb-6 border-neon-green/20">
      <div className="flex items-center gap-2 mb-3">
        <Timer className="w-5 h-5 text-neon-green" />
        <h3 className="font-semibold">Estimated Delivery</h3>
      </div>
      {timeLeft > 0 ? (
        <>
          <div className="flex items-baseline gap-1 mb-3">
            <span className="text-4xl font-bold neon-text-green">{mins}</span>
            <span className="text-lg text-muted-foreground">min</span>
            <span className="text-4xl font-bold neon-text-green ml-2">{secs.toString().padStart(2, '0')}</span>
            <span className="text-lg text-muted-foreground">sec</span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {progress < 30 ? '🍳 Kitchen is preparing your food...' :
             progress < 60 ? '👨‍🍳 Almost ready for pickup!' :
             progress < 85 ? '🚴 On the way to you!' :
             '📍 Arriving soon!'}
          </p>
        </>
      ) : (
        <div className="text-center py-2">
          <p className="text-lg font-bold text-neon-green">🎉 Your order should have arrived!</p>
          <p className="text-xs text-muted-foreground mt-1">If not, the delivery partner is almost there.</p>
        </div>
      )}
    </div>
  );
}

function LivePulse() {
  return (
    <span className="relative flex h-3 w-3">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75" />
      <span className="relative inline-flex rounded-full h-3 w-3 bg-neon-green" />
    </span>
  );
}

export default function OrderTracking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders } = useOrders();

  const order = orders.find(o => o.id === id);
  if (!order) return <div className="container py-20 text-center text-muted-foreground">Order not found</div>;

  const restaurant = mockRestaurants.find(r => r.id === order.restaurantId);
  const currentStepIndex = statusSteps.findIndex(s => s.key === order.status);
  const isActive = !['delivered', 'cancelled'].includes(order.status);

  return (
    <div className="container px-4 py-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="w-5 h-5" /></Button>
        <h1 className="text-2xl font-bold">Order #{order.id.slice(-4)}</h1>
        {isActive && <LivePulse />}
      </div>

      {/* Countdown Timer — only for active orders */}
      {isActive && (
        <CountdownTimer
          createdAt={order.createdAt}
          deliveryTimeMin={parseInt(restaurant?.deliveryTime || '35')}
        />
      )}

      {/* Delivery Map for out_for_delivery */}
      {order.status === 'out_for_delivery' && (
        <div className="glass-card p-4 mb-6 border-neon-cyan/20">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Truck className="w-5 h-5 text-neon-cyan" /> Live Tracking
          </h3>
          <div className="rounded-lg overflow-hidden">
            <iframe
              title="Delivery location"
              width="100%"
              height="200"
              style={{ border: 0 }}
              loading="lazy"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(order.deliveryAddress)}&output=embed`}
            />
          </div>
        </div>
      )}

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
                  {isCurrent && isActive && <p className="text-xs text-primary animate-pulse">In progress...</p>}
                  {step.key === 'delivered' && order.status === 'delivered' && (
                    <p className="text-xs text-neon-green mt-1">Delivered at {new Date(order.updatedAt).toLocaleTimeString('en-IN')}</p>
                  )}
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
        <div className="mt-2 text-xs text-muted-foreground">
          Payment: {order.paymentMethod.toUpperCase()} • {order.paymentStatus === 'paid' ? '✅ Paid' : '⏳ Pending'}
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

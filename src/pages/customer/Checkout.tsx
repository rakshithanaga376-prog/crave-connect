import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useOrders } from '@/contexts/OrderContext';
import { useAuth } from '@/contexts/AuthContext';
import { mockRestaurants } from '@/data/mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, CreditCard, Smartphone, Banknote, CalendarIcon, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { sounds } from '@/utils/sounds';

export default function Checkout() {
  const { items, totalAmount, restaurantId, clearCart } = useCart();
  const { addOrder } = useOrders();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState(user?.address || '');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [instructions, setInstructions] = useState('');

  const restaurant = mockRestaurants.find(r => r.id === restaurantId);
  const deliveryFee = restaurant?.deliveryFee || 0;
  const tax = Math.round(totalAmount * 0.05);
  const grandTotal = totalAmount + deliveryFee + tax;

  if (items.length === 0) { navigate('/cart'); return null; }

  const handlePlaceOrder = () => {
    if (!address.trim()) { toast.error('Please enter delivery address'); sounds.error(); return; }

    const order = addOrder({
      userId: user!.id,
      restaurantId: restaurantId!,
      items: items.map(i => ({ foodItemId: i.foodItem.id, name: i.foodItem.name, price: i.foodItem.price, quantity: i.quantity })),
      status: 'placed',
      totalAmount: grandTotal,
      deliveryAddress: address,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      scheduledTime: scheduleDate && scheduleTime ? `${scheduleDate}T${scheduleTime}` : undefined,
    });

    clearCart();
    sounds.orderPlaced();
    toast.success('Order placed successfully! 🎉');
    navigate(`/order/${order.id}`);
  };

  const paymentOptions = [
    { value: 'upi' as const, label: 'UPI', icon: Smartphone, desc: 'Google Pay, PhonePe, Paytm' },
    { value: 'card' as const, label: 'Card', icon: CreditCard, desc: 'Debit / Credit Card' },
    { value: 'cod' as const, label: 'COD', icon: Banknote, desc: 'Cash on Delivery' },
  ];

  return (
    <div className="container px-4 py-8 max-w-2xl pb-20">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="w-5 h-5" /></Button>
        <h1 className="text-2xl font-bold">Checkout</h1>
      </div>

      <div className="space-y-6">
        {/* Delivery Address */}
        <div className="glass-card p-5">
          <h3 className="font-semibold mb-3">📍 Delivery Address</h3>
          <Textarea placeholder="Enter full delivery address..." value={address} onChange={e => setAddress(e.target.value)} className="bg-muted/50" />
        </div>

        {/* Schedule */}
        <div className="glass-card p-5">
          <h3 className="font-semibold mb-3">📅 Schedule Order (Optional)</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground">Date</Label>
              <Input type="date" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} className="mt-1 bg-muted/50" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Time</Label>
              <Input type="time" value={scheduleTime} onChange={e => setScheduleTime(e.target.value)} className="mt-1 bg-muted/50" />
            </div>
          </div>
        </div>

        {/* Payment */}
        <div className="glass-card p-5">
          <h3 className="font-semibold mb-3">💳 Payment Method</h3>
          <div className="space-y-2">
            {paymentOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => setPaymentMethod(opt.value)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${paymentMethod === opt.value ? 'border-primary bg-primary/10 neon-glow-green' : 'border-border hover:bg-muted/30'}`}
              >
                <opt.icon className={`w-5 h-5 ${paymentMethod === opt.value ? 'text-primary' : 'text-muted-foreground'}`} />
                <div className="text-left">
                  <p className="font-medium text-sm">{opt.label}</p>
                  <p className="text-xs text-muted-foreground">{opt.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Special Instructions */}
        <div className="glass-card p-5">
          <h3 className="font-semibold mb-3">📝 Special Instructions</h3>
          <Textarea placeholder="Any special requests..." value={instructions} onChange={e => setInstructions(e.target.value)} className="bg-muted/50" rows={2} />
        </div>

        {/* Summary */}
        <div className="glass-card p-5 space-y-2">
          <h3 className="font-semibold">Order Summary</h3>
          {items.map(i => (
            <div key={i.foodItem.id} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{i.foodItem.name} × {i.quantity}</span>
              <span>₹{i.foodItem.price * i.quantity}</span>
            </div>
          ))}
          <div className="border-t border-border pt-2 flex justify-between text-sm"><span className="text-muted-foreground">Delivery</span><span>₹{deliveryFee}</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Taxes</span><span>₹{tax}</span></div>
          <div className="border-t border-border pt-2 flex justify-between font-bold text-lg">
            <span>Total</span><span className="text-primary">₹{grandTotal}</span>
          </div>
        </div>

        <Button onClick={handlePlaceOrder} className="w-full h-12 gradient-neon text-background font-semibold text-lg neon-glow-green">
          Place Order • ₹{grandTotal}
        </Button>
      </div>
    </div>
  );
}

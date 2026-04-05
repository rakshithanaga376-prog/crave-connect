import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { mockRestaurants } from '@/data/mock-data';
import { Button } from '@/components/ui/button';
import { Plus, Minus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Cart() {
  const { items, updateQuantity, removeItem, clearCart, totalAmount, restaurantId } = useCart();
  const navigate = useNavigate();

  const restaurant = mockRestaurants.find(r => r.id === restaurantId);
  const deliveryFee = restaurant?.deliveryFee || 0;
  const tax = Math.round(totalAmount * 0.05);
  const grandTotal = totalAmount + deliveryFee + tax;

  if (items.length === 0) {
    return (
      <div className="container px-4 py-20 text-center">
        <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">Add items from a restaurant to get started</p>
        <Button onClick={() => navigate('/restaurants')} className="gradient-neon text-background">Browse Restaurants</Button>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 max-w-2xl pb-20">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="w-5 h-5" /></Button>
        <h1 className="text-2xl font-bold">Your Cart</h1>
      </div>

      {restaurant && (
        <div className="glass-card p-4 mb-6 flex items-center gap-3">
          <img src={restaurant.image} alt={restaurant.name} className="w-12 h-12 rounded-lg object-cover" />
          <div>
            <p className="font-semibold">{restaurant.name}</p>
            <p className="text-xs text-muted-foreground">{restaurant.location}</p>
          </div>
        </div>
      )}

      <div className="space-y-3 mb-6">
        {items.map((item, i) => (
          <motion.div key={item.foodItem.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
            className="glass-card p-4 flex items-center gap-4">
            <img src={item.foodItem.image} alt={item.foodItem.name} className="w-16 h-16 rounded-lg object-cover" />
            <div className="flex-1">
              <h3 className="font-medium text-sm">{item.foodItem.name}</h3>
              <p className="text-primary font-semibold">₹{item.foodItem.price * item.quantity}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="icon" variant="outline" className="w-7 h-7" onClick={() => updateQuantity(item.foodItem.id, item.quantity - 1)}>
                <Minus className="w-3 h-3" />
              </Button>
              <span className="w-6 text-center font-semibold text-sm">{item.quantity}</span>
              <Button size="icon" className="w-7 h-7 gradient-neon text-background" onClick={() => updateQuantity(item.foodItem.id, item.quantity + 1)}>
                <Plus className="w-3 h-3" />
              </Button>
            </div>
            <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => removeItem(item.foodItem.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </motion.div>
        ))}
      </div>

      {/* Bill */}
      <div className="glass-card p-5 space-y-3 mb-6">
        <h3 className="font-semibold">Bill Details</h3>
        <div className="flex justify-between text-sm"><span className="text-muted-foreground">Item Total</span><span>₹{totalAmount}</span></div>
        <div className="flex justify-between text-sm"><span className="text-muted-foreground">Delivery Fee</span><span>₹{deliveryFee}</span></div>
        <div className="flex justify-between text-sm"><span className="text-muted-foreground">Taxes (5% GST)</span><span>₹{tax}</span></div>
        <div className="border-t border-border pt-3 flex justify-between font-bold">
          <span>Grand Total</span><span className="text-primary">₹{grandTotal}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={clearCart} className="border-destructive/30 text-destructive">Clear Cart</Button>
        <Button onClick={() => navigate('/checkout')} className="flex-1 gradient-neon text-background neon-glow-green font-semibold">
          Proceed to Checkout • ₹{grandTotal}
        </Button>
      </div>
    </div>
  );
}

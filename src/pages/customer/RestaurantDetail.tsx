import { useParams, useNavigate } from 'react-router-dom';
import { mockRestaurants, mockFoodItems, mockReviews } from '@/data/mock-data';
import { useCart } from '@/contexts/CartContext';
import { Star, Clock, MapPin, Plus, Minus, ArrowLeft, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { StarRating } from '@/components/shared/SharedComponents';

export default function RestaurantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, items, updateQuantity, totalAmount, totalItems } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const restaurant = mockRestaurants.find(r => r.id === id);
  const foodItems = mockFoodItems.filter(f => f.restaurantId === id);
  const reviews = mockReviews.filter(r => r.restaurantId === id);

  if (!restaurant) return <div className="container py-20 text-center text-muted-foreground">Restaurant not found</div>;

  const categories = ['All', ...new Set(foodItems.map(f => f.category))];
  const filtered = selectedCategory === 'All' ? foodItems : foodItems.filter(f => f.category === selectedCategory);

  const getCartQty = (foodId: string) => items.find(i => i.foodItem.id === foodId)?.quantity || 0;

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="relative h-56 md:h-72 overflow-hidden">
        <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="absolute top-4 left-4 bg-background/50 backdrop-blur-sm">
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </div>

      <div className="container px-4 -mt-16 relative z-10">
        <div className="glass-card p-6 mb-6">
          <h1 className="text-2xl font-bold">{restaurant.name}</h1>
          <p className="text-muted-foreground mt-1">{restaurant.cuisine} • {restaurant.description}</p>
          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm">
            <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-neon-orange text-neon-orange" /> {restaurant.rating} ({restaurant.reviewCount} reviews)</span>
            <span className="flex items-center gap-1 text-muted-foreground"><Clock className="w-4 h-4" /> {restaurant.deliveryTime}</span>
            <span className="flex items-center gap-1 text-muted-foreground"><MapPin className="w-4 h-4" /> {restaurant.location}</span>
            <span className="text-primary font-medium">₹{restaurant.deliveryFee} delivery</span>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6">
          {categories.map(c => (
            <Button key={c} variant={selectedCategory === c ? 'default' : 'outline'} size="sm" onClick={() => setSelectedCategory(c)}
              className={`whitespace-nowrap ${selectedCategory === c ? 'gradient-neon text-background' : ''}`}>
              {c}
            </Button>
          ))}
        </div>

        {/* Food Items */}
        <div className="space-y-3">
          {filtered.map((item, i) => {
            const qty = getCartQty(item.id);
            return (
              <motion.div key={item.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                className="glass-card p-4 flex gap-4 hover:border-primary/20 transition-all">
                <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{item.name}</h3>
                        {item.isVeg && <Leaf className="w-3.5 h-3.5 text-neon-green" />}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{item.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-lg font-bold text-primary">₹{item.price}</span>
                    {qty === 0 ? (
                      <Button size="sm" onClick={() => addItem(item)} className="gradient-neon text-background hover:opacity-90">
                        <Plus className="w-4 h-4 mr-1" /> Add
                      </Button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Button size="icon" variant="outline" className="w-8 h-8" onClick={() => updateQuantity(item.id, qty - 1)}>
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-6 text-center font-semibold">{qty}</span>
                        <Button size="icon" className="w-8 h-8 gradient-neon text-background" onClick={() => addItem(item)}>
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Reviews */}
        {reviews.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-bold mb-4">Reviews</h2>
            <div className="space-y-3">
              {reviews.map(r => (
                <div key={r.id} className="glass-card p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{r.userName}</span>
                    <StarRating rating={r.rating} />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{r.comment}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Cart Footer */}
      {totalItems > 0 && (
        <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-border p-4 z-50">
          <div className="container flex items-center justify-between">
            <div>
              <span className="text-sm text-muted-foreground">{totalItems} items</span>
              <p className="text-lg font-bold text-primary">₹{totalAmount}</p>
            </div>
            <Button onClick={() => navigate('/cart')} className="gradient-neon text-background neon-glow-green">
              View Cart →
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

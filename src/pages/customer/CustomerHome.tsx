import { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockRestaurants, mockFoodItems, cuisineCategories } from '@/data/mock-data';
import { Search, MapPin, Clock, Star, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';

export default function CustomerHome() {
  const [search, setSearch] = useState('');

  const filteredRestaurants = mockRestaurants.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.cuisine.toLowerCase().includes(search.toLowerCase())
  );

  const topRated = [...mockRestaurants].sort((a, b) => b.rating - a.rating).slice(0, 4);
  const popularItems = [...mockFoodItems].sort((a, b) => b.rating - a.rating).slice(0, 6);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-neon-green/5 via-transparent to-transparent" />
        <div className="container relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Delicious food,<br />
              <span className="neon-text-green text-primary">delivered fast</span>
            </h1>
            <p className="text-muted-foreground mb-8">Order from the best restaurants in your city</p>
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search restaurants or cuisines..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10 h-12 bg-muted/50 border-border text-base"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container px-4 pb-20 space-y-12">
        {/* Cuisine Categories */}
        <section>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-neon-orange" /> Explore Cuisines
          </h2>
          <div className="grid grid-cols-4 md:grid-cols-7 gap-3">
            {cuisineCategories.map((cat, i) => (
              <motion.div key={cat.name} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
                <Link to={`/restaurants?cuisine=${cat.name}`} className="glass-card p-4 text-center hover:border-primary/50 transition-all block group">
                  <span className="text-3xl">{cat.icon}</span>
                  <p className="text-xs mt-2 text-muted-foreground group-hover:text-foreground transition-colors">{cat.name}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Top Rated */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Star className="w-5 h-5 text-neon-orange fill-neon-orange" /> Top Rated
            </h2>
            <Link to="/restaurants" className="text-sm text-primary hover:underline">View all →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {topRated.map((r, i) => (
              <motion.div key={r.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Link to={`/restaurant/${r.id}`} className="glass-card overflow-hidden group block hover:border-primary/30 transition-all">
                  <div className="h-40 overflow-hidden">
                    <img src={r.image} alt={r.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold">{r.name}</h3>
                    <p className="text-sm text-muted-foreground">{r.cuisine}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-neon-orange text-neon-orange" />
                        <span className="text-sm font-medium">{r.rating}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" /> {r.deliveryTime}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Popular Items */}
        <section>
          <h2 className="text-xl font-bold mb-4">🔥 Popular Right Now</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {popularItems.map((item, i) => (
              <motion.div key={item.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Link to={`/restaurant/${item.restaurantId}`} className="glass-card overflow-hidden group block">
                  <div className="h-28 overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-primary font-semibold">₹{item.price}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* All Restaurants (filtered) */}
        {search && (
          <section>
            <h2 className="text-xl font-bold mb-4">Search Results</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRestaurants.map(r => (
                <Link key={r.id} to={`/restaurant/${r.id}`} className="glass-card overflow-hidden group block hover:border-primary/30 transition-all">
                  <div className="h-40 overflow-hidden">
                    <img src={r.image} alt={r.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold">{r.name}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" /> {r.location}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-neon-orange text-neon-orange" />
                        <span className="text-sm">{r.rating}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{r.deliveryTime}</span>
                    </div>
                  </div>
                </Link>
              ))}
              {filteredRestaurants.length === 0 && <p className="text-muted-foreground col-span-full text-center py-8">No restaurants found</p>}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

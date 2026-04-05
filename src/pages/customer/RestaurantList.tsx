import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { mockRestaurants } from '@/data/mock-data';
import { Search, MapPin, Clock, Star, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const cuisines = ['All', 'North Indian', 'South Indian', 'Chinese', 'Italian', 'Mughlai', 'Street Food', 'Healthy'];

export default function RestaurantList() {
  const [searchParams] = useSearchParams();
  const initialCuisine = searchParams.get('cuisine') || 'All';
  const [search, setSearch] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState(initialCuisine);
  const [sortBy, setSortBy] = useState<'rating' | 'deliveryTime' | 'name'>('rating');

  let filtered = mockRestaurants.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.cuisine.toLowerCase().includes(search.toLowerCase());
    const matchesCuisine = selectedCuisine === 'All' || r.cuisine === selectedCuisine;
    return matchesSearch && matchesCuisine;
  });

  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return parseInt(a.deliveryTime) - parseInt(b.deliveryTime);
  });

  return (
    <div className="container px-4 py-8 pb-20">
      <h1 className="text-2xl font-bold mb-6">All Restaurants</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search restaurants..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 bg-muted/50" />
        </div>
        <div className="flex gap-2">
          {(['rating', 'name', 'deliveryTime'] as const).map(s => (
            <Button key={s} variant={sortBy === s ? 'default' : 'outline'} size="sm" onClick={() => setSortBy(s)} className={sortBy === s ? 'gradient-neon text-background' : ''}>
              {s === 'rating' ? '⭐ Rating' : s === 'name' ? '📝 Name' : '⏱️ Time'}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
        {cuisines.map(c => (
          <Button key={c} variant={selectedCuisine === c ? 'default' : 'outline'} size="sm" onClick={() => setSelectedCuisine(c)}
            className={`whitespace-nowrap ${selectedCuisine === c ? 'gradient-neon text-background' : 'border-border'}`}>
            {c}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((r, i) => (
          <motion.div key={r.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Link to={`/restaurant/${r.id}`} className="glass-card overflow-hidden group block hover:border-primary/30 transition-all">
              <div className="h-44 overflow-hidden relative">
                <img src={r.image} alt={r.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-neon-orange text-neon-orange" />
                  <span className="text-xs font-semibold">{r.rating}</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg">{r.name}</h3>
                <p className="text-sm text-muted-foreground">{r.cuisine} • {r.description}</p>
                <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {r.deliveryTime}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {r.location.split(',')[0]}</span>
                  <span className="text-primary font-medium">₹{r.deliveryFee} delivery</span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
      {filtered.length === 0 && <p className="text-center text-muted-foreground py-16">No restaurants found matching your criteria</p>}
    </div>
  );
}

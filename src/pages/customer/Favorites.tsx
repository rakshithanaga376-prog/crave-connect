import { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockRestaurants, mockFoodItems } from '@/data/mock-data';
import { Heart, Star, Clock } from 'lucide-react';

export default function Favorites() {
  // Mock favorites - in real app would come from user state
  const [favoriteIds] = useState(['r1', 'r5', 'r4']);

  const favorites = mockRestaurants.filter(r => favoriteIds.includes(r.id));

  if (favorites.length === 0) {
    return (
      <div className="container px-4 py-20 text-center">
        <Heart className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">No favorites yet</h2>
        <p className="text-muted-foreground">Save your favorite restaurants here</p>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Favorites</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {favorites.map(r => (
          <Link key={r.id} to={`/restaurant/${r.id}`} className="glass-card overflow-hidden group block hover:border-neon-pink/30 transition-all">
            <div className="h-40 overflow-hidden relative">
              <img src={r.image} alt={r.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute top-3 right-3">
                <Heart className="w-5 h-5 fill-neon-pink text-neon-pink" />
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold">{r.name}</h3>
              <p className="text-sm text-muted-foreground">{r.cuisine}</p>
              <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-neon-orange text-neon-orange" /> {r.rating}</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {r.deliveryTime}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

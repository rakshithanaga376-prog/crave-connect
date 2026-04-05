import { mockRestaurants } from '@/data/mock-data';
import { Star, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function AdminRestaurants() {
  return (
    <div className="container px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Restaurant Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockRestaurants.map(r => (
          <div key={r.id} className="glass-card p-4 flex items-center gap-4">
            <img src={r.image} alt={r.name} className="w-16 h-16 rounded-lg object-cover" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{r.name}</h3>
                <Badge className={r.isActive ? 'bg-neon-green/20 text-neon-green' : 'bg-destructive/20 text-destructive'}>
                  {r.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{r.cuisine}</p>
              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-neon-orange text-neon-orange" /> {r.rating}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {r.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

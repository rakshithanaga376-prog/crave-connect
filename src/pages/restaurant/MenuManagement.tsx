import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { mockRestaurants, mockFoodItems, FoodItem } from '@/data/mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, Leaf } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

export default function MenuManagement() {
  const { user } = useAuth();
  const myRestaurants = mockRestaurants.filter(r => r.ownerId === user?.id);
  const [items, setItems] = useState<FoodItem[]>(mockFoodItems.filter(f => myRestaurants.some(r => r.id === f.restaurantId)));
  const [editItem, setEditItem] = useState<Partial<FoodItem> | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    if (!editItem?.name || !editItem?.price) { toast.error('Fill required fields'); return; }
    if (editItem.id) {
      setItems(prev => prev.map(i => i.id === editItem.id ? { ...i, ...editItem } as FoodItem : i));
      toast.success('Item updated');
    } else {
      const newItem: FoodItem = {
        id: `f${Date.now()}`,
        restaurantId: myRestaurants[0]?.id || 'r1',
        name: editItem.name,
        description: editItem.description || '',
        price: editItem.price,
        image: editItem.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300',
        category: editItem.category || 'Main Course',
        isVeg: editItem.isVeg || false,
        isAvailable: true,
        rating: 4.0,
      };
      setItems(prev => [newItem, ...prev]);
      toast.success('Item added');
    }
    setEditItem(null);
    setIsOpen(false);
  };

  const toggleAvailability = (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, isAvailable: !i.isAvailable } : i));
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
    toast.success('Item removed');
  };

  return (
    <div className="container px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Menu Management</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditItem({})} className="gradient-neon text-background"><Plus className="w-4 h-4 mr-2" /> Add Item</Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader><DialogTitle>{editItem?.id ? 'Edit Item' : 'Add New Item'}</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-4">
              <div><Label>Name</Label><Input value={editItem?.name || ''} onChange={e => setEditItem(p => ({ ...p, name: e.target.value }))} className="mt-1 bg-muted/50" /></div>
              <div><Label>Description</Label><Input value={editItem?.description || ''} onChange={e => setEditItem(p => ({ ...p, description: e.target.value }))} className="mt-1 bg-muted/50" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Price (₹)</Label><Input type="number" value={editItem?.price || ''} onChange={e => setEditItem(p => ({ ...p, price: Number(e.target.value) }))} className="mt-1 bg-muted/50" /></div>
                <div><Label>Category</Label><Input value={editItem?.category || ''} onChange={e => setEditItem(p => ({ ...p, category: e.target.value }))} className="mt-1 bg-muted/50" /></div>
              </div>
              <div><Label>Image URL</Label><Input value={editItem?.image || ''} onChange={e => setEditItem(p => ({ ...p, image: e.target.value }))} className="mt-1 bg-muted/50" /></div>
              <div className="flex items-center gap-2">
                <Switch checked={editItem?.isVeg || false} onCheckedChange={v => setEditItem(p => ({ ...p, isVeg: v }))} />
                <Label>Vegetarian</Label>
              </div>
              <Button onClick={handleSave} className="w-full gradient-neon text-background">Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {items.map(item => (
          <div key={item.id} className={`glass-card p-4 flex items-center gap-4 ${!item.isAvailable ? 'opacity-50' : ''}`}>
            <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{item.name}</h3>
                {item.isVeg && <Leaf className="w-3.5 h-3.5 text-neon-green" />}
              </div>
              <p className="text-xs text-muted-foreground">{item.category} • {item.description}</p>
              <p className="text-primary font-bold mt-1">₹{item.price}</p>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={item.isAvailable} onCheckedChange={() => toggleAvailability(item.id)} />
              <Button size="icon" variant="ghost" onClick={() => { setEditItem(item); setIsOpen(true); }}><Edit className="w-4 h-4" /></Button>
              <Button size="icon" variant="ghost" className="text-destructive" onClick={() => deleteItem(item.id)}><Trash2 className="w-4 h-4" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

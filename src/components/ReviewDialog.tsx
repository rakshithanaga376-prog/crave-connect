import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { sounds } from '@/utils/sounds';
import { useAuth } from '@/contexts/AuthContext';

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  restaurantId: string;
  restaurantName: string;
}

function StarRating({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) {
  const [hover, setHover] = useState(0);
  return (
    <div>
      <p className="text-sm font-medium mb-1.5">{label}</p>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            onClick={() => { onChange(star); sounds.click(); }}
            className="transition-transform hover:scale-110"
          >
            <Star
              className={`w-7 h-7 ${(hover || value) >= star ? 'fill-neon-orange text-neon-orange' : 'text-muted-foreground/40'}`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ReviewDialog({ open, onOpenChange, orderId, restaurantId, restaurantName }: ReviewDialogProps) {
  const { user } = useAuth();
  const [foodRating, setFoodRating] = useState(0);
  const [deliveryRating, setDeliveryRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (foodRating === 0) { toast.error('Please rate the food'); return; }
    if (!user) { toast.error('Please sign in to leave a review'); return; }

    setLoading(true);
    const { error } = await supabase.from('reviews').insert({
      user_id: user.id,
      order_id: orderId,
      restaurant_id: restaurantId,
      rating: foodRating,
      delivery_rating: deliveryRating || null,
      comment: comment.trim() || null,
    });
    setLoading(false);

    if (error) {
      toast.error('Failed to submit review');
      console.error(error);
      return;
    }

    sounds.deliveryComplete();
    toast.success('Thanks for your review! 🎉');
    onOpenChange(false);
    setFoodRating(0);
    setDeliveryRating(0);
    setComment('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-neon-orange/20 max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-lg">Rate your order</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            How was your experience with {restaurantName}?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          <StarRating value={foodRating} onChange={setFoodRating} label="Food Quality" />
          <StarRating value={deliveryRating} onChange={setDeliveryRating} label="Delivery Experience" />

          <div>
            <p className="text-sm font-medium mb-1.5">Comment (optional)</p>
            <Textarea
              placeholder="Tell us about your experience..."
              value={comment}
              onChange={e => setComment(e.target.value)}
              maxLength={500}
              className="bg-muted/50 border-border resize-none h-20"
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={loading || foodRating === 0}
            className="w-full gradient-neon text-background font-semibold hover:opacity-90 neon-glow-green"
          >
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Submit Review
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

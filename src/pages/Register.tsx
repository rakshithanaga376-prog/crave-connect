import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UtensilsCrossed } from 'lucide-react';
import type { User } from '@/data/mock-data';

const roles: { value: User['role']; label: string; icon: string; desc: string }[] = [
  { value: 'customer', label: 'Customer', icon: '👤', desc: 'Order food from restaurants' },
  { value: 'restaurant', label: 'Restaurant Owner', icon: '🍽️', desc: 'Manage your restaurant' },
  { value: 'delivery', label: 'Delivery Partner', icon: '🚴', desc: 'Deliver food & earn' },
  { value: 'admin', label: 'Admin', icon: '🧑‍💼', desc: 'Manage the platform' },
];

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<User['role']>('customer');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (register(name, email, phone, role)) {
      navigate(role === 'customer' ? '/' : `/${role}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-neon-orange/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-neon-cyan/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl gradient-neon flex items-center justify-center mx-auto mb-4 neon-glow-green">
            <UtensilsCrossed className="w-8 h-8 text-background" />
          </div>
          <h1 className="text-3xl font-bold neon-text-green">Join NeonEats</h1>
          <p className="text-muted-foreground mt-2">Create your account</p>
        </div>

        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Select your role</Label>
              <div className="grid grid-cols-2 gap-2 mt-1.5">
                {roles.map(r => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={`p-3 rounded-lg border text-left transition-all text-sm ${role === r.value ? 'border-primary bg-primary/10 neon-glow-green' : 'border-border bg-muted/30 hover:bg-muted/50'}`}
                  >
                    <span className="text-lg">{r.icon}</span>
                    <p className="font-medium mt-1">{r.label}</p>
                    <p className="text-xs text-muted-foreground">{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} className="mt-1.5 bg-muted/50 border-border" required />
            </div>
            <div>
              <Label htmlFor="reg-email">Email</Label>
              <Input id="reg-email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} className="mt-1.5 bg-muted/50 border-border" required />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="tel" placeholder="+91 98765 43210" value={phone} onChange={e => setPhone(e.target.value)} className="mt-1.5 bg-muted/50 border-border" required />
            </div>
            <div>
              <Label htmlFor="reg-password">Password</Label>
              <Input id="reg-password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className="mt-1.5 bg-muted/50 border-border" required />
            </div>
            <Button type="submit" className="w-full gradient-neon text-background font-semibold hover:opacity-90 neon-glow-green">
              Create Account
            </Button>
          </form>

          <p className="text-sm text-center text-muted-foreground mt-6">
            Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

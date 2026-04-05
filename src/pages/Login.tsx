import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UtensilsCrossed, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      navigate('/');
    }
  };

  const demoLogin = (email: string) => {
    if (login(email, 'demo')) {
      const user = email.includes('admin') ? '/admin' :
                   email.includes('deepak') ? '/delivery' :
                   email.includes('amit') ? '/restaurant' : '/';
      navigate(user);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-green/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-orange/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl gradient-neon flex items-center justify-center mx-auto mb-4 neon-glow-green">
            <UtensilsCrossed className="w-8 h-8 text-background" />
          </div>
          <h1 className="text-3xl font-bold neon-text-green">NeonEats</h1>
          <p className="text-muted-foreground mt-2">Sign in to your account</p>
        </div>

        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} className="mt-1.5 bg-muted/50 border-border" required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1.5">
                <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className="bg-muted/50 border-border pr-10" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full gradient-neon text-background font-semibold hover:opacity-90 neon-glow-green">
              Sign In
            </Button>
          </form>

          <div className="mt-6">
            <p className="text-xs text-muted-foreground text-center mb-3">Quick demo login</p>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={() => demoLogin('rahul@example.com')} className="text-xs border-neon-green/30 text-neon-green hover:bg-neon-green/10">👤 Customer</Button>
              <Button variant="outline" size="sm" onClick={() => demoLogin('amit@example.com')} className="text-xs border-neon-orange/30 text-neon-orange hover:bg-neon-orange/10">🍽️ Restaurant</Button>
              <Button variant="outline" size="sm" onClick={() => demoLogin('deepak@example.com')} className="text-xs border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10">🚴 Delivery</Button>
              <Button variant="outline" size="sm" onClick={() => demoLogin('admin@example.com')} className="text-xs border-neon-purple/30 text-neon-purple hover:bg-neon-purple/10">🧑‍💼 Admin</Button>
            </div>
          </div>

          <p className="text-sm text-center text-muted-foreground mt-6">
            Don't have an account? <Link to="/register" className="text-primary hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

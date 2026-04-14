import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UtensilsCrossed, Loader2, Eye, EyeOff } from 'lucide-react';
import { lovable } from '@/integrations/lovable';
import { toast } from 'sonner';
import { sounds } from '@/utils/sounds';
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
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<User['role']>('customer');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { register, signupWithEmail } = useAuth();
  const navigate = useNavigate();

  const handleDemoRegister = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.click();
    if (register(name, email, phone, role)) {
      sounds.orderPlaced();
      navigate(role === 'customer' ? '/' : `/${role}`);
    }
  };

  const handleRealRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); sounds.error(); return; }
    setLoading(true);
    const success = await signupWithEmail(email, password, name, phone, role);
    setLoading(false);
    if (success) {
      sounds.orderPlaced();
      navigate('/login');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      sounds.click();
      const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
      if (result.error) { toast.error('Google sign-in failed.'); sounds.error(); }
    } catch { toast.error('Google sign-in failed.'); sounds.error(); }
    finally { setGoogleLoading(false); }
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
          {/* Google Sign Up */}
          <Button
            type="button" variant="outline"
            className="w-full mb-4 border-border hover:bg-muted/50 h-11 text-sm font-medium"
            onClick={handleGoogleSignIn} disabled={googleLoading}
          >
            {googleLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : (
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            Continue with Google
          </Button>

          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">or</span></div>
          </div>

          <Tabs defaultValue="real" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="real">Email Signup</TabsTrigger>
              <TabsTrigger value="demo">Demo Signup</TabsTrigger>
            </TabsList>

            <TabsContent value="real">
              <form onSubmit={handleRealRegister} className="space-y-3">
                <div>
                  <Label>Role</Label>
                  <div className="grid grid-cols-2 gap-2 mt-1.5">
                    {roles.map(r => (
                      <button key={r.value} type="button" onClick={() => { setRole(r.value); sounds.click(); }}
                        className={`p-2.5 rounded-lg border text-left transition-all text-sm ${role === r.value ? 'border-primary bg-primary/10 neon-glow-green' : 'border-border bg-muted/30 hover:bg-muted/50'}`}>
                        <span className="text-lg">{r.icon}</span>
                        <p className="font-medium text-xs mt-1">{r.label}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="r-name">Full Name</Label>
                  <Input id="r-name" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} className="mt-1 bg-muted/50 border-border" required />
                </div>
                <div>
                  <Label htmlFor="r-email">Email</Label>
                  <Input id="r-email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 bg-muted/50 border-border" required />
                </div>
                <div>
                  <Label htmlFor="r-phone">Phone</Label>
                  <Input id="r-phone" type="tel" placeholder="+91 98765 43210" value={phone} onChange={e => setPhone(e.target.value)} className="mt-1 bg-muted/50 border-border" required />
                </div>
                <div>
                  <Label htmlFor="r-pass">Password</Label>
                  <div className="relative mt-1">
                    <Input id="r-pass" type={showPassword ? 'text' : 'password'} placeholder="Min. 6 characters" value={password} onChange={e => setPassword(e.target.value)} className="bg-muted/50 border-border pr-10" required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full gradient-neon text-background font-semibold hover:opacity-90 neon-glow-green" disabled={loading}>
                  {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Create Account
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="demo">
              <form onSubmit={handleDemoRegister} className="space-y-3">
                <div>
                  <Label>Role</Label>
                  <div className="grid grid-cols-2 gap-2 mt-1.5">
                    {roles.map(r => (
                      <button key={r.value} type="button" onClick={() => { setRole(r.value); sounds.click(); }}
                        className={`p-2.5 rounded-lg border text-left transition-all text-sm ${role === r.value ? 'border-primary bg-primary/10 neon-glow-green' : 'border-border bg-muted/30 hover:bg-muted/50'}`}>
                        <span className="text-lg">{r.icon}</span>
                        <p className="font-medium text-xs mt-1">{r.label}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <div><Label htmlFor="d-name">Full Name</Label><Input id="d-name" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} className="mt-1 bg-muted/50 border-border" required /></div>
                <div><Label htmlFor="d-email">Email</Label><Input id="d-email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 bg-muted/50 border-border" required /></div>
                <div><Label htmlFor="d-phone">Phone</Label><Input id="d-phone" type="tel" placeholder="+91 98765 43210" value={phone} onChange={e => setPhone(e.target.value)} className="mt-1 bg-muted/50 border-border" required /></div>
                <div><Label htmlFor="d-pass">Password</Label><Input id="d-pass" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className="mt-1 bg-muted/50 border-border" required /></div>
                <Button type="submit" className="w-full gradient-neon text-background font-semibold hover:opacity-90 neon-glow-green">Create Demo Account</Button>
              </form>
            </TabsContent>
          </Tabs>

          <p className="text-sm text-center text-muted-foreground mt-6">
            Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

import { mockDeliveryPartners } from '@/data/mock-data';
import { useAuth } from '@/contexts/AuthContext';
import { StatCard } from '@/components/shared/SharedComponents';
import { DollarSign, TrendingUp, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function DeliveryEarnings() {
  const { user } = useAuth();
  const partner = mockDeliveryPartners.find(dp => dp.userId === user?.id) || mockDeliveryPartners[0];

  const earningsData = [
    { day: 'Mon', earnings: 450, deliveries: 5 },
    { day: 'Tue', earnings: 680, deliveries: 8 },
    { day: 'Wed', earnings: 520, deliveries: 6 },
    { day: 'Thu', earnings: 810, deliveries: 9 },
    { day: 'Fri', earnings: 1050, deliveries: 12 },
    { day: 'Sat', earnings: 1320, deliveries: 15 },
    { day: 'Sun', earnings: 1140, deliveries: 13 },
  ];

  const weeklyTotal = earningsData.reduce((s, d) => s + d.earnings, 0);

  return (
    <div className="container px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Earnings</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard title="Total Earnings" value={`₹${partner.totalEarnings.toLocaleString('en-IN')}`} icon={DollarSign} glowColor="green" />
        <StatCard title="This Week" value={`₹${weeklyTotal.toLocaleString('en-IN')}`} icon={TrendingUp} glowColor="orange" />
        <StatCard title="Total Deliveries" value={partner.totalDeliveries} icon={Calendar} glowColor="cyan" />
      </div>

      <div className="glass-card p-6">
        <h3 className="font-semibold mb-4">Weekly Earnings</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={earningsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 15%)" />
            <XAxis dataKey="day" stroke="hsl(0 0% 55%)" fontSize={12} />
            <YAxis stroke="hsl(0 0% 55%)" fontSize={12} />
            <Tooltip contentStyle={{ background: 'hsl(0 0% 7%)', border: '1px solid hsl(0 0% 15%)', borderRadius: '8px' }} formatter={(v: number) => [`₹${v}`, 'Earnings']} />
            <Bar dataKey="earnings" fill="hsl(142 71% 45%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

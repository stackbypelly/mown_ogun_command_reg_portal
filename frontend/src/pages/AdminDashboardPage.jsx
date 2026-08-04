import { useEffect, useState } from 'react';
import { Users, BadgeCheck, Hourglass, AlertCircle, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../lib/api';

const DashboardCard = ({ title, value, icon: Icon, tone }) => (
  <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm h-full">
    <div className="flex h-full flex-col justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">{title}</p>
        <p className="mt-3 text-3xl font-semibold text-slate-900">{value}</p>
      </div>
      <div className={`mt-6 self-start rounded-2xl p-3 ${tone}`}>
        <Icon size={20} />
      </div>
    </div>
  </div>
);

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, rejected: 0, active: 0 });
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, membersRes] = await Promise.all([api.get('/stats'), api.get('/members')]);
        setStats(statsRes.data);
        setMembers(membersRes.data);
      } catch (error) {
        console.error(error);
      }
    };
    load();
  }, []);

  const pieData = [
    { name: 'Approved', value: stats.approved },
    { name: 'Pending', value: stats.pending },
    { name: 'Rejected', value: stats.rejected },
  ];

  const barData = members.slice(0, 6).map((member) => ({ name: member.surname, count: 1 }));

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#022969]">Dashboard Overview</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">Here is a live overview of the Ogun State Command membership database.</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <DashboardCard title="Total Members" value={stats.total} icon={Users} tone="bg-slate-900 text-white" />
        <DashboardCard title="Pending" value={stats.pending} icon={Hourglass} tone="bg-[#022969]/10 text-[#022969]" />
        <DashboardCard title="Approved" value={stats.approved} icon={BadgeCheck} tone="bg-emerald-100 text-emerald-700" />
        <DashboardCard title="Rejected" value={stats.rejected} icon={AlertCircle} tone="bg-rose-100 text-rose-700" />
        <DashboardCard title="Active" value={stats.active} icon={Activity} tone="bg-sky-100 text-sky-700" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Registration Status</h3>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110}>
                  <Cell fill="#0f172a" />
                  <Cell fill="#f59e0b" />
                  <Cell fill="#ef4444" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Recent Registrations</h3>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#f59e0b" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;

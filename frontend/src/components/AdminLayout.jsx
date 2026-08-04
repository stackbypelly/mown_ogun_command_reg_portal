import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, FileCheck2, BadgeCheck, ShieldCheck, BarChart3, Download, UserCog, Settings, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';
import api from '../lib/api';

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/members', label: 'All Members', icon: Users },
  { to: '/admin/pending', label: 'Pending', icon: FileCheck2 },
  { to: '/admin/approved', label: 'Approved', icon: BadgeCheck },
  { to: '/admin/rejected', label: 'Rejected', icon: ShieldCheck },
  { to: '/admin/statistics', label: 'Statistics', icon: BarChart3 },
  { to: '/admin/export', label: 'Export Data', icon: Download },
  { to: '/admin/users', label: 'Admin Users', icon: UserCog },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error(error);
    } finally {
      localStorage.removeItem('mow-token');
      navigate('/admin/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex">
        <aside className={`fixed inset-y-0 left-0 z-20 w-72 transform border-r border-slate-200 bg-slate-950 p-6 text-slate-200 transition ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#022969]">Admin</p>
              <h2 className="mt-1 text-xl font-semibold text-white">MOW Portal</h2>
            </div>
          </div>
          <nav className="mt-8 space-y-2">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${isActive ? 'bg-[#022969] text-white' : 'text-slate-300 hover:bg-slate-800'}`}>
                <Icon size={18} /> {label}
              </NavLink>
            ))}
            <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium text-slate-300 hover:bg-slate-800">
              <LogOut size={18} /> Logout
            </button>
          </nav>
        </aside>
        <div className="flex-1 lg:ml-72">
          <header className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button className="rounded-full border border-slate-300 p-2 lg:hidden" onClick={() => setMobileOpen((prev) => !prev)}>
                  <Menu size={18} />
                </button>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#022969]">Dashboard</p>
                  <h1 className="text-xl font-semibold text-slate-900">Welcome back, Admin</h1>
                </div>
              </div>
            </div>
          </header>
          <main className="p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

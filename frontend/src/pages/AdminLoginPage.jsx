import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import api from '../lib/api';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/login', form);
      localStorage.setItem('mow-token', response.data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-16 sm:px-6 lg:px-8">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#022969] text-white">
            <Lock size={24} />
          </div>
          <h1 className="mt-4 text-2xl font-semibold text-slate-900">Admin Sign In</h1>
          <p className="mt-2 text-sm text-slate-600">Secure access to the Man O' War Nigeria Ogun State Command portal.</p>
        </div>
        {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="flex items-center gap-3 rounded-2xl border border-slate-300 px-3 py-3 text-sm text-slate-700">
            <Mail size={16} className="text-slate-400" />
            <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="Email address" className="w-full border-0 outline-none" required />
          </label>
          <label className="flex items-center gap-3 rounded-2xl border border-slate-300 px-3 py-3 text-sm text-slate-700">
            <Lock size={16} className="text-slate-400" />
            <input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Password" className="w-full border-0 outline-none" required />
          </label>
          <button type="submit" disabled={loading} className="w-full rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60">
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>
      </div>
    </main>
  );
};

export default AdminLoginPage;

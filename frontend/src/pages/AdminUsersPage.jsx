import { useEffect, useState } from 'react';
import { UserPlus } from 'lucide-react';
import Swal from 'sweetalert2';
import api from '../lib/api';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [creating, setCreating] = useState(false);
  const token = localStorage.getItem('mow-token');
  const currentUser = token ? JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))) : {};
  const canCreateAdmin = currentUser.role === 'SUPER_ADMIN';

  const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await api.get('/users');
        setUsers(response.data);
        setError('');
      } catch (err) {
        console.error('Failed to fetch users:', err);
        setError(err.response?.data?.message || 'Unable to load admin users.');
      } finally {
        setLoading(false);
      }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateAdmin = async (event) => {
    event.preventDefault();
    setCreating(true);
    try {
      await api.post('/users', form);
      setForm({ name: '', email: '', password: '' });
      await fetchUsers();
      await Swal.fire({ icon: 'success', title: 'Admin account created', text: 'The new administrator can now sign in.' });
    } catch (err) {
      await Swal.fire({ icon: 'error', title: 'Unable to create account', text: err.response?.data?.message || 'Please try again.' });
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#022969]">Admin Users</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">Manage administrator accounts</h2>
          </div>
          {canCreateAdmin && <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Super Admin access</span>}
        </div>
      </div>

      {canCreateAdmin && (
        <form onSubmit={handleCreateAdmin} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-[#022969]/10 p-3 text-[#022969]"><UserPlus size={20} /></div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Create admin access</h3>
              <p className="text-sm text-slate-500">Create an active administrator account.</p>
            </div>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Full name" className="rounded-xl border border-slate-300 px-3 py-2" required />
            <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="Email address" className="rounded-xl border border-slate-300 px-3 py-2" required />
            <input type="password" minLength={8} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Password (8+ characters)" className="rounded-xl border border-slate-300 px-3 py-2" required />
          </div>
          <button type="submit" disabled={creating} className="mt-4 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
            {creating ? 'Creating account...' : 'Create admin account'}
          </button>
        </form>
      )}

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {error ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-rose-700">
                    {error}
                  </td>
                </tr>
              ) : loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                    Loading admin users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                    No admin users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-t border-slate-200">
                    <td className="px-4 py-3 font-semibold text-slate-900">{user.name}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3">{user.role}</td>
                    <td className="px-4 py-3">{user.status}</td>
                    <td className="px-4 py-3">{new Date(user.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;

import { useEffect, useState } from 'react';
import api from '../lib/api';

const SettingsPage = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await api.get('/settings');
        setSettings(response.data || {});
        setError('');
      } catch (err) {
        console.error('Failed to fetch settings:', err);
        setError(err.response?.data?.message || 'Unable to load settings.');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#022969]">Admin Settings</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">Portal configuration</h2>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm text-center text-slate-500">
          Loading settings...
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Site Mode</p>
              <p className="mt-2 text-slate-900">{settings.mode || 'Not configured'}</p>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Current Year</p>
              <p className="mt-2 text-slate-900">{settings.currentYear || new Date().getFullYear()}</p>
            </div>
          </div>
          <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-slate-700">
            <p className="text-sm font-semibold">Note</p>
            <p className="mt-2 text-sm">Settings are loaded from the backend and can be extended for email, export, or registration behavior.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;

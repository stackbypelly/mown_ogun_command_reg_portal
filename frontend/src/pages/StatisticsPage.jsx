import { useEffect, useState } from 'react';
import api from '../lib/api';

const StatisticsPage = () => {
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, rejected: 0, active: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await api.get('/stats');
        setStats(response.data);
        setError('');
      } catch (err) {
        console.error('Failed to fetch statistics:', err);
        setError(err.response?.data?.message || 'Failed to load statistics. Please ensure you have the required permissions.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#022969]">Reporting & Statistics</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">Dynamic registration statistics</h2>
      </div>
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm text-center text-slate-500">
          Loading statistics...
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {Object.entries(stats).map(([key, value]) => (
            <div key={key} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">{key.replace(/\b\w/g, (char) => char.toUpperCase())}</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StatisticsPage;

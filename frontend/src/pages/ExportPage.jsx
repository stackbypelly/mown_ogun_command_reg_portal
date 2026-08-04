import { useState } from 'react';
import api from '../lib/api';

const ExportPage = () => {
  const [message, setMessage] = useState('');
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState('');

  const handleExport = async () => {
    setExporting(true);
    setError('');
    setMessage('');

    try {
      const response = await api.get('/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', response.headers['content-disposition']?.split('filename=')[1] || 'members-export.csv');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      setMessage('Export is downloading.');
    } catch (err) {
      console.error('Export failed:', err);
      setError(err.response?.data?.message || 'Failed to export records.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#022969]">Data Export</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">Download member records</h2>
        <p className="mt-4 text-sm text-slate-600">Export membership data for reporting, backup, or offline analysis.</p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <button
          type="button"
          onClick={handleExport}
          disabled={exporting}
          className="rounded-full bg-[#022969] px-5 py-3 text-sm font-semibold text-white transition disabled:opacity-60"
        >
          {exporting ? 'Exporting…' : 'Export Members CSV'}
        </button>

        {message && <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div>}
        {error && <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}
      </div>
    </div>
  );
};

export default ExportPage;

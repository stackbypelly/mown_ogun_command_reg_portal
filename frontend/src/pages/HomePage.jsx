import { ArrowRight, ShieldCheck, Users, BadgeCheck, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomePage = () => (
  <main className="bg-slate-50">
    <section className="bg-[radial-gradient(circle_at_top_left,_rgba(2,41,105,0.2),_transparent_40%),linear-gradient(135deg,_#0f172a,_#1e293b)] py-20 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm">
            <ShieldCheck size={16} /> Official Member Registration Portal
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">Man O' War Nigeria</h1>
            <p className="text-2xl font-medium text-[#022969]">Ogun State Command</p>
            <p className="max-w-2xl text-lg text-slate-200">Register your membership details securely and help the Ogun State Command maintain an accurate and disciplined digital database.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/register" className="flex items-center gap-2 rounded-full bg-[#022969] px-6 py-3 font-semibold text-white">Register Now <ArrowRight size={16} /></Link>
            <Link to="/admin/login" className="rounded-full border border-white/30 px-6 py-3 font-semibold text-white">Admin Login</Link>
          </div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur">
          <h2 className="text-xl font-semibold">Registration Highlights</h2>
          <div className="mt-6 space-y-4 text-sm text-slate-200">
            <div className="flex items-start gap-3 rounded-2xl bg-white/10 p-4">
              <Users size={18} className="mt-0.5 text-[#022969]" />
              <div><p className="font-semibold">Secure online registration</p><p>Members can complete and review their information before submission.</p></div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl bg-white/10 p-4">
              <BadgeCheck size={18} className="mt-0.5 text-[#022969]" />
              <div><p className="font-semibold">Approval workflow</p><p>Admin staff can review, approve, reject, and manage membership records.</p></div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl bg-white/10 p-4">
              <Search size={18} className="mt-0.5 text-[#022969]" />
              <div><p className="font-semibold">Searchable records</p><p>Members and registration history can be tracked with filters and reporting.</p></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900">Registration Instructions</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li>1. Fill in your personal and organizational details.</li>
            <li>2. Upload your passport photograph.</li>
            <li>3. Review and confirm the information before submission.</li>
            <li>4. Keep your registration ID for future reference.</li>
          </ul>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900">Administrative Access</h3>
          <p className="mt-4 text-sm text-slate-600">Authorized administrators can securely log in, manage records, update statuses, export reports, and monitor registration trends.</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900">Contact</h3>
          <p className="mt-4 text-sm text-slate-600">For support, contact the Ogun State Command administration office.</p>
        </div>
      </div>
    </section>
  </main>
);

export default HomePage;

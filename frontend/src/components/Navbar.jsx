import { Link } from 'react-router-dom';
import { ShieldCheck, UserRound } from 'lucide-react';
import Logo from '../assets/man-o-war-logor.png';

const Navbar = () => (
  <header className="border-b border-slate-200 bg-white/95 backdrop-blur">
    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
      <Link to="/" className="flex items-center gap-3">
        {/* <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#022969] text-white shadow-sm">
          <ShieldCheck size={20} />
        </div> */}
        <div className="flex items-center gap-3">
          <img src={Logo} alt="Man O' War logo" className="h-15 w-15 rounded-full  border-slate-200 bg-white p-1" />
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#022969]">Man O' War Nigeria</p>
            <p className="text-xs text-slate-600">Ogun State Command</p>
          </div>
        </div>
      </Link>
      <nav className="flex items-center gap-3">
        <Link to="/register" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Register Now</Link>
        <Link to="/admin/login" className="flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
          <UserRound size={16} /> Admin Login
        </Link>
      </nav>
    </div>
  </header>
);

export default Navbar;

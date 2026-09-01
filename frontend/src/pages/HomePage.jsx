import { useEffect, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, ShieldCheck, Users, BadgeCheck, Search, ClipboardList, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import imageOne from '../assets/IMG_2204.JPG';
import imageTwo from '../assets/IMG_2203.JPG';
import imageThree from '../assets/IMG_2198.JPG';
import imageFour from '../assets/IMG_2196.JPG';
import imageFive from '../assets/IMG_2187.JPG';

const carouselImages = [imageOne, imageTwo, imageThree, imageFour, imageFive];

const HomePage = () => {
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveImage((currentImage) => (currentImage + 1) % carouselImages.length);
    }, 5500);

    return () => window.clearInterval(interval);
  }, []);

  const showPreviousImage = () => {
    setActiveImage((currentImage) => (currentImage - 1 + carouselImages.length) % carouselImages.length);
  };

  const showNextImage = () => {
    setActiveImage((currentImage) => (currentImage + 1) % carouselImages.length);
  };

  return (
  <main className="bg-slate-50">
    <section className="relative isolate overflow-hidden py-20 text-white">
      {carouselImages.map((image, index) => (
        <img
          key={image}
          src={image}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 -z-20 h-full w-full object-cover transition-opacity duration-1000 ${index === activeImage ? 'opacity-100' : 'opacity-0'}`}
        />
      ))}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(4,20,43,0.94)_0%,rgba(4,20,43,0.76)_48%,rgba(4,20,43,0.55)_100%)]" />
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
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-3" aria-label="Hero image carousel controls">
        <button type="button" onClick={showPreviousImage} aria-label="Show previous image" className="rounded-full border border-white/30 bg-black/20 p-2 text-white transition hover:bg-white/20">
          <ChevronLeft size={18} />
        </button>
        <div className="flex gap-2">
          {carouselImages.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActiveImage(index)}
              aria-label={`Show image ${index + 1}`}
              aria-current={index === activeImage ? 'true' : undefined}
              className={`h-2.5 w-2.5 rounded-full border border-white/70 transition ${index === activeImage ? 'bg-white' : 'bg-white/30 hover:bg-white/70'}`}
            />
          ))}
        </div>
        <button type="button" onClick={showNextImage} aria-label="Show next image" className="rounded-full border border-white/30 bg-black/20 p-2 text-white transition hover:bg-white/20">
          <ChevronRight size={18} />
        </button>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#022969]/10 text-[#022969]">
            <ClipboardList size={24} aria-hidden="true" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900">Registration Instructions</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li>1. Fill in your personal and organizational details.</li>
            <li>2. Upload your passport photograph.</li>
            <li>3. Review and confirm the information before submission.</li>
            <li>4. Keep your registration ID for future reference.</li>
          </ul>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
            <ShieldCheck size={24} aria-hidden="true" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900">Administrative Access</h3>
          <p className="mt-4 text-sm text-slate-600">Authorized administrators can securely log in, manage records, update statuses, export reports, and monitor registration trends.</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
            <Phone size={24} aria-hidden="true" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900">Contact</h3>
          <p className="mt-4 text-sm text-slate-600">For support, contact the Ogun State Command administration office.</p>
        </div>
      </div>
    </section>
  </main>
  );
};

export default HomePage;

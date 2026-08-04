import Logo from '../assets/man-o-war-logor.png';

const Footer = () => (
  <footer className="border-t border-slate-200 bg-slate-950 text-slate-300">
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:px-8">
      <div>
        
        <h3 className="flex gap-3 text-lg font-semibold text-white"> <img src={Logo} alt="Man O' War logo" className="h-10 w-10 rounded-full  border-slate-200 bg-white p-1" /> Man O' War Nigeria</h3>
        <p className="mt-2 text-sm">Official membership registration portal for the Ogun State Command.</p>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-white">Contact</h3>
        <p className="mt-2 text-sm">Headquarters, Ogun State Command</p>
        <p className="text-sm">Email: info@mowogun.gov.ng</p>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-white">Support</h3>
        <p className="mt-2 text-sm">Secure registration, admin review, and records management.</p>
      </div>
    </div>
  </footer>
);

export default Footer;

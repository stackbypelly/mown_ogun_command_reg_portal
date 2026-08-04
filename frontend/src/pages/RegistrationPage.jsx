import { useState } from 'react';
import { CheckCircle2, FileText } from 'lucide-react';
import RegistrationForm from '../components/RegistrationForm';

const RegistrationPage = () => {
  const [submittedMember, setSubmittedMember] = useState(null);

  if (submittedMember) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-3xl border border-emerald-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3 text-emerald-600">
            <CheckCircle2 size={28} />
            <h1 className="text-3xl font-semibold text-slate-900">Registration Successful</h1>
          </div>
          <p className="mt-4 text-slate-600">Thank you for registering with Man O' War Nigeria Ogun State Command.</p>
          <div className="mt-8 grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 md:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Registration ID</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{submittedMember.registrationId}</p>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Status</p>
              <p className="mt-2 text-lg font-semibold text-[#022969]">Pending Review</p>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Full Name</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{submittedMember.firstName} {submittedMember.surname}</p>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Date Submitted</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{new Date(submittedMember.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <button className="flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white">
              <FileText size={16} /> Download Registration Slip
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#022969]">Official Registration</p>
          <h1 className="text-3xl font-semibold text-slate-900">Member Registration Form</h1>
          <p className="max-w-3xl text-slate-600">Please complete the form carefully. All information entered will be reviewed by the Ogun State Command.</p>
        </div>
        <RegistrationForm onSubmitSuccess={setSubmittedMember} />
      </div>
    </main>
  );
};

export default RegistrationPage;

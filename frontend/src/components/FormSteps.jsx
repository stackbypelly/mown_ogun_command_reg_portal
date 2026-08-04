const steps = ['Personal Information', 'Contact Information', 'Man O\' War Information', 'Education & Occupation', 'Additional Information', 'Review & Submit'];

const FormSteps = ({ currentStep }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
    <div className="flex flex-wrap gap-2">
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const isActive = currentStep === stepNumber;
        const isComplete = currentStep > stepNumber;
        return (
          <div key={label} className={`rounded-full px-3 py-2 text-sm font-medium ${isActive ? 'bg-[#022969] text-white' : isComplete ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
            {stepNumber}. {label}
          </div>
        );
      })}
    </div>
  </div>
);

export default FormSteps;

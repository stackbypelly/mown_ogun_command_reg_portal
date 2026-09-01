import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, ArrowRight, CheckCircle2, ImagePlus } from 'lucide-react';
import api from '../lib/api';
import FormSteps from './FormSteps';

const schema = z.object({
  surname: z.string().min(1, 'Surname is required'),
  firstName: z.string().min(1, 'First name is required'),
  middleName: z.string().optional(),
  gender: z.string().min(1, 'Select gender'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  maritalStatus: z.string().min(1, 'Choose marital status'),
  nationality: z.string().min(1, 'Nationality is required'),
  stateOfOrigin: z.string().min(1, 'State of origin is required'),
  lgaOfOrigin: z.string().min(1, 'LGA is required'),
  placeOfBirth: z.string().min(1, 'Place of birth is required'),
  bloodGroup: z.string().min(1, 'Blood group is required'),
  genotype: z.string().min(1, 'Genotype is required'),
  phone: z.string().min(1, 'Phone number is required'),
  whatsapp: z.string().min(1, 'WhatsApp number is required'),
  email: z.string().email('Enter a valid email'),
  residentialAddress: z.string().min(1, 'Residential address is required'),
  stateOfResidence: z.string().min(1, 'State of residence is required'),
  lgaOfResidence: z.string().min(1, 'LGA of residence is required'),
  emergencyContactName: z.string().min(1, 'Emergency contact name is required'),
  emergencyContactPhone: z.string().min(1, 'Emergency contact phone is required'),
  emergencyContactRelationship: z.string().min(1, 'Relationship is required'),
  membershipNumber: z
    .string()
    .min(1, 'Membership / Service Number is required')
    .regex(/^MOWN\/NC\/\d{4,}$/, 'Use the format MOWN/NC/0001'),
  dateJoined: z.string().optional(),
  yearJoined: z.string().optional(),
  areaCommandId: z.string().optional(),
  unit: z.string().optional(),
  currentRank: z.string().optional(),
  previousRank: z.string().optional(),
  currentAppointment: z.string().optional(),
  previousAppointment: z.string().optional(),
  training: z.string().optional(),
  qualification: z.string().optional(),
  membershipStatus: z.string().optional(),
  previousCommand: z.string().optional(),
  dateTransferred: z.string().optional(),
  education: z.string().optional(),
  institution: z.string().optional(),
  course: z.string().optional(),
  occupation: z.string().optional(),
  employer: z.string().optional(),
  officeAddress: z.string().optional(),
  skills: z.string().optional(),
  certifications: z.string().optional(),
  religion: z.string().optional(),
  nextOfKin: z.string().optional(),
  nextOfKinPhone: z.string().optional(),
  nextOfKinAddress: z.string().optional(),
  additionalInformation: z.string().optional(),
  declarationAccepted: z.boolean().refine((value) => value, 'You must accept the declaration'),
});

const RegistrationForm = ({ onSubmitSuccess, initialData = {} }) => {
  const [step, setStep] = useState(1);
  const [previewImage, setPreviewImage] = useState('');
  const [photoError, setPhotoError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [commands, setCommands] = useState([]);
  const { register, handleSubmit, formState: { errors }, trigger, setValue, watch } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      declarationAccepted: false,
      ...initialData,
    },
  });

  const watchedValues = watch();

  useMemo(() => {
    api.get('/commands').then((response) => setCommands(response.data)).catch(() => {});
  }, []);

  const goNext = async () => {
    if (step === 1 && !previewImage) {
      setPhotoError('Passport photograph is required.');
      return;
    }

    const fieldsByStep = {
      1: ['surname', 'firstName', 'gender', 'dateOfBirth', 'maritalStatus', 'nationality', 'stateOfOrigin', 'lgaOfOrigin', 'placeOfBirth', 'bloodGroup', 'genotype'],
      2: ['phone', 'whatsapp', 'email', 'residentialAddress', 'stateOfResidence', 'lgaOfResidence', 'emergencyContactName', 'emergencyContactPhone', 'emergencyContactRelationship'],
      3: ['membershipNumber', 'dateJoined', 'yearJoined', 'areaCommandId', 'unit', 'currentRank', 'previousRank', 'currentAppointment', 'previousAppointment', 'training', 'qualification', 'membershipStatus', 'previousCommand', 'dateTransferred'],
      4: ['education', 'institution', 'course', 'occupation', 'employer', 'officeAddress', 'skills', 'certifications'],
      5: ['declarationAccepted'],
    };

    const valid = await trigger(fieldsByStep[step]);
    if (valid) setStep((prev) => prev + 1);
  };

  const goBack = () => setStep((prev) => prev - 1);

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setPhotoError('');
    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result);
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setError('');
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value instanceof File ? value : value);
        }
      });
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput?.files?.[0]) formData.append('passportPhoto', fileInput.files[0]);
      const response = await api.post('/members', formData);
      onSubmitSuccess(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <FormSteps currentStep={step} />
      {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-3xl border border-slate-200 bg-transparent p-6">
        {step === 1 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#022969]">Step 1 of 6</p>
                <h2 className="text-2xl font-semibold text-slate-900">Personal Information</h2>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="md:col-span-2 flex flex-col gap-2 text-sm font-medium text-slate-700">
                Passport Photograph
                <input type="file" accept="image/png,image/jpeg" required onChange={handlePhotoChange} className="rounded-xl border border-slate-300 px-3 py-2" />
                <div className="flex h-32 w-full items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50">
                  {previewImage ? <img src={previewImage} alt="Preview" className="h-full w-full rounded-2xl object-cover" /> : <ImagePlus className="text-slate-400" size={32} />}
                </div>
                {photoError && <span className="text-xs text-red-600">{photoError}</span>}
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Surname
                <input {...register('surname')} className="rounded-xl border border-slate-300 px-3 py-2" />
                {errors.surname && <span className="text-xs text-red-600">{errors.surname.message}</span>}
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                First Name
                <input {...register('firstName')} className="rounded-xl border border-slate-300 px-3 py-2" />
                {errors.firstName && <span className="text-xs text-red-600">{errors.firstName.message}</span>}
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Middle Name
                <input {...register('middleName')} className="rounded-xl border border-slate-300 px-3 py-2" />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Gender
                <select {...register('gender')} className="rounded-xl border border-slate-300 px-3 py-2">
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                {errors.gender && <span className="text-xs text-red-600">{errors.gender.message}</span>}
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Date of Birth
                <input type="date" {...register('dateOfBirth')} className="rounded-xl border border-slate-300 px-3 py-2" />
                {errors.dateOfBirth && <span className="text-xs text-red-600">{errors.dateOfBirth.message}</span>}
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Marital Status
                <select {...register('maritalStatus')} className="rounded-xl border border-slate-300 px-3 py-2">
                  <option value="">Select</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
                {errors.maritalStatus && <span className="text-xs text-red-600">{errors.maritalStatus.message}</span>}
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Nationality
                <input {...register('nationality')} className="rounded-xl border border-slate-300 px-3 py-2" />
                {errors.nationality && <span className="text-xs text-red-600">{errors.nationality.message}</span>}
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                State of Origin
                <input {...register('stateOfOrigin')} className="rounded-xl border border-slate-300 px-3 py-2" />
                {errors.stateOfOrigin && <span className="text-xs text-red-600">{errors.stateOfOrigin.message}</span>}
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                LGA of Origin
                <input {...register('lgaOfOrigin')} className="rounded-xl border border-slate-300 px-3 py-2" />
                {errors.lgaOfOrigin && <span className="text-xs text-red-600">{errors.lgaOfOrigin.message}</span>}
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Place of Birth
                <input {...register('placeOfBirth')} className="rounded-xl border border-slate-300 px-3 py-2" />
                {errors.placeOfBirth && <span className="text-xs text-red-600">{errors.placeOfBirth.message}</span>}
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Blood Group
                <select {...register('bloodGroup')} className="rounded-xl border border-slate-300 px-3 py-2">
                  <option value="">Select</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
                {errors.bloodGroup && <span className="text-xs text-red-600">{errors.bloodGroup.message}</span>}
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Genotype
                <select {...register('genotype')} className="rounded-xl border border-slate-300 px-3 py-2">
                  <option value="">Select</option>
                  <option value="AA">AA</option>
                  <option value="AS">AS</option>
                  <option value="SS">SS</option>
                </select>
                {errors.genotype && <span className="text-xs text-red-600">{errors.genotype.message}</span>}
              </label>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#022969]">Step 2 of 6</p>
            <h2 className="text-2xl font-semibold text-slate-900">Contact Information</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Phone Number
                <input {...register('phone')} className="rounded-xl border border-slate-300 px-3 py-2" />
                {errors.phone && <span className="text-xs text-red-600">{errors.phone.message}</span>}
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                WhatsApp Number
                <input {...register('whatsapp')} className="rounded-xl border border-slate-300 px-3 py-2" />
                {errors.whatsapp && <span className="text-xs text-red-600">{errors.whatsapp.message}</span>}
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Email Address
                <input type="email" {...register('email')} className="rounded-xl border border-slate-300 px-3 py-2" />
                {errors.email && <span className="text-xs text-red-600">{errors.email.message}</span>}
              </label>
              <label className="md:col-span-2 flex flex-col gap-2 text-sm font-medium text-slate-700">
                Residential Address
                <textarea {...register('residentialAddress')} rows="3" className="rounded-xl border border-slate-300 px-3 py-2" />
                {errors.residentialAddress && <span className="text-xs text-red-600">{errors.residentialAddress.message}</span>}
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                State of Residence
                <input {...register('stateOfResidence')} className="rounded-xl border border-slate-300 px-3 py-2" />
                {errors.stateOfResidence && <span className="text-xs text-red-600">{errors.stateOfResidence.message}</span>}
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                LGA of Residence
                <input {...register('lgaOfResidence')} className="rounded-xl border border-slate-300 px-3 py-2" />
                {errors.lgaOfResidence && <span className="text-xs text-red-600">{errors.lgaOfResidence.message}</span>}
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Emergency Contact Name
                <input {...register('emergencyContactName')} className="rounded-xl border border-slate-300 px-3 py-2" />
                {errors.emergencyContactName && <span className="text-xs text-red-600">{errors.emergencyContactName.message}</span>}
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Emergency Contact Phone
                <input {...register('emergencyContactPhone')} className="rounded-xl border border-slate-300 px-3 py-2" />
                {errors.emergencyContactPhone && <span className="text-xs text-red-600">{errors.emergencyContactPhone.message}</span>}
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Relationship
                <input {...register('emergencyContactRelationship')} className="rounded-xl border border-slate-300 px-3 py-2" />
                {errors.emergencyContactRelationship && <span className="text-xs text-red-600">{errors.emergencyContactRelationship.message}</span>}
              </label>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#022969]">Step 3 of 6</p>
            <h2 className="text-2xl font-semibold text-slate-900">Man O' War Information</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Membership / Service Number
                <input
                  {...register('membershipNumber')}
                  placeholder="MOWN/NC/0001"
                  className="rounded-xl border border-slate-300 px-3 py-2"
                />
                {errors.membershipNumber && <span className="text-xs text-red-600">{errors.membershipNumber.message}</span>}
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Date Joined Man O' War
                <input type="date" {...register('dateJoined')} className="rounded-xl border border-slate-300 px-3 py-2" />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Year Joined
                <input {...register('yearJoined')} className="rounded-xl border border-slate-300 px-3 py-2" />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Area Command
                <select {...register('areaCommandId')} className="rounded-xl border border-slate-300 px-3 py-2">
                  <option value="">Select</option>
                  {commands.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                </select>
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Unit / Division
                <input {...register('unit')} className="rounded-xl border border-slate-300 px-3 py-2" />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Current Rank
                <input {...register('currentRank')} className="rounded-xl border border-slate-300 px-3 py-2" />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Previous Rank
                <input {...register('previousRank')} className="rounded-xl border border-slate-300 px-3 py-2" />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Current Appointment
                <input {...register('currentAppointment')} className="rounded-xl border border-slate-300 px-3 py-2" />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Previous Appointment
                <input {...register('previousAppointment')} className="rounded-xl border border-slate-300 px-3 py-2" />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Training / Courses Attended
                <input {...register('training')} className="rounded-xl border border-slate-300 px-3 py-2" />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Highest Man O' War Qualification
                <input {...register('qualification')} className="rounded-xl border border-slate-300 px-3 py-2" />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Membership Status
                <select {...register('membershipStatus')} className="rounded-xl border border-slate-300 px-3 py-2">
                  <option value="">Select</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Reserve">Reserve</option>
                  <option value="Other">Other</option>
                </select>
              </label>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#022969]">Step 4 of 6</p>
            <h2 className="text-2xl font-semibold text-slate-900">Education & Occupation</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Highest Educational Qualification
                <input {...register('education')} className="rounded-xl border border-slate-300 px-3 py-2" />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Institution Attended
                <input {...register('institution')} className="rounded-xl border border-slate-300 px-3 py-2" />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Course of Study
                <input {...register('course')} className="rounded-xl border border-slate-300 px-3 py-2" />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Occupation
                <input {...register('occupation')} className="rounded-xl border border-slate-300 px-3 py-2" />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Employer / Organisation
                <input {...register('employer')} className="rounded-xl border border-slate-300 px-3 py-2" />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Office Address
                <input {...register('officeAddress')} className="rounded-xl border border-slate-300 px-3 py-2" />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Professional Skills
                <input {...register('skills')} className="rounded-xl border border-slate-300 px-3 py-2" />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Professional Certifications
                <input {...register('certifications')} className="rounded-xl border border-slate-300 px-3 py-2" />
              </label>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#022969]">Step 5 of 6</p>
            <h2 className="text-2xl font-semibold text-slate-900">Additional Information</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Religion
                <input {...register('religion')} className="rounded-xl border border-slate-300 px-3 py-2" />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Next of Kin
                <input {...register('nextOfKin')} className="rounded-xl border border-slate-300 px-3 py-2" />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Next of Kin Phone
                <input {...register('nextOfKinPhone')} className="rounded-xl border border-slate-300 px-3 py-2" />
              </label>
              <label className="md:col-span-2 flex flex-col gap-2 text-sm font-medium text-slate-700">
                Next of Kin Address
                <textarea {...register('nextOfKinAddress')} rows="3" className="rounded-xl border border-slate-300 px-3 py-2" />
              </label>
              <label className="md:col-span-2 flex flex-col gap-2 text-sm font-medium text-slate-700">
                Medical Information / Additional Comments
                <textarea {...register('additionalInformation')} rows="4" className="rounded-xl border border-slate-300 px-3 py-2" />
              </label>
              <label className="md:col-span-2 flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                <input type="checkbox" {...register('declarationAccepted')} className="mt-1 h-4 w-4" />
                <span>I hereby declare that the information provided is true, accurate, and complete to the best of my knowledge.</span>
              </label>
              {errors.declarationAccepted && <span className="md:col-span-2 text-xs text-red-600">{errors.declarationAccepted.message}</span>}
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#022969]">Step 6 of 6</p>
            <h2 className="text-2xl font-semibold text-slate-900">Review & Submit</h2>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="font-semibold text-slate-900">Registration Summary</h3>
              <div className="mt-3 grid gap-3 text-sm text-slate-700 md:grid-cols-2">
                <div><span className="font-semibold">Name:</span> {watch('firstName')} {watch('surname')}</div>
                <div><span className="font-semibold">Email:</span> {watch('email')}</div>
                <div><span className="font-semibold">Phone:</span> {watch('phone')}</div>
                <div><span className="font-semibold">Area Command:</span> {watch('areaCommandId') || 'Pending selection'}</div>
              </div>
            </div>
            <div className="rounded-2xl border border-[#022969]/20 bg-[#022969]/5 p-4 text-sm text-[#022969]">
              Please confirm that all information is correct. Once submitted, your registration will be reviewed by the Ogun State Command.
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:justify-between">
          <button type="button" onClick={goBack} disabled={step === 1} className="flex items-center justify-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50">
            <ArrowLeft size={16} /> Back
          </button>
          {step < 6 ? (
            <button type="button" onClick={goNext} className="flex items-center justify-center gap-2 rounded-full bg-[#022969] px-4 py-2 text-sm font-semibold text-white">
              Continue <ArrowRight size={16} />
            </button>
          ) : (
            <button type="submit" disabled={isSubmitting} className="flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">
              <CheckCircle2 size={16} /> {isSubmitting ? 'Submitting...' : 'Submit Registration'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;

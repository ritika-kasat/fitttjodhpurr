import DashboardLayout from '../../layouts/DashboardLayout';
import { Banknote, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

const bankDetails = {
  accountHolder: 'FitJodhpur Fitness Solutions Pvt. Ltd.',
  bankName: 'HDFC Bank Ltd.',
  accountNumber: '50200087654321',
  ifsc: 'HDFC0001234',
  branch: 'Ratanada Branch, Jodhpur',
};

const GetStarted = () => {
  const [confirm, setConfirm] = useState(false);

  const handleConfirm = () => {
    toast.success('We have received your confirmation! Our team will verify the payment shortly.');
    setConfirm(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2">Manual Payment Transfer</h2>
            <p className="text-slate-300">
              Please transfer the subscription amount to the bank account below and click "I Have Transferred".
            </p>
          </div>
          <div className="absolute right-0 bottom-0 opacity-5">
            <Banknote className="h-64 w-64 -mb-10 -mr-10" />
          </div>
        </div>

        {/* Bank Details Card */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-4">FitJodhpur Official Bank Details</h3>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-slate-500">Account Holder</dt>
              <dd className="mt-1 text-sm text-slate-900">{bankDetails.accountHolder}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-500">Bank Name</dt>
              <dd className="mt-1 text-sm text-slate-900">{bankDetails.bankName}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-500">Account Number</dt>
              <dd className="mt-1 text-sm font-mono text-slate-900">{bankDetails.accountNumber}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-500">IFSC Code</dt>
              <dd className="mt-1 text-sm font-mono text-slate-900">{bankDetails.ifsc}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-500">Branch</dt>
              <dd className="mt-1 text-sm text-slate-900">{bankDetails.branch}</dd>
            </div>
          </dl>
        </div>

        {/* Confirmation Button */}
        <div className="flex justify-center">
          <button
            onClick={handleConfirm}
            className="px-6 py-3 bg-primary hover:bg-orange-700 text-white rounded-xl font-bold transition-colors shadow-md"
          >
            I Have Transferred
          </button>
        </div>

        {/* Confirmation Message */}
        {confirm && (
          <div className="flex items-center gap-2 text-green-700 bg-green-50 p-4 rounded-lg">
            <CheckCircle2 className="h-5 w-5" />
            <span className="font-medium">Your payment is pending verification.</span>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default GetStarted;

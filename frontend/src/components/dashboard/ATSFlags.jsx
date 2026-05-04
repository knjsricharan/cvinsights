import { CheckCircle2, AlertOctagon } from 'lucide-react';

const ATSFlags = ({ flags = [] }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-lg font-semibold text-slate-800 mb-4 font-serif">ATS Compatibility</h2>
      
      {flags.length === 0 ? (
        <div className="flex items-center text-green-600 bg-green-50 p-4 rounded-lg border border-green-100">
          <CheckCircle2 className="w-5 h-5 mr-3 flex-shrink-0" />
          <p className="text-sm font-medium">Excellent! No format issues or ATS blockers detected.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {flags.map((flag, idx) => (
            <div key={idx} className="flex items-start text-orange-800 bg-orange-50 p-3 rounded-lg border border-orange-100">
              <AlertOctagon className="w-4 h-4 mr-3 mt-0.5 flex-shrink-0 text-orange-500" />
              <p className="text-sm">{flag}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ATSFlags;

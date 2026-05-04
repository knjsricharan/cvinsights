import { CheckCircle2, AlertTriangle } from 'lucide-react';

const StrengthsWeaknesses = ({ strengths = [], weaknesses = [] }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="border-l-4 border-green-500 p-6 h-full">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 font-serif flex items-center">
            <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
            Core Strengths
          </h2>
          <ul className="space-y-3">
            {strengths.length > 0 ? (
              strengths.map((str, i) => (
                <li key={i} className="text-sm text-slate-600 flex items-start">
                  <span className="text-green-500 mr-2 mt-0.5">•</span>
                  <span>{str}</span>
                </li>
              ))
            ) : (
              <li className="text-sm text-slate-400 italic">No specific strengths highlighted.</li>
            )}
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="border-l-4 border-red-500 p-6 h-full">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 font-serif flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
            Critical Weaknesses
          </h2>
          <ul className="space-y-3">
            {weaknesses.length > 0 ? (
              weaknesses.map((weak, i) => (
                <li key={i} className="text-sm text-slate-600 flex items-start">
                  <span className="text-red-500 mr-2 mt-0.5">•</span>
                  <span>{weak}</span>
                </li>
              ))
            ) : (
              <li className="text-sm text-slate-400 italic">No critical weaknesses detected.</li>
            )}
          </ul>
        </div>
      </div>

    </div>
  );
};

export default StrengthsWeaknesses;

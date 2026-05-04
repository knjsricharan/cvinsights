import { Check, X } from 'lucide-react';

const SkillsChart = ({ found = [], missing = [] }) => {
  const displayFound = found.slice(0, 12);
  const displayMissing = missing.slice(0, 12);
  const moreFound = found.length - 12;
  const moreMissing = missing.length - 12;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {/* Found Skills */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800 font-serif">Skills Found</h2>
          <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
            {found.length}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {displayFound.length > 0 ? (
            displayFound.map((skill, i) => (
              <span key={i} className="inline-flex items-center px-2.5 py-1 rounded border border-green-200 bg-green-50 text-green-700 text-xs font-medium">
                <Check className="w-3 h-3 mr-1" />
                {skill}
              </span>
            ))
          ) : (
            <p className="text-sm text-slate-500 italic">No hard skills detected.</p>
          )}
          {moreFound > 0 && (
            <span className="inline-flex items-center px-2.5 py-1 rounded border border-slate-200 bg-slate-50 text-slate-600 text-xs font-medium">
              +{moreFound} more
            </span>
          )}
        </div>
      </div>

      {/* Missing Skills */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800 font-serif">Missing Skills (Role-based)</h2>
          <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full">
            {missing.length}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {displayMissing.length > 0 ? (
            displayMissing.map((skill, i) => (
              <span key={i} className="inline-flex items-center px-2.5 py-1 rounded border border-red-200 bg-red-50 text-red-700 text-xs font-medium">
                <X className="w-3 h-3 mr-1" />
                {skill}
              </span>
            ))
          ) : (
            <p className="text-sm text-slate-500 italic">Great coverage! No major missing skills.</p>
          )}
          {moreMissing > 0 && (
            <span className="inline-flex items-center px-2.5 py-1 rounded border border-slate-200 bg-slate-50 text-slate-600 text-xs font-medium">
              +{moreMissing} more
            </span>
          )}
        </div>
      </div>

    </div>
  );
};

export default SkillsChart;

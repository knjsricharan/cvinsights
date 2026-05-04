import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const Suggestions = ({ suggestions = [] }) => {
  const [expanded, setExpanded] = useState(false);

  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  // Sort by priority (high > medium > low)
  const priorityWeight = { high: 3, medium: 2, low: 1 };
  const sortedSuggestions = [...suggestions].sort((a, b) => 
    (priorityWeight[b.priority?.toLowerCase()] || 0) - (priorityWeight[a.priority?.toLowerCase()] || 0)
  );

  const displayCount = expanded ? sortedSuggestions.length : Math.min(5, sortedSuggestions.length);
  const visibleSuggestions = sortedSuggestions.slice(0, displayCount);
  const hasMore = sortedSuggestions.length > 5;

  const getPriorityBadge = (priority) => {
    const p = priority.toLowerCase();
    if (p === 'high') return <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded uppercase">High</span>;
    if (p === 'medium') return <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-0.5 rounded uppercase">Medium</span>;
    return <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded uppercase">Low</span>;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-slate-800 font-serif">Action Plan</h2>
        <span className="text-sm text-slate-500 font-medium">{suggestions.length} items to fix</span>
      </div>

      <div className="space-y-4">
        {visibleSuggestions.map((sug, idx) => (
          <div key={idx} className="border border-slate-100 bg-slate-50 rounded-lg p-4 transition-all hover:border-slate-300">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                {getPriorityBadge(sug.priority)}
                <span className="text-xs font-medium text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-full capitalize">
                  {sug.section}
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-800 font-medium mb-3">{sug.issue}</p>
            <div className="bg-indigo-50 border border-indigo-100 rounded p-3">
              <p className="text-sm text-indigo-900"><span className="font-semibold text-indigo-700 mr-1">Fix:</span>{sug.fix}</p>
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <button 
          onClick={() => setExpanded(!expanded)}
          className="mt-6 w-full flex items-center justify-center space-x-1 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors py-2"
        >
          <span>{expanded ? 'Show Less' : `View All ${sortedSuggestions.length} Suggestions`}</span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      )}
    </div>
  );
};

export default Suggestions;

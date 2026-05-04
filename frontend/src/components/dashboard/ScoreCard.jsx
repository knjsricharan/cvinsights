import { useEffect, useState } from 'react';

const ScoreCard = ({ analysis }) => {
  const [count, setCount] = useState(0);
  const targetScore = analysis?.overall_score || 0;
  const grade = analysis?.grade || 'F';
  
  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const increment = targetScore / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= targetScore) {
        setCount(targetScore);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [targetScore]);

  const getGradeColor = (g) => {
    switch (g) {
      case 'A': return 'text-green-500 bg-green-50 border-green-200';
      case 'B': return 'text-blue-500 bg-blue-50 border-blue-200';
      case 'C': return 'text-yellow-500 bg-yellow-50 border-yellow-200';
      case 'D': return 'text-orange-500 bg-orange-50 border-orange-200';
      default: return 'text-red-500 bg-red-50 border-red-200';
    }
  };

  const getStrokeColor = (score) => {
    if (score >= 90) return '#22c55e';
    if (score >= 80) return '#3b82f6';
    if (score >= 70) return '#eab308';
    if (score >= 60) return '#f97316';
    return '#ef4444';
  };

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (count / 100) * circumference;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center justify-center relative overflow-hidden">
      <h2 className="text-xl font-semibold text-slate-800 mb-6 font-serif">Overall Quality</h2>
      
      <div className="relative flex items-center justify-center w-40 h-40">
        <svg className="transform -rotate-90 w-40 h-40">
          <circle
            cx="80"
            cy="80"
            r={radius}
            className="stroke-slate-100"
            strokeWidth="12"
            fill="transparent"
          />
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke={getStrokeColor(targetScore)}
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-100 ease-out"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-slate-800">{count}</span>
          <span className="text-xs text-slate-400 font-medium">/ 100</span>
        </div>
      </div>
      
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <span className={`px-4 py-1.5 rounded-full font-bold border ${getGradeColor(grade)}`}>
          Grade {grade}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        {analysis?.detected_role && (
          <span className="text-xs font-medium bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
            {analysis.detected_role}
          </span>
        )}
        {analysis?.seniority_level && (
          <span className="text-xs font-medium bg-slate-100 text-slate-600 px-3 py-1 rounded-full capitalize">
            {analysis.seniority_level} Level
          </span>
        )}
      </div>
      
      {analysis?.improvement_potential > 0 && (
        <p className="mt-4 text-sm text-slate-500 text-center">
          You can improve by <span className="font-semibold text-indigo-600">{analysis.improvement_potential} points</span>
        </p>
      )}
    </div>
  );
};

export default ScoreCard;

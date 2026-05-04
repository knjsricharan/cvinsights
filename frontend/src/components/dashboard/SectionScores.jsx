import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const SectionScores = ({ scores }) => {
  if (!scores) return null;

  const data = Object.entries(scores)
    .filter(([_, value]) => value !== null && value !== undefined)
    .map(([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      score: value
    }));

  if (data.length === 0) return null;

  const getColor = (score) => {
    if (score >= 80) return '#22c55e'; // green
    if (score >= 60) return '#eab308'; // yellow
    return '#ef4444'; // red
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-200 rounded shadow-sm text-sm">
          <p className="font-semibold text-slate-800">{payload[0].payload.name}</p>
          <p className="text-slate-600">Score: <span className="font-bold" style={{ color: payload[0].fill }}>{payload[0].value}</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-full">
      <h2 className="text-lg font-semibold text-slate-800 mb-6 font-serif">Section Analysis</h2>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <XAxis type="number" domain={[0, 100]} hide />
            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={90} tick={{ fontSize: 13, fill: '#475569' }} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
            <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={20}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.score)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SectionScores;

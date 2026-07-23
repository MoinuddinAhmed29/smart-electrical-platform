import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface ChartCardProps {
  title: string;
  data: Array<{ time: string; value: number }>;
  color: string;
  unit: string;
}

export default function ChartCard({ title, data, color, unit }: ChartCardProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-white">{title}</h3>
        <span className="text-xs font-mono text-slate-400 uppercase">Real-time Stream</span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={11} tickLine={false} unit={unit} />
            <Tooltip
              contentStyle={{ backgroundColor: '#090a0f', borderColor: '#1e293b', borderRadius: '0.75rem', color: '#fff' }}
            />
            <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
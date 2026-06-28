import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { cn } from '@/lib/utils';

interface AnalyticsChartProps {
  data: { name: string; value: number; completed?: number }[];
  type?: 'bar' | 'pie' | 'area';
  title?: string;
  className?: string;
  strokeColor?: string;
}

const COLORS = [
  '#00C9A7', // Teal
  '#7B2FBE', // Purple
  '#FF3CAC', // Pink
  '#FFB300', // Amber
  '#FF6B6B'  // Coral
];

const AnalyticsChart = ({ data, type = 'area', className, strokeColor = '#00C9A7' }: AnalyticsChartProps) => {
  return (
    <div className={cn("h-full w-full flex flex-col", className)}>
      <ResponsiveContainer width="100%" height="100%">
        {type === 'area' || type === 'bar' ? (
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={strokeColor} stopOpacity={0.25}/>
                <stop offset="95%" stopColor={strokeColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-default)" />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--text-muted)', fontSize: 11, fontWeight: 500 }}
              dy={8}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--text-muted)', fontSize: 11, fontWeight: 500 }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-card)',
                fontSize: '12px',
                color: 'var(--text-primary)'
              }}
              cursor={{ stroke: 'var(--border-strong)', strokeWidth: 1 }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={strokeColor} 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorValue)" 
              animationDuration={1500}
            />
          </AreaChart>
        ) : (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={8}
              dataKey="value"
              animationBegin={0}
              animationDuration={1500}
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-md)',
                fontSize: '12px',
                color: 'var(--text-primary)'
              }}
            />
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default AnalyticsChart;

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface AnalyticsChartProps {
  data: { name: string; value: number; completed?: number }[];
  type?: 'bar' | 'pie' | 'area';
  title?: string;
  className?: string;
}

const COLORS = [
  'hsl(var(--primary))',
  '#06b6d4', // Cyan
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#f59e0b'  // Amber
];

const AnalyticsChart = ({ data, type = 'area', title, className }: AnalyticsChartProps) => {
  return (
    <div className={cn("h-full flex flex-col", className)}>
      <ResponsiveContainer width="100%" height="100%">
        {type === 'area' || type === 'bar' ? (
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 800 }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 800 }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(15, 15, 25, 0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                fontSize: '12px',
                fontWeight: '900'
              }}
              itemStyle={{ color: '#fff' }}
              cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 2, strokeDasharray: '5 5' }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="hsl(var(--primary))" 
              strokeWidth={4}
              fillOpacity={1} 
              fill="url(#colorValue)" 
              animationDuration={2000}
            />
            {data[0]?.completed !== undefined && (
              <Area 
                type="monotone" 
                dataKey="completed" 
                stroke="#06b6d4" 
                strokeWidth={4}
                fillOpacity={1} 
                fill="url(#colorCompleted)" 
                animationDuration={2500}
              />
            )}
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
                  style={{ filter: `drop-shadow(0 0 8px ${COLORS[index % COLORS.length]}40)` }}
                />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(15, 15, 25, 0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px',
                fontSize: '12px',
                fontWeight: '900'
              }}
            />
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default AnalyticsChart;



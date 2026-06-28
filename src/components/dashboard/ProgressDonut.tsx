import { Card, CardContent } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { cn } from '@/lib/utils';

interface ProgressDonutProps {
  completed: number;
  inProgress: number;
  pending: number;
  className?: string;
}

const ProgressDonut = ({ completed, inProgress, pending, className }: ProgressDonutProps) => {
  const total = completed + inProgress + pending;
  const completedPercent = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  const data = [
    { name: 'Completed', value: completed, color: 'url(#brandGrad)' },
    { name: 'In Progress', value: inProgress, color: '#00C9A7' },
    { name: 'Pending', value: pending, color: 'var(--border-strong)' },
  ];

  return (
    <Card className={cn(
      "bg-[var(--bg-card)] border border-[var(--border-default)] rounded-[16px] overflow-hidden flex flex-col shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-200", 
      className
    )}>
      <div className="p-5 border-b border-[var(--border-default)]">
        <h3 className="text-[16px] font-semibold text-[var(--text-primary)]">Project Progress</h3>
      </div>
      <CardContent className="flex-1 flex flex-col items-center justify-center p-6">
        
        {/* 200px diameter container */}
        <div className="relative w-[200px] h-[200px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                <linearGradient id="brandGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FF3CAC" />
                  <stop offset="50%" stopColor="#7B2FBE" />
                  <stop offset="100%" stopColor="#784BA0" />
                </linearGradient>
              </defs>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    className="hover:opacity-90 transition-opacity" 
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
          </ResponsiveContainer>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[24px] font-bold text-[var(--text-primary)] leading-none">{completedPercent}%</span>
            <span className="text-[11px] text-[var(--text-muted)] mt-1">Completed</span>
          </div>
        </div>

        {/* Legend: dots + labels, horizontal layout below */}
        <div className="flex flex-wrap items-center justify-center gap-4 w-full mt-6">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div 
                className="w-2.5 h-2.5 rounded-full shrink-0" 
                style={{ 
                  background: item.color.startsWith('url') 
                    ? 'linear-gradient(135deg, #FF3CAC 0%, #7B2FBE 100%)' 
                    : item.color 
                }} 
              />
              <span className="text-[12px] text-[var(--text-secondary)] capitalize">{item.name}</span>
              <span className="text-[12px] font-bold text-[var(--text-primary)]">({item.value})</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressDonut;

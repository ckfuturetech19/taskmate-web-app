import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
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
    { name: 'Completed', value: completed, color: 'hsl(142 71% 45%)' },
    { name: 'In Progress', value: inProgress, color: 'hsl(142 60% 60%)' },
    { name: 'Pending', value: pending, color: 'hsl(var(--muted-foreground) / 0.2)' },
  ];

  const COLORS = data.map(item => item.color);

  return (
    <Card className={cn("transition-all duration-500 hover:shadow-2xl bg-card/50 backdrop-blur-md border-border/50 rounded-2xl overflow-hidden flex flex-col", className)}>
      <CardHeader className="bg-muted/20 border-b border-border/10">
        <CardTitle className="text-base font-bold uppercase tracking-tight text-foreground/80">Project Progress</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="relative w-full h-[250px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={8}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} className="hover:opacity-80 transition-opacity duration-300" />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  fontSize: '12px',
                  fontWeight: '600'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-4xl font-black text-foreground">{completedPercent}%</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Overall</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 w-full mt-6">
          {data.map((item) => (
            <div key={item.name} className="flex flex-col items-center gap-1 p-2 rounded-xl bg-muted/30 border border-border/5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">{item.name}</span>
              <span className="text-sm font-black text-foreground">{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressDonut;


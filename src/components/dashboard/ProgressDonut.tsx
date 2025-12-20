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
    { name: 'Pending', value: pending, color: 'hsl(0 0% 85%)' },
  ];

  const COLORS = data.map(item => item.color);

  return (
    <Card className={cn("transition-all duration-300 hover:shadow-lg", className)}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Project Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="text-center mt-4">
            <p className="text-3xl font-bold text-foreground">{completedPercent}%</p>
            <p className="text-sm text-muted-foreground">Project Ended</p>
          </div>
          <div className="flex flex-wrap gap-4 mt-6 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(142 71% 45%)' }} />
              <span className="text-sm text-muted-foreground">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(142 60% 60%)' }} />
              <span className="text-sm text-muted-foreground">In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(0 0% 85%)' }} />
              <span className="text-sm text-muted-foreground">Pending</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressDonut;


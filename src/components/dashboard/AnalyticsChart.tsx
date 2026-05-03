import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { cn } from '@/lib/utils';

interface AnalyticsChartProps {
  data: { name: string; value: number; completed?: number }[];
  type?: 'bar' | 'pie';
  title?: string;
  className?: string;
}

const COLORS = [
  'hsl(142 71% 45%)', // Primary green
  'hsl(142 60% 60%)', // Lighter green
  'hsl(142 40% 80%)', // Very light green
  'hsl(0 0% 70%)',    // Gray
  'hsl(0 0% 50%)'     // Dark gray
];

const AnalyticsChart = ({ data, type = 'bar', title, className }: AnalyticsChartProps) => {
  return (
    <Card className={cn("transition-all duration-500 hover:shadow-2xl h-full flex flex-col bg-card/50 backdrop-blur-md border-border/50 rounded-2xl overflow-hidden", className)}>
      <CardHeader className="flex-shrink-0 pb-3 border-b border-border/10 bg-muted/20">
        <CardTitle className="text-base font-bold uppercase tracking-tight text-foreground/80">{title || 'Analytics'}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center p-6 pt-8">
        <ResponsiveContainer width="100%" height="100%" minHeight={250}>
          {type === 'bar' ? (
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(142 71% 45%)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(142 71% 45%)" stopOpacity={0.2}/>
                </linearGradient>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted-foreground/10" />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                className="text-[10px] font-bold uppercase tracking-tighter"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                dy={10}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                className="text-[10px] font-bold"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip 
                cursor={{ fill: 'hsl(var(--muted))', opacity: 0.2 }}
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  fontSize: '12px',
                  fontWeight: '600'
                }}
              />
              {data[0]?.completed !== undefined && (
                <Bar name="Completed" dataKey="completed" fill="url(#colorCompleted)" radius={[6, 6, 0, 0]} barSize={20} />
              )}
              <Bar name="Total Tasks" dataKey="value" fill="url(#colorTotal)" radius={[6, 6, 0, 0]} barSize={20} />
              <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', paddingTop: '20px' }} />
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                animationBegin={0}
                animationDuration={1500}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="stroke-background border-4" />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}
              />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default AnalyticsChart;


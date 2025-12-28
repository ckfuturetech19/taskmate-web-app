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
    <Card className={cn("transition-all duration-300 hover:shadow-lg h-full flex flex-col", className)}>
      <CardHeader className="flex-shrink-0 pb-3">
        <CardTitle className="text-base font-semibold">{title || 'Analytics'}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center p-4">
        <ResponsiveContainer width="100%" height="100%" minHeight={200}>
          {type === 'bar' ? (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="name" 
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              {data[0]?.completed !== undefined ? (
                <Bar dataKey="completed" fill="hsl(142 71% 45%)" radius={[8, 8, 0, 0]} />
              ) : (
                <Bar dataKey="value" fill="hsl(142 71% 45%)" radius={[8, 8, 0, 0]} />
              )}
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
            </PieChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default AnalyticsChart;


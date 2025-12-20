import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Square } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface TimeTrackerCardProps {
  className?: string;
}

const TimeTrackerCard = ({ className }: TimeTrackerCardProps) => {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTime(prev => {
        let { hours, minutes, seconds } = prev;
        seconds += 1;
        
        if (seconds >= 60) {
          seconds = 0;
          minutes += 1;
        }
        if (minutes >= 60) {
          minutes = 0;
          hours += 1;
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const handlePlayPause = () => {
    setIsRunning(!isRunning);
  };

  const handleStop = () => {
    setIsRunning(false);
    setTime({ hours: 0, minutes: 0, seconds: 0 });
  };

  const formatTime = (value: number) => value.toString().padStart(2, '0');

  return (
    <Card className={cn("transition-all duration-300 hover:shadow-lg h-full flex flex-col", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 flex-shrink-0">
        <CardTitle className="text-base font-semibold">Time Tracker</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col items-center justify-center pt-0">
        <div className="flex flex-col items-center gap-4 w-full">
          <div className="text-3xl sm:text-4xl font-bold text-foreground font-mono">
            {formatTime(time.hours)}:{formatTime(time.minutes)}:{formatTime(time.seconds)}
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              onClick={handlePlayPause}
              className={cn(
                "h-10 w-10 rounded-full",
                isRunning ? "bg-muted hover:bg-muted/80" : "bg-primary hover:bg-primary/90"
              )}
              style={!isRunning ? { background: 'linear-gradient(135deg, #1E6F43, #2FAE72)' } : {}}
            >
              {isRunning ? (
                <Pause className="h-5 w-5 text-foreground" />
              ) : (
                <Play className="h-5 w-5 text-primary-foreground" />
              )}
            </Button>
            <Button
              size="icon"
              onClick={handleStop}
              variant="destructive"
              className="h-10 w-10 rounded-full"
            >
              <Square className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeTrackerCard;


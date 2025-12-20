import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimePickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value?: Date;
  onSelect: (hours: number, minutes: number) => void;
}

export const TimePicker = ({ open, onOpenChange, value, onSelect }: TimePickerProps) => {
  const [hours, setHours] = useState(value?.getHours() || 12);
  const [minutes, setMinutes] = useState(value?.getMinutes() || 0);
  const [mode, setMode] = useState<'analog' | 'digital'>('analog');

  const handleSave = () => {
    onSelect(hours, minutes);
    onOpenChange(false);
  };

  const handleHourClick = (hour: number) => {
    setHours(hour);
  };

  const handleMinuteClick = (minute: number) => {
    setMinutes(minute);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Set Time
          </DialogTitle>
        </DialogHeader>

        <Tabs value={mode} onValueChange={(v) => setMode(v as 'analog' | 'digital')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="analog">Analog</TabsTrigger>
            <TabsTrigger value="digital">Digital</TabsTrigger>
          </TabsList>

          <TabsContent value="analog" className="space-y-4">
            {/* Analog Clock */}
            <div className="flex flex-col items-center gap-4 py-4">
              {/* Selected Time Display */}
              <div className="text-4xl font-bold text-primary">
                {hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}
              </div>

              {/* Hour Selection Circle */}
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Hours</Label>
                <div className="relative w-72 h-72 rounded-full border-2 border-primary/20 bg-muted/10 flex items-center justify-center">
                  {/* Center dot */}
                  <div className="absolute w-3 h-3 bg-primary rounded-full z-10" />
                  
                  {/* Outer circle - hours 12-23 */}
                  {Array.from({ length: 12 }, (_, i) => {
                    const hour = i + 12;
                    const angle = (i * 30 - 90) * (Math.PI / 180);
                    const radius = 120;
                    const x = 144 + radius * Math.cos(angle);
                    const y = 144 + radius * Math.sin(angle);
                    
                    return (
                      <button
                        key={hour}
                        type="button"
                        onClick={() => handleHourClick(hour)}
                        className={cn(
                          "absolute w-10 h-10 rounded-full flex items-center justify-center text-xs font-medium transition-all",
                          hours === hour 
                            ? "bg-primary text-primary-foreground scale-110 shadow-lg z-20" 
                            : "hover:bg-muted/50 hover:scale-105 text-muted-foreground"
                        )}
                        style={{
                          left: `${x - 20}px`,
                          top: `${y - 20}px`,
                        }}
                      >
                        {hour}
                      </button>
                    );
                  })}
                  
                  {/* Inner circle - hours 0-11 */}
                  {Array.from({ length: 12 }, (_, i) => {
                    const angle = (i * 30 - 90) * (Math.PI / 180);
                    const radius = 80;
                    const x = 144 + radius * Math.cos(angle);
                    const y = 144 + radius * Math.sin(angle);
                    
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleHourClick(i)}
                        className={cn(
                          "absolute w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all",
                          hours === i 
                            ? "bg-primary text-primary-foreground scale-110 shadow-lg z-20" 
                            : "hover:bg-muted/50 hover:scale-105"
                        )}
                        style={{
                          left: `${x - 20}px`,
                          top: `${y - 20}px`,
                        }}
                      >
                        {i}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Minute Selection */}
              <div className="space-y-2 w-full">
                <Label className="text-sm text-muted-foreground">Minutes</Label>
                <div className="flex flex-wrap gap-2 justify-center">
                  {Array.from({ length: 60 }, (_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleMinuteClick(i)}
                      className={cn(
                        "w-12 h-10 rounded-full flex items-center justify-center text-xs font-semibold transition-all",
                        minutes === i 
                          ? "bg-primary text-primary-foreground shadow-lg scale-110" 
                          : "bg-primary/10 hover:bg-primary/20 hover:scale-105"
                      )}
                    >
                      {i.toString().padStart(2, '0')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="digital" className="space-y-4 py-4">
            {/* Digital Input */}
            <div className="flex flex-col items-center gap-6">
              {/* Large Time Display */}
              <div className="text-6xl font-bold text-primary tracking-wider">
                {hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}
              </div>

              {/* Input Controls */}
              <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
                <div className="space-y-2">
                  <Label htmlFor="hours">Hours</Label>
                  <Input
                    id="hours"
                    type="number"
                    min="0"
                    max="23"
                    value={hours}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (!isNaN(val) && val >= 0 && val <= 23) {
                        setHours(val);
                      }
                    }}
                    className="text-center text-2xl font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minutes">Minutes</Label>
                  <Input
                    id="minutes"
                    type="number"
                    min="0"
                    max="59"
                    value={minutes}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (!isNaN(val) && val >= 0 && val <= 59) {
                        setMinutes(val);
                      }
                    }}
                    className="text-center text-2xl font-bold"
                  />
                </div>
              </div>

              {/* Quick Time Buttons */}
              <div className="grid grid-cols-3 gap-2 w-full max-w-xs">
                {[
                  { label: 'Morning', h: 9, m: 0 },
                  { label: 'Noon', h: 12, m: 0 },
                  { label: 'Evening', h: 18, m: 0 },
                ].map(({ label, h, m }) => (
                  <Button
                    key={label}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setHours(h);
                      setMinutes(m);
                    }}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Set Time
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

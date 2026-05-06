import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Activity, Clock, Timer, Brain, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type TimerMode = 'clock' | 'pomodoro' | 'stopwatch';

const TimeTrackerCard = ({ className }: { className?: string }) => {
  const [mode, setMode] = useState<TimerMode>('clock');
  const [isRunning, setIsRunning] = useState(false);
  
  // Clock state
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Stopwatch state
  const [stopwatchTime, setStopwatchTime] = useState(0);
  
  // Pomodoro state
  const [pomoTime, setPomoTime] = useState(25 * 60);
  const [isWork, setIsWork] = useState(true);

  // Clock effect
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Stopwatch/Pomo effect
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      if (mode === 'stopwatch') {
        setStopwatchTime(prev => prev + 1);
      } else if (mode === 'pomodoro') {
        setPomoTime(prev => {
          if (prev <= 0) {
            setIsRunning(false);
            return isWork ? 5 * 60 : 25 * 60; // Switch break/work on complete (simplified)
          }
          return prev - 1;
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, mode, isWork]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h.toString().padStart(2, '0') + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleAction = () => setIsRunning(!isRunning);
  
  const resetTimer = () => {
    setIsRunning(false);
    if (mode === 'stopwatch') setStopwatchTime(0);
    if (mode === 'pomodoro') setPomoTime(25 * 60);
  };

  return (
    <div className={cn("glass rounded-[2.5rem] border-white/10 p-6 flex flex-col shadow-2xl relative overflow-hidden h-full group", className)}>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-20" />
      
      {/* Header & Mode Switcher */}
      <div className="flex items-center justify-between mb-6 relative z-20">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Quantum Hub</h3>
        </div>
        
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
          {(['clock', 'pomodoro', 'stopwatch'] as TimerMode[]).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setIsRunning(false); }}
              className={cn(
                "px-3 py-1.5 rounded-lg transition-all flex items-center justify-center",
                mode === m ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {m === 'clock' && <Clock className="h-3.5 w-3.5" />}
              {m === 'pomodoro' && <Brain className="h-3.5 w-3.5" />}
              {m === 'stopwatch' && <Timer className="h-3.5 w-3.5" />}
            </button>
          ))}
        </div>
      </div>

      <CardContent className="flex-1 flex flex-col items-center justify-center p-0 relative z-10">
        <AnimatePresence mode="wait">
          {mode === 'clock' && (
            <motion.div 
              key="clock"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="text-center"
            >
              <div className="text-6xl font-black tracking-tighter text-foreground font-jakarta flex items-center gap-2">
                <span className="tabular-nums">{currentTime.getHours().toString().padStart(2, '0')}</span>
                <span className="text-primary/30">:</span>
                <span className="tabular-nums">{currentTime.getMinutes().toString().padStart(2, '0')}</span>
              </div>
              <div className="mt-2 text-xs font-black text-primary/60 tracking-[0.5em] uppercase">
                {currentTime.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
              </div>
            </motion.div>
          )}

          {mode !== 'clock' && (
            <motion.div
              key="timers"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center"
            >
              <div className="text-6xl font-black tracking-tighter text-foreground font-jakarta">
                {formatTime(mode === 'stopwatch' ? stopwatchTime : pomoTime)}
              </div>
              <div className="mt-2 text-[10px] font-black text-muted-foreground tracking-[0.4em] uppercase">
                {mode === 'pomodoro' ? (isWork ? 'Deep Work Phase' : 'Recharge Phase') : 'Elapsed Mission Time'}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {mode !== 'clock' && (
          <div className="flex items-center gap-3 mt-10 w-full">
            <Button
              size="lg"
              onClick={handleAction}
              className={cn(
                "flex-1 h-12 rounded-xl font-black text-[10px] tracking-[0.2em] transition-all active:scale-95",
                isRunning ? "bg-white/5 border border-white/10 text-foreground" : "bg-primary text-primary-foreground shadow-xl shadow-primary/20"
              )}
            >
              {isRunning ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {isRunning ? 'SUSPEND' : 'INITIALIZE'}
            </Button>
            
            <Button
              size="icon"
              onClick={resetTimer}
              variant="ghost"
              className="h-12 w-12 rounded-xl border border-white/5 hover:bg-white/5 active:scale-95"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>

      {/* Aesthetic Background Decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/5 blur-[80px] rounded-full pointer-events-none" />
      
      <div className="absolute bottom-4 left-6 flex items-center gap-2 opacity-30">
        <Zap className="h-3 w-3" />
        <span className="text-[7px] font-black uppercase tracking-[0.4em]">Temporal Sync Active</span>
      </div>
    </div>
  );
};

export default TimeTrackerCard;



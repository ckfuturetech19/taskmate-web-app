import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Clock, Timer, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type TimerMode = 'clock' | 'pomodoro' | 'stopwatch';

const TimeTrackerCard = ({ className }: { className?: string }) => {
  const [mode, setMode] = useState<TimerMode>('clock');
  const [isRunning, setIsRunning] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [pomoTime, setPomoTime] = useState(25 * 60);
  const [isWork, setIsWork] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      if (mode === 'stopwatch') {
        setStopwatchTime(prev => prev + 1);
      } else if (mode === 'pomodoro') {
        setPomoTime(prev => {
          if (prev <= 0) { setIsRunning(false); setIsWork(w => !w); return isWork ? 5 * 60 : 25 * 60; }
          return prev - 1;
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, mode, isWork]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const modes: { key: TimerMode; label: string; icon: typeof Clock }[] = [
    { key: 'clock', label: 'Clock', icon: Clock },
    { key: 'pomodoro', label: 'Pomo', icon: Brain },
    { key: 'stopwatch', label: 'Watch', icon: Timer },
  ];

  return (
    <div className={cn(
      "bg-[var(--bg-card)] border border-[var(--border-default)] rounded-[12px] p-5 flex flex-col shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow h-full overflow-hidden",
      className
    )}>
      {/* Header row — compact */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-[#7B2FBE]/10 flex items-center justify-center">
            <Clock className="h-4 w-4 text-[#7B2FBE]" />
          </div>
          <span className="font-semibold text-[15px] text-[var(--text-primary)]">Time</span>
        </div>

        {/* Compact segmented tabs — won't overflow */}
        <div className="flex bg-[var(--bg-base)] rounded-lg border border-[var(--border-default)] p-0.5 gap-0.5">
          {modes.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => { setMode(key); setIsRunning(false); }}
              className={cn(
                "px-2 py-1 rounded-md text-[11px] font-medium transition-all duration-150 flex items-center gap-1 whitespace-nowrap",
                mode === key
                  ? "bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              )}
            >
              <Icon className={cn("h-3 w-3 shrink-0", mode === key ? "text-[#7B2FBE]" : "")} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Time display */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {mode === 'clock' && (
            <motion.div key="clock"
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }} className="text-center"
            >
              <div className="flex items-baseline justify-center gap-0.5">
                <span className="text-[46px] font-bold tracking-tight text-[var(--text-primary)] tabular-nums leading-none">
                  {currentTime.getHours().toString().padStart(2, '0')}
                </span>
                <motion.span
                  animate={{ opacity: [1, 0.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                  className="text-[38px] font-bold text-[var(--text-muted)] leading-none"
                >:</motion.span>
                <span className="text-[46px] font-bold tracking-tight text-[var(--text-primary)] tabular-nums leading-none">
                  {currentTime.getMinutes().toString().padStart(2, '0')}
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] mt-1.5 font-medium">
                {currentTime.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
              </p>
            </motion.div>
          )}

          {mode !== 'clock' && (
            <motion.div key={mode}
              initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }} className="flex flex-col items-center gap-1"
            >
              <span className="text-[42px] font-bold tracking-tight text-[var(--text-primary)] tabular-nums leading-none">
                {formatTime(mode === 'stopwatch' ? stopwatchTime : pomoTime)}
              </span>
              <span className="text-[11px] text-[var(--text-muted)] font-medium">
                {mode === 'pomodoro' ? (isWork ? 'Work session' : 'Break time') : 'Elapsed'}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      {mode !== 'clock' && (
        <div className="flex gap-2 mt-4">
          <Button
            onClick={() => setIsRunning(!isRunning)}
            className="flex-1 h-8 rounded-lg text-[12px] font-semibold border-0 text-white"
            style={{ background: isRunning ? 'var(--bg-base)' : '#7B2FBE', color: isRunning ? 'var(--text-primary)' : 'white', border: isRunning ? '1px solid var(--border-default)' : 'none' }}
          >
            {isRunning ? <Pause className="h-3.5 w-3.5 mr-1" /> : <Play className="h-3.5 w-3.5 mr-1" />}
            {isRunning ? 'Pause' : 'Start'}
          </Button>
          <Button
            variant="ghost"
            onClick={() => { setIsRunning(false); if (mode === 'stopwatch') setStopwatchTime(0); if (mode === 'pomodoro') setPomoTime(25 * 60); }}
            className="h-8 w-8 p-0 rounded-lg border border-[var(--border-default)] text-[var(--text-muted)] hover:text-[var(--text-primary)] shrink-0"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default TimeTrackerCard;

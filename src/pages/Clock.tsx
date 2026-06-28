import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTaskContext } from '@/contexts/TaskContext';
import { Button } from '@/components/ui/button';
import { Timer, Play, Pause, RotateCcw, Clock as ClockIcon, Brain, Zap, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import PremiumGate from '@/components/premium/PremiumGate';
import { motion, AnimatePresence } from 'framer-motion';
import { Task } from '@/types/task';
import AppLayout from '@/components/app/AppLayout';

type TimerMode = 'clock' | 'pomodoro' | 'stopwatch';

const POMO_WORK = 25 * 60;
const POMO_BREAK = 5 * 60;

const Clock = () => {
  const { user } = useAuth();
  const { getPersonalTasks, updateTask } = useTaskContext();
  const personalTasks = getPersonalTasks();

  const [mode, setMode] = useState<TimerMode>(() => (localStorage.getItem('focus_mode') as TimerMode) || 'clock');
  const [isRunning, setIsRunning] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [pomoSeconds, setPomoSeconds] = useState(POMO_WORK);
  const [isWork, setIsWork] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [stopwatchSeconds, setStopwatchSeconds] = useState(0);
  const [lapTimes, setLapTimes] = useState<number[]>([]);

  // Clock tick
  useEffect(() => {
    const id = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // Timer logic
  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => {
      if (mode === 'stopwatch') {
        setStopwatchSeconds(p => p + 1);
      } else if (mode === 'pomodoro') {
        setPomoSeconds(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            if (selectedTask?.id) updateTask(selectedTask.id, { isCompleted: true, focusTimerRemainingSeconds: 0 });
            setIsWork(w => !w);
            return isWork ? POMO_BREAK : POMO_WORK;
          }
          return prev - 1;
        });
      }
    }, 1000);
    return () => clearInterval(id);
  }, [isRunning, mode, isWork, selectedTask]);

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`;
  };

  const reset = () => {
    setIsRunning(false);
    if (mode === 'pomodoro') { setPomoSeconds(POMO_WORK); setIsWork(true); }
    if (mode === 'stopwatch') { setStopwatchSeconds(0); setLapTimes([]); }
  };

  const pomoProgress = (POMO_WORK - pomoSeconds) / POMO_WORK;
  const focusTasks = useMemo(() => personalTasks.filter(t => !t.isCompleted), [personalTasks]);

  const modes = [
    { key: 'clock' as TimerMode, label: 'Clock', icon: ClockIcon, color: '#7B2FBE' },
    { key: 'pomodoro' as TimerMode, label: 'Pomodoro', icon: Brain, color: '#7B2FBE' },
    { key: 'stopwatch' as TimerMode, label: 'Stopwatch', icon: Timer, color: '#00C9A7' },
  ];

  const activeMode = modes.find(m => m.key === mode)!;

  return (
    <AppLayout title="Clock">
      <PremiumGate feature="Clock & Focus" description="Access timers, Pomodoro sessions, and focus tracking." variant="dialog">
        <div className="space-y-6 pb-8">

          {/* Page title */}
          <div>
            <h1 className="text-[22px] font-bold text-[var(--text-primary)]">Clock & Focus</h1>
            <p className="text-[13px] text-[var(--text-muted)] mt-0.5">Track time, run Pomodoro sessions, and stay focused</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">

            <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-[12px] overflow-hidden shadow-[var(--shadow-card)]">

              {/* Mode tabs at top */}
              <div className="flex border-b border-[var(--border-default)] bg-[var(--bg-base)]">
                {modes.map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => { setMode(key); setIsRunning(false); }}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-3 text-[13px] font-medium transition-all duration-200 relative",
                      mode === key
                        ? "text-[var(--text-primary)] bg-[var(--bg-card)]"
                        : "text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]"
                    )}
                  >
                    <Icon className={cn("h-4 w-4", mode === key ? "text-[#7B2FBE]" : "")} />
                    {label}
                    {mode === key && (
                      <motion.div
                        layoutId="tab-underline"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#7B2FBE]"
                        transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Timer body */}
              <div className="flex flex-col items-center justify-center py-16 px-8 relative min-h-[380px]">
                {/* Subtle bg glow */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-[0.04]"
                  style={{ background: `radial-gradient(ellipse at center, #7B2FBE 0%, transparent 70%)` }}
                />

                <AnimatePresence mode="wait">
                  <motion.div
                    key={mode}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="flex flex-col items-center relative z-10"
                  >
                    {/* === CLOCK MODE === */}
                    {mode === 'clock' && (
                      <div className="text-center">
                        <div className="flex items-baseline gap-1 justify-center">
                          <span className="text-[80px] sm:text-[100px] font-bold tabular-nums text-[var(--text-primary)] leading-none tracking-tight">
                            {format(currentTime, 'HH')}
                          </span>
                          <motion.span
                            animate={{ opacity: [1, 0.2, 1] }}
                            transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
                            className="text-[70px] sm:text-[90px] font-bold text-[var(--text-muted)] leading-none"
                          >:</motion.span>
                          <span className="text-[80px] sm:text-[100px] font-bold tabular-nums text-[var(--text-primary)] leading-none tracking-tight">
                            {format(currentTime, 'mm')}
                          </span>
                        </div>
                        <p className="text-[14px] text-[var(--text-muted)] mt-4 font-medium">
                          {format(currentTime, 'EEEE, MMMM do')}
                        </p>
                        <p className="text-[12px] text-[var(--text-muted)] mt-1">
                          {Intl.DateTimeFormat().resolvedOptions().timeZone}
                        </p>
                      </div>
                    )}

                    {/* === POMODORO MODE === */}
                    {mode === 'pomodoro' && (
                      <div className="flex flex-col items-center gap-5">
                        {/* SVG progress ring */}
                        <div className="relative h-[200px] w-[200px]">
                          <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                            {/* Track */}
                            <circle cx="100" cy="100" r="88" fill="none" stroke="var(--bg-base)" strokeWidth="8" />
                            {/* Progress */}
                            <motion.circle
                              cx="100" cy="100" r="88" fill="none"
                              stroke="#7B2FBE"
                              strokeWidth="8"
                              strokeLinecap="round"
                              strokeDasharray={`${2 * Math.PI * 88}`}
                              animate={{ strokeDashoffset: `${2 * Math.PI * 88 * (1 - pomoProgress)}` }}
                              transition={{ duration: 0.8, ease: 'linear' }}
                            />
                          </svg>
                          {/* Center content */}
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-[36px] font-bold tabular-nums text-[var(--text-primary)] leading-none tracking-tight">
                              {formatTime(pomoSeconds)}
                            </span>
                            <span className={cn(
                              "text-[11px] font-semibold mt-2 px-2 py-0.5 rounded-full",
                              isWork
                                ? "bg-[#7B2FBE]/10 text-[#7B2FBE]"
                                : "bg-[#00C9A7]/10 text-[#00C9A7]"
                            )}>
                              {isWork ? 'WORK' : 'BREAK'}
                            </span>
                          </div>
                        </div>

                        {selectedTask && (
                          <div className="text-center">
                            <p className="text-[12px] text-[var(--text-muted)]">Focusing on</p>
                            <p className="text-[14px] font-semibold text-[var(--text-primary)] mt-0.5 max-w-[240px] truncate">
                              {selectedTask.title}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* === STOPWATCH MODE === */}
                    {mode === 'stopwatch' && (
                      <div className="flex flex-col items-center gap-4 w-full">
                        <span className="text-[72px] sm:text-[88px] font-bold tabular-nums text-[var(--text-primary)] leading-none tracking-tight">
                          {formatTime(stopwatchSeconds)}
                        </span>
                        {lapTimes.length > 0 && (
                          <div className="w-full max-w-[280px] space-y-1.5 max-h-[120px] overflow-y-auto">
                            {[...lapTimes].reverse().map((lap, i) => (
                              <div key={i} className="flex justify-between items-center text-[12px] px-3 py-1.5 rounded-lg bg-[var(--bg-base)]">
                                <span className="text-[var(--text-muted)]">Lap {lapTimes.length - i}</span>
                                <span className="font-semibold text-[var(--text-primary)] tabular-nums">{formatTime(lap)}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Control bar at bottom */}
              {mode !== 'clock' && (
                <div className="border-t border-[var(--border-default)] bg-[var(--bg-base)] px-8 py-4 flex items-center justify-center gap-3">
                  <Button
                    variant="ghost"
                    onClick={reset}
                    className="h-10 px-5 rounded-xl border border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-[13px] font-medium"
                  >
                    <RotateCcw className="h-3.5 w-3.5 mr-2" /> Reset
                  </Button>

                  {mode === 'stopwatch' && (
                    <Button
                      variant="ghost"
                      onClick={() => isRunning && setLapTimes(p => [...p, stopwatchSeconds])}
                      disabled={!isRunning}
                      className="h-10 px-5 rounded-xl border border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-[13px] font-medium disabled:opacity-40"
                    >
                      Lap
                    </Button>
                  )}

                  <Button
                    disabled={mode === 'pomodoro' && !selectedTask}
                    onClick={() => setIsRunning(!isRunning)}
                    className="h-10 px-8 rounded-xl text-[13px] font-semibold text-white disabled:opacity-50"
                    style={{ background: isRunning ? '#6B7280' : '#7B2FBE' }}
                  >
                    {isRunning ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                    {isRunning ? 'Pause' : 'Start'}
                  </Button>

                  {mode === 'pomodoro' && (
                    <Button
                      variant="ghost"
                      onClick={() => setPomoSeconds(p => p + 60)}
                      className="h-10 px-5 rounded-xl border border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-[13px] font-medium"
                    >
                      +1 min
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* ===== RIGHT: Sidebar Panel ===== */}
            <div className="space-y-4">

              {/* Pomodoro task picker */}
              {mode === 'pomodoro' && (
                <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-[12px] p-4 shadow-[var(--shadow-card)]">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[13px] font-semibold text-[var(--text-primary)]">Focus Task</h3>
                    <span className="text-[11px] text-[var(--text-muted)]">{focusTasks.length} available</span>
                  </div>
                  <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-0.5">
                    {focusTasks.length > 0 ? focusTasks.map(task => (
                      <button
                        key={task.id}
                        onClick={() => { setSelectedTask(task); setPomoSeconds(POMO_WORK); setIsRunning(false); }}
                        className={cn(
                          "w-full p-3 rounded-xl border text-left transition-all duration-150 group",
                          selectedTask?.id === task.id
                            ? "border-[#7B2FBE]/40 bg-[#7B2FBE]/6"
                            : "border-[var(--border-default)] hover:border-[#7B2FBE]/25 hover:bg-[var(--bg-card-hover)]"
                        )}
                      >
                        <div className="flex items-start gap-2.5">
                          <div className={cn(
                            "h-4 w-4 mt-0.5 rounded-full border-2 shrink-0 transition-colors",
                            selectedTask?.id === task.id ? "border-[#7B2FBE] bg-[#7B2FBE]" : "border-[var(--border-strong)]"
                          )} />
                          <div>
                            <p className={cn("text-[13px] font-medium leading-tight", selectedTask?.id === task.id ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]")}>
                              {task.title}
                            </p>
                            <p className="text-[11px] text-[var(--text-muted)] mt-0.5">25 min session</p>
                          </div>
                        </div>
                      </button>
                    )) : (
                      <div className="text-center py-6">
                        <p className="text-[12px] text-[var(--text-muted)]">No tasks available</p>
                        <p className="text-[11px] text-[var(--text-muted)] mt-0.5">Create a task first</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Quick stats */}
              <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-[12px] p-4 shadow-[var(--shadow-card)]">
                <h3 className="text-[13px] font-semibold text-[var(--text-primary)] mb-3">Today's Focus</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Sessions', value: '0', icon: Brain, color: '#7B2FBE' },
                    { label: 'Focus time', value: '0m', icon: Timer, color: '#00C9A7' },
                    { label: 'Tasks done', value: personalTasks.filter(t => t.isCompleted).length.toString(), icon: Zap, color: '#FFB300' },
                    { label: 'Pending', value: personalTasks.filter(t => !t.isCompleted).length.toString(), icon: ClockIcon, color: '#7B2FBE' },
                  ].map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className="bg-[var(--bg-base)] rounded-xl p-3 flex flex-col gap-1.5">
                      <div className="h-7 w-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
                        <Icon className="h-3.5 w-3.5" style={{ color }} />
                      </div>
                      <span className="text-[20px] font-bold text-[var(--text-primary)] leading-none">{value}</span>
                      <span className="text-[11px] text-[var(--text-muted)]">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mode info card */}
              <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-[12px] p-4 shadow-[var(--shadow-card)]">
                <h3 className="text-[13px] font-semibold text-[var(--text-primary)] mb-2">
                  {mode === 'clock' && 'World Clock'}
                  {mode === 'pomodoro' && 'Pomodoro Method'}
                  {mode === 'stopwatch' && 'Stopwatch'}
                </h3>
                <p className="text-[12px] text-[var(--text-muted)] leading-relaxed">
                  {mode === 'clock' && `Your local time in ${Intl.DateTimeFormat().resolvedOptions().timeZone}. All task deadlines are calculated in this timezone.`}
                  {mode === 'pomodoro' && 'Work in focused 25-minute sprints, then take a 5-minute break. Select a task above to track your progress automatically.'}
                  {mode === 'stopwatch' && 'Measure elapsed time precisely. Use Lap to record split times without stopping the timer.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </PremiumGate>
    </AppLayout>
  );
};

export default Clock;

import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTaskContext } from '@/contexts/TaskContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Timer, Play, Pause, RotateCcw, Check, Clock as ClockIcon, Brain, Zap, Globe, ShieldCheck, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import PremiumGate from '@/components/premium/PremiumGate';
import { motion, AnimatePresence } from 'framer-motion';
import { Task } from '@/types/task';
import AppLayout from '@/components/app/AppLayout';

type TimerMode = 'clock' | 'pomodoro' | 'stopwatch';

const Clock = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getPersonalTasks, updateTask } = useTaskContext();
  const personalTasks = getPersonalTasks();
  
  const [mode, setMode] = useState<TimerMode>(() => (localStorage.getItem('focus_mode') as TimerMode) || 'clock');
  const [isRunning, setIsRunning] = useState(false);
  
  // 1. All State Declarations First
  const [currentTime, setCurrentTime] = useState(new Date());
  const [pomoSeconds, setPomoSeconds] = useState(25 * 60);
  const [isWork, setIsWork] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [stopwatchSeconds, setStopwatchSeconds] = useState(0);

  // 2. Persistence Loading
  useEffect(() => {
    const savedStopwatch = localStorage.getItem('focus_stopwatch_seconds');
    const savedPomo = localStorage.getItem('focus_pomo_seconds');
    const savedTaskId = localStorage.getItem('focus_selected_task_id');
    
    if (savedStopwatch) setStopwatchSeconds(parseInt(savedStopwatch));
    if (savedPomo) setPomoSeconds(parseInt(savedPomo));
    if (savedTaskId) {
      const task = personalTasks.find(t => t.id === savedTaskId);
      if (task) {
        setSelectedTask(task);
        // If task has saved remaining seconds, prioritize that
        if (task.focusTimerRemainingSeconds && task.focusTimerRemainingSeconds > 0) {
          setPomoSeconds(task.focusTimerRemainingSeconds);
        }
      }
    }
  }, [personalTasks.length]); // Re-run if tasks load later

  // 3. Persistence Saving (Local Only)
  useEffect(() => {
    localStorage.setItem('focus_mode', mode);
    localStorage.setItem('focus_stopwatch_seconds', stopwatchSeconds.toString());
    localStorage.setItem('focus_pomo_seconds', pomoSeconds.toString());
    if (selectedTask) localStorage.setItem('focus_selected_task_id', selectedTask.id || '');
  }, [mode, stopwatchSeconds, pomoSeconds, selectedTask]);

  // Global Tick
  useEffect(() => {
    const id = setInterval(() => {
      setCurrentTime(new Date());
      if (isRunning) {
        if (mode === 'pomodoro') {
          setPomoSeconds(prev => {
            const nextVal = prev <= 1 ? 0 : prev - 1;
            
            if (nextVal === 0) {
              setIsRunning(false);
              if (selectedTask?.id) {
                updateTask(selectedTask.id, { 
                  isCompleted: true,
                  focusTimerRemainingSeconds: 0 
                });
              }
              return isWork ? 5 * 60 : 25 * 60;
            }

            // Optional: Periodically sync to DB every 10 seconds to avoid too many API calls
            if (nextVal % 10 === 0 && selectedTask?.id) {
               updateTask(selectedTask.id, { focusTimerRemainingSeconds: nextVal });
            }

            return nextVal;
          });
        } else if (mode === 'stopwatch') {
          setStopwatchSeconds(prev => prev + 1);
        }
      }
    }, 1000);
    return () => clearInterval(id);
  }, [isRunning, mode, isWork, selectedTask]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h.toString().padStart(2, '0') + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = mode === 'pomodoro' ? (pomoSeconds / (isWork ? 25 * 60 : 5 * 60)) * 100 : 0;

  const focusTasks = useMemo(() => {
    return personalTasks.filter(t => !t.isCompleted);
  }, [personalTasks]);

  return (
    <AppLayout title="Temporal Center">
      <PremiumGate 
        feature="Temporal Command" 
        description="Access advanced temporal synchronization and focus modules."
        variant="dialog"
      >
        <div className="min-h-[85vh] flex flex-col items-center justify-center py-4 sm:py-12 relative overflow-hidden">
          
          {/* Background Ambient Glows */}
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/5 blur-[100px] rounded-full pointer-events-none" />

          <div className="w-full max-w-[1400px] mx-auto relative z-10 px-4">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-12 items-center">
              
              {/* Left Column - The Massive Immersion Clock */}
              <div className="lg:col-span-8 flex flex-col items-center justify-center min-h-[300px] sm:min-h-[500px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={mode}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="relative"
                  >
                    {/* Progress Ring for Pomodoro */}
                    {mode === 'pomodoro' && (
                      <div className="absolute inset-[-60px] pointer-events-none">
                        <svg className="w-full h-full rotate-[-90deg]">
                          <circle
                            cx="50%"
                            cy="50%"
                            r="48%"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                            className="text-white/5"
                          />
                          <motion.circle
                            cx="50%"
                            cy="50%"
                            r="48%"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeDasharray="100 100"
                            initial={{ strokeDashoffset: 100 }}
                            animate={{ strokeDashoffset: 100 - progress }}
                            className="text-primary drop-shadow-[0_0_15px_rgba(var(--primary-rgb),0.6)]"
                          />
                        </svg>
                      </div>
                    )}

                    {/* High-Fidelity Time Display */}
                    <div className="text-center">
                      <div className={cn(
                        "font-black tracking-tighter text-foreground leading-none font-jakarta flex items-center justify-center gap-1 sm:gap-4 drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]",
                        user?.isPro 
                          ? "text-[4rem] xs:text-[5rem] sm:text-[6.5rem] md:text-[7.5rem] lg:text-[8.5rem] xl:text-[11rem] 2xl:text-[14rem]" 
                          : "text-[3rem] xs:text-[4rem] sm:text-[5rem] md:text-[6rem] lg:text-[7rem]"
                      )}>
                        {mode === 'clock' ? (
                          <>
                            <span className="tabular-nums">{format(currentTime, 'HH')}</span>
                            <span className="text-primary/20 animate-pulse">:</span>
                            <span className="tabular-nums">{format(currentTime, 'mm')}</span>
                          </>
                        ) : (
                          <span className="tabular-nums">
                            {formatTime(mode === 'pomodoro' ? pomoSeconds : stopwatchSeconds)}
                          </span>
                        )}
                      </div>
                      
                      <div className="mt-8 flex flex-col items-center">
                        <div className="h-px w-32 bg-gradient-to-r from-transparent via-primary/50 to-transparent mb-4" />
                        <div className="space-y-2">
                          <p className="text-base sm:text-xl font-black text-primary/60 uppercase tracking-[0.3em] sm:tracking-[0.6em] italic drop-shadow-sm">
                            {mode === 'clock' ? format(currentTime, 'EEEE, MMMM dd') : 
                             mode === 'pomodoro' ? (isWork ? 'Deep Work Mission' : 'Recharge Phase') : 'Mission Elapsed Time'}
                          </p>
                          {mode === 'pomodoro' && selectedTask && (
                            <motion.p 
                              initial={{ opacity: 0 }} 
                              animate={{ opacity: 1 }}
                              className="text-sm font-bold text-foreground/40 uppercase tracking-[0.3em]"
                            >
                              Target: {selectedTask.title}
                            </motion.p>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Right Column - Tactical Sidebar */}
              <div className="lg:col-span-4 space-y-8 max-h-none lg:max-h-[70vh] overflow-y-auto pr-0 lg:pr-2 custom-scrollbar">
                
                {/* 1. Mode Selector */}
                <div className="glass p-2 rounded-[2rem] border-white/10 flex flex-col gap-2">
                  {(['clock', 'pomodoro', 'stopwatch'] as TimerMode[]).map((m) => (
                    <button
                      key={m}
                      onClick={() => { setMode(m); setIsRunning(false); }}
                      className={cn(
                        "w-full px-6 py-4 rounded-2xl transition-all duration-500 font-black text-xs uppercase tracking-[0.2em] flex items-center justify-between group",
                        mode === m 
                          ? "bg-primary text-primary-foreground shadow-xl shadow-primary/30" 
                          : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {m === 'clock' && <Globe className="h-4 w-4" />}
                        {m === 'pomodoro' && <Brain className="h-4 w-4" />}
                        {m === 'stopwatch' && <Timer className="h-4 w-4" />}
                        {m}
                      </div>
                      <ChevronRight className={cn("h-4 w-4 transition-transform group-hover:translate-x-1", mode === m ? "opacity-100" : "opacity-0")} />
                    </button>
                  ))}
                </div>

                {/* 2. Objective Selection (Only in Pomodoro) */}
                <AnimatePresence>
                  {mode === 'pomodoro' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4 overflow-hidden"
                    >
                      <div className="flex items-center justify-between px-2">
                        <h4 className="font-black text-[10px] uppercase tracking-[0.4em] text-primary/60">Objective Queue</h4>
                        <div className="h-1 w-12 bg-primary/20 rounded-full" />
                      </div>
                      <div className="space-y-2">
                        {focusTasks.length > 0 ? (
                          focusTasks.map(task => (
                            <button
                              key={task.id}
                              onClick={() => {
                                setSelectedTask(task);
                                setPomoSeconds(25 * 60);
                                setIsRunning(false);
                              }}
                              className={cn(
                                "w-full p-4 rounded-2xl border text-left transition-all duration-300 group",
                                selectedTask?.id === task.id
                                  ? "bg-primary/20 border-primary shadow-lg shadow-primary/10"
                                  : "bg-white/5 border-white/5 hover:bg-white/10"
                              )}
                            >
                              <p className={cn("text-xs font-bold uppercase tracking-wider truncate", selectedTask?.id === task.id ? "text-primary" : "text-foreground")}>
                                {task.title}
                              </p>
                              <div className="flex items-center gap-2 mt-1 opacity-40">
                                <Timer className="h-3 w-3" />
                                <span className="text-[10px] font-black uppercase">25m Target</span>
                              </div>
                            </button>
                          ))
                        ) : (
                          <div className="p-8 glass rounded-2xl border-dashed border-white/10 text-center">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">No Active Objectives</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 3. Tactical Actions */}
                <AnimatePresence mode="wait">
                  {mode !== 'clock' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <Button
                        size="lg"
                        disabled={mode === 'pomodoro' && !selectedTask}
                        onClick={() => setIsRunning(!isRunning)}
                        className={cn(
                          "w-full h-16 sm:h-20 rounded-[2rem] transition-all duration-500 font-black text-xs sm:text-sm tracking-[0.3em] uppercase group relative overflow-hidden",
                          isRunning 
                            ? "bg-white/5 border border-white/10 text-foreground" 
                            : "bg-primary text-primary-foreground shadow-2xl shadow-primary/40",
                          mode === 'pomodoro' && !selectedTask && "opacity-50 grayscale"
                        )}
                      >
                        <div className="flex items-center gap-3 relative z-10">
                          {isRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 translate-x-0.5" />}
                          {isRunning ? 'SUSPEND' : 'INITIALIZE'}
                        </div>
                        {!isRunning && <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />}
                      </Button>

                      <div className="grid grid-cols-2 gap-4">
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setIsRunning(false);
                            if (mode === 'pomodoro') setPomoSeconds(25 * 60);
                            else setStopwatchSeconds(0);
                          }}
                          className="h-14 sm:h-16 rounded-[1.5rem] glass border-white/5 text-muted-foreground hover:text-foreground font-black text-[10px] tracking-widest uppercase"
                        >
                          <RotateCcw className="h-4 w-4 mr-2" /> RESET
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => mode === 'pomodoro' && setPomoSeconds(pomoSeconds + 60)}
                          className="h-14 sm:h-16 rounded-[1.5rem] glass border-white/5 text-muted-foreground hover:text-primary font-black text-[10px] tracking-widest uppercase"
                        >
                          <Zap className="h-4 w-4 mr-2" /> ADD MIN
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 4. Status Matrix */}
                <div className="space-y-4 pt-4 pb-12">
                  <div className="flex items-center justify-between px-2">
                    <h4 className="font-black text-[10px] uppercase tracking-[0.4em] text-muted-foreground">Mission Matrix</h4>
                    <div className="h-1 w-12 bg-primary/20 rounded-full" />
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <Card className="glass-dark p-4 rounded-2xl border-white/5 flex items-center gap-4 group hover:border-primary/20 transition-colors">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <ShieldCheck className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-0.5">Network Status</p>
                        <p className="text-xs font-bold text-foreground uppercase tracking-tighter flex items-center gap-2">
                          Encrypted <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                        </p>
                      </div>
                    </Card>

                    <Card className="glass-dark p-4 rounded-2xl border-white/5 flex items-center gap-4 group hover:border-primary/20 transition-colors">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <Zap className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-0.5">Temporal Sync</p>
                        <p className="text-xs font-bold text-foreground uppercase tracking-tighter">Active Node</p>
                      </div>
                    </Card>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </PremiumGate>
    </AppLayout>
  );
};

export default Clock;

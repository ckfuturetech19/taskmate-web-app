import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AppLayout from '@/components/app/AppLayout';
import { useTaskContext } from '@/contexts/TaskContext';
import { usePremium } from '@/contexts/PremiumContext';
import { Task } from '@/types/task';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Timer, Play, Pause, Square, RotateCcw, Check, Clock as ClockIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import PremiumGate from '@/components/premium/PremiumGate';

type TimerMode = 'direct' | 'task' | 'clock';

const Clock = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getPersonalTasks, updateTask } = useTaskContext();
  const { isPremium } = usePremium();
  const personalTasks = getPersonalTasks();
  
  // Get tasks with focus timers enabled
  const tasksWithTimers = useMemo(() => {
    return personalTasks.filter(t => t.focusTimerEnabled && !t.isCompleted);
  }, [personalTasks]);

  // Timer mode
  const [mode, setMode] = useState<TimerMode>('direct');

  // Direct Timer State (counts up from 0)
  const [directTimerSeconds, setDirectTimerSeconds] = useState(0);
  const [isDirectTimerRunning, setIsDirectTimerRunning] = useState(false);
  const [directTimerInterval, setDirectTimerInterval] = useState<NodeJS.Timeout | null>(null);

  // Task Timer State (counts down from task duration)
  const initialTaskId = location.state?.taskId;
  const [selectedTask, setSelectedTask] = useState<Task | null>(() => {
    if (initialTaskId) {
      return tasksWithTimers.find(t => t.id === initialTaskId) || null;
    }
    return tasksWithTimers.length > 0 ? tasksWithTimers[0] : null;
  });

  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [taskTimerInterval, setTaskTimerInterval] = useState<NodeJS.Timeout | null>(null);

  // System Clock State
  const [currentTime, setCurrentTime] = useState(new Date());

  // Load direct timer from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('direct_timer_seconds');
    const running = localStorage.getItem('direct_timer_running');
    if (saved) {
      setDirectTimerSeconds(parseInt(saved, 10));
    }
    if (running === 'true' && saved) {
      setIsDirectTimerRunning(true);
    }
  }, []);

  // Direct Timer Logic (counts up)
  useEffect(() => {
    if (isDirectTimerRunning) {
      const id = setInterval(() => {
        setDirectTimerSeconds((prev) => {
          const newValue = prev + 1;
          localStorage.setItem('direct_timer_seconds', newValue.toString());
          return newValue;
        });
      }, 1000);
      setDirectTimerInterval(id);
      return () => clearInterval(id);
    } else if (directTimerInterval) {
      clearInterval(directTimerInterval);
      setDirectTimerInterval(null);
    }
  }, [isDirectTimerRunning]);

  // System Clock Update
  useEffect(() => {
    const id = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // Initialize task timer when task is selected
  useEffect(() => {
    if (selectedTask && mode === 'task' && !isRunning && remainingSeconds === 0) {
      // Check if task has saved remaining time
      const savedTime = selectedTask.focusTimerRemainingSeconds;
      if (savedTime && savedTime > 0) {
        setRemainingSeconds(savedTime);
      } else {
        const duration = (selectedTask.focusDurationMinutes || 25) * 60;
        setRemainingSeconds(duration);
      }
    }
  }, [selectedTask, mode, isRunning]);

  const handleCompleteTask = () => {
    if (selectedTask?.id) {
      updateTask(selectedTask.id, {
        isCompleted: true,
        focusTimerIsRunning: false,
        focusTimerStartTime: undefined,
        focusTimerRemainingSeconds: undefined,
      });
      // Navigate back or select next task
      const nextTask = tasksWithTimers.find(t => t.id !== selectedTask.id && !t.isCompleted);
      if (nextTask) {
        setSelectedTask(nextTask);
        const duration = (nextTask.focusDurationMinutes || 25) * 60;
        setRemainingSeconds(duration);
      } else {
        setSelectedTask(null);
        setRemainingSeconds(0);
      }
    }
  };

  // Task Timer countdown logic
  useEffect(() => {
    if (isRunning && !isPaused && remainingSeconds > 0 && mode === 'task') {
      const id = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            if (selectedTask) {
              handleCompleteTask();
            }
            return 0;
          }
          const newValue = prev - 1;
          // Update task with remaining time
          if (selectedTask?.id) {
            updateTask(selectedTask.id, {
              focusTimerRemainingSeconds: newValue,
            });
          }
          return newValue;
        });
      }, 1000);
      setTaskTimerInterval(id);
      return () => clearInterval(id);
    } else if (taskTimerInterval) {
      clearInterval(taskTimerInterval);
      setTaskTimerInterval(null);
    }
  }, [isRunning, isPaused, remainingSeconds, selectedTask, mode]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Direct Timer Controls
  const toggleDirectTimer = () => {
    setIsDirectTimerRunning(!isDirectTimerRunning);
    localStorage.setItem('direct_timer_running', (!isDirectTimerRunning).toString());
  };

  const stopDirectTimer = () => {
    setIsDirectTimerRunning(false);
    setDirectTimerSeconds(0);
    localStorage.setItem('direct_timer_seconds', '0');
    localStorage.setItem('direct_timer_running', 'false');
  };

  const resetDirectTimer = () => {
    setDirectTimerSeconds(0);
    localStorage.setItem('direct_timer_seconds', '0');
  };

  // Task Timer Controls
  const handleStart = () => {
    if (selectedTask && remainingSeconds > 0) {
      setIsRunning(true);
      setIsPaused(false);
      
      if (selectedTask.id) {
        updateTask(selectedTask.id, {
          focusTimerIsRunning: true,
          focusTimerStartTime: new Date().toISOString(),
          focusTimerRemainingSeconds: remainingSeconds,
        });
      }
    }
  };

  const handlePause = () => {
    setIsPaused(true);
    setIsRunning(false);
    
    if (selectedTask?.id) {
      updateTask(selectedTask.id, {
        focusTimerIsRunning: false,
        focusTimerRemainingSeconds: remainingSeconds,
      });
    }
  };

  const handleResume = () => {
    setIsPaused(false);
    setIsRunning(true);
    
    if (selectedTask?.id) {
      updateTask(selectedTask.id, {
        focusTimerIsRunning: true,
      });
    }
  };

  const handleStop = () => {
    setIsRunning(false);
    setIsPaused(false);
    
    if (selectedTask?.id) {
      updateTask(selectedTask.id, {
        focusTimerIsRunning: false,
        focusTimerStartTime: undefined,
        focusTimerRemainingSeconds: undefined,
      });
    }
    
    if (selectedTask) {
      const duration = (selectedTask.focusDurationMinutes || 25) * 60;
      setRemainingSeconds(duration);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    
    if (selectedTask) {
      const duration = (selectedTask.focusDurationMinutes || 25) * 60;
      setRemainingSeconds(duration);
      
      if (selectedTask.id) {
        updateTask(selectedTask.id, {
          focusTimerIsRunning: false,
          focusTimerStartTime: undefined,
          focusTimerRemainingSeconds: undefined,
        });
      }
    }
  };

  const hours = Math.floor(remainingSeconds / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const secs = remainingSeconds % 60;

  const directHours = Math.floor(directTimerSeconds / 3600);
  const directMinutes = Math.floor((directTimerSeconds % 3600) / 60);
  const directSecs = directTimerSeconds % 60;

  return (
    <AppLayout title="Focus Timer">
      <PremiumGate 
        feature="Focus Timer" 
        description="Focus timer and task-based timers are premium features. Upgrade to unlock."
        variant="dialog"
      >
        <div className="space-y-6">
          {/* Mode Selection Tabs */}
          <Tabs value={mode} onValueChange={(v) => setMode(v as TimerMode)} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="direct" className="gap-2">
              <Timer className="h-4 w-4" />
              Direct Timer
            </TabsTrigger>
            <TabsTrigger value="task" className="gap-2">
              <Timer className="h-4 w-4" />
              Task Timer
            </TabsTrigger>
            <TabsTrigger value="clock" className="gap-2">
              <ClockIcon className="h-4 w-4" />
              System Clock
            </TabsTrigger>
          </TabsList>

          {/* Direct Timer Mode */}
          <TabsContent value="direct" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="p-8 bg-gradient-to-br from-primary/5 via-primary/10 to-background border-primary/20">
                  <div className="space-y-6">
                    <div className="text-center">
                      <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                        Direct Timer
                      </h2>
                      <p className="text-muted-foreground">Casual timer that counts up from 0</p>
                    </div>

                    <div className="flex items-center justify-center">
                      <div className="relative">
                        <div className={cn(
                          "text-7xl md:text-8xl font-mono font-bold transition-all duration-300",
                          isDirectTimerRunning
                            ? "bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent"
                            : "text-foreground"
                        )}>
                          {formatTime(directTimerSeconds)}
                        </div>
                        {isDirectTimerRunning && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="h-32 w-32 border-4 border-primary border-t-transparent rounded-full animate-spin opacity-30" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-center gap-4 text-sm">
                      <div className="text-center p-3 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                        <div className="text-2xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                          {directHours}
                        </div>
                        <div className="text-muted-foreground">Hours</div>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                        <div className="text-2xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                          {directMinutes}
                        </div>
                        <div className="text-muted-foreground">Minutes</div>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                        <div className="text-2xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                          {directSecs}
                        </div>
                        <div className="text-muted-foreground">Seconds</div>
                      </div>
                    </div>

                    <div className="flex justify-center gap-3 flex-wrap">
                      <Button
                        size="lg"
                        onClick={toggleDirectTimer}
                        className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-105"
                        style={{ background: 'linear-gradient(135deg, #1E6F43, #2FAE72)' }}
                      >
                        {isDirectTimerRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                        {isDirectTimerRunning ? 'Pause' : 'Start'}
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        onClick={stopDirectTimer}
                        className="gap-2 border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
                      >
                        <Square className="h-5 w-5" />
                        Stop
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        onClick={resetDirectTimer}
                        className="gap-2 border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
                      >
                        <RotateCcw className="h-5 w-5" />
                        Reset
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Task Timer Mode */}
          <TabsContent value="task" className="mt-6">
            {tasksWithTimers.length === 0 ? (
              <Card className="p-12 text-center bg-gradient-to-br from-primary/5 via-primary/10 to-background border-primary/20">
                <div className="relative inline-block mb-4">
                  <Timer className="h-16 w-16 mx-auto text-primary/50" />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent rounded-full blur-xl" />
                </div>
                <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  No Focus Timers
                </h3>
                <p className="text-muted-foreground mb-6">
                  Enable focus timer when creating a task to use this feature.
                </p>
                <Button 
                  onClick={() => navigate('/tasks')}
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #1E6F43, #2FAE72)' }}
                >
                  Go to Tasks
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card className="p-8 bg-gradient-to-br from-primary/5 via-primary/10 to-background border-primary/20">
                    {selectedTask ? (
                      <div className="space-y-6">
                        <div className="text-center">
                          <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                            {selectedTask.title}
                          </h2>
                          <p className="text-muted-foreground">
                            Focus Duration: {selectedTask.focusDurationMinutes || 25} minutes
                          </p>
                        </div>

                        <div className="flex items-center justify-center">
                          <div className="relative">
                            <div className={cn(
                              "text-7xl md:text-8xl font-mono font-bold transition-all duration-300",
                              remainingSeconds === 0 
                                ? "text-destructive" 
                                : isRunning 
                                ? "bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent"
                                : "text-foreground"
                            )}>
                              {formatTime(remainingSeconds)}
                            </div>
                            {isRunning && (
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="h-32 w-32 border-4 border-primary border-t-transparent rounded-full animate-spin opacity-30" />
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-center gap-4 text-sm">
                          <div className="text-center p-3 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                            <div className="text-2xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                              {hours}
                            </div>
                            <div className="text-muted-foreground">Hours</div>
                          </div>
                          <div className="text-center p-3 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                            <div className="text-2xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                              {minutes}
                            </div>
                            <div className="text-muted-foreground">Minutes</div>
                          </div>
                          <div className="text-center p-3 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                            <div className="text-2xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                              {secs}
                            </div>
                            <div className="text-muted-foreground">Seconds</div>
                          </div>
                        </div>

                        <div className="flex justify-center gap-3 flex-wrap">
                          {!isRunning && !isPaused && (
                            <Button
                              size="lg"
                              onClick={handleStart}
                              disabled={remainingSeconds === 0}
                              className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-105"
                              style={{ background: 'linear-gradient(135deg, #1E6F43, #2FAE72)' }}
                            >
                              <Play className="h-5 w-5" />
                              Start
                            </Button>
                          )}
                          {isRunning && !isPaused && (
                            <Button
                              size="lg"
                              variant="outline"
                              onClick={handlePause}
                              className="gap-2 border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
                            >
                              <Pause className="h-5 w-5" />
                              Pause
                            </Button>
                          )}
                          {isPaused && (
                            <Button
                              size="lg"
                              onClick={handleResume}
                              className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-105"
                              style={{ background: 'linear-gradient(135deg, #1E6F43, #2FAE72)' }}
                            >
                              <Play className="h-5 w-5" />
                              Resume
                            </Button>
                          )}
                          {(isRunning || isPaused) && (
                            <>
                              <Button
                                size="lg"
                                variant="outline"
                                onClick={handleStop}
                                className="gap-2 border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
                              >
                                <Square className="h-5 w-5" />
                                Stop
                              </Button>
                              <Button
                                size="lg"
                                variant="outline"
                                onClick={handleReset}
                                className="gap-2 border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
                              >
                                <RotateCcw className="h-5 w-5" />
                                Reset
                              </Button>
                            </>
                          )}
                          <Button
                            size="lg"
                            variant="outline"
                            onClick={handleCompleteTask}
                            className="gap-2 border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
                          >
                            <Check className="h-5 w-5" />
                            Complete
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Timer className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                        <p className="text-muted-foreground">Select a task to start timer</p>
                      </div>
                    )}
                  </Card>
                </div>

                <div className="lg:col-span-1">
                  <Card className="bg-gradient-to-br from-primary/5 via-background to-primary/5 border-primary/20">
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                        Tasks with Focus Timer
                      </h3>
                      <div className="space-y-2 max-h-[600px] overflow-y-auto">
                        {tasksWithTimers.map((task) => (
                          <div
                            key={task.id}
                            onClick={() => {
                              if (!isRunning) {
                                setSelectedTask(task);
                                const duration = (task.focusDurationMinutes || 25) * 60;
                                setRemainingSeconds(duration);
                                setIsPaused(false);
                              }
                            }}
                            className={cn(
                              "p-3 rounded-lg border cursor-pointer transition-all duration-300",
                              selectedTask?.id === task.id
                                ? "bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 border-primary shadow-md shadow-primary/10"
                                : "hover:bg-gradient-to-r hover:from-primary/10 hover:via-primary/5 hover:to-primary/10 border-primary/20 hover:border-primary/40 hover:shadow-sm",
                              isRunning && selectedTask?.id !== task.id && "opacity-50 cursor-not-allowed"
                            )}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <p className={cn(
                                  "font-medium text-sm truncate",
                                  selectedTask?.id === task.id && "bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
                                )}>
                                  {task.title}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Timer className={cn(
                                    "h-3.5 w-3.5",
                                    selectedTask?.id === task.id ? "text-primary" : "text-muted-foreground"
                                  )} />
                                  <p className="text-xs text-muted-foreground">
                                    {task.focusDurationMinutes || 25} min
                                  </p>
                                </div>
                              </div>
                              {task.focusTimerIsRunning && (
                                <div className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-lg shadow-primary/50" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>

          {/* System Clock Mode */}
          <TabsContent value="clock" className="mt-6">
            <Card className="p-8 bg-gradient-to-br from-primary/5 via-primary/10 to-background border-primary/20">
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    System Clock
                  </h2>
                  <p className="text-muted-foreground">Current time</p>
                </div>

                <div className="flex items-center justify-center">
                  <div className="text-7xl md:text-8xl font-mono font-bold text-foreground">
                    {format(currentTime, 'HH:mm:ss')}
                  </div>
                </div>

                <div className="flex justify-center gap-4 text-sm">
                  <div className="text-center p-3 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                    <div className="text-2xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                      {format(currentTime, 'HH')}
                    </div>
                    <div className="text-muted-foreground">Hours</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                    <div className="text-2xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                      {format(currentTime, 'mm')}
                    </div>
                    <div className="text-muted-foreground">Minutes</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                    <div className="text-2xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                      {format(currentTime, 'ss')}
                    </div>
                    <div className="text-muted-foreground">Seconds</div>
                  </div>
                </div>

                <div className="text-center text-muted-foreground">
                  <p className="text-lg">{format(currentTime, 'EEEE, MMMM d, yyyy')}</p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
        </div>
      </PremiumGate>
    </AppLayout>
  );
};

export default Clock;

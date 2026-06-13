import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Sparkles, Mic, Check } from 'lucide-react';

interface MockTask {
  id: string;
  text: string;
  completed: boolean;
  priority: 'High' | 'Medium' | 'Low';
  score: number; // For mock AI sorting
}

const InteractivePlayground: React.FC = () => {
  const [tasks, setTasks] = useState<MockTask[]>([
    { id: '1', text: '📅 Sync weekly schedule with dev team', completed: false, priority: 'High', score: 95 },
    { id: '2', text: '🎙️ Voice capture: Review contract timelines', completed: true, priority: 'Medium', score: 75 },
    { id: '3', text: '🎯 Set focus block for design system work', completed: false, priority: 'Medium', score: 85 },
    { id: '4', text: '☕ Take a 10-minute mindfulness break', completed: false, priority: 'Low', score: 40 },
  ]);

  const [newTaskText, setNewTaskText] = useState('');
  const [isPrioritizing, setIsPrioritizing] = useState(false);

  // Task Handlers
  const toggleTask = (id: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    const priorities: ('High' | 'Medium' | 'Low')[] = ['High', 'Medium', 'Low'];
    const randomPriority = priorities[Math.floor(Math.random() * priorities.length)];
    const score = randomPriority === 'High' ? 90 : randomPriority === 'Medium' ? 70 : 40;

    const newTask: MockTask = {
      id: Date.now().toString(),
      text: newTaskText.trim(),
      completed: false,
      priority: randomPriority,
      score: score + Math.floor(Math.random() * 9),
    };

    setTasks(prev => [...prev, newTask]);
    setNewTaskText('');
  };

  const deleteTask = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  // Mock AI prioritization
  const handleAiPrioritize = () => {
    setIsPrioritizing(true);
    setTimeout(() => {
      setTasks(prev => [...prev].sort((a, b) => b.score - a.score));
      setIsPrioritizing(false);
    }, 1000);
  };

  // Progress calculations
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const progressPercent = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // SVG Circular progress params
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <section className="py-24 border-y border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-[#05020c] relative overflow-hidden">
      {/* Aurora Ambient Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-[#F0607A]/5 to-[#8B65C8]/5 blur-[80px] pointer-events-none rounded-full" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        
        {/* Section Heading */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-200/50 dark:bg-white/5 border border-slate-300 dark:border-white/10 mb-4"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#8B65C8]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#8B65C8] dark:text-[#C4B8E8]">
              Interactive Playground
            </span>
          </motion.div>
          
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white uppercase tracking-tight mb-4">
            Experience the Core Flow
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
            Try our task manager right now. Check off default items, type custom tasks, or run the AI auto-prioritizer to see dynamic prioritization in action.
          </p>
        </div>

        {/* Dashboard Playground Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
          
          {/* Main Card containing Taskboard */}
          <div className="lg:col-span-2 bg-white/70 dark:bg-slate-950/60 backdrop-blur-xl border border-slate-200 dark:border-white/5 p-6 sm:p-8 rounded-[2.5rem] shadow-xs flex flex-col justify-between relative overflow-hidden group">
            
            {/* Header controls inside Mock App */}
            <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-white/5 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-white/10" />
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-white/10" />
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-white/10" />
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 font-mono tracking-widest uppercase ml-2">Sandbox Workspace</span>
              </div>

              {/* AI Auto Sort Trigger */}
              <button
                onClick={handleAiPrioritize}
                disabled={isPrioritizing || totalTasks === 0}
                className="flex items-center gap-2 px-4 py-2 bg-[#8B65C8]/10 hover:bg-[#8B65C8]/20 disabled:opacity-40 transition-colors rounded-xl text-xs font-bold text-[#8B65C8] dark:text-[#C4B8E8] cursor-pointer"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isPrioritizing ? 'animate-spin' : ''}`} />
                {isPrioritizing ? 'AI Prioritizing...' : 'AI Auto-Sort'}
              </button>
            </div>

            {/* Task list container */}
            <div className="space-y-3 min-h-[200px]">
              <AnimatePresence initial={false}>
                {tasks.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col items-center justify-center text-center py-10"
                  >
                    <p className="text-slate-400 dark:text-slate-500 text-sm">No tasks in your sandbox list. Add one below!</p>
                  </motion.div>
                ) : (
                  tasks.map(task => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      onClick={() => toggleTask(task.id)}
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer select-none group/item ${
                        task.completed
                          ? 'bg-slate-100/40 dark:bg-slate-900/10 border-slate-100 dark:border-white/5 opacity-60'
                          : 'bg-white/50 dark:bg-slate-900/40 border-slate-200 dark:border-white/5 hover:border-[#8B65C8]/30 dark:hover:border-[#8B65C8]/30 shadow-2xs'
                      }`}
                    >
                      <div className="flex items-center gap-4.5 pr-4 flex-1">
                        {/* Custom Checkbox circle */}
                        <div
                          className={`w-5.5 h-5.5 rounded-full border flex items-center justify-center transition-all shrink-0 ${
                            task.completed
                              ? 'bg-gradient-to-r from-[#F0607A] to-[#8B65C8] border-transparent text-white'
                              : 'border-slate-300 dark:border-white/20 hover:border-[#8B65C8]'
                          }`}
                        >
                          {task.completed && <Check className="w-3.5 h-3.5 stroke-[3.5]" />}
                        </div>
                        
                        <span
                          className={`text-xs sm:text-sm font-medium leading-normal break-all transition-all duration-300 ${
                            task.completed
                              ? 'text-slate-400 dark:text-slate-600 line-through'
                              : 'text-slate-700 dark:text-slate-200'
                          }`}
                        >
                          {task.text}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {/* Priority Badge */}
                        <span
                          className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                            task.priority === 'High'
                              ? 'bg-rose-500/10 text-rose-500 border border-rose-500/10'
                              : task.priority === 'Medium'
                              ? 'bg-amber-500/10 text-amber-500 border border-amber-500/10'
                              : 'bg-slate-500/10 text-slate-500 border border-slate-500/10'
                          }`}
                        >
                          {task.priority}
                        </span>

                        {/* Delete Button */}
                        <button
                          onClick={(e) => deleteTask(task.id, e)}
                          className="p-1.5 text-slate-400 dark:text-slate-600 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-900/60 rounded-lg transition-colors cursor-pointer"
                          aria-label="Delete task"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Task addition form input */}
            <form onSubmit={addTask} className="mt-8 flex items-center gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  placeholder="Type or speak to add a sandbox task..."
                  className="w-full pl-5 pr-12 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-white text-xs sm:text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:border-[#8B65C8] dark:focus:border-[#8B65C8] transition-colors"
                />
                
                {/* Voice Icon decoration */}
                <Mic className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
              </div>
              
              <button
                type="submit"
                className="p-3.5 bg-gradient-to-r from-[#F0607A] to-[#8B65C8] text-white hover:scale-105 active:scale-95 transition-all rounded-2xl shadow-md cursor-pointer flex items-center justify-center shrink-0"
              >
                <Plus className="w-5 h-5" />
              </button>
            </form>
          </div>

          {/* Side Card containing Stats & Progress Circle */}
          <div className="bg-white/70 dark:bg-slate-950/60 backdrop-blur-xl border border-slate-200 dark:border-white/5 p-8 rounded-[2.5rem] shadow-xs flex flex-col justify-between items-center text-center relative overflow-hidden">
            <div className="w-full">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Sandbox Performance</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-8">Calculated directly from your interactions inside the playground.</p>
              
              {/* Circular SVG Progress Ring */}
              <div className="relative w-32 h-32 mx-auto flex items-center justify-center mb-8">
                <svg className="w-full h-full transform -rotate-90">
                  {/* Track ring */}
                  <circle
                    cx="64"
                    cy="64"
                    r={radius}
                    className="stroke-slate-100 dark:stroke-white/5"
                    strokeWidth="7"
                    fill="transparent"
                  />
                  {/* Glowing progress ring gradient */}
                  <circle
                    cx="64"
                    cy="64"
                    r={radius}
                    stroke="url(#progressGradient)"
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-500 ease-out"
                  />
                  
                  {/* Gradient definition */}
                  <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#F0607A" />
                      <stop offset="100%" stopColor="#8B65C8" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Inner percentage text */}
                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">
                    {Math.round(progressPercent)}%
                  </span>
                  <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    Done
                  </span>
                </div>
              </div>

              {/* Progress Detail Stats */}
              <div className="grid grid-cols-2 gap-4 border-t border-slate-200 dark:border-white/5 pt-6 text-left">
                <div>
                  <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Total Tasks</p>
                  <p className="text-lg font-black text-slate-800 dark:text-white">{totalTasks}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Completed</p>
                  <p className="text-lg font-black text-[#8B65C8] dark:text-[#C4B8E8]">{completedTasks}</p>
                </div>
              </div>
            </div>

            {/* Motivational message footer */}
            <div className="mt-8 text-[11px] font-medium text-slate-400 dark:text-slate-500">
              {progressPercent === 100 && totalTasks > 0
                ? '🎉 Excellent work! Sandbox fully cleared!'
                : progressPercent >= 50
                ? '⚡ Getting closer! Keep checking them off!'
                : totalTasks > 0
                ? '📋 Ready to start checking tasks off?'
                : '✨ Enter tasks on the left to begin!'}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default InteractivePlayground;

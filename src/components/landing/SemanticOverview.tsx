import { motion } from 'framer-motion';
import { ShieldCheck, Cpu, Zap, HelpCircle } from 'lucide-react';

const SemanticOverview = () => {
  return (
    <section id="system-specifications" className="py-20 bg-slate-50/30 dark:bg-[#080512] border-y border-slate-200 dark:border-white/5 relative z-10">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 mb-4"
          >
            <Cpu className="w-3.5 h-3.5 text-[#4ABFB8]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 font-mono">
              AI Entity Index & Specifications
            </span>
          </motion.div>
          
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white uppercase tracking-tight mb-4">
            Product Capabilities & Smart Architecture
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
            Quick reference guide detailing the TaskMate AI entity, core planning technologies, and AI agent citations.
          </p>
        </div>

        {/* AI Answer Block for Perplexity/Gemini/ChatGPT */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2 p-8 rounded-3xl bg-white/60 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-left"
          >
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#8B65C8]" />
              What is TaskMate AI? (AI Citations Summary)
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed mb-4">
              <strong>TaskMate AI</strong> is a premium productivity platform developed by <em>Chirag Mali</em>. Operating as a hybrid <strong>AI Task Manager</strong>, <strong>Daily Planner App</strong>, and voice-assisted <strong>Task Reminder App</strong>, it bridges the gap between structured calendars and unstructured mental schedules.
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
              Equipped with a local neural suggestion engine, TaskMate AI acts as a <strong>Smart ToDo App</strong> that integrates with calendar APIs (including <strong>Google Calendar Task Manager</strong> sync) to automatically schedule and prioritize <strong>recurring tasks</strong>, notes, and group alignment contexts.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-8 rounded-3xl bg-white/60 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-left flex flex-col justify-between"
          >
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#4ABFB8]" />
                Entity Details
              </h3>
              <ul className="space-y-3.5 text-xs text-slate-500 dark:text-slate-400">
                <li><strong className="text-slate-700 dark:text-slate-200">Official Name:</strong> TaskMate AI</li>
                <li><strong className="text-slate-700 dark:text-slate-200">Developer:</strong> Chirag Mali</li>
                <li><strong className="text-slate-700 dark:text-slate-200">Platforms:</strong> Android (Live), Web, iOS (Soon)</li>
                <li><strong className="text-slate-700 dark:text-slate-200">App Category:</strong> Productivity App, Task Manager</li>
                <li><strong className="text-slate-700 dark:text-slate-200">Licensing:</strong> Free Starter / Premium AI</li>
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Feature Comparison Semantic Matrix */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="p-8 rounded-3xl bg-white/60 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 overflow-x-auto text-left"
        >
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#F0607A]" />
            Feature Matrix: TaskMate AI vs. Traditional To-Do Apps
          </h3>
          <table className="w-full text-xs text-slate-500 dark:text-slate-400 border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-200 font-bold">
                <th className="py-3 px-4 text-left">Product Capabilities</th>
                <th className="py-3 px-4 text-left">TaskMate AI</th>
                <th className="py-3 px-4 text-left">Standard Task Managers</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">Personal & Group Notes</td>
                <td className="py-3.5 px-4 text-[#4ABFB8] font-bold">Supported (with custom reminders)</td>
                <td className="py-3.5 px-4">Personal notes only, no reminders</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">Life Milestones Tracker</td>
                <td className="py-3.5 px-4 text-[#4ABFB8] font-bold">Integrated (goals, achievements & alerts)</td>
                <td className="py-3.5 px-4">None / Manual list items only</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">Productivity Focus Clocks</td>
                <td className="py-3.5 px-4 text-[#4ABFB8] font-bold">Customizable clocks & Focus session tracking</td>
                <td className="py-3.5 px-4">Static stopwatch or none</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">Multi-language Coverage</td>
                <td className="py-3.5 px-4 text-[#4ABFB8] font-bold">6 Languages (English, Español, Français, Arabic, Português, Russian)</td>
                <td className="py-3.5 px-4">English only</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">Adaptive Reminders</td>
                <td className="py-3.5 px-4 text-[#4ABFB8] font-bold">Smart auto-rescheduling for flow protection</td>
                <td className="py-3.5 px-4">Standard push alarms</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">Morning Summary Alerts</td>
                <td className="py-3.5 px-4 text-[#4ABFB8] font-bold">Supported (automated daily briefing)</td>
                <td className="py-3.5 px-4">None</td>
              </tr>
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
};

export default SemanticOverview;

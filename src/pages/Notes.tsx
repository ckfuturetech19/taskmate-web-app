import AppLayout from '@/components/app/AppLayout';
import NotesSidebar from '@/components/notes/NotesSidebar';
import { FileText, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Notes = () => {
  return (
    <AppLayout title="Notes">
      <div className="flex h-[calc(100vh-84px)] -mx-4 sm:-mx-6 lg:-mx-8 -my-4 overflow-hidden bg-[var(--bg-base)]">
        {/* Left Side: Notes Sidebar */}
        <NotesSidebar />

        {/* Right Side: Empty Placeholder State */}
        <div className="flex-1 hidden md:flex flex-col items-center justify-center p-8 bg-[var(--bg-base)] relative overflow-hidden">
          {/* Ambient decorative glowing backdrops */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-[var(--brand-pink)]/5 blur-[80px] pointer-events-none" />
          <div className="absolute top-[40%] left-[60%] w-[250px] h-[250px] rounded-full bg-[var(--brand-purple)]/5 blur-[60px] pointer-events-none" />
          
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="max-w-md text-center space-y-6 relative z-10 px-6 py-10 rounded-2xl border border-[var(--border-default)]/60 bg-[var(--bg-card)]/50 backdrop-blur-md shadow-xl"
            style={{
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.02)'
            }}
          >
            {/* Glowing Icon Wrapper */}
            <div className="relative mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--brand-orange)] to-[var(--brand-pink)] flex items-center justify-center text-white shadow-lg shadow-pink-500/10">
              <FileText className="h-7 w-7" />
              <div className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-[var(--brand-purple)] flex items-center justify-center border-2 border-[var(--bg-card)] text-white">
                <Sparkles className="h-2.5 w-2.5" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-[var(--text-primary)]">
                Select a note to start
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-[280px] mx-auto">
                Choose an existing notepad from the sidebar library on the left, or create a brand new note to begin crafting your content.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Notes;

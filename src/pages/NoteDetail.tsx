import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '@/components/app/AppLayout';
import { Note, NoteService } from '@/services/noteService';
import { socketService } from '@/services/socketService';
import { AIService } from '@/services/aiService';
import NoteEditor from '@/components/notes/NoteEditor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { exportToPDF } from '@/lib/pdfExport';
import {
  ChevronLeft,
  Save,
  Trash2,
  Users,
  Clock,
  CheckCircle2,
  Loader2,
  MoreVertical,
  Copy,
  Check,
  Bell,
  Calendar as CalendarIcon,
  X,
  FileDown,
  RefreshCcw,
  Layout,
  Maximize2,
  Minimize2,
  Sparkles,
  BrainCircuit,
  Wand2,
  Zap
} from 'lucide-react';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import React from 'react';

const NoteDetail = () => {
  const { noteId } = useParams<{ noteId: string }>();
  const navigate = useNavigate();

  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [showCustomization, setShowCustomization] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isEditorFocused, setIsEditorFocused] = useState(false);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [insights, setInsights] = useState<any[]>([]);

  const { user } = useAuth();
  const { theme } = useTheme();

  // Local edit states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [reminder, setReminder] = useState<Date | undefined>();
  const [reminderUtc, setReminderUtc] = useState<string | null>(null);

  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchNote = async () => {
    if (!noteId) return;
    try {
      setLoading(true);
      const response = await NoteService.getNotes();
      const foundNote = response.data.find(n => n.id === noteId);

      if (!foundNote) {
        toast({ title: 'Note not found', variant: 'destructive' });
        navigate('/notes');
        return;
      }

      setNote(foundNote);
      setTitle(foundNote.title);
      setContent(foundNote.content || '');
      setReminder(foundNote.reminder ? new Date(foundNote.reminder) : undefined);
      setReminderUtc(foundNote.reminderUtc || null);
    } catch (error) {
      console.error('Error fetching note:', error);
      toast({ title: 'Error', description: 'Failed to load note detail', variant: 'destructive' });
      navigate('/notes');
    } finally {
      setLoading(false);
    }
  };

  const fetchInsights = async () => {
    if (!noteId) return;
    const data = await AIService.getInsights(noteId);
    setInsights(data);
  };

  useEffect(() => {
    fetchNote();
    fetchInsights();
  }, [noteId]);

  const isDirtyRef = React.useRef(isDirty);
  useEffect(() => {
    isDirtyRef.current = isDirty;
  }, [isDirty]);

  // Handle Real-Time Sync
  useEffect(() => {
    if (!noteId) return;

    socketService.initialize();
    socketService.joinNoteRoom(noteId);

    const handleNoteUpdate = (updatedNote: Note) => {
      console.log('📡 Real-time note update received:', updatedNote);
      
      // Always update the base note object for metadata (members, etc)
      setNote(updatedNote);
      
      // Update title only if not focused to avoid stealing focus
      const titleElement = document.activeElement as HTMLElement;
      if (titleElement?.id !== 'note-title-input') {
        setTitle(updatedNote.title);
      }

      // Update content only if not focused OR if we aren't dirty
      // Priority: remote updates are accepted if we aren't actively typing in the editor
      if (!isDirtyRef.current || !isEditorFocused) {
        setContent(updatedNote.content || '');
        setReminder(updatedNote.reminder ? new Date(updatedNote.reminder) : undefined);
        setReminderUtc(updatedNote.reminderUtc || null);
        
        // If we were dirty but not focused, we just took the remote update, so we're no longer dirty
        if (!isEditorFocused) {
          setIsDirty(false);
        }
      }
    };

    const handleNoteDelete = () => {
      toast({ title: 'Note Deleted', description: 'This note was deleted by the owner.' });
      navigate('/notes');
    };

    const handleInsightAdded = (newInsight: any) => {
      setInsights(prev => {
        // Prevent duplicates
        if (prev.find(i => i.id === newInsight.id)) return prev;
        return [newInsight, ...prev];
      });
      toast({ title: 'AI Insight Added', description: `Generated by ${newInsight.user?.name || 'someone'}` });
    };

    const handleInsightDeleted = (data: { id: string }) => {
      setInsights(prev => prev.filter(i => i.id !== data.id));
    };

    socketService.on('note_updated', handleNoteUpdate);
    socketService.on('note_deleted', handleNoteDelete);
    socketService.on('insight_added', handleInsightAdded);
    socketService.on('insight_deleted', handleInsightDeleted);

    return () => {
      socketService.off('note_updated', handleNoteUpdate);
      socketService.off('note_deleted', handleNoteDelete);
      socketService.off('insight_added', handleInsightAdded);
      socketService.off('insight_deleted', handleInsightDeleted);
    };
  }, [noteId, navigate]);

  const handleSave = async () => {
    if (!noteId || !note) return;

    try {
      setSaving(true);
      // Convert local reminder to UTC if set
      let utcReminder: string | null = null;
      if (reminder) {
        utcReminder = reminder.toISOString();
      }

      const response = await NoteService.updateNote(noteId, {
        title,
        content,
        reminder: reminder ? reminder.toISOString() : null,
        reminderUtc: utcReminder
      });
      setNote(response.data);
      setReminderUtc(response.data.reminderUtc || null);
      setIsDirty(false);
    } catch (error) {
      console.error('Error saving note:', error);
      toast({ title: 'Error', description: 'Failed to save changes', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  // Auto-save logic
  useEffect(() => {
    if (isDirty) {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => {
        handleSave();
      }, 1000); // Faster auto-save for better real-time feel
    }
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [title, content, reminder, reminderUtc, isDirty]);

  const handleDelete = async () => {
    if (!noteId) return;
    if (!window.confirm('Are you sure you want to delete this note?')) return;

    try {
      await NoteService.deleteNote(noteId);
      toast({ title: 'Note deleted successfully' });
      navigate('/notes');
    } catch (error) {
      console.error('Error deleting note:', error);
      toast({ title: 'Error', description: 'Failed to delete note', variant: 'destructive' });
    }
  };

  const handleCopyInviteCode = () => {
    if (!note?.inviteCode) return;
    navigator.clipboard.writeText(note.inviteCode);
    setCopied(true);
    toast({ title: 'Code copied to clipboard!' });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportPDF = async () => {
    try {
      setExporting(true);
      await exportToPDF(title, content);
      toast({ title: 'PDF exported successfully!' });
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast({ title: 'Error', description: 'Failed to export PDF', variant: 'destructive' });
    } finally {
      setExporting(false);
    }
  };

  const handleAiAction = async (action: 'summarize' | 'extract') => {
    if (!content || content.trim().length < 10) {
      toast({ title: 'Content too short', description: 'Add more text before using AI tools.', variant: 'destructive' });
      return;
    }

    try {
      setIsAiProcessing(true);
      let result = '';
      
      if (action === 'summarize') {
        toast({ title: 'AI is thinking...', description: 'Summarizing your note...' });
        result = await AIService.summarizeNote(content);
      } else {
        toast({ title: 'AI is thinking...', description: 'Extracting action items...' });
        result = await AIService.extractActionItems(content);
      }

      if (result) {
        // Save to database instead of just appending to content
        await AIService.saveInsight(noteId!, result, action);
        await fetchInsights();
        
        toast({ title: 'AI magic complete!', description: `${action === 'summarize' ? 'Summary' : 'Tasks'} generated and saved.` });
      }
    } catch (error) {
      console.error('AI Action Error:', error);
      toast({ title: 'AI Error', description: 'Failed to process AI request', variant: 'destructive' });
    } finally {
      setIsAiProcessing(false);
    }
  };

  const handleDeleteInsight = async (id: string) => {
    const success = await AIService.deleteInsight(id);
    if (success) {
      setInsights(insights.filter(i => i.id !== id));
      toast({ title: 'Insight deleted' });
    }
  };

  if (loading) {
    return (
      <AppLayout title="Loading Note...">
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Fetching note details...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title={title || 'Note Detail'} isZenMode={isFullscreen}>
      {/* Background Particles - Only show when not in fullscreen or as part of fullscreen background */}
      <div className={cn(
        "absolute inset-0 pointer-events-none overflow-hidden z-0",
        isFullscreen ? "fixed z-[99]" : ""
      )}>
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-primary/10 rounded-full blur-[1px]"
            animate={{
              y: ["0%", "100%", "0%"],
              x: ["0%", "50%", "0%"],
              opacity: [0.05, 0.15, 0.05],
            }}
            transition={{
              duration: 30 + Math.random() * 40,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * -50
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "max-w-6xl mx-auto space-y-6 relative z-10 transition-all duration-500",
          isFullscreen ? "max-w-none w-full h-screen bg-background m-0 p-0 overflow-hidden rounded-none border-none" : "px-2 sm:px-4 pb-20"
        )}
      >
        {/* Compact Consolidated Header - Hide in Fullscreen */}
        {!isFullscreen && (
          <div className="bg-card/50 backdrop-blur-md sticky top-0 z-30 p-3 sm:p-4 rounded-2xl border border-border/20 shadow-lg flex flex-col gap-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/notes')}
                className="h-9 w-9 shrink-0 hover:bg-primary/10"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              <Input
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setIsDirty(true);
                }}
                placeholder="Note Title"
                className="text-lg sm:text-2xl font-black border-none bg-transparent p-0 focus-visible:ring-0 h-auto placeholder:text-muted-foreground/30 truncate"
              />
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Status Indicator (Icon only on mobile) */}
              <div className="flex items-center">
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                ) : !isDirty && note ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : null}
              </div>

              <div className="flex items-center gap-1 sm:gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleSave}
                  disabled={!isDirty || saving}
                  className="h-9 px-2 sm:px-3 gap-2 hover:bg-green-500/10 text-green-600 dark:text-green-400"
                >
                  <Save className="h-4 w-4" />
                  <span className="hidden md:inline font-bold">Save</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={fetchNote}
                  className="h-9 px-2 sm:px-3 gap-2 hover:bg-primary/10 text-primary"
                >
                  <RefreshCcw className={cn("h-4 w-4", loading && "animate-spin")} />
                  <span className="hidden md:inline font-bold">Sync</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleExportPDF}
                  disabled={exporting}
                  className="h-9 px-2 sm:px-3 gap-2 hover:bg-blue-500/10 text-blue-600 dark:text-blue-400"
                >
                  <FileDown className="h-4 w-4" />
                  <span className="hidden md:inline font-bold">PDF</span>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={isAiProcessing}
                      className="h-9 px-2 sm:px-3 gap-2 hover:bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold"
                    >
                      {isAiProcessing ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Sparkles className="h-4 w-4" />
                      )}
                      <span className="hidden md:inline">AI Tools</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 border-purple-500/20 shadow-purple-500/10">
                    <DropdownMenuItem 
                      onClick={() => handleAiAction('summarize')}
                      className="gap-3 rounded-xl py-3 cursor-pointer group"
                    >
                      <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                        <BrainCircuit className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-sm">Summarize Note</span>
                        <span className="text-[10px] text-muted-foreground italic">Get a quick overview</span>
                      </div>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem 
                      onClick={() => handleAiAction('extract')}
                      className="gap-3 rounded-xl py-3 cursor-pointer group"
                    >
                      <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                        <Zap className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-sm">Extract Tasks</span>
                        <span className="text-[10px] text-muted-foreground italic">Find actionable items</span>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>


                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 rounded-2xl p-2">
                    {note?.isGroup && (
                      <>
                        <DropdownMenuItem onClick={handleCopyInviteCode} className="gap-2 rounded-xl">
                          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          Copy Invite Code
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem className="text-destructive gap-2 rounded-xl" onClick={handleDelete}>
                      <Trash2 className="h-4 w-4" />
                      Delete Note
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>


          {/* Minimal Info Bar */}
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-border/10">
            {/* Joined Members */}
            {note?.members && note.members.length > 0 && (
              <div className="flex items-center -space-x-2 mr-1">
                {note.members.slice(0, 4).map((member) => (
                  <div
                    key={member.id}
                    className="h-6 w-6 rounded-full border-2 border-background bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-[8px] font-black shadow-sm ring-1 ring-primary/5"
                    title={member.user.displayName}
                  >
                    {member.user.displayName[0]}
                  </div>
                ))}
                {note.members.length > 4 && (
                  <div className="h-6 w-6 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[8px] font-bold shadow-sm">
                    +{note.members.length - 4}
                  </div>
                )}
              </div>
            )}

            {note?.isGroup && (
              <div className="flex items-center gap-1.5 bg-blue-500/5 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-full text-[10px] font-bold border border-blue-500/10">
                <Users className="h-3 w-3" />
                <span className="font-mono">{note.inviteCode}</span>
                <button onClick={handleCopyInviteCode} className="hover:scale-110 active:scale-95 transition-transform">
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </button>
              </div>
            )}

            <Popover>
              <PopoverTrigger asChild>
                <button className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all",
                  reminder
                    ? "bg-orange-500/10 border-orange-500/20 text-orange-600 dark:text-orange-400"
                    : "bg-muted/30 border-border/10 text-muted-foreground hover:bg-muted/50"
                )}>
                  <Bell className={cn("h-3 w-3", reminder && "animate-bounce")} />
                  {reminder ? format(reminder, 'MMM d, h:mm a') : 'Add Reminder'}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-2xl shadow-2xl border-border/20" align="start">
                <Calendar
                  mode="single"
                  selected={reminder}
                  onSelect={(date) => {
                    if (date) {
                      const newDate = new Date(date);
                      newDate.setHours(reminder?.getHours() || 9);
                      newDate.setMinutes(reminder?.getMinutes() || 0);
                      setReminder(newDate);
                      setReminderUtc(newDate.toISOString());
                      setIsDirty(true);
                    }
                  }}
                  initialFocus
                />
                <div className="p-3 border-t bg-muted/20 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                      type="time"
                      className="h-8 w-24 text-xs"
                      value={reminder ? format(reminder, 'HH:mm') : '09:00'}
                      onChange={(e) => {
                        const [hours, minutes] = e.target.value.split(':');
                        const newDate = new Date(reminder || new Date());
                        newDate.setHours(parseInt(hours));
                        newDate.setMinutes(parseInt(minutes));
                        setReminder(newDate);
                        setReminderUtc(newDate.toISOString());
                        setIsDirty(true);
                      }}
                    />
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => {
                    setReminder(undefined);
                    setReminderUtc(null);
                    setIsDirty(true);
                  }} className="text-xs text-red-500">Clear</Button>
                </div>
              </PopoverContent>
            </Popover>

            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/60 ml-auto">
              <Clock className="h-3 w-3" />
              <span>{format(new Date(note?.updatedAt || Date.now()), 'h:mm a')}</span>
            </div>
          </div>
        </div>

        )                                                     
        }{/* Rich Text Editor Area with 3D Effect */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className={cn(
            "min-h-[600px] rounded-2xl border transition-all duration-500 overflow-hidden flex flex-col",
            theme === 'dark'
              ? "bg-gradient-to-br from-card to-card/50 border-border/40 shadow-2xl"
              : "bg-white border-black/5 shadow-xl"
          )}
          style={{
            boxShadow: theme === 'dark' ? '0 20px 60px rgba(0, 0, 0, 0.3)' : '0 10px 40px rgba(0, 0, 0, 0.05)'
          }}
        >
          <NoteEditor
            content={content}
            currentUserName={user?.name}
            isFullscreen={isFullscreen}
            onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
            onFocusChange={setIsEditorFocused}
            onChange={(newContent) => {
              if (newContent !== content) {
                setContent(newContent);
                setIsDirty(true);
              }
            }}
          />
        </motion.div>

        {/* AI Insights Section */}
        {insights.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-border/10">
            <div className="flex items-center gap-2 px-2">
              <Sparkles className="h-4 w-4 text-purple-500" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground/80">AI Command Center</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              {insights.map((insight) => (
                <div key={insight.id} className="ai-response-container group relative">
                  <div className="ai-shimmer"></div>
                  
                  <div className="flex items-center justify-between mb-4 relative z-10">
                    <div className="ai-response-header mb-0">
                      <span className="sparkle-icon">✨</span>
                      <span>AI {insight.type === 'summarize' ? 'Summary' : 'Action Items'}</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 text-[10px] bg-background/40 px-2 py-1 rounded-full border border-border/10">
                        <span className="text-muted-foreground">Gen by</span>
                        <span className="font-bold text-primary">{insight.user?.name || 'User'}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteInsight(insight.id)}
                        className="h-7 w-7 rounded-full text-destructive opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  <div className="ai-response-content relative z-10 text-sm prose-sm dark:prose-invert">
                    {insight.content.split('\n').map((line: string, i: number) => {
                      const trimmed = line.trim();
                      if (!trimmed) return <div key={i} className="h-2" />;
                      
                      if (trimmed.startsWith('### ')) {
                        return <h4 key={i} className="text-primary font-bold mt-3 mb-1">{trimmed.replace('### ', '')}</h4>;
                      }
                      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
                        return <li key={i} className="ml-4 my-1">{trimmed.substring(2)}</li>;
                      }
                      
                      // Better bold detection
                      const parts = trimmed.split(/(\*\*.*?\*\*)/g);
                      return (
                        <p key={i} className="my-1 leading-relaxed">
                          {parts.map((part, pi) => {
                            if (part.startsWith('**') && part.endsWith('**')) {
                              return <strong key={pi}>{part.slice(2, -2)}</strong>;
                            }
                            return part;
                          })}
                        </p>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </AppLayout>
  );
};

export default NoteDetail;

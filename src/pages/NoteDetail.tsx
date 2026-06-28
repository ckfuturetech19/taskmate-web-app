import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '@/components/app/AppLayout';
import NotesSidebar from '@/components/notes/NotesSidebar';
import { Note, NoteService } from '@/services/noteService';
import { socketService } from '@/services/socketService';
import { AIService } from '@/services/aiService';
import NoteEditor from '@/components/notes/NoteEditor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { exportToPDF } from '@/lib/pdfExport';
import {
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
  X,
  FileDown,
  RefreshCcw,
  Sparkles,
  BrainCircuit,
  Zap,
  PanelRightClose,
  PanelRightOpen
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
import { motion, AnimatePresence } from 'framer-motion';
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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isEditorFocused, setIsEditorFocused] = useState(false);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [insights, setInsights] = useState<any[]>([]);
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);

  const { user } = useAuth();

  // Local edit states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [reminder, setReminder] = useState<Date | undefined>();
  const [reminderUtc, setReminderUtc] = useState<string | null>(null);

  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchNote = async (silent = false) => {
    if (!noteId) return;
    try {
      if (!silent) setLoading(true);
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
      if (!silent) setLoading(false);
    }
  };

  const fetchInsights = async () => {
    if (!noteId) return;
    try {
      const data = await AIService.getInsights(noteId);
      const insightsList = Array.isArray(data)
        ? data
        : (data && typeof data === 'object' && 'insights' in data && Array.isArray((data as any).insights))
          ? (data as any).insights
          : [];
      setInsights(insightsList);
      // Auto open panel if there are insights on initial load
      if (insightsList.length > 0) {
        setIsAiPanelOpen(true);
      }
    } catch (error) {
      console.error('Error fetching insights:', error);
      setInsights([]);
    }
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
      if (!isDirtyRef.current || !isEditorFocused) {
        setContent(updatedNote.content || '');
        setReminder(updatedNote.reminder ? new Date(updatedNote.reminder) : undefined);
        setReminderUtc(updatedNote.reminderUtc || null);
        
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
        if (prev.find(i => i.id === newInsight.id)) return prev;
        return [newInsight, ...prev];
      });
      toast({ title: 'AI Insight Added', description: `Generated by ${newInsight.user?.name || 'someone'}` });
      setIsAiPanelOpen(true); // Open AI panel to show new insight
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
      }, 1200); // Debounce to allow continuous typing
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
    if (!content || content.replace(/<[^>]*>/g, '').trim().length < 10) {
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
        await AIService.saveInsight(noteId!, result, action);
        await fetchInsights();
        toast({ title: 'AI execution complete!', description: `${action === 'summarize' ? 'Summary' : 'Tasks'} generated.` });
      }
    } catch (error) {
      console.error('AI Action Error:', error);
      toast({ title: 'AI Error', description: 'Failed to process AI request', variant: 'destructive' });
    } finally {
      setIsAiProcessing(false);
    }
  };

  const handleDeleteInsight = async (id: string) => {
    try {
      const success = await AIService.deleteInsight(id);
      if (success) {
        setInsights(insights.filter(i => i.id !== id));
        toast({ title: 'Insight deleted' });
      }
    } catch (error) {
      console.error('Error deleting insight:', error);
    }
  };

  if (loading) {
    return (
      <AppLayout title="Loading Note...">
        <div className="flex h-[calc(100vh-84px)] -mx-4 sm:-mx-6 lg:-mx-8 -my-4 overflow-hidden bg-[var(--bg-base)]">
          <NotesSidebar activeNoteId={noteId} />
          <div className="flex-grow flex flex-col items-center justify-center gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-[var(--brand-pink)]" />
            <p className="text-sm text-[var(--text-muted)]">Fetching note details...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title={title || 'Note Detail'} isZenMode={isFullscreen}>
      <div className="flex h-[calc(100vh-84px)] -mx-4 sm:-mx-6 lg:-mx-8 -my-4 overflow-hidden bg-[var(--bg-base)] relative">
        
        {/* Left: Notes Sidebar (hidden in Zen / Fullscreen mode) */}
        {!isFullscreen && (
          <NotesSidebar activeNoteId={noteId} />
        )}

        {/* Center: Main Editor & Workspace */}
        <div className="flex-1 h-full overflow-hidden flex flex-col relative bg-[var(--bg-base)]">
          
          {/* Header Panel */}
          {!isFullscreen && (
            <div className="p-4 border-b border-[var(--border-default)] bg-[var(--bg-card)] flex flex-col gap-3 shrink-0">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Input
                    id="note-title-input"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      setIsDirty(true);
                    }}
                    placeholder="Note Title"
                    className="text-[18px] sm:text-[22px] font-bold border-none bg-transparent p-0 focus-visible:ring-0 h-auto placeholder:text-muted-foreground/30 truncate text-[var(--text-primary)]"
                  />
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2">
                  {/* Status Indicator */}
                  <div className="flex items-center mr-1">
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin text-[var(--text-muted)]" />
                    ) : !isDirty && note ? (
                      <CheckCircle2 className="h-4 w-4 text-[#00C9A7]" />
                    ) : null}
                  </div>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleSave}
                    disabled={!isDirty || saving}
                    className="h-8 px-2.5 gap-1 hover:bg-[#00C9A7]/10 text-[#00C9A7] font-semibold rounded-lg text-[12px]"
                  >
                    <Save className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Save</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => fetchNote(true)}
                    className="h-8 px-2.5 gap-1 hover:bg-[var(--bg-card-hover)] text-[var(--text-secondary)] font-semibold rounded-lg text-[12px]"
                  >
                    <RefreshCcw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
                    <span className="hidden sm:inline">Sync</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleExportPDF}
                    disabled={exporting}
                    className="h-8 px-2.5 gap-1 hover:bg-[var(--bg-card-hover)] text-[var(--text-secondary)] font-semibold rounded-lg text-[12px]"
                  >
                    <FileDown className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">PDF</span>
                  </Button>

                  {/* AI Panel Drawer Toggle */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsAiPanelOpen(!isAiPanelOpen)}
                    className={cn(
                      "h-8 px-2.5 gap-1 font-semibold rounded-lg text-[12px] transition-colors",
                      isAiPanelOpen
                        ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20"
                        : "hover:bg-[var(--bg-card-hover)] text-[var(--text-secondary)]"
                    )}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>AI Console</span>
                    {insights.length > 0 && (
                      <span className="ml-1 px-1.5 py-0.2 text-[9px] font-bold bg-purple-500 text-white rounded-full">
                        {insights.length}
                      </span>
                    )}
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-[var(--bg-card-hover)] text-[var(--text-secondary)]">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 rounded-[12px] p-1 border-[var(--border-default)] bg-[var(--bg-card)] shadow-md">
                      <DropdownMenuItem 
                        onClick={() => handleAiAction('summarize')}
                        disabled={isAiProcessing}
                        className="gap-2 rounded-lg text-[12px] font-semibold hover:bg-[var(--bg-card-hover)] text-[var(--text-primary)]"
                      >
                        <BrainCircuit className="h-4 w-4 text-[var(--brand-purple)]" />
                        Summarize
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleAiAction('extract')}
                        disabled={isAiProcessing}
                        className="gap-2 rounded-lg text-[12px] font-semibold hover:bg-[var(--bg-card-hover)] text-[var(--text-primary)]"
                      >
                        <Zap className="h-4 w-4 text-[var(--accent-teal)]" />
                        Extract Action Items
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-[var(--border-default)]" />
                      {note?.isGroup && (
                        <>
                          <DropdownMenuItem onClick={handleCopyInviteCode} className="gap-2 rounded-lg text-[12px] font-semibold hover:bg-[var(--bg-card-hover)] text-[var(--text-primary)]">
                            {copied ? <Check className="h-4 w-4 text-[var(--status-success)]" /> : <Copy className="h-4 w-4" />}
                            Copy Invite Code
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-[var(--border-default)]" />
                        </>
                      )}
                      <DropdownMenuItem className="text-[var(--status-danger)] gap-2 rounded-lg text-[12px] font-semibold hover:bg-red-500/10 focus:bg-red-500/10" onClick={handleDelete}>
                        <Trash2 className="h-4 w-4" />
                        Delete Note
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Minimal Info Bar */}
              <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[var(--border-default)]">
                {/* Joined Members */}
                {note?.members && note.members.length > 0 && (
                  <div className="flex items-center -space-x-1.5 mr-1">
                    {note.members.slice(0, 4).map((member) => (
                      <div
                        key={member.id}
                        className="h-6 w-6 rounded-full border border-[var(--bg-card)] bg-[var(--brand-gradient)] flex items-center justify-center text-[9px] font-bold text-white shadow-sm"
                        title={member.user.displayName}
                      >
                        {member.user.displayName[0].toUpperCase()}
                      </div>
                    ))}
                    {note.members.length > 4 && (
                      <div className="h-6 w-6 rounded-full border border-[var(--bg-card)] bg-[var(--bg-base)] text-[var(--text-secondary)] flex items-center justify-center text-[9px] font-semibold shadow-sm">
                        +{note.members.length - 4}
                      </div>
                    )}
                  </div>
                )}

                {note?.isGroup && (
                  <div className="flex items-center gap-1 bg-[var(--bg-base)] text-[var(--text-secondary)] px-2.5 py-0.5 rounded-full text-[11px] font-semibold border border-[var(--border-default)]">
                    <Users className="h-3 w-3" />
                    <span>Invite: <span className="font-mono text-[var(--text-primary)] font-bold">{note.inviteCode}</span></span>
                    <button onClick={handleCopyInviteCode} className="hover:scale-110 active:scale-95 transition-transform ml-1">
                      {copied ? <Check className="h-3 w-3 text-[var(--status-success)]" /> : <Copy className="h-3 w-3" />}
                    </button>
                  </div>
                )}

                <Popover>
                  <PopoverTrigger asChild>
                    <button className={cn(
                      "flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border transition-all",
                      reminder
                        ? "bg-orange-500/10 border-orange-500/20 text-orange-600 dark:text-orange-400"
                        : "bg-[var(--bg-base)] border-[var(--border-default)] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]"
                    )}>
                      <Bell className={cn("h-3 w-3", reminder && "animate-bounce")} />
                      {reminder ? format(reminder, 'MMM d, h:mm a') : 'Add Reminder'}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 rounded-[16px] shadow-2xl border-[var(--border-default)]" align="start">
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

                <div className="flex items-center gap-1 text-[10px] text-muted-foreground/60 ml-auto">
                  <Clock className="h-3 w-3" />
                  <span>Last Saved: {format(new Date(note?.updatedAt || Date.now()), 'h:mm a')}</span>
                </div>
              </div>
            </div>
          )}

          {/* Note Editor Area */}
          <div className="flex-1 min-h-0 p-4 md:p-6 bg-[var(--bg-base)]">
            <div className="h-full rounded-2xl overflow-hidden flex flex-col border border-[var(--border-default)] shadow-md">
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
            </div>
          </div>
        </div>

        {/* Right Panel: AI Insights Drawer */}
        <AnimatePresence>
          {!isFullscreen && isAiPanelOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 360, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="h-full border-l border-[var(--border-default)] bg-[var(--bg-card)] flex flex-col shrink-0 overflow-hidden relative z-10"
            >
              {/* Header */}
              <div className="p-4 border-b border-[var(--border-default)] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-500" />
                  <h3 className="font-bold text-[14px] text-[var(--text-primary)]">AI Command Center</h3>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsAiPanelOpen(false)}
                  className="h-8 w-8 rounded-full text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)]"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Action Buttons inside Drawer */}
              <div className="p-4 bg-[var(--bg-base)]/50 border-b border-[var(--border-default)] grid grid-cols-2 gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAiAction('summarize')}
                  disabled={isAiProcessing}
                  className="h-9 gap-1 text-[11px] font-semibold border-[var(--border-default)] hover:bg-[var(--bg-card-hover)]"
                >
                  {isAiProcessing ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <BrainCircuit className="h-3 w-3 text-purple-500" />}
                  Summarize
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAiAction('extract')}
                  disabled={isAiProcessing}
                  className="h-9 gap-1 text-[11px] font-semibold border-[var(--border-default)] hover:bg-[var(--bg-card-hover)]"
                >
                  {isAiProcessing ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Zap className="h-3 w-3 text-teal-500" />}
                  Extract Tasks
                </Button>
              </div>

              {/* Insights List */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
                {insights.length === 0 ? (
                  <div className="text-center py-20 px-4 border border-dashed border-[var(--border-default)] rounded-xl bg-[var(--bg-base)]">
                    <Sparkles className="h-8 w-8 mx-auto text-purple-400 mb-2 opacity-50 animate-pulse" />
                    <p className="text-xs font-semibold text-[var(--text-secondary)]">No insights generated yet</p>
                    <p className="text-[10px] text-[var(--text-muted)] mt-1 max-w-[200px] mx-auto">
                      Use the quick action buttons above to summarize notes or extract task items.
                    </p>
                  </div>
                ) : (
                  insights.map((insight) => (
                    <div key={insight.id} className="p-4 rounded-xl border border-[var(--border-default)] bg-[var(--bg-base)] relative group">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1">
                          ✨ AI {insight.type === 'summarize' ? 'Summary' : 'Action Items'}
                        </span>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] text-[var(--text-muted)] bg-[var(--bg-card)] px-1.5 py-0.5 rounded">
                            {insight.user?.name || 'AI'}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteInsight(insight.id)}
                            className="h-6 w-6 rounded-full text-destructive opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="text-[12px] text-[var(--text-primary)] leading-relaxed space-y-1.5 font-normal select-text">
                        {insight.content.split('\n').map((line: string, i: number) => {
                          const trimmed = line.trim();
                          if (!trimmed) return <div key={i} className="h-1.5" />;
                          
                          if (trimmed.startsWith('### ')) {
                            return <h4 key={i} className="text-purple-600 dark:text-purple-400 font-bold mt-2 mb-1">{trimmed.replace('### ', '')}</h4>;
                          }
                          if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
                            return <li key={i} className="ml-3 my-0.5 list-disc">{trimmed.substring(2)}</li>;
                          }
                          
                          const parts = trimmed.split(/(\*\*.*?\*\*)/g);
                          return (
                            <p key={i} className="my-0.5">
                              {parts.map((part, pi) => {
                                if (part.startsWith('**') && part.endsWith('**')) {
                                  return <strong key={pi} className="font-bold text-slate-800 dark:text-slate-100">{part.slice(2, -2)}</strong>;
                                }
                                return part;
                              })}
                            </p>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </AppLayout>
  );
};

export default NoteDetail;

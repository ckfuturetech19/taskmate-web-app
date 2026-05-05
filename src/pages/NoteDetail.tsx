import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '@/components/app/AppLayout';
import { Note, NoteService } from '@/services/noteService';
import { socketService } from '@/services/socketService';
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
  FileDown
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

  useEffect(() => {
    fetchNote();
  }, [noteId]);

  // Handle Real-Time Sync
  useEffect(() => {
    if (!noteId) return;
    
    const socket = socketService.initialize();
    socket.emit('join_note_room', noteId);
    
    socket.on('note_updated', (updatedNote: Note) => {
      setNote(updatedNote);
      if (!isDirty) {
        setTitle(updatedNote.title);
        setContent(updatedNote.content || '');
        setReminder(updatedNote.reminder ? new Date(updatedNote.reminder) : undefined);
        setReminderUtc(updatedNote.reminderUtc || null);
      }
    });

    socket.on('note_deleted', () => {
      toast({ title: 'Note Deleted', description: 'This note was deleted by the owner.' });
      navigate('/notes');
    });

    return () => {
      socket.off('note_updated');
      socket.off('note_deleted');
    };
  }, [noteId, isDirty, navigate]);

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
      // Removed the toast here to make it feel smoother with auto-save
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
      }, 2000); 
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
    <AppLayout title={title || 'Note Detail'}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto space-y-6 px-2 sm:px-4 pb-20"
      >
        {/* Enhanced Header with Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-primary/5 to-purple-500/5 p-4 sm:p-6 rounded-2xl border border-border/30 shadow-sm">
          <motion.div
            whileHover={{ x: -4 }}
            className="flex items-center gap-2"
          >
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/notes')}
              className="gap-2 hover:bg-primary/10"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
          </motion.div>
          
          <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap justify-end">
            {/* Status Indicator */}
            <div className="hidden xs:flex items-center gap-2">
              {saving ? (
                <motion.span className="flex items-center gap-2 text-[10px] sm:text-xs text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Saving...
                </motion.span>
              ) : !isDirty && note ? (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-1.5 text-[10px] sm:text-xs text-green-600 dark:text-green-400"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Saved
                </motion.span>
              ) : null}
            </div>

            {/* Save Button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                size="sm" 
                onClick={handleSave} 
                disabled={!isDirty || saving}
                className="gap-2 px-4 shadow-sm bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
              >
                <Save className="h-4 w-4" />
                <span className="hidden sm:inline">Save</span>
              </Button>
            </motion.div>

            {/* Export PDF Button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="sm"
                onClick={handleExportPDF}
                disabled={exporting}
                className="gap-2 px-3 shadow-sm bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
              >
                {exporting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <FileDown className="h-4 w-4" />
                )}\n                <span className="hidden sm:inline text-xs">PDF</span>
              </Button>
            </motion.div>

            {/* More Options */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.div whileHover={{ rotate: 90 }} whileTap={{ scale: 0.9 }}>
                  <Button variant="outline" size="icon" className="h-9 w-9">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </motion.div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {note?.isGroup && (
                  <>
                    <DropdownMenuItem onClick={handleCopyInviteCode} className="gap-2">
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      Copy Invite Code
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                
                <DropdownMenuItem className="text-destructive gap-2" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4" />
                  Delete Note
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Note Metadata & Controls */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          {/* Title Input with 3D Effect */}
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="transform-gpu"
          >
            <Input 
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setIsDirty(true);
              }}
              placeholder="📝 Note Title"
              className="text-2xl sm:text-4xl font-extrabold border-none bg-gradient-to-r from-primary/5 to-purple-500/5 p-4 focus-visible:ring-2 focus-visible:ring-primary/50 shadow-sm rounded-xl h-auto placeholder:text-muted-foreground/30 transition-all"
            />
          </motion.div>
          
          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3 bg-card/50 p-4 rounded-xl border border-border/20">
            {/* Invite Code Badge */}
            {note?.isGroup && (
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-3 py-2 rounded-full text-xs font-semibold border border-blue-100 dark:border-blue-800 transition-all"
              >
                <Users className="h-3.5 w-3.5" />
                <span>Invite: <span className="font-mono">{note.inviteCode?.slice(0, 6)}</span></span>
                <motion.button 
                  whileHover={{ rotate: 20 }}
                  onClick={handleCopyInviteCode} 
                  className="ml-1 hover:scale-110 active:scale-95 transition-transform"
                >
                  {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                </motion.button>
              </motion.div>
            )}

            {/* Reminder Picker */}
            <Popover>
              <PopoverTrigger asChild>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={cn(
                      "gap-2 rounded-full px-3 text-xs shadow-sm transition-all",
                      reminder ? "bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-400" : ""
                    )}
                  >
                    <Bell className={cn("h-3.5 w-3.5", reminder && "animate-bounce")} />
                    {reminder ? format(reminder, 'MMM d, h:mm a') : 'Reminder'}
                    {reminder && reminderUtc && (
                      <span className="text-[10px] text-muted-foreground ml-1">({format(new Date(reminderUtc), 'HH:mm')} UTC)</span>
                    )}
                    {reminder && (
                      <X 
                        className="h-3 w-3 ml-1 hover:text-red-500" 
                        onClick={(e) => {
                          e.stopPropagation();
                          setReminder(undefined);
                          setReminderUtc(null);
                          setIsDirty(true);
                        }} 
                      />
                    )}
                  </Button>
                </motion.div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
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

            {/* Last Edited */}
            <motion.div className="flex items-center gap-1.5 text-xs text-muted-foreground ml-auto">
              <Clock className="h-3.5 w-3.5" />
              <span>Updated {format(new Date(note?.updatedAt || Date.now()), 'h:mm a')}</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Rich Text Editor Area with 3D Effect */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="min-h-[600px] bg-gradient-to-br from-card to-card/50 rounded-2xl border border-border/40 shadow-2xl overflow-hidden transition-all duration-300 focus-within:border-primary/60 focus-within:shadow-2xl flex flex-col"
          style={{
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}
        >
          <NoteEditor 
            content={content} 
            onChange={(newContent) => {
              if (newContent !== content) {
                setContent(newContent);
                setIsDirty(true);
              }
            }} 
          />
        </motion.div>
      </motion.div>
    </AppLayout>
  );
};

export default NoteDetail;

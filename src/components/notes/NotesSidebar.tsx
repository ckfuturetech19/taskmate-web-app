import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Note, NoteService } from '@/services/noteService';
import { 
  Plus, 
  Search, 
  FileText, 
  KeyRound, 
  Loader2, 
  Users, 
  X,
  ChevronRight
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { usePremium } from '@/contexts/PremiumContext';
import { UpgradePromptDialog } from '@/components/premium/UpgradePromptDialog';
import JoinNoteDialog from './JoinNoteDialog';
import { extractAndTruncateHtml } from '@/lib/htmlUtils';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface NotesSidebarProps {
  activeNoteId?: string;
  onNotesLoaded?: (notes: Note[]) => void;
}

const NotesSidebar = ({ activeNoteId, onNotesLoaded }: NotesSidebarProps) => {
  const navigate = useNavigate();
  const { isPremium } = usePremium();
  
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [noteTab, setNoteTab] = useState<'personal' | 'group'>('personal');
  
  // Dialog states
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  
  // Create Note Form State
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [isGroupNote, setIsGroupNote] = useState(false);
  const [creating, setCreating] = useState(false);

  const fetchNotes = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const response = await NoteService.getNotes();
      setNotes(response.data);
      if (onNotesLoaded) {
        onNotesLoaded(response.data);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast({
        title: 'Error',
        description: 'Failed to load notes list.',
        variant: 'destructive',
      });
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleOpenCreateNote = () => {
    if (!isPremium && notes.length >= 2) {
      setIsUpgradeOpen(true);
    } else {
      setIsCreateDialogOpen(true);
    }
  };

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim()) return;

    try {
      setCreating(true);
      const response = await NoteService.createNote({
        title: newNoteTitle,
        isGroup: isGroupNote
      });
      const newNote = response.data;
      setNotes(prev => [newNote, ...prev]);
      setIsCreateDialogOpen(false);
      setNewNoteTitle('');
      setIsGroupNote(false);
      
      toast({
        title: 'Note Created',
        description: `"${newNote.title}" is ready.`,
      });
      
      // Navigate to the newly created note
      navigate(`/notes/${newNote.id}`);
    } catch (error) {
      console.error('Error creating note:', error);
      toast({
        title: 'Error',
        description: 'Failed to create note.',
        variant: 'destructive',
      });
    } finally {
      setCreating(false);
    }
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (note.content && note.content.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTab = noteTab === 'group' ? note.isGroup : !note.isGroup;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="w-full md:w-[320px] shrink-0 border-r border-[var(--border-default)] bg-[var(--bg-card)] flex flex-col h-[calc(100vh-80px)] transition-all duration-300 relative z-20">
      
      {/* Sidebar Header & Control Panel */}
      <div className="p-4 border-b border-[var(--border-default)] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-1.5">
              Notebooks
            </h2>
            <span className="text-[11px] font-semibold bg-[var(--brand-pink)]/10 text-[var(--brand-pink)] px-2 py-0.5 rounded-full">
              {notes.length}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]"
              onClick={() => setIsJoinDialogOpen(true)}
              title="Join Note"
            >
              <KeyRound className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              className="h-8 w-8 rounded-full bg-[var(--brand-gradient)] text-white hover:brightness-105 shadow-sm"
              onClick={handleOpenCreateNote}
              title="Create Note"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
          <Input 
            placeholder="Search notes..." 
            className="pl-9 pr-3 h-9 rounded-full border border-[var(--border-default)] focus:border-[var(--brand-pink)] bg-[var(--bg-base)] text-[13px] w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Note Tabs */}
        <div className="flex bg-[var(--bg-base)] border border-[var(--border-default)] p-0.5 rounded-full w-full">
          <button 
            onClick={() => setNoteTab('personal')}
            className={cn(
              "flex-1 py-1 rounded-full text-[11px] font-semibold transition-all duration-200",
              noteTab === 'personal' 
                ? "bg-[var(--brand-gradient)] text-white shadow-xs" 
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            )}
          >
            Personal
          </button>
          <button 
            onClick={() => setNoteTab('group')}
            className={cn(
              "flex-1 py-1 rounded-full text-[11px] font-semibold transition-all duration-200",
              noteTab === 'group' 
                ? "bg-[var(--brand-gradient)] text-white shadow-xs" 
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            )}
          >
            Group Notes
          </button>
        </div>
      </div>

      {/* Notes List Container */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-[var(--brand-pink)]" />
            <span className="text-xs text-[var(--text-muted)]">Loading notes...</span>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="text-center py-12 px-4 border border-dashed border-[var(--border-default)] rounded-xl bg-[var(--bg-base)]">
            <FileText className="h-8 w-8 mx-auto text-[var(--text-muted)] mb-2 opacity-50" />
            <p className="text-xs font-medium text-[var(--text-secondary)]">No notes found</p>
            <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
              {searchQuery ? "Try refining your search" : "Create a note to start"}
            </p>
          </div>
        ) : (
          filteredNotes.map((note) => {
            const isActive = note.id === activeNoteId;
            return (
              <div
                key={note.id}
                onClick={() => navigate(`/notes/${note.id}`)}
                className={cn(
                  "p-3 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col gap-1 text-left relative overflow-hidden group select-none",
                  isActive
                    ? "bg-[var(--bg-base)] border-[var(--brand-pink)] shadow-[0_2px_8px_rgba(245,168,123,0.15)]"
                    : "bg-transparent border-transparent hover:bg-[var(--bg-base)]/50 hover:border-[var(--border-default)]"
                )}
              >
                {/* Active Indicator bar */}
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[var(--brand-orange)] to-[var(--brand-pink)]" />
                )}

                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-[13px] text-[var(--text-primary)] truncate flex-1 group-hover:text-[var(--brand-pink)] transition-colors">
                    {note.title || 'Untitled Note'}
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)] shrink-0">
                    {format(new Date(note.updatedAt || note.createdAt), 'MMM d')}
                  </span>
                </div>

                <p className="text-[11px] text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                  {extractAndTruncateHtml(note.content, 75) || (
                    <span className="italic text-[var(--text-muted)]">No content yet...</span>
                  )}
                </p>
                
                <div className="flex items-center justify-between mt-1 pt-1 border-t border-[var(--border-default)]/30">
                  <span className="text-[9px] font-medium text-[var(--text-muted)] flex items-center gap-1">
                    {note.isGroup ? (
                      <>
                        <Users className="h-3 w-3 text-[var(--brand-purple)]" />
                        Group
                      </>
                    ) : (
                      <>
                        <FileText className="h-3 w-3 text-[var(--brand-pink)]" />
                        Personal
                      </>
                    )}
                  </span>
                  
                  <ChevronRight className="h-3 w-3 text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Overflow-Safe Create Note Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-[440px] max-h-[85vh] overflow-y-auto rounded-[20px] bg-[var(--bg-card)] border border-[var(--border-default)] p-6 shadow-[var(--shadow-modal)] relative flex flex-col scrollbar-none">
          <button 
            onClick={() => setIsCreateDialogOpen(false)}
            className="absolute right-4 top-4 h-8 w-8 rounded-full flex items-center justify-center hover:bg-[var(--bg-card-hover)] text-[var(--text-secondary)] z-55"
          >
            <X className="h-4 w-4" />
          </button>

          <DialogHeader className="p-0 mb-4 shrink-0">
            <DialogTitle className="text-[18px] font-bold text-[var(--text-primary)]">Create New Note</DialogTitle>
            <DialogDescription className="text-[12px] text-[var(--text-muted)] mt-1">
              Create a personal notepad or collaborative workspace.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateNote} className="space-y-4 flex-1">
            <div className="space-y-1.5">
              <Label htmlFor="title" className="text-[12px] font-semibold text-[var(--text-secondary)]">Note Title</Label>
              <Input
                id="title"
                placeholder="e.g. Weekly Objectives"
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
                className="h-10 border-[var(--border-strong)] focus:border-[var(--brand-pink)] rounded-[10px] bg-transparent text-[13px] w-full"
                autoFocus
              />
            </div>
            
            <div className="flex items-center justify-between p-3.5 rounded-[12px] border border-[var(--border-default)] bg-[var(--bg-base)]">
              <div className="space-y-0.5">
                <Label htmlFor="isGroup" className="text-[12px] font-semibold text-[var(--text-primary)]">Group Collaboration</Label>
                <p className="text-[11px] text-[var(--text-muted)]">Allows others to join via invite code.</p>
              </div>
              <Switch
                id="isGroup"
                checked={isGroupNote}
                onCheckedChange={setIsGroupNote}
                className="data-[state=checked]:bg-[var(--brand-gradient)]"
              />
            </div>
            
            <DialogFooter className="flex items-center justify-end gap-2 pt-2 shrink-0">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => setIsCreateDialogOpen(false)}
                className="rounded-full h-9 text-[12px] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={creating || !newNoteTitle.trim()} 
                className="rounded-full h-9 bg-[var(--brand-gradient)] text-white hover:brightness-105 shadow-sm text-[12px] font-semibold px-5 min-w-[100px]"
              >
                {creating && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />}
                Create
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Join Dialog */}
      <JoinNoteDialog 
        open={isJoinDialogOpen} 
        onOpenChange={setIsJoinDialogOpen} 
        onSuccess={() => fetchNotes(true)}
      />

      {/* Upgrade Dialog */}
      <UpgradePromptDialog
        open={isUpgradeOpen}
        onOpenChange={setIsUpgradeOpen}
        title="Upgrade to Create More Notes"
        description="Free users are limited to 2 collaborative notes. Get TaskMate Pro to create unlimited notes, organize life milestones, and download the mobile app for real-time sync."
      />
    </div>
  );
};

export default NotesSidebar;

import { useState, useEffect } from 'react';
import AppLayout from '@/components/app/AppLayout';
import NoteCard from '@/components/notes/NoteCard';
import JoinNoteDialog from '@/components/notes/JoinNoteDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Note, NoteService } from '@/services/noteService';
import { Plus, Search, FileText, KeyRound, Loader2, RefreshCcw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  // Create Note State
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [isGroupNote, setIsGroupNote] = useState(false);
  const [creating, setCreating] = useState(false);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await NoteService.getNotes();
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast({
        title: 'Error',
        description: 'Failed to load notes. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim()) return;

    try {
      setCreating(true);
      const response = await NoteService.createNote({
        title: newNoteTitle,
        isGroup: isGroupNote
      });
      setNotes([response.data, ...notes]);
      setIsCreateDialogOpen(false);
      setNewNoteTitle('');
      setIsGroupNote(false);
      toast({
        title: 'Note Created',
        description: `"${response.data.title}" is ready.`,
      });
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

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (note.content && note.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <AppLayout title="Notes">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">Group Notes</h1>
            <p className="text-sm text-muted-foreground">Collaborate with your team in real-time.</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => setIsJoinDialogOpen(true)}
            >
              <KeyRound className="h-4 w-4" />
              Join Note
            </Button>
            <Button 
              className="gap-2"
              onClick={() => setIsCreateDialogOpen(true)}
              style={{ background: 'linear-gradient(135deg, #1E6F43, #2FAE72)' }}
            >
              <Plus className="h-4 w-4" />
              New Note
            </Button>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search notes..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Notes Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading your notes...</p>
          </div>
        ) : filteredNotes.length === 0 ? (
          <Card className="border-dashed py-12">
            <CardContent className="flex flex-col items-center justify-center text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-1">No notes found</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-xs">
                {searchQuery 
                  ? "No notes match your search query." 
                  : "You haven't created any notes yet. Start by creating a new one or joining a group note."}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsJoinDialogOpen(true)}>Join Note</Button>
                <Button onClick={() => setIsCreateDialogOpen(true)}>Create Note</Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredNotes.map(note => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        )}
      </div>

      {/* Create Note Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Note</DialogTitle>
            <DialogDescription>
              Create a personal or collaborative group note.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateNote} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Note Title</Label>
              <Input
                id="title"
                placeholder="e.g. Weekly Strategy"
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
                autoFocus
              />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
              <div className="space-y-0.5">
                <Label htmlFor="isGroup">Group Collaboration</Label>
                <p className="text-xs text-muted-foreground">Allows others to join via invite code.</p>
              </div>
              <Switch
                id="isGroup"
                checked={isGroupNote}
                onCheckedChange={setIsGroupNote}
              />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={creating || !newNoteTitle.trim()}>
                {creating && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Create Note
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Join Note Dialog */}
      <JoinNoteDialog 
        open={isJoinDialogOpen} 
        onOpenChange={setIsJoinDialogOpen} 
        onSuccess={fetchNotes}
      />
    </AppLayout>
  );
};

export default Notes;

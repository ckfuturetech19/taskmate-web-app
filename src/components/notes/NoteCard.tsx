import { Note } from '@/services/noteService';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Users, Pencil, Trash2, MoreVertical } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { extractAndTruncateHtml } from '@/lib/htmlUtils';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface NoteCardProps {
  note: Note;
  onDelete?: (id: string) => void;
}

const NoteCard = ({ note, onDelete }: NoteCardProps) => {
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className="group h-full relative"
    >
      <Card 
        className={cn(
          "bg-[var(--bg-card)] border border-[var(--border-default)] rounded-[16px] overflow-hidden transition-all duration-200 cursor-pointer shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] hover:border-[var(--border-brand)] h-full",
        )}
        onClick={() => navigate(`/notes/${note.id}`)}
      >
        <CardContent className="p-[20px] h-full flex flex-col justify-between">
          {/* Header Row: Type Icon + Date */}
          <div className="flex items-center justify-between w-full mb-3">
            {note.isGroup ? (
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#7B2FBE] to-[#784BA0] text-white flex items-center justify-center shrink-0">
                <Users className="h-4 w-4" />
              </div>
            ) : (
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#FF3CAC] to-[#FF6B6B] text-white flex items-center justify-center shrink-0">
                <FileText className="h-4 w-4" />
              </div>
            )}
            
            <span className="text-[12px] text-[var(--text-muted)]">
              {format(new Date(note.createdAt || note.updatedAt), 'MMM d, yyyy')}
            </span>
          </div>

          {/* Title & Preview */}
          <div className="space-y-1.5 flex-1">
            <h3 className="text-[15px] font-semibold text-[var(--text-primary)] group-hover:text-[var(--brand-pink)] transition-colors duration-150 line-clamp-1">
              {note.title}
            </h3>
            <p className="text-[13px] text-[var(--text-secondary)] line-clamp-3 leading-relaxed mb-4">
              {extractAndTruncateHtml(note.content, 120) || (
                <span className="text-[var(--text-muted)] italic">No content yet...</span>
              )}
            </p>
          </div>

          {/* Footer: Status Badge + Actions (on hover) */}
          <div className="flex items-center justify-between border-t border-[var(--border-default)] pt-3 mt-2">
            <Badge variant="outline" className={cn(
              "rounded-full text-[11px] font-medium px-2 py-0.5 border-transparent",
              note.isGroup 
                ? "bg-[var(--brand-purple)]/10 text-[var(--brand-purple)]" 
                : "bg-[var(--brand-pink)]/10 text-[var(--brand-pink)]"
            )}>
              {note.isGroup ? 'Group' : 'Personal'}
            </Badge>

            {/* Actions list - only shows on card hover */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/notes/${note.id}`);
                }}
                className="h-7 w-7 rounded-full text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)]"
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>

              {onDelete && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]">
                      <MoreVertical className="h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-[12px] p-1 shadow-md">
                    <DropdownMenuItem 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        setShowDeleteDialog(true); 
                      }}
                      className="rounded-[8px] h-9 text-[13px] font-semibold text-[var(--status-danger)] hover:bg-red-500/10 focus:bg-red-500/10"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-2" />
                      Delete Note
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {onDelete && (
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent className="bg-[var(--bg-card)] rounded-[20px] border border-[var(--border-default)] shadow-[var(--shadow-modal)] p-6 max-w-sm">
            <AlertDialogHeader>
              <AlertDialogTitle className="font-semibold text-[18px] text-[var(--text-primary)]">Delete Note</AlertDialogTitle>
              <AlertDialogDescription className="text-[13px] text-[var(--text-secondary)]">
                This will permanently remove "{note.title}".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-2 mt-4">
              <AlertDialogCancel className="rounded-full h-9 text-[13px] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDelete(note.id)}
                className="rounded-full h-9 bg-[var(--status-danger)] text-white hover:bg-[var(--status-danger)]/90 text-[13px]"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </motion.div>
  );
};

export default NoteCard;

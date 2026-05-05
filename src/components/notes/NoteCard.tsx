import { Note } from '@/services/noteService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, ChevronRight, FileText, Bell, Zap } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { extractAndTruncateHtml } from '@/lib/htmlUtils';
import { cn } from '@/lib/utils';
import { useCursorTracking } from '@/hooks/useCursorTracking';

interface NoteCardProps {
  note: Note;
}

const NoteCard = ({ note }: NoteCardProps) => {
  const navigate = useNavigate();
  const isOverdue = note.reminder && new Date(note.reminder) < new Date();
  const { containerRef, rotation, lightPosition, handleMouseMove, handleMouseLeave } = useCursorTracking();

  return (
    <div 
      ref={containerRef}
      className="group perspective h-full"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Card 
        className={cn(
          "cursor-tracking-card",
          "h-full relative overflow-hidden transition-shadow duration-200 cursor-pointer",
          "border border-border/30 hover:border-primary/50",
          "shadow-md hover:shadow-2xl",
          "bg-gradient-to-br hover:from-card hover:to-primary/5",
          "before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/10 before:to-transparent before:opacity-0 hover:before:opacity-100",
          "before:transition-opacity before:duration-300 before:pointer-events-none"
        )}
        onClick={() => navigate(`/notes/${note.id}`)}
        style={{
          transformStyle: 'preserve-3d' as any,
          transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${Math.abs(rotation.x) > 0 || Math.abs(rotation.y) > 0 ? 1.02 : 1})`,
          transition: Math.abs(rotation.x) === 0 && Math.abs(rotation.y) === 0 ? 'transform 0.6s cubic-bezier(0.23, 1, 0.320, 1)' : 'none'
        }}
      >
        {/* 3D Background Effect */}
        <div className="absolute inset-0 bg-grid-pattern opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
        
        {/* Accent Line */}
        <div className="absolute top-0 left-0 h-1 w-0 bg-gradient-to-r from-primary to-purple-500 group-hover:w-full transition-all duration-500" />

        {/* Dynamic Light Reflection */}
        <div 
          className="absolute pointer-events-none opacity-0 group-hover:opacity-30 transition-opacity duration-300 rounded-full blur-3xl"
          style={{
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%)',
            left: `${lightPosition.x}%`,
            top: `${lightPosition.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
        />
        
        <CardHeader className="p-4 pb-3 flex flex-row items-start justify-between space-y-0 relative z-10">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 text-primary group-hover:from-primary group-hover:to-primary/80 group-hover:text-primary-foreground transition-all duration-300 shadow-sm group-hover:shadow-lg" style={{
              transform: `rotateZ(${rotation.y * 2}deg) scale(${Math.abs(rotation.x) > 0 || Math.abs(rotation.y) > 0 ? 1.1 : 1})`,
              transition: Math.abs(rotation.x) === 0 && Math.abs(rotation.y) === 0 ? 'transform 0.4s ease-out' : 'none'
            }}>
              <FileText className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base font-semibold truncate max-w-[150px] sm:max-w-[200px] group-hover:text-primary transition-colors duration-300">
                {note.title}
              </CardTitle>
              <p className="text-xs text-muted-foreground/60 mt-0.5">
                {format(new Date(note.createdAt || note.updatedAt), 'MMM d, yyyy')}
              </p>
            </div>
          </div>
          {note.isGroup && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 gap-1 px-2 ml-2 shrink-0 group-hover:scale-110 transition-transform duration-300">
              <Users className="h-3 w-3" />
              <span className="hidden xs:inline">Group</span>
            </Badge>
          )}
        </CardHeader>
        
        <CardContent className="p-4 pt-0 relative z-10 flex flex-col h-full">
          {/* Content Preview */}
          <p className="text-sm text-muted-foreground/80 line-clamp-2 mb-4 min-h-[40px] group-hover:text-foreground/70 transition-colors duration-300 leading-relaxed">
            {extractAndTruncateHtml(note.content, 120) || <span className="text-muted-foreground/40 italic">No content yet...</span>}
          </p>

          {/* Metadata Section */}
          <div className="space-y-3 mt-auto pt-3 border-t border-border/20">
            {/* Reminder Badge */}
            {note.reminder && (
              <div className={cn(
                "flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-300",
                isOverdue
                  ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 animate-pulse"
                  : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 group-hover:bg-orange-200 dark:group-hover:bg-orange-900/50"
              )}>
                <Bell className={cn("h-3.5 w-3.5", isOverdue && "animate-bounce")} />
                {isOverdue ? "Overdue" : format(new Date(note.reminder), 'MMM d, h:mm a')}
              </div>
            )}

            {/* Footer Info */}
            <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground/60">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                <span>Updated {format(new Date(note.updatedAt), 'MMM d')}</span>
              </div>
              <div className="flex items-center gap-1 text-primary font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-x-2 group-hover:translate-x-0 duration-500">
                <span className="text-xs">View</span>
                <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </div>
        </CardContent>
        
        {/* Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 group-hover:animate-pulse transition-opacity duration-300 pointer-events-none" />
      </Card>
    </div>
  );
};

export default NoteCard;

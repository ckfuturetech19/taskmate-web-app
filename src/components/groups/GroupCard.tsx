import { Group } from '@/types/task';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Copy, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface GroupCardProps {
  group: Group;
}

const GroupCard = ({ group }: GroupCardProps) => {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleCopyInvite = async () => {
    await navigator.clipboard.writeText(group.inviteCode);
    setCopied(true);
    toast({
      title: 'Invite code copied',
      description: 'Share this code with others to invite them.',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200 cursor-pointer" onClick={() => navigate(`/groups/${group.id}`)}>
      <CardContent className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-base sm:text-lg mb-1 break-words">{group.name}</h3>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Users className="h-4 w-4 shrink-0" />
              <span>{Object.keys(group.members || {}).length} member{Object.keys(group.members || {}).length !== 1 ? 's' : ''}</span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 w-full sm:w-auto shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              handleCopyInvite();
            }}
          >
            {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            <span className="font-mono text-xs truncate">{group.inviteCode}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GroupCard;

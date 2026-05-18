import React from 'react';
import { useWorkspaceInvitations } from '@/hooks/workspace/useWorkspace';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, UserPlus, Check, X, Shield } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

export const WorkspaceInvitations: React.FC = () => {
  const { invitations, isLoading, acceptInvitation, declineInvitation } = useWorkspaceInvitations();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Workspace Invitations</h1>
          <p className="text-muted-foreground">Manage your incoming invitations to join other tactical units.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          [1, 2].map(i => <Skeleton key={i} className="h-32 rounded-xl w-full" />)
        ) : invitations.length > 0 ? (
          invitations.map((invite: any) => (
            <Card key={invite.id} className="glass border-white/10 rounded-xl overflow-hidden hover:bg-white/5 transition-all group border-l-4 border-l-primary">
              <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 shadow-inner">
                  <UserPlus className="w-8 h-8" />
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                    <h3 className="text-xl font-black tracking-tight">{invite.workspace?.name}</h3>
                    <Badge variant="outline" className="rounded-lg border-primary/20 text-primary text-[10px] uppercase font-bold">Invitation</Badge>
                  </div>
                  <p className="text-muted-foreground text-sm font-medium">
                    You have been invited to join this workspace as an <span className="text-foreground font-bold">{invite.role}</span>.
                  </p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-2 font-bold opacity-50">
                    Invited by {invite.invitedBy?.name || 'Administrator'}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Button 
                    variant="ghost" 
                    onClick={() => declineInvitation.mutate(invite.id)}
                    disabled={declineInvitation.isPending || acceptInvitation.isPending}
                    className="rounded-xl h-12 px-6 font-black uppercase tracking-widest text-[10px] hover:bg-destructive/10 hover:text-destructive transition-colors"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Decline
                  </Button>
                  <Button 
                    onClick={() => acceptInvitation.mutate(invite.id)}
                    disabled={acceptInvitation.isPending || declineInvitation.isPending}
                    className="rounded-xl h-12 px-8 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Accept Invite
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="py-24 text-center glass rounded-xl border-dashed border-white/20">
            <div className="w-20 h-20 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-6 opacity-20">
              <Mail className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black">No Pending Invites</h3>
            <p className="text-muted-foreground max-w-xs mx-auto mt-2">
              You're all caught up! When someone invites you to a workspace, it will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

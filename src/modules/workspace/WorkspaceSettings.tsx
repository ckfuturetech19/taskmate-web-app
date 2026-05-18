import React from 'react';
import { useWorkspace } from '@/providers/WorkspaceProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Building2, 
  Settings, 
  Users, 
  Bell, 
  Shield, 
  Globe, 
  Clock,
  Trash2
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import api from '@/services/apiService';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { InviteMemberModal } from '@/components/workspace/InviteMemberModal';
import { useWorkspaceMembers, useWorkspaceInvitesSent } from '@/hooks/workspace/useWorkspace';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { UserMinus, UserCog, Mail } from 'lucide-react';

export const WorkspaceSettingsUI: React.FC = () => {
  const { currentWorkspace, role } = useWorkspace();
  const [inviteModalOpen, setInviteModalOpen] = React.useState(false);

  const { members, isLoading: membersLoading, updateRole, removeMember } = useWorkspaceMembers();
  const { data: invites, isLoading: invitesLoading } = useWorkspaceInvitesSent(currentWorkspace?.id || '');

  if (role !== 'OWNER' && role !== 'ADMIN') {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
          <Shield className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-black">Access Restricted</h1>
        <p className="text-muted-foreground max-w-md">
          Only workspace Owners and Admins can access the settings. Please contact your administrator.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Workspace Settings</h1>
          <p className="text-muted-foreground">Configure your workspace environment and preferences.</p>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-white/5 border border-white/10 rounded-xl h-12 p-1">
          <TabsTrigger value="general" className="rounded-xl px-6 font-bold text-xs uppercase tracking-widest">General</TabsTrigger>
          <TabsTrigger value="members" className="rounded-xl px-6 font-bold text-xs uppercase tracking-widest">Members</TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-xl px-6 font-bold text-xs uppercase tracking-widest">Notifications</TabsTrigger>
          <TabsTrigger value="advanced" className="rounded-xl px-6 font-bold text-xs uppercase tracking-widest text-destructive hover:text-destructive">Danger Zone</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card className="glass border-white/10 rounded-xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                Workspace Information
              </CardTitle>
              <CardDescription>Update your workspace name, logo and public slug.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Workspace Name</Label>
                  <Input id="name" defaultValue={currentWorkspace?.name} className="rounded-xl bg-white/5 border-white/10" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Workspace Slug</Label>
                  <div className="flex items-center">
                    <span className="bg-muted px-3 h-10 flex items-center rounded-l-xl border border-r-0 border-white/10 text-xs text-muted-foreground">taskmate.com/</span>
                    <Input id="slug" defaultValue={currentWorkspace?.slug} className="rounded-l-none rounded-r-xl bg-white/5 border-white/10" />
                  </div>
                </div>
              </div>
              <Button className="rounded-xl font-bold px-8 mt-4">Save Changes</Button>
            </CardContent>
          </Card>

          <Card className="glass border-white/10 rounded-xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                Regional Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-bold">Timezone</Label>
                  <p className="text-sm text-muted-foreground">Set the default timezone for all members.</p>
                </div>
                <div className="w-64">
                  <Input defaultValue="UTC (Coordinated Universal Time)" className="rounded-xl bg-white/5 border-white/10" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-bold">Attendance Tracking</Label>
                  <p className="text-sm text-muted-foreground">Enable attendance logs for team members.</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members">
          <Card className="glass border-white/10 rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Team Members
                </CardTitle>
                <CardDescription>Manage your team and their roles.</CardDescription>
              </div>
              <Button size="sm" className="rounded-xl" onClick={() => setInviteModalOpen(true)}>Invite Member</Button>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Active Members */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground pl-1">Active Personnel</h4>
                {membersLoading ? (
                  [1, 2].map(i => <Skeleton key={i} className="h-16 rounded-xl w-full" />)
                ) : members?.map((member: any) => (
                  <div key={member.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 transition-colors hover:border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-white uppercase shadow-lg">
                        {member.user?.name?.[0] || 'U'}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{member.user?.name}</p>
                        <p className="text-xs text-muted-foreground">{member.user?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="h-7 px-3 rounded-lg border-white/10 uppercase text-[10px] font-bold gap-2 hover:bg-white/5">
                            {typeof member.role === 'object' ? member.role.name : member.role}
                            <Settings className="w-3 h-3 opacity-50" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="glass border-white/10 rounded-xl p-1">
                          <DropdownMenuItem onClick={() => updateRole.mutate({ userId: member.user.id, role: 'ADMIN' })} className="rounded-lg text-[10px] font-black uppercase tracking-wider">Make Admin</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateRole.mutate({ userId: member.user.id, role: 'MANAGER' })} className="rounded-lg text-[10px] font-black uppercase tracking-wider">Make Manager</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateRole.mutate({ userId: member.user.id, role: 'EMPLOYEE' })} className="rounded-lg text-[10px] font-black uppercase tracking-wider">Make Employee</DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-white/5" />
                          <DropdownMenuItem 
                            onClick={() => {
                              if (confirm('Are you sure you want to remove this member?')) {
                                removeMember.mutate(member.user.id);
                              }
                            }}
                            className="rounded-lg text-[10px] font-black uppercase tracking-wider text-destructive focus:text-destructive"
                          >
                            Remove Member
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pending Invites */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground pl-1">Awaiting Response</h4>
                {invitesLoading ? (
                  <Skeleton className="h-16 rounded-xl w-full" />
                ) : invites?.length > 0 ? invites.map((invite: any) => (
                  <div key={invite.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-dashed border-white/10 opacity-70">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-muted-foreground">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">{invite.email}</p>
                        <p className="text-[9px] uppercase tracking-tighter text-primary font-black">Invitation Sent</p>
                      </div>
                    </div>
                    <Badge variant="ghost" className="text-[10px] font-bold uppercase opacity-50">Pending</Badge>
                  </div>
                )) : (
                  <div className="py-8 text-center border border-dashed border-white/5 rounded-xl">
                    <p className="text-xs text-muted-foreground font-medium italic">No pending invitations.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="glass border-white/10 rounded-xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Workspace Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { label: 'Task Assignments', desc: 'Notify members when they are assigned a task.' },
                { label: 'Project Updates', desc: 'Notify members of status changes in projects.' },
                { label: 'Mention Notifications', desc: 'Notify members when mentioned in comments.' },
                { label: 'Daily Reports', desc: 'Send daily summary of workspace activity.' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base font-bold">{item.label}</Label>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch defaultChecked={idx < 3} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced">
          <Card className="border-destructive/20 bg-destructive/5 rounded-xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-destructive">Danger Zone</CardTitle>
              <CardDescription>Irreversible actions for your workspace.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-xl">
                <div className="space-y-0.5">
                  <Label className="text-base font-bold text-destructive">Delete Workspace</Label>
                  <p className="text-sm text-muted-foreground">This will permanently delete the workspace and all its data.</p>
                </div>
                <Button variant="destructive" className="rounded-xl font-bold">Delete Forever</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {currentWorkspace && (
        <InviteMemberModal 
          open={inviteModalOpen} 
          onOpenChange={setInviteModalOpen} 
          workspaceId={currentWorkspace.id} 
        />
      )}
    </div>
  );
};

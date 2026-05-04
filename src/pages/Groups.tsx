import { useState } from 'react';
import AppLayout from '@/components/app/AppLayout';
import GroupCard from '@/components/groups/GroupCard';
import TaskCard from '@/components/tasks/TaskCard';
import CreateGroupDialog from '@/components/groups/CreateGroupDialog';
import JoinGroupDialog from '@/components/groups/JoinGroupDialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTaskContext } from '@/contexts/TaskContext';
import { useAuth } from '@/contexts/AuthContext';
import { usePremium } from '@/contexts/PremiumContext';
import { Plus, UserPlus, Users, CheckSquare } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Task } from '@/types/task';
import PremiumGate from '@/components/premium/PremiumGate';

const Groups = () => {
  const { user } = useAuth();
  const { isPremium } = usePremium();
  const { groups, tasks, createGroup, joinGroup, updateTask, deleteTask, toggleTaskComplete } = useTaskContext();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('groups');

  const userGroups = groups;
  const groupTasks = tasks.filter(task => task.groupId && userGroups.some(g => g.id === task.groupId));

  const handleEdit = (task: Task) => {
    // Navigate to task detail or open edit dialog
    toast({
      title: 'Edit task',
      description: 'Navigate to the task page to edit this task.',
    });
  };

  const handleCreateGroup = async (name: string) => {
    try {
      const group = await createGroup(name);
      toast({
        title: 'Group created',
        description: `"${group.name}" has been created. Share the invite code to add members.`,
      });
      setCreateDialogOpen(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create group. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleJoinGroup = async (inviteCode: string): Promise<boolean> => {
    try {
      const success = await joinGroup(inviteCode);
      if (success) {
        toast({
          title: 'Joined group',
          description: 'You have successfully joined the group.',
        });
        setJoinDialogOpen(false);
      }
      return success;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to join group. Check the invite code.',
        variant: 'destructive',
      });
      return false;
    }
  };

  return (
    <AppLayout title="Groups">
      <PremiumGate 
        feature="Team Collaboration" 
        description="Create and join groups to collaborate with your team. This is a premium feature."
        variant="dialog"
      >
        <div className="space-y-4 sm:space-y-5 md:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
              <TabsList className="grid w-full grid-cols-2 sm:w-auto h-auto">
                <TabsTrigger value="groups" className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2">My Groups</TabsTrigger>
                <TabsTrigger value="tasks" className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2">All Group Tasks</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button 
                variant="outline" 
                onClick={() => {
                  if (!isPremium) return;
                  setJoinDialogOpen(true);
                }}
                disabled={!isPremium}
                className="gap-2 w-full sm:w-auto text-sm sm:text-base"
              >
                <UserPlus className="h-4 w-4" />
                <span className="hidden sm:inline">Join Group</span>
                <span className="sm:hidden">Join</span>
              </Button>
              <Button 
                onClick={() => {
                  if (!isPremium) return;
                  setCreateDialogOpen(true);
                }}
                disabled={!isPremium}
                className="gap-2 w-full sm:w-auto text-sm sm:text-base"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Create Group</span>
                <span className="sm:hidden">Create</span>
              </Button>
            </div>
          </div>

        {activeTab === 'groups' ? (
          userGroups.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-lg border border-border">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground mb-4">
                You're not part of any groups yet.
              </p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={() => setJoinDialogOpen(true)}>
                  Join a Group
                </Button>
                <Button onClick={() => setCreateDialogOpen(true)}>
                  Create a Group
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {userGroups.map(group => (
                <GroupCard key={group.id} group={group} />
              ))}
            </div>
          )
        ) : (
          groupTasks.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-lg border border-border">
              <CheckSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground mb-4">
                No group tasks yet.
              </p>
              <p className="text-sm text-muted-foreground">
                Tasks from all your groups will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {groupTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleComplete={toggleTaskComplete}
                  onEdit={handleEdit}
                  onDelete={deleteTask}
                />
              ))}
            </div>
          )
        )}
        </div>

        {isPremium && (
          <>
            <CreateGroupDialog
              open={createDialogOpen}
              onOpenChange={setCreateDialogOpen}
              onCreateGroup={handleCreateGroup}
            />

            <JoinGroupDialog
              open={joinDialogOpen}
              onOpenChange={setJoinDialogOpen}
              onJoinGroup={handleJoinGroup}
            />
          </>
        )}
      </PremiumGate>
    </AppLayout>
  );
};

export default Groups;

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
import { Plus, UserPlus, Users, CheckSquare } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Task } from '@/types/task';

const Groups = () => {
  const { user } = useAuth();
  const { groups, tasks, createGroup, joinGroup, updateTask, deleteTask, toggleTaskComplete } = useTaskContext();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('groups');

  const userGroups = groups.filter(g => user && g.members[user.uid] === true);
  const groupTasks = tasks.filter(task => task.groupId && userGroups.some(g => g.id === task.groupId));

  const handleEdit = (task: Task) => {
    // Navigate to task detail or open edit dialog
    toast({
      title: 'Edit task',
      description: 'Navigate to the task page to edit this task.',
    });
  };

  const handleCreateGroup = (name: string) => {
    const group = createGroup(name);
    toast({
      title: 'Group created',
      description: `"${group.name}" has been created. Share the invite code to add members.`,
    });
  };

  const handleJoinGroup = (inviteCode: string): boolean => {
    const success = joinGroup(inviteCode);
    if (success) {
      toast({
        title: 'Joined group',
        description: 'You have successfully joined the group.',
      });
    }
    return success;
  };

  return (
    <AppLayout title="Groups">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
            <TabsList className="grid w-full grid-cols-2 sm:w-auto">
              <TabsTrigger value="groups" className="text-xs sm:text-sm">My Groups</TabsTrigger>
              <TabsTrigger value="tasks" className="text-xs sm:text-sm">All Group Tasks</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button variant="outline" onClick={() => setJoinDialogOpen(true)} className="gap-2 w-full sm:w-auto">
              <UserPlus className="h-4 w-4" />
              <span className="hidden sm:inline">Join Group</span>
              <span className="sm:hidden">Join</span>
            </Button>
            <Button onClick={() => setCreateDialogOpen(true)} className="gap-2 w-full sm:w-auto">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
    </AppLayout>
  );
};

export default Groups;

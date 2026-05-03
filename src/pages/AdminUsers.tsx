import { useState, useEffect } from 'react';
import AppLayout from '@/components/app/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/apiService';
import { toast } from '@/hooks/use-toast';
import { Users, Shield, Calendar, Search, Trash2, Crown, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  isPro: boolean;
  isAdmin: boolean;
  proStartDate?: string;
  proEndDate?: string;
  createdAt: string;
  _count: {
    tasks: number;
    groupMemberships: number;
  };
}

const AdminUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProUser, setEditingProUser] = useState<string | null>(null);
  const [proDates, setProDates] = useState({ start: '', end: '' });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch user list. Are you an admin?',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateProStatus = async (userId: string, isPro: boolean) => {
    try {
      await api.put('/admin/users/pro', { 
        userId, 
        isPro,
        proStartDate: isPro ? proDates.start : null,
        proEndDate: isPro ? proDates.end : null
      });
      toast({
        title: 'Success',
        description: `User pro status updated.`,
      });
      setEditingProUser(null);
      fetchUsers();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update pro status.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user? This action is irreversible.')) return;
    
    try {
      await api.delete(`/admin/users/${userId}`);
      toast({
        title: 'User Deleted',
        description: 'User has been removed from the system.',
      });
      fetchUsers();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete user.',
        variant: 'destructive',
      });
    }
  };

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!currentUser?.isAdmin) {
    return (
      <AppLayout title="Access Denied">
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <Shield className="h-16 w-16 text-destructive mb-4" />
          <h2 className="text-2xl font-bold">Admin Only</h2>
          <p className="text-muted-foreground mt-2">You do not have permission to view this page.</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="User Management">
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              All Users ({users.length})
            </h2>
            <p className="text-muted-foreground">Manage user accounts and premium access</p>
          </div>
          
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search users..." 
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                <p className="text-muted-foreground">No users found matching your search.</p>
              </CardContent>
            </Card>
          ) : (
            filteredUsers.map(user => (
              <Card key={user.id} className="overflow-hidden transition-all hover:shadow-md border-border/50">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {/* User Info Section */}
                    <div className="flex-1 p-4 md:p-6 flex items-start gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-lg font-bold text-primary">
                          {user.name?.[0] || user.email[0].toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-lg truncate">{user.name || 'Anonymous User'}</h3>
                          {user.isAdmin && <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-200">Admin</Badge>}
                          {user.isPro ? (
                            <Badge className="bg-primary text-primary-foreground">PRO</Badge>
                          ) : (
                            <Badge variant="outline" className="text-muted-foreground">Free</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                        
                        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Joined {new Date(user.createdAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Crown className="h-3 w-3" />
                            {user._count.tasks} Tasks
                          </span>
                        </div>

                        {user.isPro && (user.proStartDate || user.proEndDate) && (
                          <div className="mt-3 p-2 bg-muted rounded-md text-xs inline-flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-3 w-3 text-primary" />
                              <span className="font-medium">Premium Duration:</span>
                            </div>
                            <div className="text-muted-foreground ml-5">
                              {user.proStartDate ? new Date(user.proStartDate).toLocaleDateString() : 'Start'} 
                              {' — '} 
                              {user.proEndDate ? new Date(user.proEndDate).toLocaleDateString() : 'End'}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions Section */}
                    <div className="bg-muted/30 p-4 md:p-6 border-t md:border-t-0 md:border-l border-border flex flex-col justify-center gap-3 w-full md:w-72">
                      {editingProUser === user.id ? (
                        <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-200">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase text-muted-foreground">Start Date</label>
                            <Input 
                              type="datetime-local" 
                              className="h-8 text-xs"
                              value={proDates.start}
                              onChange={(e) => setProDates(prev => ({ ...prev, start: e.target.value }))}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase text-muted-foreground">End Date</label>
                            <Input 
                              type="datetime-local" 
                              className="h-8 text-xs"
                              value={proDates.end}
                              onChange={(e) => setProDates(prev => ({ ...prev, end: e.target.value }))}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" className="flex-1 h-8" onClick={() => handleUpdateProStatus(user.id, true)}>Save</Button>
                            <Button size="sm" variant="outline" className="flex-1 h-8" onClick={() => setEditingProUser(null)}>Cancel</Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <Button 
                            variant={user.isPro ? "outline" : "default"} 
                            className={cn("w-full h-9", !user.isPro && "bg-primary hover:bg-primary/90")}
                            onClick={() => {
                              if (user.isPro) {
                                handleUpdateProStatus(user.id, false);
                              } else {
                                setEditingProUser(user.id);
                                // Default dates: Now to 1 month from now
                                const now = new Date();
                                const nextMonth = new Date();
                                nextMonth.setMonth(now.getMonth() + 1);
                                setProDates({
                                  start: now.toISOString().slice(0, 16),
                                  end: nextMonth.toISOString().slice(0, 16)
                                });
                              }
                            }}
                          >
                            {user.isPro ? 'Revoke Pro' : 'Make Pro'}
                          </Button>
                          
                          <Button 
                            variant="ghost" 
                            className="w-full h-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={user.id === currentUser.id}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete User
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default AdminUsers;

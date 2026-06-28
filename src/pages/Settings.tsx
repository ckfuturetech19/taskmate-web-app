import AppLayout from '@/components/app/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Moon, Sun, Edit2, Check, X, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

const Settings = () => {
  const { user, signOut, updateProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(user?.name || '');
  const [updating, setUpdating] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action is permanent and cannot be undone.')) {
      toast({
        title: 'Account Deletion Requested',
        description: 'Please contact support to complete account removal.',
      });
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <AppLayout title="Settings">
      <div className="max-w-2xl mx-auto space-y-6 pb-12">
        {/* Page Header */}
        <div className="border-b border-[var(--border-default)] pb-4">
          <h1 className="text-[24px] font-bold text-[var(--text-primary)]">Settings</h1>
          <p className="text-[13px] text-[var(--text-muted)]">Manage your account and preferences</p>
        </div>

        {/* Profile Details Card */}
        <Card className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-[16px] overflow-hidden shadow-[var(--shadow-card)]">
          <div className="p-5 border-b border-[var(--border-default)]">
            <h3 className="text-[16px] font-semibold text-[var(--text-primary)]">Profile Details</h3>
          </div>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 bg-[var(--brand-gradient)] text-white">
                <AvatarImage src={user?.photoURL} alt={user?.name || 'User'} />
                <AvatarFallback className="bg-[var(--brand-gradient)] text-white text-lg font-bold">
                  {getInitials(user?.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <Input 
                      value={newName} 
                      onChange={(e) => setNewName(e.target.value)}
                      className="h-9 w-48 border-[var(--border-strong)] focus:border-[var(--brand-pink)] rounded-[8px]"
                      autoFocus
                    />
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8 text-[var(--status-success)] hover:bg-[var(--status-success)]/10 rounded-full"
                      onClick={async () => {
                        setUpdating(true);
                        try {
                          await updateProfile({ name: newName });
                          setIsEditingName(false);
                          toast({ title: 'Name updated' });
                        } catch (err: any) {
                          toast({ title: 'Error', description: err.message, variant: 'destructive' });
                        } finally {
                          setUpdating(false);
                        }
                      }}
                      disabled={updating}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8 text-[var(--status-danger)] hover:bg-red-500/10 rounded-full"
                      onClick={() => {
                        setIsEditingName(false);
                        setNewName(user?.name || '');
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-[16px] text-[var(--text-primary)]">{user?.name || 'User'}</p>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-7 w-7 rounded-full text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]"
                      onClick={() => setIsEditingName(true)}
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
                <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">{user?.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings Card */}
        <Card className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-[16px] overflow-hidden shadow-[var(--shadow-card)]">
          <div className="p-5 border-b border-[var(--border-default)]">
            <h3 className="text-[16px] font-semibold text-[var(--text-primary)]">Appearance</h3>
          </div>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {theme === 'dark' ? (
                  <Moon className="h-5 w-5 text-[var(--brand-purple)]" />
                ) : (
                  <Sun className="h-5 w-5 text-[var(--brand-pink)]" />
                )}
                <div>
                  <Label htmlFor="dark-mode" className="text-[14px] font-semibold text-[var(--text-primary)]">Dark Mode</Label>
                  <p className="text-[12px] text-[var(--text-muted)] mt-0.5">Switch between light and dark themes</p>
                </div>
              </div>
              <Switch
                id="dark-mode"
                checked={theme === 'dark'}
                onCheckedChange={toggleTheme}
                className="data-[state=checked]:bg-[var(--brand-gradient)]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Account Management Card */}
        <Card className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-[16px] overflow-hidden shadow-[var(--shadow-card)]">
          <div className="p-5 border-b border-[var(--border-default)]">
            <h3 className="text-[16px] font-semibold text-[var(--text-primary)]">Account Management</h3>
          </div>
          <CardContent className="p-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="ghost" 
                onClick={handleSignOut} 
                className="rounded-full h-10 px-6 text-[13px] font-semibold border border-[var(--border-default)] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] flex items-center justify-center gap-1.5"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>

              {/* Red outline ghost delete button */}
              <Button 
                variant="ghost" 
                onClick={handleDeleteAccount} 
                className="rounded-full h-10 px-6 text-[13px] font-semibold border border-[var(--status-danger)] text-[var(--status-danger)] hover:bg-red-500/10 flex items-center justify-center gap-1.5"
              >
                <Trash2 className="h-4 w-4" />
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Settings;

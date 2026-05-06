import AppLayout from '@/components/app/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Moon, Sun, Edit2, Check, X } from 'lucide-react';
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

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <AppLayout title="Settings">
      <div className="max-w-2xl w-full space-y-3 sm:space-y-4 md:space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user?.photoURL} alt={user?.name || 'User'} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                  {getInitials(user?.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <Input 
                      value={newName} 
                      onChange={(e) => setNewName(e.target.value)}
                      className="h-8 w-48"
                      autoFocus
                    />
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8 text-green-500 hover:text-green-600 hover:bg-green-50"
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
                      className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
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
                    <p className="font-medium text-foreground text-lg">{user?.name || 'User'}</p>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-7 w-7 text-muted-foreground hover:text-primary"
                      onClick={() => setIsEditingName(true)}
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize how TaskMate looks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {theme === 'dark' ? (
                  <Moon className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <Sun className="h-5 w-5 text-muted-foreground" />
                )}
                <div>
                  <Label htmlFor="dark-mode" className="text-foreground">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">Switch between light and dark themes</p>
                </div>
              </div>
              <Switch
                id="dark-mode"
                checked={theme === 'dark'}
                onCheckedChange={toggleTheme}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Manage your account</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" onClick={handleSignOut} className="gap-2">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Settings;

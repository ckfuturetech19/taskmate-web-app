import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/app/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Milestone, MilestoneService } from '@/services/milestoneService';
import { Plus, Search, Award, Calendar as CalendarIcon, Loader2, Trash2, Clock, Bell, BellOff, ArrowRight, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePremium } from '@/contexts/PremiumContext';
import { UpgradePromptDialog } from '@/components/premium/UpgradePromptDialog';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const MILESTONE_TYPES = [
  { value: 'custom', label: 'Custom' },
  { value: 'internship', label: 'Internship' },
  { value: 'job', label: 'Job' },
  { value: 'relationship', label: 'Relationship' },
  { value: 'marriage', label: 'Marriage' },
  { value: 'education', label: 'Education' },
  { value: 'fitness', label: 'Fitness' },
  { value: 'learning', label: 'Learning' },
  { value: 'savings', label: 'Savings' },
  { value: 'business', label: 'Business' },
  { value: 'habit', label: 'Habit' }
];

const INTERVAL_TYPES = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'half_yearly', label: 'Half Yearly' },
  { value: 'yearly', label: 'Yearly' }
];

const Milestones = () => {
  const navigate = useNavigate();
  const { isPremium } = usePremium();
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('custom');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [intervalType, setIntervalType] = useState('monthly');
  const [creating, setCreating] = useState(false);

  const fetchMilestones = async () => {
    try {
      setLoading(true);
      const response = await MilestoneService.getMilestones();
      setMilestones(response.data);
    } catch (error) {
      console.error('Error fetching milestones:', error);
      toast({
        title: 'Error',
        description: 'Failed to load milestones. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMilestones();
  }, []);

  const handleOpenCreateMilestone = () => {
    if (!isPremium && milestones.length >= 1) {
      setIsUpgradeOpen(true);
    } else {
      setIsCreateDialogOpen(true);
    }
  };

  const handleCreateMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !startDate) return;

    try {
      setCreating(true);
      const response = await MilestoneService.createMilestone({
        title: title.trim(),
        description: description.trim() || undefined,
        type,
        startDate: new Date(startDate).toISOString(),
        endDate: endDate ? new Date(endDate).toISOString() : undefined,
        notificationEnabled,
        intervalType,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
      });
      
      setMilestones([response.data, ...milestones]);
      setIsCreateDialogOpen(false);
      
      // Reset Form
      setTitle('');
      setDescription('');
      setType('custom');
      setStartDate('');
      setEndDate('');
      setNotificationEnabled(true);
      setIntervalType('monthly');

      toast({
        title: 'Milestone Created',
        description: `"${response.data.title}" has been created.`,
      });
    } catch (error) {
      console.error('Error creating milestone:', error);
      toast({
        title: 'Error',
        description: 'Failed to create milestone.',
        variant: 'destructive',
      });
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteMilestone = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this milestone?')) return;

    try {
      await MilestoneService.deleteMilestone(id);
      setMilestones(milestones.filter(m => m.id !== id));
      toast({
        title: 'Milestone Deleted',
        description: 'The milestone has been successfully removed.',
      });
    } catch (error) {
      console.error('Error deleting milestone:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete milestone.',
        variant: 'destructive',
      });
    }
  };

  const handleToggleNotification = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const milestone = milestones.find(m => m.id === id);
    if (!milestone) return;

    try {
      const enabled = !milestone.notificationEnabled;
      await MilestoneService.updateMilestone(id, { notificationEnabled: enabled });
      setMilestones(milestones.map(m => m.id === id ? { ...m, notificationEnabled: enabled } : m));
      toast({
        title: enabled ? 'Notifications Enabled' : 'Notifications Muted',
        description: enabled ? 'You will receive reminders for this milestone.' : 'Reminders have been muted.',
      });
    } catch (error) {
      console.error('Error updating notification status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update reminder settings.',
        variant: 'destructive',
      });
    }
  };

  const filteredMilestones = milestones.filter(m => 
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (m.description && m.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <AppLayout title="Milestones">
      <div className="space-y-6 pb-10">
        
        {/* Page Header */}
        <div className="flex flex-row items-center justify-between border-b border-[var(--border-default)] pb-4">
          <div>
            <h1 className="text-[24px] font-bold text-[var(--text-primary)]">Milestones & Goals</h1>
            <p className="text-[13px] text-[var(--text-muted)]">
              Track project phases, business releases, and key achievements
            </p>
          </div>
          
          <Button 
            onClick={handleOpenCreateMilestone}
            className="rounded-full bg-[var(--brand-gradient)] text-white hover:brightness-105 shadow-sm text-[13px] font-semibold h-9 px-5 shrink-0"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            New Milestone
          </Button>
        </div>

        {/* Search Bar - Full width, 44px height, pill */}
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--text-muted)]" />
          <Input 
            placeholder="Search milestones..." 
            className="pl-12 pr-4 h-11 rounded-full border border-[var(--border-default)] focus:border-[var(--brand-pink)] bg-[var(--bg-card)] text-[14px] w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Milestones Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-[var(--brand-pink)]" />
            <p className="text-sm text-[var(--text-muted)]">Loading milestones...</p>
          </div>
        ) : filteredMilestones.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16 bg-[var(--bg-card)] rounded-[16px] border border-[var(--border-default)] p-8 max-w-lg mx-auto shadow-sm">
            <div className="h-[72px] w-[72px] rounded-full bg-[var(--brand-gradient)] flex items-center justify-center text-white mb-5 shadow-md">
              <Award className="h-8 w-8" />
            </div>
            
            <h3 className="text-[17px] font-semibold text-[var(--text-primary)]">
              {searchQuery ? "No results found" : "No milestones yet"}
            </h3>
            
            <p className="text-[14px] text-[var(--text-muted)] mt-1.5 max-w-[280px]">
              {searchQuery 
                ? "We couldn't find any milestones matching that search." 
                : "Start tracking project releases, career steps, learning goals, or key business phases!"}
            </p>

            {!searchQuery && (
              <Button 
                onClick={handleOpenCreateMilestone}
                className="mt-6 rounded-full bg-[var(--brand-gradient)] text-white hover:brightness-105 shadow-sm text-[13px] font-semibold h-9 px-6"
              >
                Create Milestone
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMilestones.map(m => {
              const formattedStartDate = format(new Date(m.startDate), 'MMM dd, yyyy');
              const elapsedString = `${m.yearsCompleted ? `${m.yearsCompleted}y ` : ''}${m.monthsCompleted ? `${m.monthsCompleted}m ` : ''}${(m.daysCompleted || 0) % 30}d`;
              const isOverdue = m.remainingDays !== null && m.remainingDays !== undefined && m.remainingDays < 0;

              return (
                <Card 
                  key={m.id} 
                  className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-[16px] overflow-hidden transition-all duration-200 cursor-pointer shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] hover:border-[var(--border-brand)] flex flex-col justify-between group"
                  onClick={() => navigate(`/milestones/${m.id}`)}
                >
                  <CardContent className="p-[20px] px-[24px] space-y-4">
                    {/* Top Row: Type Pill + Action Buttons */}
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[11px] font-semibold text-white px-2.5 py-0.5 rounded-full bg-[var(--brand-gradient)] capitalize">
                        {m.type}
                      </span>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]"
                          onClick={(e) => handleToggleNotification(m.id, e)}
                        >
                          {m.notificationEnabled ? <Bell className="h-4 w-4 text-[var(--brand-pink)]" /> : <BellOff className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full text-[var(--text-secondary)] hover:bg-red-500/10 hover:text-[var(--status-danger)]"
                          onClick={(e) => handleDeleteMilestone(m.id, e)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Title & Description */}
                    <div className="space-y-1">
                      <h3 className="text-[16px] font-semibold text-[var(--text-primary)] group-hover:text-[var(--brand-pink)] transition-colors line-clamp-1">
                        {m.title}
                      </h3>
                      {m.description && (
                        <p className="text-[13px] text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                          {m.description}
                        </p>
                      )}
                    </div>

                    {/* Meta Row */}
                    <div className="flex items-center justify-between text-[12px] text-[var(--text-secondary)] pt-1">
                      <div className="flex items-center gap-1.5">
                        <CalendarIcon className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                        <span>Since {formattedStartDate}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-semibold text-[var(--text-primary)]">
                        <Clock className="h-3.5 w-3.5 text-[var(--brand-pink)]" />
                        <span>{elapsedString} elapsed</span>
                      </div>
                    </div>

                    {/* Progress Bar (if endDate is set) */}
                    {m.endDate && m.progressPercentage !== null && m.progressPercentage !== undefined && (
                      <div className="space-y-1.5 pt-1">
                        <div className="flex justify-between text-[11px] font-semibold text-[var(--text-muted)]">
                          <span>Progress</span>
                          <span>{m.progressPercentage}%</span>
                        </div>
                        {/* 6px height track, brand-gradient fill */}
                        <div className="h-[6px] w-full bg-[var(--border-default)] rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[var(--brand-gradient)] rounded-full transition-all duration-500" 
                            style={{ width: `${m.progressPercentage}%` }}
                          />
                        </div>
                        {m.remainingDays !== null && m.remainingDays !== undefined && (
                          <p className={cn(
                            "text-[11px] font-semibold text-right",
                            isOverdue ? "text-[var(--brand-pink)] font-bold" : "text-[var(--text-muted)]"
                          )}>
                            {isOverdue ? `${Math.abs(m.remainingDays)} days overdue` : `${m.remainingDays} days remaining`}
                          </p>
                        )}
                      </div>
                    )}
                    
                    {/* Card Footer: Interval and Action Link */}
                    <div className="pt-3 border-t border-[var(--border-default)] flex items-center justify-between text-[12px] text-[var(--text-muted)]">
                      <span className="capitalize">Interval: {m.intervalType}</span>
                      <span className="flex items-center gap-1 text-[var(--brand-purple)] font-semibold hover:text-[var(--brand-pink)] transition-colors">
                        View Details <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Milestone Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-[480px] rounded-[20px] bg-[var(--bg-card)] border border-[var(--border-default)] p-8 shadow-[var(--shadow-modal)] relative">
          <button 
            onClick={() => setIsCreateDialogOpen(false)}
            className="absolute right-4 top-4 h-8 w-8 rounded-full flex items-center justify-center hover:bg-[var(--bg-card-hover)] text-[var(--text-secondary)]"
          >
            <X className="h-4 w-4" />
          </button>

          <DialogHeader className="p-0 mb-4">
            <DialogTitle className="text-[20px] font-semibold text-[var(--text-primary)]">Create Milestone</DialogTitle>
            <DialogDescription className="text-[14px] text-[var(--text-muted)] mt-1">
              Start tracking a new major achievement or lifetime milestone.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleCreateMilestone} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="milestone-title" className="text-[13px] font-semibold text-[var(--text-secondary)]">Milestone Title</Label>
              <Input
                id="milestone-title"
                placeholder="e.g. My Startup Journey"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-10 border-[var(--border-strong)] focus:border-[var(--brand-pink)] rounded-[12px] bg-transparent text-[14px]"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="milestone-desc" className="text-[13px] font-semibold text-[var(--text-secondary)]">Description</Label>
              <Textarea
                id="milestone-desc"
                placeholder="Add some details about this milestone..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[80px] border-[var(--border-strong)] focus:border-[var(--brand-pink)] rounded-[12px] bg-transparent text-[14px] resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="milestone-type" className="text-[13px] font-semibold text-[var(--text-secondary)]">Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger id="milestone-type" className="h-10 border-[var(--border-strong)] focus:border-[var(--brand-pink)] rounded-[12px] bg-transparent text-[14px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-[12px]">
                    {MILESTONE_TYPES.map(t => (
                      <SelectItem key={t.value} value={t.value} className="rounded-lg">{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="milestone-interval" className="text-[13px] font-semibold text-[var(--text-secondary)]">Check Interval</Label>
                <Select value={intervalType} onValueChange={setIntervalType}>
                  <SelectTrigger id="milestone-interval" className="h-10 border-[var(--border-strong)] focus:border-[var(--brand-pink)] rounded-[12px] bg-transparent text-[14px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-[12px]">
                    {INTERVAL_TYPES.map(i => (
                      <SelectItem key={i.value} value={i.value} className="rounded-lg">{i.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="milestone-start" className="text-[13px] font-semibold text-[var(--text-secondary)]">Start Date</Label>
                <Input
                  id="milestone-start"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="h-10 border-[var(--border-strong)] focus:border-[var(--brand-pink)] rounded-[12px] bg-transparent text-[14px]"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="milestone-end" className="text-[13px] font-semibold text-[var(--text-secondary)]">End Date (Optional)</Label>
                <Input
                  id="milestone-end"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="h-10 border-[var(--border-strong)] focus:border-[var(--brand-pink)] rounded-[12px] bg-transparent text-[14px]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-[12px] border border-[var(--border-default)] bg-[var(--bg-base)]">
              <div className="space-y-0.5">
                <Label htmlFor="notification" className="text-[13px] font-semibold text-[var(--text-primary)]">Reminders</Label>
                <p className="text-[12px] text-[var(--text-muted)]">Get checking reminders for interval checks.</p>
              </div>
              <Switch
                id="notification"
                checked={notificationEnabled}
                onCheckedChange={setNotificationEnabled}
                className="data-[state=checked]:bg-[var(--brand-gradient)]"
              />
            </div>

            <DialogFooter className="flex items-center justify-end gap-3 pt-2">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => setIsCreateDialogOpen(false)}
                className="rounded-full h-10 text-[13px] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={creating || !title.trim() || !startDate} 
                className="rounded-full h-10 bg-[var(--brand-gradient)] text-white hover:brightness-105 shadow-sm text-[13px] font-semibold px-6 min-w-[120px]"
              >
                {creating && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Create
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Upgrade Prompt Dialog */}
      <UpgradePromptDialog
        open={isUpgradeOpen}
        onOpenChange={setIsUpgradeOpen}
        title="Upgrade to Track More Milestones"
        description="Free users are limited to 1 lifetime milestone. Get TaskMate Pro to track infinite goals, business cycles, internships, and activate mobile sync."
      />
    </AppLayout>
  );
};

export default Milestones;

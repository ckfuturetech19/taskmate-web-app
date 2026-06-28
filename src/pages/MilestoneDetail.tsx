import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '@/components/app/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Milestone, MilestoneService, MilestoneTimelineItem } from '@/services/milestoneService';
import { ArrowLeft, Calendar, Clock, Bell, BellOff, Trash2, Sparkles, Loader2, Edit, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
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

const MilestoneDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [milestone, setMilestone] = useState<Milestone | null>(null);
  const [timeline, setTimeline] = useState<MilestoneTimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('custom');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [intervalType, setIntervalType] = useState('monthly');

  const handleOpenEditDialog = () => {
    if (!milestone) return;
    setTitle(milestone.title);
    setDescription(milestone.description || '');
    setType(milestone.type);
    setStartDate(milestone.startDate ? format(new Date(milestone.startDate), 'yyyy-MM-dd') : '');
    setEndDate(milestone.endDate ? format(new Date(milestone.endDate), 'yyyy-MM-dd') : '');
    setNotificationEnabled(milestone.notificationEnabled);
    setIntervalType(milestone.intervalType);
    setIsEditDialogOpen(true);
  };

  const handleUpdateMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!milestone || !title.trim() || !startDate) return;

    try {
      setUpdating(true);
      const response = await MilestoneService.updateMilestone(milestone.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        type,
        startDate: new Date(startDate).toISOString(),
        endDate: endDate ? new Date(endDate).toISOString() : undefined,
        notificationEnabled,
        intervalType,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
      });

      setMilestone(response.data);
      setIsEditDialogOpen(false);
      toast({
        title: 'Milestone Updated',
        description: `"${response.data.title}" has been successfully updated.`,
      });
    } catch (error) {
      console.error('Error updating milestone:', error);
      toast({
        title: 'Error',
        description: 'Failed to update milestone details.',
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
    }
  };

  const setTimelineSafely = (data: any) => {
    if (Array.isArray(data)) {
      setTimeline(data);
    } else if (data && typeof data === 'object' && Array.isArray(data.timeline)) {
      setTimeline(data.timeline);
    } else if (data && typeof data === 'object' && Array.isArray(data.data)) {
      setTimeline(data.data);
    } else {
      setTimeline([]);
    }
  };

  const fetchData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const [milestoneRes, timelineRes] = await Promise.all([
        MilestoneService.getMilestone(id),
        MilestoneService.getMilestoneTimeline(id)
      ]);
      setMilestone(milestoneRes.data);
      setTimelineSafely(timelineRes.data);
    } catch (error) {
      console.error('Error fetching milestone details:', error);
      toast({
        title: 'Error',
        description: 'Failed to load milestone details. It may have been deleted.',
        variant: 'destructive',
      });
      navigate('/milestones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleToggleNotification = async () => {
    if (!milestone) return;
    try {
      const response = await MilestoneService.toggleMilestone(milestone.id);
      setMilestone({ ...milestone, notificationEnabled: response.data.notificationEnabled });
      toast({
        title: response.data.notificationEnabled ? 'Notifications Enabled' : 'Notifications Muted',
        description: `Notifications for "${milestone.title}" have been updated.`,
      });
    } catch (error) {
      console.error('Error toggling notifications:', error);
      toast({
        title: 'Error',
        description: 'Failed to update notification settings.',
        variant: 'destructive',
      });
    }
  };

  const handleTriggerMilestone = async () => {
    if (!milestone) return;
    try {
      setTriggering(true);
      await MilestoneService.triggerMilestone(milestone.id);
      toast({
        title: 'Milestone Triggered',
        description: 'Manual interval check completed.',
      });
      const timelineRes = await MilestoneService.getMilestoneTimeline(milestone.id);
      setTimelineSafely(timelineRes.data);
    } catch (error) {
      console.error('Error triggering milestone:', error);
      toast({
        title: 'Error',
        description: 'Failed to trigger milestone check.',
        variant: 'destructive',
      });
    } finally {
      setTriggering(false);
    }
  };

  const handleDeleteMilestone = async () => {
    if (!milestone) return;
    if (!confirm('Are you sure you want to delete this milestone?')) return;

    try {
      await MilestoneService.deleteMilestone(milestone.id);
      toast({
        title: 'Milestone Deleted',
        description: 'The milestone has been successfully removed.',
      });
      navigate('/milestones');
    } catch (error) {
      console.error('Error deleting milestone:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete milestone.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <AppLayout title="Milestone Details">
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-[var(--brand-pink)]" />
          <p className="text-sm text-[var(--text-muted)] font-medium">Loading details...</p>
        </div>
      </AppLayout>
    );
  }

  if (!milestone) return null;

  const formattedStartDate = format(new Date(milestone.startDate), 'MMMM dd, yyyy');
  const formattedEndDate = milestone.endDate ? format(new Date(milestone.endDate), 'MMMM dd, yyyy') : null;
  const elapsedString = `${milestone.yearsCompleted ? `${milestone.yearsCompleted} years ` : ''}${milestone.monthsCompleted ? `${milestone.monthsCompleted} months ` : ''}${(milestone.daysCompleted || 0) % 30} days`;
  
  const isOverdue = milestone.remainingDays !== null && milestone.remainingDays !== undefined && milestone.remainingDays < 0;
  const isClose = milestone.remainingDays !== null && milestone.remainingDays !== undefined && milestone.remainingDays >= 0 && milestone.remainingDays < 30;

  return (
    <AppLayout title={milestone.title}>
      <div className="space-y-6 pb-10">
        {/* Navigation / Header */}
        <div className="flex items-center gap-3 border-b border-[var(--border-default)] pb-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full h-9 w-9 text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-default)]"
            onClick={() => navigate('/milestones')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-[20px] font-bold text-[var(--text-primary)]">{milestone.title}</h1>
            <p className="text-[12px] text-[var(--text-muted)] mt-0.5">
              Type: {milestone.type} • Interval: {milestone.intervalType}
            </p>
          </div>
        </div>

        {/* Info Grid: Main Content + Actions Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
          {/* Main Content Details Card */}
          <div className="space-y-6">
            <Card className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-[16px] p-6 shadow-[var(--shadow-card)]">
              <div>
                <h3 className="text-[18px] font-semibold text-[var(--brand-pink)] mb-2">Overview</h3>
                {milestone.description && (
                  <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed mb-4">
                    {milestone.description}
                  </p>
                )}
              </div>

              <div className="space-y-5">
                {/* Dates & Time row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 rounded-[12px] bg-[var(--bg-base)] border border-[var(--border-default)]">
                    <Calendar className="h-5 w-5 text-[var(--brand-pink)] shrink-0" />
                    <div>
                      <p className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">Start Date</p>
                      <p className="text-[13px] font-bold text-[var(--text-primary)]">{formattedStartDate}</p>
                    </div>
                  </div>

                  {formattedEndDate && (
                    <div className="flex items-center gap-3 p-4 rounded-[12px] bg-[var(--bg-base)] border border-[var(--border-default)]">
                      <Calendar className="h-5 w-5 text-[var(--brand-purple)] shrink-0" />
                      <div>
                        <p className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">End Target</p>
                        <p className="text-[13px] font-bold text-[var(--text-primary)]">{formattedEndDate}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3 p-4 rounded-[12px] bg-[var(--bg-base)] border border-[var(--border-default)] col-span-1 sm:col-span-2">
                    <Clock className="h-5 w-5 text-[var(--accent-teal)] shrink-0" />
                    <div>
                      <p className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">Elapsed Time</p>
                      <p className="text-[13px] font-bold text-[var(--text-primary)]">{elapsedString || '0 days'}</p>
                      <p className="text-[11px] text-[var(--text-muted)] font-medium">({milestone.daysCompleted || 0} total calendar days completed)</p>
                    </div>
                  </div>
                </div>

                {/* Progress Bar (taller 8px) */}
                {milestone.endDate && milestone.progressPercentage !== null && milestone.progressPercentage !== undefined && (
                  <div className="space-y-2.5 p-4 rounded-[12px] bg-[var(--bg-base)] border border-[var(--border-default)]">
                    <div className="flex justify-between items-center text-[12px] font-semibold">
                      <span className="text-[var(--text-secondary)]">Target Progress</span>
                      <span className="text-[var(--text-primary)]">{milestone.progressPercentage}%</span>
                    </div>
                    {/* Taller 8px progress bar */}
                    <div className="h-2 w-full bg-[var(--border-default)] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[var(--brand-gradient)] rounded-full transition-all duration-500" 
                        style={{ width: `${milestone.progressPercentage}%` }}
                      />
                    </div>
                    {milestone.remainingDays !== null && (
                      <div className="flex justify-end pt-1">
                        {/* Remaining days pill badge */}
                        <span className={cn(
                          "px-2.5 py-0.5 rounded-full text-[11px] font-semibold",
                          isOverdue 
                            ? "bg-red-500/10 text-[var(--status-danger)]" 
                            : isClose 
                            ? "bg-amber-500/10 text-[var(--status-warning)]" 
                            : "bg-emerald-500/10 text-[var(--status-success)]"
                        )}>
                          {isOverdue 
                            ? `${Math.abs(milestone.remainingDays)} days overdue` 
                            : `${milestone.remainingDays} days remaining`}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>

            {/* Timeline history section */}
            <Card className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-[16px] p-6 shadow-[var(--shadow-card)]">
              <div className="mb-4">
                <h3 className="font-semibold text-[16px] text-[var(--text-primary)]">Check History & Timeline</h3>
                <p className="text-[12px] text-[var(--text-muted)]">Record of all triggered intervals and milestone alerts.</p>
              </div>

              {!Array.isArray(timeline) || timeline.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center text-[var(--text-muted)] bg-[var(--bg-base)] rounded-[12px] p-4 border border-[var(--border-default)]">
                  <p className="text-[13px] font-medium text-[var(--text-primary)]">No alerts logged yet</p>
                  <p className="text-[12px] text-[var(--text-muted)] max-w-xs mt-0.5">
                    Alert logs are generated as you hit monthly, quarterly, or yearly interval dates.
                  </p>
                </div>
              ) : (
                <div className="relative border-l-2 border-[var(--border-default)] ml-4 pl-6 space-y-6 py-2">
                  {(Array.isArray(timeline) ? timeline : []).map(item => {
                    const triggeredDate = format(new Date(item.triggeredAt), 'MMMM dd, yyyy @ hh:mm a');
                    let label = `${item.intervalValue} Months`;
                    if (item.intervalValue >= 12 && item.intervalValue % 12 === 0) {
                      const yrs = item.intervalValue / 12;
                      label = yrs === 1 ? '1 Year' : `${yrs} Years`;
                    }
                    
                    return (
                      <div key={item.id} className="relative">
                        {/* Dotted/solid vertical timeline node indicator */}
                        <span className="absolute -left-[31px] top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white border-2 border-[var(--brand-pink)]" />
                        <div>
                          <h4 className="text-[14px] font-semibold text-[var(--text-primary)]">Reached: {label}</h4>
                          <p className="text-[11px] text-[var(--text-muted)] mt-0.5">Triggered on {triggeredDate}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>

          {/* Actions Sidebar */}
          <Card className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-[16px] p-5 shadow-[var(--shadow-card)] flex flex-col justify-between h-fit gap-4">
            <div className="space-y-3">
              <h3 className="font-semibold text-[15px] text-[var(--text-primary)] px-1">Actions</h3>
              
              <div className="flex flex-col gap-1.5">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start rounded-full h-10 px-4 text-[13px] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] font-medium gap-2.5"
                  onClick={handleOpenEditDialog}
                >
                  <Edit className="h-4 w-4 text-[var(--brand-purple)]" />
                  Edit Details
                </Button>

                <Button 
                  variant="ghost" 
                  className="w-full justify-start rounded-full h-10 px-4 text-[13px] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] font-medium gap-2.5"
                  onClick={handleToggleNotification}
                >
                  {milestone.notificationEnabled ? (
                    <>
                      <BellOff className="h-4 w-4 text-[var(--text-muted)]" />
                      Mute Notifications
                    </>
                  ) : (
                    <>
                      <Bell className="h-4 w-4 text-[var(--brand-pink)]" />
                      Unmute Notifications
                    </>
                  )}
                </Button>

                <Button 
                  variant="ghost" 
                  className="w-full justify-start rounded-full h-10 px-4 text-[13px] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] font-medium gap-2.5"
                  onClick={handleTriggerMilestone}
                  disabled={triggering}
                >
                  {triggering ? (
                    <Loader2 className="h-4 w-4 animate-spin text-[var(--brand-pink)]" />
                  ) : (
                    <Sparkles className="h-4 w-4 text-[var(--accent-teal)]" />
                  )}
                  Trigger Check
                </Button>
              </div>
            </div>

            {/* Red outline danger ghost delete button */}
            <div className="pt-4 border-t border-[var(--border-default)]">
              <Button 
                variant="ghost" 
                className="w-full rounded-full h-9 border border-[var(--status-danger)] hover:bg-red-500/10 text-[var(--status-danger)] text-[12px] font-semibold transition-all"
                onClick={handleDeleteMilestone}
              >
                <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                Delete Milestone
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Edit Milestone Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-[480px] rounded-[20px] bg-[var(--bg-card)] border border-[var(--border-default)] p-8 shadow-[var(--shadow-modal)] relative">
          <button 
            onClick={() => setIsEditDialogOpen(false)}
            className="absolute right-4 top-4 h-8 w-8 rounded-full flex items-center justify-center hover:bg-[var(--bg-card-hover)] text-[var(--text-secondary)]"
          >
            <X className="h-4 w-4" />
          </button>

          <DialogHeader className="p-0 mb-4">
            <DialogTitle className="text-[20px] font-semibold text-[var(--text-primary)]">Edit Milestone</DialogTitle>
            <DialogDescription className="text-[14px] text-[var(--text-muted)] mt-1">
              Update the details of your target milestone.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleUpdateMilestone} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="edit-milestone-title" className="text-[13px] font-semibold text-[var(--text-secondary)]">Milestone Title</Label>
              <Input
                id="edit-milestone-title"
                placeholder="e.g. My Startup Journey"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="h-10 border-[var(--border-strong)] focus:border-[var(--brand-pink)] rounded-[12px] bg-transparent text-[14px]"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="edit-milestone-desc" className="text-[13px] font-semibold text-[var(--text-secondary)]">Description</Label>
              <Textarea
                id="edit-milestone-desc"
                placeholder="Details or motivations about this milestone..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[80px] border-[var(--border-strong)] focus:border-[var(--brand-pink)] rounded-[12px] bg-transparent text-[14px] resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="edit-milestone-type" className="text-[13px] font-semibold text-[var(--text-secondary)]">Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger id="edit-milestone-type" className="h-10 border-[var(--border-strong)] focus:border-[var(--brand-pink)] rounded-[12px] bg-transparent text-[14px]">
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
                <Label htmlFor="edit-milestone-interval" className="text-[13px] font-semibold text-[var(--text-secondary)]">Check Interval</Label>
                <Select value={intervalType} onValueChange={setIntervalType}>
                  <SelectTrigger id="edit-milestone-interval" className="h-10 border-[var(--border-strong)] focus:border-[var(--brand-pink)] rounded-[12px] bg-transparent text-[14px]">
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
                <Label htmlFor="edit-milestone-start" className="text-[13px] font-semibold text-[var(--text-secondary)]">Start Date</Label>
                <Input
                  id="edit-milestone-start"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="h-10 border-[var(--border-strong)] focus:border-[var(--brand-pink)] rounded-[12px] bg-transparent text-[14px]"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="edit-milestone-end" className="text-[13px] font-semibold text-[var(--text-secondary)]">End Date</Label>
                <Input
                  id="edit-milestone-end"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="h-10 border-[var(--border-strong)] focus:border-[var(--brand-pink)] rounded-[12px] bg-transparent text-[14px]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-[12px] border border-[var(--border-default)] bg-[var(--bg-base)]">
              <div className="space-y-0.5">
                <Label htmlFor="edit-notification" className="text-[13px] font-semibold text-[var(--text-primary)]">Reminders</Label>
                <p className="text-[12px] text-[var(--text-muted)]">Get checking reminders for interval checks.</p>
              </div>
              <Switch
                id="edit-notification"
                checked={notificationEnabled}
                onCheckedChange={setNotificationEnabled}
                className="data-[state=checked]:bg-[var(--brand-gradient)]"
              />
            </div>

            <DialogFooter className="flex items-center justify-end gap-3 pt-2">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => setIsEditDialogOpen(false)}
                className="rounded-full h-10 text-[13px] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={updating || !title.trim() || !startDate} 
                className="rounded-full h-10 bg-[var(--brand-gradient)] text-white hover:brightness-105 shadow-sm text-[13px] font-semibold px-6 min-w-[120px]"
              >
                {updating && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default MilestoneDetail;

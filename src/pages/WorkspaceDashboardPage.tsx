import React from 'react';
import AppLayout from '@/components/app/AppLayout';
import { WorkspaceDashboard } from '@/modules/workspace/WorkspaceDashboard';

const WorkspaceDashboardPage = () => {
  return (
    <AppLayout title="Workspace Dashboard">
      <WorkspaceDashboard />
    </AppLayout>
  );
};

export default WorkspaceDashboardPage;

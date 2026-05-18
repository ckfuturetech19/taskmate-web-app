import React from 'react';
import AppLayout from '@/components/app/AppLayout';
import { WorkspaceSettingsUI } from '@/modules/workspace/WorkspaceSettings';

const WorkspaceSettingsPage = () => {
  return (
    <AppLayout title="Workspace Settings">
      <WorkspaceSettingsUI />
    </AppLayout>
  );
};

export default WorkspaceSettingsPage;

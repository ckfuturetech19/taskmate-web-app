import React from 'react';
import AppLayout from '@/components/app/AppLayout';
import { TeamTaskList } from '@/modules/teamTasks/TeamTaskList';

const TeamTaskListPage = () => {
  return (
    <AppLayout title="Team Tasks">
      <TeamTaskList />
    </AppLayout>
  );
};

export default TeamTaskListPage;

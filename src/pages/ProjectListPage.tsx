import React from 'react';
import AppLayout from '@/components/app/AppLayout';
import { ProjectList } from '@/modules/projects/ProjectList';

const ProjectListPage = () => {
  return (
    <AppLayout title="Projects">
      <ProjectList />
    </AppLayout>
  );
};

export default ProjectListPage;

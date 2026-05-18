import React, { useState } from 'react';
import { useProjects } from '@/hooks/workspace/useProjects';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Folder, Clock, MoreVertical, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { CreateProjectModal } from '@/components/workspace/CreateProjectModal';
import { useNavigate } from 'react-router-dom';
import { useWorkspace } from '@/providers/WorkspaceProvider';

export const ProjectList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const { data: projects, isLoading } = useProjects();
  const { hasPermission } = useWorkspace();
  const navigate = useNavigate();

  const filteredProjects = projects?.filter((p: any) => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log('[ProjectList] projects:', projects);
  console.log('[ProjectList] filteredProjects:', filteredProjects);
  console.log('[ProjectList] isLoading:', isLoading);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Team Projects</h1>
          <p className="text-muted-foreground">Manage and track your collective initiatives.</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => window.location.reload()}
            className="rounded-xl glass border-white/10"
          >
            Refresh
          </Button>
          {hasPermission('PROJECT_CREATE') && (
            <Button 
              onClick={() => setCreateModalOpen(true)}
              className="rounded-xl shadow-lg shadow-primary/20"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search projects..." 
            className="pl-10 rounded-xl bg-muted/30 border-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="rounded-xl border-white/10 glass">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 rounded-[2.5rem]" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects && filteredProjects.length > 0 ? (
            filteredProjects.map((project: any, i: number) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => navigate(`/projects/${project.id}`)}
              >
                <Card className="glass group hover:border-primary/40 transition-all duration-300 rounded-[2.5rem] border-white/10 overflow-hidden cursor-pointer h-full flex flex-col">
                  <CardHeader className="p-6 pb-2">
                    <div className="flex justify-between items-start">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white" style={{ backgroundColor: project.color || '#3B82F6' }}>
                        <Folder className="w-6 h-6" />
                      </div>
                      <Badge variant="secondary" className="rounded-full bg-primary/10 text-primary border-none">
                        {project.status || 'Active'}
                      </Badge>
                    </div>
                    <CardTitle className="mt-4 text-xl font-bold group-hover:text-primary transition-colors">
                      {project.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-2 flex-1 flex flex-col justify-between">
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {project.description || 'No description provided.'}
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold">
                            {i}
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{project._count?.tasks || 0} tasks</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center glass rounded-[2.5rem] border-dashed border-white/20">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Folder className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold">No projects found</h3>
              <p className="text-muted-foreground">Try adjusting your search or create a new project.</p>
              {hasPermission('PROJECT_CREATE') && (
                <Button 
                  variant="link" 
                  onClick={() => setCreateModalOpen(true)}
                  className="mt-2 text-primary font-bold"
                >
                  Create your first project
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      <CreateProjectModal open={createModalOpen} onOpenChange={setCreateModalOpen} />
    </div>
  );
};


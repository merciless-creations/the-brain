'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Book, FileText, ScrollText, File } from 'lucide-react';
import { Button, Spinner, Heading, Text } from '@/components/ui';
import { ThreeColumnLayout } from '@/components/layout';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { CreateProjectModal } from '@/components/projects/CreateProjectModal';
import type { Project } from '@/lib/types';
import { toast } from 'sonner';

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Fetch projects
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/v1/projects');
      const data = await response.json();
      setProjects(data.data);
    } catch (error) {
      toast.error('Failed to load projects');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProject = async (newProject: Project) => {
    setProjects([newProject, ...projects]);
    toast.success('Project created successfully!');
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      await fetch(`/api/v1/projects/${projectId}`, {
        method: 'DELETE',
      });
      
      setProjects(projects.filter(p => p.id !== projectId));
      toast.success('Project deleted');
    } catch (error) {
      toast.error('Failed to delete project');
      console.error(error);
    }
  };

  return (
    <ThreeColumnLayout title="Your Library">
      <div className="min-h-screen bg-bg-app">
        {/* Header Section - Writer's Desk */}
        <div className="border-b border-border-subtle bg-gradient-to-b from-bg-primary to-bg-app">
          <div className="max-w-7xl mx-auto px-8 py-12">
            <div className="flex items-start justify-between">
              <div>
                <Heading level={1} className="mb-3">
                  Your Library
                </Heading>
                <Text color="secondary" className="text-lg mb-6">
                  {projects.length === 0 
                    ? 'Begin your writing journey' 
                    : `${projects.length} ${projects.length === 1 ? 'manuscript' : 'manuscripts'} in progress`
                  }
                </Text>
              </div>
              <Button
                variant="ai"
                onClick={() => setIsCreateModalOpen(true)}
                className="gap-2"
              >
                <Plus size={20} />
                New Manuscript
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-8 py-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-32">
              <Spinner size="lg" />
            </div>
          ) : projects.length === 0 ? (
            // Empty State - Fresh Notebook
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-accent-blue/20 blur-3xl rounded-full" />
                <Book className="relative text-accent-blue" size={80} strokeWidth={1.5} />
              </div>
              
              <Heading level={2} className="mb-3">
                Your Library Awaits
              </Heading>
              <Text color="secondary" className="mb-8 max-w-md">
                Every great work begins with a blank page. Start your first manuscript and bring your ideas to life.
              </Text>
              
              <div className="grid grid-cols-2 gap-4 mb-10 max-w-md">
                <div className="p-4 bg-bg-secondary border border-border rounded-lg text-left">
                  <Book className="text-accent-purple mb-2" size={24} />
                  <Text variant="small" weight="semibold" className="mb-1">Books</Text>
                  <Text variant="tiny" color="tertiary">Full-length manuscripts</Text>
                </div>
                <div className="p-4 bg-bg-secondary border border-border rounded-lg text-left">
                  <FileText className="text-accent-blue mb-2" size={24} />
                  <Text variant="small" weight="semibold" className="mb-1">Articles</Text>
                  <Text variant="tiny" color="tertiary">Essays & longform</Text>
                </div>
                <div className="p-4 bg-bg-secondary border border-border rounded-lg text-left">
                  <ScrollText className="text-accent-emerald mb-2" size={24} />
                  <Text variant="small" weight="semibold" className="mb-1">Guides</Text>
                  <Text variant="tiny" color="tertiary">How-to & tutorials</Text>
                </div>
                <div className="p-4 bg-bg-secondary border border-border rounded-lg text-left">
                  <File className="text-accent-amber mb-2" size={24} />
                  <Text variant="small" weight="semibold" className="mb-1">Whitepapers</Text>
                  <Text variant="tiny" color="tertiary">Research & analysis</Text>
                </div>
              </div>
              
              <Button
                variant="primary"
                size="lg"
                onClick={() => setIsCreateModalOpen(true)}
                className="gap-2"
              >
                <Plus size={20} />
                Create Your First Manuscript
              </Button>
            </div>
          ) : (
            // Projects Grid - Bookshelf View
            <>
              <div className="mb-6">
                <Text color="tertiary" variant="small" className="uppercase tracking-wider">
                  Active Manuscripts
                </Text>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onDelete={handleDeleteProject}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Create Project Modal */}
        <CreateProjectModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateProject}
        />
      </div>
    </ThreeColumnLayout>
  );
}

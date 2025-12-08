'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { MoreVertical, Trash2, Archive, Copy, ExternalLink } from 'lucide-react';
import type { Project } from '@/lib/types';
import { Badge, Text } from '@/components/ui';

interface ProjectCardProps {
  project: Project;
  onDelete: (projectId: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);

  const formatWordCount = (count: number) => {
    return count.toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'emerald';
      case 'draft': return 'blue';
      case 'archived': return 'gray';
      default: return 'blue';
    }
  };

  return (
    <Link href={`/projects/${project.id}`}>
      <div 
        className="group relative h-80 rounded-lg overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-pointer"
        style={{
          background: `linear-gradient(145deg, ${project.cover_color}dd, ${project.cover_color})`
        }}
      >
        {/* Book Spine Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/10" />
        
        {/* Leather Texture Overlay */}
        <div 
          className="absolute inset-0 opacity-10" 
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")',
            backgroundSize: '100px 100px',
          }}
        />

        {/* Content */}
        <div className="relative h-full p-6 flex flex-col text-white">
          {/* Top Section - Status & Menu */}
          <div className="flex items-start justify-between mb-4">
            <Badge 
              variant={getStatusColor(project.status) as any}
              size="sm"
              className="bg-white/20 backdrop-blur-sm border border-white/30"
            >
              {project.status}
            </Badge>
            
            <div className="relative">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setShowMenu(!showMenu);
                }}
                className="p-1.5 rounded-md hover:bg-white/20 transition-colors"
              >
                <MoreVertical size={18} />
              </button>
              
              {showMenu && (
                <div className="absolute right-0 top-8 w-48 bg-bg-elevated border border-border-strong rounded-lg shadow-xl py-1 z-10">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      // TODO: Implement duplicate
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-bg-secondary flex items-center gap-2"
                  >
                    <Copy size={14} />
                    Duplicate
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      // TODO: Implement archive
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-bg-secondary flex items-center gap-2"
                  >
                    <Archive size={14} />
                    Archive
                  </button>
                  <hr className="my-1 border-border" />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (confirm('Are you sure you want to delete this project?')) {
                        onDelete(project.id);
                      }
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-bg-secondary flex items-center gap-2"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Middle Section - Title & Description */}
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-3 leading-tight line-clamp-3 font-serif">
              {project.title}
            </h3>
            <p className="text-white/80 text-sm line-clamp-3 leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Bottom Section - Stats */}
          <div className="pt-4 border-t border-white/20">
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <Text variant="tiny" className="text-white/60 mb-0.5">
                  Word Count
                </Text>
                <Text variant="small" weight="semibold" className="text-white">
                  {formatWordCount(project.word_count)}
                </Text>
              </div>
              <div>
                <Text variant="tiny" className="text-white/60 mb-0.5">
                  Chapters
                </Text>
                <Text variant="small" weight="semibold" className="text-white">
                  {project.chapter_count}
                </Text>
              </div>
            </div>
            
            <Text variant="tiny" className="text-white/50">
              Last edited {format(new Date(project.updated_at), 'MMM d, yyyy')}
            </Text>
          </div>

          {/* Hover Effect - Gold Foil Accent */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
        </div>

        {/* Shine Effect on Hover */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </Link>
  );
};

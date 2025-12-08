'use client';

import React, { useState } from 'react';
import { Book, FileText, ScrollText, File, Sparkles } from 'lucide-react';
import { Modal, Button, Input, Text } from '@/components/ui';
import type { Project, ProjectType } from '@/lib/types';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (project: Project) => void;
}

const projectTypes: { value: ProjectType; label: string; icon: React.ReactNode; description: string }[] = [
  {
    value: 'book',
    label: 'Book',
    icon: <Book size={24} />,
    description: 'Full-length manuscript',
  },
  {
    value: 'article',
    label: 'Article',
    icon: <FileText size={24} />,
    description: 'Essay or longform piece',
  },
  {
    value: 'guide',
    label: 'Guide',
    icon: <ScrollText size={24} />,
    description: 'How-to or tutorial',
  },
  {
    value: 'whitepaper',
    label: 'Whitepaper',
    icon: <File size={24} />,
    description: 'Research & analysis',
  },
  {
    value: 'other',
    label: 'Other',
    icon: <Sparkles size={24} />,
    description: 'Something unique',
  },
];

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedType, setSelectedType] = useState<ProjectType>('book');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});

  const validate = () => {
    const newErrors: { title?: string; description?: string } = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    } else if (description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    try {
      setIsSubmitting(true);
      
      const response = await fetch('/api/v1/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          type: selectedType,
        }),
      });
      
      const data = await response.json();
      
      onCreate(data.data);
      
      // Reset form
      setTitle('');
      setDescription('');
      setSelectedType('book');
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Failed to create project:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setTitle('');
      setDescription('');
      setSelectedType('book');
      setErrors({});
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Manuscript"
      description="Begin your next writing project"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Project Type Selection */}
        <div>
          <Text variant="small" weight="medium" className="mb-3">
            What are you writing?
          </Text>
          <div className="grid grid-cols-5 gap-3">
            {projectTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setSelectedType(type.value)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedType === type.value
                    ? 'border-accent-blue bg-accent-blue/10 shadow-md'
                    : 'border-border hover:border-border-strong hover:bg-bg-secondary'
                }`}
              >
                <div className={`${
                  selectedType === type.value ? 'text-accent-blue' : 'text-text-secondary'
                }`}>
                  {type.icon}
                </div>
                <Text 
                  variant="tiny" 
                  weight="medium"
                  className={`mt-2 ${
                    selectedType === type.value ? 'text-accent-blue' : 'text-text-primary'
                  }`}
                >
                  {type.label}
                </Text>
              </button>
            ))}
          </div>
        </div>

        {/* Title Input */}
        <Input
          label="Title"
          placeholder="Enter your manuscript title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={errors.title}
          autoFocus
          disabled={isSubmitting}
        />

        {/* Description Input */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            Description
          </label>
          <textarea
            placeholder="What is this project about? (A brief overview helps you stay focused)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSubmitting}
            rows={4}
            className={`w-full px-3 py-2 bg-bg-input border rounded-md text-text-primary placeholder:text-text-tertiary transition-all duration-200 ease-smooth hover:border-border-strong focus:border-accent-blue focus:outline-none focus:ring-4 focus:ring-accent-blue/10 resize-none ${
              errors.description ? 'border-accent-rose' : 'border-border'
            }`}
          />
          {errors.description && (
            <p className="mt-1.5 text-sm text-accent-rose">{errors.description}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="ai"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Manuscript'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

'use client';

import React, { useState } from 'react';
import { 
  Button, 
  Input, 
  Card, 
  Badge, 
  Spinner, 
  Modal, 
  Tooltip, 
  Heading, 
  Text 
} from '@/components/ui';
import { Plus, Sparkles } from 'lucide-react';

export default function ShowcasePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen bg-bg-app p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <Heading level={1}>Design System Showcase</Heading>
          <Text variant="lead" color="secondary">
            A comprehensive collection of all UI components for The Brain
          </Text>
        </div>

        {/* Typography */}
        <section className="space-y-6">
          <Heading level={2}>Typography</Heading>
          <Card>
            <div className="space-y-4">
              <Heading level={1}>Heading 1 - Display</Heading>
              <Heading level={2}>Heading 2 - Page Title</Heading>
              <Heading level={3}>Heading 3 - Section</Heading>
              <Heading level={4}>Heading 4 - Subsection</Heading>
              <Heading level={5}>Heading 5 - Card Title</Heading>
              <Heading level={6}>Heading 6 - Small Title</Heading>
              
              <div className="pt-4 border-t border-border">
                <Text variant="lead">Lead text - Larger body text for emphasis</Text>
                <Text variant="body">Body text - Default paragraph text</Text>
                <Text variant="small">Small text - Secondary information</Text>
                <Text variant="tiny">Tiny text - Captions and labels</Text>
              </div>
              
              <div className="pt-4 border-t border-border">
                <Text color="primary">Primary color text</Text>
                <Text color="secondary">Secondary color text</Text>
                <Text color="tertiary">Tertiary color text</Text>
                <Text color="disabled">Disabled color text</Text>
              </div>
            </div>
          </Card>
        </section>

        {/* Buttons */}
        <section className="space-y-6">
          <Heading level={2}>Buttons</Heading>
          <Card>
            <div className="space-y-6">
              <div>
                <Text variant="small" color="secondary" className="mb-3">Variants</Text>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary">Primary Button</Button>
                  <Button variant="secondary">Secondary Button</Button>
                  <Button variant="ghost">Ghost Button</Button>
                  <Button variant="ai">
                    <Sparkles size={16} />
                    AI Button
                  </Button>
                  <Button variant="danger">Danger Button</Button>
                </div>
              </div>
              
              <div>
                <Text variant="small" color="secondary" className="mb-3">Sizes</Text>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                </div>
              </div>
              
              <div>
                <Text variant="small" color="secondary" className="mb-3">States</Text>
                <div className="flex flex-wrap gap-3">
                  <Button disabled>Disabled</Button>
                  <Button 
                    isLoading={isLoading} 
                    onClick={() => {
                      setIsLoading(true);
                      setTimeout(() => setIsLoading(false), 2000);
                    }}
                  >
                    {isLoading ? 'Loading...' : 'Click to Load'}
                  </Button>
                  <Button>
                    <Plus size={16} />
                    With Icon
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Inputs */}
        <section className="space-y-6">
          <Heading level={2}>Inputs</Heading>
          <Card>
            <div className="space-y-6 max-w-md">
              <Input label="Default Input" placeholder="Enter text..." />
              <Input 
                label="Input with Helper" 
                placeholder="Email address"
                helperText="We'll never share your email with anyone else."
              />
              <Input 
                label="Error State" 
                placeholder="Invalid input"
                error="This field is required"
              />
              <Input 
                label="Disabled Input" 
                placeholder="Cannot edit"
                disabled
              />
            </div>
          </Card>
        </section>

        {/* Badges */}
        <section className="space-y-6">
          <Heading level={2}>Badges</Heading>
          <Card>
            <div className="space-y-4">
              <div>
                <Text variant="small" color="secondary" className="mb-3">Colors</Text>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="blue">Blue</Badge>
                  <Badge variant="purple">Purple</Badge>
                  <Badge variant="emerald">Emerald</Badge>
                  <Badge variant="amber">Amber</Badge>
                  <Badge variant="rose">Rose</Badge>
                  <Badge variant="cyan">Cyan</Badge>
                  <Badge variant="gray">Gray</Badge>
                </div>
              </div>
              
              <div>
                <Text variant="small" color="secondary" className="mb-3">Sizes</Text>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge size="sm">Small Badge</Badge>
                  <Badge size="md">Medium Badge</Badge>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Cards */}
        <section className="space-y-6">
          <Heading level={2}>Cards</Heading>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <Heading level={4}>Default Card</Heading>
              <Text variant="small" color="secondary" className="mt-2">
                Card with default padding and hover effect
              </Text>
            </Card>
            
            <Card hover={false}>
              <Heading level={4}>No Hover</Heading>
              <Text variant="small" color="secondary" className="mt-2">
                Card without hover effect
              </Text>
            </Card>
            
            <Card padding="sm">
              <Heading level={4}>Small Padding</Heading>
              <Text variant="small" color="secondary" className="mt-2">
                Card with reduced padding
              </Text>
            </Card>
          </div>
        </section>

        {/* Modal & Spinner */}
        <section className="space-y-6">
          <Heading level={2}>Modal & Spinner</Heading>
          <Card>
            <div className="space-y-6">
              <div>
                <Text variant="small" color="secondary" className="mb-3">Modal</Text>
                <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
              </div>
              
              <div>
                <Text variant="small" color="secondary" className="mb-3">Spinner</Text>
                <div className="flex gap-4 items-center">
                  <Spinner size="sm" />
                  <Spinner size="md" />
                  <Spinner size="lg" />
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Tooltip */}
        <section className="space-y-6">
          <Heading level={2}>Tooltip</Heading>
          <Card>
            <div className="flex gap-4">
              <Tooltip content="Top tooltip" position="top">
                <Button variant="secondary">Top</Button>
              </Tooltip>
              <Tooltip content="Bottom tooltip" position="bottom">
                <Button variant="secondary">Bottom</Button>
              </Tooltip>
              <Tooltip content="Left tooltip" position="left">
                <Button variant="secondary">Left</Button>
              </Tooltip>
              <Tooltip content="Right tooltip" position="right">
                <Button variant="secondary">Right</Button>
              </Tooltip>
            </div>
          </Card>
        </section>

        {/* Dark Mode */}
        <section className="space-y-6">
          <Heading level={2}>Theme</Heading>
          <Card>
            <Text>
              Toggle dark mode using the moon/sun icon in the header. 
              All components automatically adapt to the selected theme.
            </Text>
          </Card>
        </section>
      </div>

      {/* Example Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Example Modal"
        description="This is a demonstration of the modal component"
        size="md"
      >
        <div className="space-y-4">
          <Text>
            This modal can be closed by clicking the X button, pressing Escape, 
            or clicking outside the modal.
          </Text>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsModalOpen(false)}>
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

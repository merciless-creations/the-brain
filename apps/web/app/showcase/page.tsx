import { Button, Card, Container, Badge } from '@/components/ui'

export default function ShowcasePage() {
  return (
    <main className="min-h-screen bg-bg-app py-20">
      <Container size="xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">
            <span className="text-gradient">Design System Showcase</span>
          </h1>
          <p className="text-xl text-text-secondary">
            Modern, sleek components
          </p>
        </div>

        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8">Color Palette</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="h-24 rounded-lg bg-accent-blue mb-3 shadow-glow-blue"></div>
              <p className="text-sm font-medium">Electric Blue</p>
            </div>
            <div>
              <div className="h-24 rounded-lg bg-accent-purple mb-3 shadow-glow-purple"></div>
              <p className="text-sm font-medium">Vibrant Purple</p>
            </div>
            <div>
              <div className="h-24 rounded-lg bg-accent-cyan mb-3"></div>
              <p className="text-sm font-medium">Cyan</p>
            </div>
            <div>
              <div className="h-24 rounded-lg bg-accent-emerald mb-3"></div>
              <p className="text-sm font-medium">Emerald</p>
            </div>
          </div>
        </section>

        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8">Buttons</h2>
          
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
        </section>

        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8">Cards</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <h3 className="text-xl font-semibold mb-3">Standard Card</h3>
              <p className="text-text-secondary">Hover over me for elevation effect</p>
            </Card>
            
            <Card>
              <div className="text-3xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold mb-3">Icon Card</h3>
              <p className="text-text-secondary">Perfect for features</p>
            </Card>
            
            <Card className="bg-gradient-to-br from-accent-blue/10 to-accent-purple/10">
              <h3 className="text-xl font-semibold mb-3">Gradient Card</h3>
              <p className="text-text-secondary">With custom styling</p>
            </Card>
          </div>
        </section>

        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8">Badges</h2>
          
          <div className="flex flex-wrap gap-3">
            <Badge variant="blue">Blue</Badge>
            <Badge variant="purple">Purple</Badge>
            <Badge variant="emerald">Emerald</Badge>
            <Badge variant="amber">Amber</Badge>
            <Badge variant="rose">Rose</Badge>
          </div>
        </section>
      </Container>
    </main>
  )
}

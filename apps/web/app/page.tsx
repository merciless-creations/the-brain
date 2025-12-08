export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-bg-app">
      <div className="max-w-5xl w-full">
        <h1 className="text-6xl font-extrabold mb-4 text-text-primary">
          The Brain
        </h1>
        <p className="text-2xl mb-8 text-text-secondary">
          Non-Fiction AI Authoring Platform
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <div className="p-6 border border-border rounded-lg hover:shadow-lg transition-shadow bg-bg-secondary">
            <h2 className="text-xl font-semibold mb-2 text-text-primary">✨ AI-Powered Writing</h2>
            <p className="text-text-secondary">
              Generate outlines, expand ideas, and rewrite with confidence.
            </p>
          </div>
          
          <div className="p-6 border border-border rounded-lg hover:shadow-lg transition-shadow bg-bg-secondary">
            <h2 className="text-xl font-semibold mb-2 text-text-primary">📚 Research Vault</h2>
            <p className="text-text-secondary">
              Organize your research with AI-powered summarization.
            </p>
          </div>
          
          <div className="p-6 border border-border rounded-lg hover:shadow-lg transition-shadow bg-bg-secondary">
            <h2 className="text-xl font-semibold mb-2 text-text-primary">🤝 Collaboration</h2>
            <p className="text-text-secondary">
              Real-time editing with your co-authors.
            </p>
          </div>
          
          <div className="p-6 border border-border rounded-lg hover:shadow-lg transition-shadow bg-bg-secondary">
            <h2 className="text-xl font-semibold mb-2 text-text-primary">📊 Smart Export</h2>
            <p className="text-text-secondary">
              Export to Markdown, Word, or PDF with one click.
            </p>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <button className="px-8 py-4 bg-accent-blue text-white rounded-lg font-semibold hover:bg-accent-blue-hover hover:-translate-y-0.5 transition-all shadow-md hover:shadow-lg">
            Get Started
          </button>
        </div>
      </div>
    </main>
  )
}

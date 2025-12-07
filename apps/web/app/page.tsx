export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24" style={{ fontFamily: 'var(--font-inter, system-ui)' }}>
      <div className="max-w-5xl w-full">
        <h1 className="text-6xl font-extrabold mb-4 bg-gradient-to-r from-primary-500 to-secondary-500" style={{ 
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent'
        }}>
          The Brain
        </h1>
        <p className="text-2xl mb-8" style={{ color: 'var(--text-secondary)' }}>
          Non-Fiction AI Authoring Platform
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow" style={{ borderColor: 'var(--primary-200, #E0E7FF)' }}>
            <h2 className="text-xl font-semibold mb-2">✨ AI-Powered Writing</h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              Generate outlines, expand ideas, and rewrite with confidence.
            </p>
          </div>
          
          <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow" style={{ borderColor: 'var(--primary-200, #E0E7FF)' }}>
            <h2 className="text-xl font-semibold mb-2">📚 Research Vault</h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              Organize your research with AI-powered summarization.
            </p>
          </div>
          
          <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow" style={{ borderColor: 'var(--primary-200, #E0E7FF)' }}>
            <h2 className="text-xl font-semibold mb-2">🤝 Collaboration</h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              Real-time editing with your co-authors.
            </p>
          </div>
          
          <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow" style={{ borderColor: 'var(--primary-200, #E0E7FF)' }}>
            <h2 className="text-xl font-semibold mb-2">📊 Smart Export</h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              Export to Markdown, Word, or PDF with one click.
            </p>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <button className="px-8 py-4 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity shadow-md hover:shadow-lg" style={{ backgroundColor: 'var(--primary-500)' }}>
            Get Started
          </button>
        </div>
      </div>
    </main>
  )
}

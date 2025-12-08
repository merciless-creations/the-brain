import { http, HttpResponse } from 'msw'
import { projectHandlers } from './handlers/projects'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const handlers = [
  // Health check
  http.get(`${API_URL}/health`, () => {
    return HttpResponse.json({ status: 'ok', message: 'API is running' })
  }),

  // Project handlers
  ...projectHandlers,

  // Get chapters for a project
  http.get(`${API_URL}/api/v1/projects/:id/chapters`, ({ params }) => {
    const { id } = params
    return HttpResponse.json({
      data: [
        {
          id: '1',
          type: 'chapter',
          attributes: {
            project_id: id,
            title: 'Introduction',
            order: 1,
            content: '# Introduction\n\nThis is the opening chapter...',
            word_count: 523,
            status: 'draft',
            created_at: '2025-12-02T10:00:00Z',
            updated_at: '2025-12-06T11:15:00Z',
          },
        },
        {
          id: '2',
          type: 'chapter',
          attributes: {
            project_id: id,
            title: 'Background and Context',
            order: 2,
            content: '# Background\n\nThe historical context...',
            word_count: 1845,
            status: 'needs-research',
            created_at: '2025-12-03T09:30:00Z',
            updated_at: '2025-12-07T10:45:00Z',
          },
        },
      ],
    })
  }),

  // AI: Generate chapter outline
  http.post(`${API_URL}/api/v1/ai/draft`, async ({ request }) => {
    const body = await request.json()
    
    // Simulate AI processing time
    await new Promise((resolve) => setTimeout(resolve, 2000))
    
    return HttpResponse.json({
      data: {
        content: `# ${body.topic}\n\n## Introduction\n\n- Opening hook\n- Thesis statement\n- Chapter overview\n\n## Section 1: Main Concept\n\n- Key point 1\n- Key point 2\n- Supporting evidence\n\n## Section 2: Deep Dive\n\n- Detailed analysis\n- Examples\n- Data and statistics\n\n## Conclusion\n\n- Summary\n- Implications\n- Transition to next chapter`,
        metadata: {
          model: 'gpt-4',
          tokens: 450,
          confidence: 0.87,
        },
      },
    })
  }),

  // AI: Rewrite text
  http.post(`${API_URL}/api/v1/ai/rewrite`, async ({ request }) => {
    const body = await request.json()
    
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    return HttpResponse.json({
      data: {
        content: `[Rewritten in ${body.style} style] ${body.text}`,
        metadata: {
          model: 'gpt-4',
          tokens: 200,
          confidence: 0.92,
        },
      },
    })
  }),
]

export interface Project {
  id: string
  type: 'project'
  attributes: {
    title: string
    created_at: string
    updated_at: string
    chapter_count: number
    word_count: number
    status: 'draft' | 'needs-research' | 'needs-edit' | 'final'
  }
}

export interface Chapter {
  id: string
  type: 'chapter'
  attributes: {
    project_id: string
    title: string
    order: number
    content: string
    word_count: number
    status: 'draft' | 'needs-research' | 'needs-edit' | 'final'
    created_at: string
    updated_at: string
  }
}

export interface ResearchNote {
  id: string
  type: 'research-note'
  attributes: {
    project_id: string
    title: string
    content: string
    source_url?: string
    tags: string[]
    uploaded_file_path?: string
    created_at: string
    updated_at: string
  }
}

export interface AIDraftRequest {
  topic: string
  purpose?: string
  style?: string
  length?: 'short' | 'medium' | 'long'
}

export interface AIRewriteRequest {
  text: string
  style: 'clarify' | 'condense' | 'expand' | 'technical' | 'accessible'
  operation: string
}

export interface AIResponse {
  content: string
  metadata: {
    model: string
    tokens: number
    confidence: number
  }
}

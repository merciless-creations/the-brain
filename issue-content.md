## 🎯 **THE BRAIN - UI BUILD-OUT PLAN** (API Mocked/Simulated)

Based on all documentation and the current state, here is a comprehensive plan to build out the UI with fully mocked APIs:

---

## 📋 **CURRENT STATE**
- ✅ Next.js 14 + TypeScript setup
- ✅ Tailwind CSS configured  
- ✅ MSW (Mock Service Worker) ready
- ✅ Basic project structure in place
- ✅ Comprehensive design system documented
- ⚠️ Minimal UI implementation
- ⚠️ No TipTap editor yet
- ⚠️ No major screens built

---

## 🏗️ **BUILD PLAN - 7 PHASES**

### **PHASE 1: Foundation & Design System** (2-3 days)
**Goal**: Establish reusable component library with design tokens

#### Tasks:
1. **Implement CSS Variables from Design System**
   - Create `app/design-tokens.css` with all colors, spacing, typography
   - Light/dark mode variables
   - Update `globals.css` to import tokens

2. **Build Core UI Components** (in `components/ui/`)
   - `Button.tsx` - All variants (primary, secondary, ghost, AI)
   - `Input.tsx` - Text input with states
   - `Card.tsx` - Base card with hover states
   - `Badge.tsx` - Status badges
   - `Modal.tsx` - Base modal/dialog
   - `Tooltip.tsx` - Hover tooltips
   - `Spinner.tsx` - Loading spinner
   - `Toast.tsx` - Notification system (use Sonner or react-hot-toast)

3. **Typography Components**
   - `Heading.tsx` - H1-H6 with proper styling
   - `Text.tsx` - Body text variants

4. **Layout Components**
   - `Sidebar.tsx` - Navigation sidebar
   - `Header.tsx` - Global header
   - `Panel.tsx` - Right panel (collapsible)
   - `ThreeColumnLayout.tsx` - Main layout wrapper

**Deliverables**:
- Storybook or showcase page (`/showcase`) with all components
- Dark mode toggle working
- Design system tokens applied globally

---

### **PHASE 2: Authentication & Navigation** (2 days)
**Goal**: Login flow and basic navigation structure

#### Tasks:
1. **Auth UI**
   - `/app/login/page.tsx` - Login form
   - `/app/signup/page.tsx` - Signup form
   - Auth context (`lib/auth-context.tsx`)
   - MSW handlers for auth endpoints

2. **Navigation Structure**
   - Implement `Sidebar` with routes:
     - Dashboard
     - Projects
     - Research Vault
     - Settings
   - Active state highlighting
   - Keyboard shortcuts setup

3. **MSW Mock Auth**
   - `POST /api/v1/auth/login` → return JWT mock
   - `POST /api/v1/auth/signup` → return success
   - `GET /api/v1/auth/me` → return user object
   - Store mock JWT in localStorage

**Deliverables**:
- Working login/signup flow
- Protected routes (redirect if not authenticated)
- Sidebar navigation functional

---

### **PHASE 3: Dashboard & Project Management** (3 days)
**Goal**: Projects dashboard with CRUD operations

#### Tasks:
1. **Dashboard Page** (`/app/dashboard/page.tsx`)
   - Grid of project cards
   - "New Project" button
   - Empty state when no projects

2. **Project Card Component**
   - Title, last edited, word count, status
   - Hover effects
   - 3-dot menu (Archive, Duplicate, Delete)

3. **Project Creation Modal**
   - Form: Title, Description, Type
   - Validation
   - Success toast on creation

4. **MSW Mock Endpoints**
   - `GET /api/v1/projects` → array of projects
   - `POST /api/v1/projects` → create project
   - `PUT /api/v1/projects/:id` → update project
   - `DELETE /api/v1/projects/:id` → delete project

5. **Project Data Model** (MSW)
   ```typescript
   type Project = {
     id: string
     title: string
     description: string
     createdAt: string
     updatedAt: string
     wordCount: number
     chapterCount: number
     status: 'draft' | 'active' | 'archived'
   }
   ```

**Deliverables**:
- Functional dashboard with projects
- Create/Edit/Delete projects (all mocked)
- Smooth transitions and loading states

---

### **PHASE 4: Book Outline & Chapter Manager** (4 days)
**Goal**: Project overview with draggable chapter outline

#### Tasks:
1. **Project Overview Page** (`/app/projects/[id]/page.tsx`)
   - Header: Book title, status, export button
   - Chapter list with drag-and-drop
   - Add chapter button

2. **Chapter List Component**
   - `ChapterList.tsx` with drag-and-drop (use `@dnd-kit/core`)
   - Chapter cards showing:
     - Number, title, status badge, word count
     - Expand/collapse sections
     - Inline title editing
     - Right-click context menu

3. **Chapter CRUD**
   - Add chapter modal
   - Edit chapter inline
   - Delete confirmation dialog
   - Reorder via drag-and-drop

4. **MSW Mock Endpoints**
   - `GET /api/v1/projects/:id` → project details
   - `GET /api/v1/projects/:id/chapters` → chapters array
   - `POST /api/v1/projects/:id/chapters` → create chapter
   - `PUT /api/v1/chapters/:id` → update chapter
   - `DELETE /api/v1/chapters/:id` → delete chapter
   - `PUT /api/v1/chapters/:id/reorder` → update order

5. **Chapter Data Model**
   ```typescript
   type Chapter = {
     id: string
     projectId: string
     title: string
     order: number
     status: 'draft' | 'needs-research' | 'needs-edit' | 'final'
     content: string // Markdown or HTML
     wordCount: number
     sections: Section[]
   }
   ```

**Deliverables**:
- Working chapter outline view
- Drag-and-drop reordering
- Chapter CRUD operations
- Smooth animations

---

### **PHASE 5: Rich Text Editor (TipTap)** (5-6 days)
**Goal**: Distraction-free editor with AI toolbar

#### Tasks:
1. **Install TipTap**
   ```bash
   npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-placeholder
   ```

2. **Editor Page** (`/app/projects/[id]/chapters/[chapterId]/page.tsx`)
   - Three-column layout:
     - Left: Chapter outline (collapsible)
     - Center: Editor
     - Right: AI panel (collapsible)

3. **TipTap Editor Component** (`components/editor/TipTapEditor.tsx`)
   - Basic extensions: Bold, Italic, Heading, BulletList, etc.
   - Placeholder text
   - Autosave indicator
   - Toolbar (sticky)
   - Max-width 65ch for content
   - Serif font for body text

4. **Editor Toolbar**
   - Text formatting: Bold, Italic, Underline
   - Headings: H1, H2, H3
   - Lists: Bullet, Numbered
   - Insert: Link, Image
   - AI dropdown (we'll populate in Phase 6)

5. **Floating Toolbar** (on text selection)
   - Appears above selected text
   - Quick actions: Bold, Italic, Comment, AI Rewrite

6. **Autosave Logic**
   - Debounced save (2 seconds after typing stops)
   - Visual indicator: "Saving..." → "Saved"
   - MSW handler: `PUT /api/v1/chapters/:id/content`

7. **MSW Mock Endpoints**
   - `GET /api/v1/chapters/:id` → chapter with content
   - `PUT /api/v1/chapters/:id/content` → save content
   - Return success with timestamp

**Deliverables**:
- Functional rich text editor
- Autosave working
- Toolbar with all formatting options
- Three-column layout with collapsible panels

---

### **PHASE 6: AI Features UI** (4-5 days)
**Goal**: AI interaction panels and workflows (UI only, mocked responses)

#### Tasks:
1. **AI Panel Component** (`components/ai/AIPanel.tsx`)
   - Right sidebar in editor
   - Tabs: Suggestions, Rewrite, Research
   - Collapsible

2. **AI Features**

   **A. Generate Chapter Outline**
   - Modal with form:
     - Topic (textarea)
     - Purpose (textarea)
     - Target length (radio buttons)
     - Tone (dropdown)
   - "Generate" button → show loading
   - Mock response: Structured outline (JSON)
   - Display outline with "Expand section" buttons

   **B. Expand Bullets to Paragraphs**
   - User types bullet points
   - "Expand" button in toolbar
   - Modal shows expansion options
   - Mock response: Paragraphs
   - Side-by-side view: Original | AI result
   - Accept/Reject buttons

   **C. Rewrite Tool**
   - Select text → Floating toolbar appears
   - "Rewrite" dropdown:
     - Clarify
     - Condense
     - Expand with examples
     - Make more technical
     - Make more accessible
   - Click option → Loading state
   - Show result in modal (side-by-side)
   - Accept replaces text, Reject closes

   **D. AI Ghostwriter (Assist Mode)**
   - Toggle in toolbar: "AI Assist" (on/off)
   - When on: After user stops typing, show gray italic suggestion
   - "Tab to accept, Esc to dismiss" hint
   - Mock: Generate next 1-2 sentences based on context

   **E. Voice & Style Controls**
   - Dropdown in toolbar
   - Presets: Academic, Professional, Journalistic, etc.
   - Apply to selection or full chapter

3. **AI Loading States**
   - Gradient spinner with "AI is thinking..."
   - Progress indicator
   - Confidence meter (show percentage)

4. **MSW Mock AI Endpoints**
   - `POST /api/v1/ai/generate-outline` → structured outline
   - `POST /api/v1/ai/expand-bullets` → paragraphs
   - `POST /api/v1/ai/rewrite` → rewritten text
   - `POST /api/v1/ai/suggest-next` → continuation
   - All return after 1-2 second delay to simulate processing

5. **AI Response Format**
   ```typescript
   type AIResponse = {
     content: string
     confidence: number // 0-100
     alternatives?: string[] // Optional variations
   }
   ```

**Deliverables**:
- AI panel with all features accessible
- Modal workflows for AI generation
- Side-by-side comparison views
- All AI features functional (with mocked responses)
- Loading states and animations

---

### **PHASE 7: Research Vault & Additional Features** (3-4 days)
**Goal**: Research management and supporting features

#### Tasks:
1. **Research Vault Page** (`/app/research/page.tsx`)
   - Left: Tag filter sidebar
   - Right: Grid of research note cards
   - Search bar at top
   - Upload button

2. **Research Note Card**
   - Title, tags, excerpt
   - Buttons: View, Summarize (AI), Edit, Delete
   - Click → Open in modal

3. **Research Note Modal**
   - Full content display
   - Edit mode
   - Add/remove tags
   - Link to chapters

4. **Upload Research**
   - Drag-and-drop or file picker
   - Support: PDF, TXT, MD
   - Show upload progress
   - Auto-summarize with AI (mocked)

5. **MSW Mock Endpoints**
   - `GET /api/v1/research` → array of notes
   - `POST /api/v1/research` → create note
   - `PUT /api/v1/research/:id` → update note
   - `DELETE /api/v1/research/:id` → delete note
   - `POST /api/v1/research/upload` → upload file
   - `POST /api/v1/ai/summarize` → summarize document

6. **Additional Features**

   **A. Comments System**
   - Highlight text in editor
   - Add comment button
   - Comment thread in right panel
   - Reply functionality

   **B. Version History (Basic)**
   - List of saved versions
   - View previous version (read-only)
   - Compare with current (simple diff)

   **C. Export Modal**
   - Format selection: Markdown, DOCX, PDF
   - Options: TOC, chapters, notes, citations
   - Preview structure
   - Download button (generates mock file)

   **D. Settings Page** (`/app/settings/page.tsx`)
   - Profile settings
   - Theme toggle (light/dark)
   - Keyboard shortcuts reference

**Deliverables**:
- Functional research vault
- Upload and manage research notes
- Comments system
- Basic version history
- Export functionality (mocked)
- Settings page

---

## 🎨 **UI/UX POLISH** (Ongoing)
Throughout all phases, ensure:

1. **Responsive Design**
   - Mobile: Drawer navigation, stacked layout
   - Tablet: Narrow sidebar, single column
   - Desktop: Full three-column layout

2. **Animations & Transitions**
   - Smooth page transitions (200ms fade)
   - Hover effects on cards (lift + shadow)
   - Modal enter/exit animations
   - Loading skeletons

3. **Keyboard Shortcuts**
   - Implement global shortcuts (Cmd+K, etc.)
   - Editor shortcuts (Cmd+B, Cmd+I, etc.)
   - Show shortcuts in tooltips

4. **Accessibility**
   - Focus indicators
   - ARIA labels
   - Keyboard navigation
   - Screen reader support

5. **Error States**
   - Form validation errors
   - API error toasts
   - Offline mode indicator
   - Empty states with CTAs

---

## 🛠️ **TECHNICAL IMPLEMENTATION NOTES**

### **Libraries to Install**
```bash
# Editor
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-placeholder

# Drag & Drop
npm install @dnd-kit/core @dnd-kit/sortable

# Notifications
npm install sonner

# Icons
npm install lucide-react

# Forms
npm install react-hook-form zod @hookform/resolvers

# Date handling
npm install date-fns

# State (optional, but recommended)
npm install zustand
```

### **Folder Structure**
```
/apps/web
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── signup/
│   ├── dashboard/
│   ├── projects/
│   │   └── [id]/
│   │       ├── page.tsx (outline view)
│   │       └── chapters/
│   │           └── [chapterId]/
│   │               └── page.tsx (editor)
│   ├── research/
│   ├── settings/
│   └── showcase/ (component showcase)
├── components/
│   ├── ui/ (base components)
│   ├── editor/ (TipTap components)
│   ├── ai/ (AI panels and modals)
│   ├── layout/ (Sidebar, Header, etc.)
│   └── projects/ (Project-specific components)
├── lib/
│   ├── hooks/ (custom React hooks)
│   ├── utils/ (helper functions)
│   └── types.ts (TypeScript types)
├── mocks/
│   ├── handlers/ (organized by feature)
│   │   ├── auth.ts
│   │   ├── projects.ts
│   │   ├── chapters.ts
│   │   ├── ai.ts
│   │   └── research.ts
│   ├── data/ (mock data generators)
│   └── browser.ts
```

### **MSW Data Persistence**
Since we're mocking, use:
- LocalStorage to persist mock data between sessions
- IndexedDB for larger mock datasets (research PDFs)
- Session-based state in MSW handlers

### **State Management**
For this scope, use:
- React Context for auth
- Zustand for global UI state (sidebar open/closed, theme, etc.)
- React Query (TanStack Query) for data fetching/caching
  ```bash
  npm install @tanstack/react-query
  ```

---

## 📊 **ESTIMATED TIMELINE**

| Phase | Duration | Focus |
|-------|----------|-------|
| Phase 1 | 2-3 days | Design system & components |
| Phase 2 | 2 days | Auth & navigation |
| Phase 3 | 3 days | Dashboard & projects |
| Phase 4 | 4 days | Chapter outline |
| Phase 5 | 5-6 days | TipTap editor |
| Phase 6 | 4-5 days | AI features UI |
| Phase 7 | 3-4 days | Research vault |
| **Total** | **23-27 days** | ~4-5 weeks |

Add 20% buffer for refinement = **28-33 days (~6 weeks)**

---

## ✅ **ACCEPTANCE CRITERIA**

By the end, you should have:
1. ✅ Complete design system implemented
2. ✅ All major screens functional (Dashboard, Outline, Editor, Research)
3. ✅ TipTap editor with toolbar and autosave
4. ✅ All AI features accessible via UI (mocked responses)
5. ✅ Drag-and-drop chapter reordering
6. ✅ Research vault with upload
7. ✅ Comments system
8. ✅ Export functionality (UI complete)
9. ✅ Responsive design (mobile, tablet, desktop)
10. ✅ Dark mode toggle
11. ✅ Keyboard shortcuts
12. ✅ Smooth animations and transitions
13. ✅ Proper loading/error states
14. ✅ Accessibility features (focus, ARIA, keyboard nav)

---

## 🚀 **NEXT STEPS**

1. **Review this plan** - Any questions or adjustments?
2. **Start Phase 1** - Set up design tokens and build core UI components
3. **Iterate** - Build incrementally, test frequently, refine continuously

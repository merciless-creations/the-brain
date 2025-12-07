# Design Layouts & Screens

## Application Layout Architecture

### Three-Panel Layout (Desktop)

```
┌─────────────────────────────────────────────────────────────┐
│  Header (Global) - 64px height                              │
├────────┬──────────────────────────────────┬─────────────────┤
│        │                                  │                 │
│ Left   │      Main Content                │    Right        │
│ Sidebar│      (Editor / Dashboard)        │    Panel        │
│        │                                  │                 │
│ 256px  │      Flexible width              │    320px        │
│        │                                  │    (Optional)   │
│        │                                  │                 │
└────────┴──────────────────────────────────┴─────────────────┘
```

### Responsive Breakpoints

**Mobile (<640px)**:
```
┌─────────────────┐
│ Header + Drawer │
├─────────────────┤
│                 │
│  Full Width     │
│  Content        │
│                 │
└─────────────────┘
```

**Tablet (640px - 1024px)**:
```
┌────────┬─────────────────┐
│        │                 │
│ Nav    │   Main Content  │
│ 200px  │                 │
│        │                 │
└────────┴─────────────────┘
```

---

## Screen Layouts

### 1. Dashboard (Home)

**Purpose**: Project overview and navigation

**Layout**:
```
┌─────────────────────────────────────────────────────────────┐
│  Header: "Your Projects" + New Project Button              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │  Project    │  │  Project    │  │  Project    │        │
│  │  Card       │  │  Card       │  │  Card       │        │
│  │             │  │             │  │             │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐                          │
│  │  Project    │  │  + New      │                          │
│  │  Card       │  │  Project    │                          │
│  │             │  │             │                          │
│  └─────────────┘  └─────────────┘                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Project Card Contents**:
- Title (large, bold)
- Last edited timestamp
- Chapter count + Total word count
- Status indicator (colored dot)
- 3-dot menu (Archive, Duplicate, Delete)
- Hover: Lift + shadow effect

---

### 2. Project Overview / Book Dashboard

**Purpose**: Manage chapters and book structure

**Layout**:
```
┌────────┬──────────────────────────────────────────────────┐
│        │  Header: Book Title + Status + Export Button    │
│        ├──────────────────────────────────────────────────┤
│  Nav   │                                                  │
│        │  ┌────────────────────────────────────────┐      │
│ Active:│  │  Chapter 1: Introduction               │      │
│ Outline│  │  ├─ Section 1.1                        │      │
│        │  │  └─ Section 1.2                        │      │
│        │  ├────────────────────────────────────────┤      │
│        │  │  Chapter 2: Background                 │      │
│        │  │  ├─ Section 2.1                        │      │
│        │  │  └─ Section 2.2                        │      │
│        │  ├────────────────────────────────────────┤      │
│        │  │  + Add Chapter                         │      │
│        │  └────────────────────────────────────────┘      │
│        │                                                  │
└────────┴──────────────────────────────────────────────────┘
```

**Features**:
- Drag handles on each chapter (left side)
- Click chapter → navigate to editor
- Inline edit chapter titles
- Status badges on each chapter
- Word count per chapter
- Expand/collapse sections
- Right-click context menu

---

### 3. Editor View

**Purpose**: Write and edit chapter content

**Layout**:
```
┌────────┬──────────────────────────────────┬──────────────┐
│        │  Toolbar (Fixed)                 │              │
│ Outline│  [B I U] | [H1 H2] | [AI ▼]     │  AI Panel    │
│        ├──────────────────────────────────┤              │
│ Ch 1   │                                  │  ┌─────────┐ │
│ ├─1.1  │  # Chapter Title                │  │ Suggest │ │
│ ├─1.2  │                                  │  │ next    │ │
│ └─1.3  │  Start writing here...           │  │ para    │ │
│        │                                  │  └─────────┘ │
│ Ch 2   │  The content flows naturally     │              │
│ ├─2.1  │  with generous line spacing      │  ┌─────────┐ │
│ └─2.2  │  and optimal reading width.      │  │ Rewrite │ │
│        │                                  │  │ for...  │ │
│ Ch 3   │  [Continue editing...]           │  └─────────┘ │
│        │                                  │              │
└────────┴──────────────────────────────────┴──────────────┘
```

**Toolbar Sections**:
1. **Text Formatting**: Bold, Italic, Underline, Strikethrough
2. **Headings**: H1, H2, H3, Paragraph
3. **Lists**: Bullet, Numbered
4. **Insert**: Link, Image, Citation, Note
5. **AI Tools**: Dropdown with all AI operations

**Editor Specs**:
- Max width: `65ch` (optimal reading)
- Centered horizontally
- Font: Serif for body, Sans for headings
- Line height: 1.625 (relaxed)
- Autosave indicator in toolbar

**Right Panel (Collapsible)**:
- AI suggestions
- Research notes (contextual)
- Comments thread
- Chapter statistics

---

### 4. Research Vault

**Purpose**: Organize research materials

**Layout**:
```
┌────────┬──────────────────────────────────────────────────┐
│        │  Header: "Research Vault" + Upload Button       │
│  Nav   ├──────────┬───────────────────────────────────────┤
│        │          │                                       │
│ Active:│  Tags    │  ┌─────────────────────────────┐     │
│Research│  ☑ All   │  │ Research Note Title         │     │
│        │  ☐ Climate│  │ Tags: climate, data         │     │
│        │  ☐ Data  │  │ Excerpt: Lorem ipsum...     │     │
│        │  ☐ Policy│  │ [View] [Summarize] [Edit]   │     │
│        │          │  └─────────────────────────────┘     │
│        │  + Tag   │                                       │
│        │          │  ┌─────────────────────────────┐     │
│        │          │  │ Research Note Title         │     │
│        │          │  │ PDF attached (climate.pdf)  │     │
│        │          │  │ [View] [Summarize] [Edit]   │     │
│        │          │  └─────────────────────────────┘     │
│        │          │                                       │
└────────┴──────────┴───────────────────────────────────────┘
```

**Features**:
- Filter by tags (multi-select)
- Search across all notes
- Upload PDF → auto-summarize
- Click note → expand in modal
- Drag note into editor → insert reference

---

### 5. AI Interaction Flows

#### Flow 1: Generate Chapter Outline

```
┌─────────────────────────────────────────────────┐
│  Generate Chapter Outline                       │
├─────────────────────────────────────────────────┤
│                                                 │
│  Topic:                                         │
│  ┌───────────────────────────────────────────┐ │
│  │ Climate Change Impact on Biodiversity    │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  Purpose:                                       │
│  ┌───────────────────────────────────────────┐ │
│  │ Educational overview for general public  │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  Target Length: ● 1000  ○ 2000  ○ 3000 words   │
│  Tone: ● Academic  ○ Professional  ○ Casual    │
│                                                 │
│         [Cancel]  [Generate Outline]           │
└─────────────────────────────────────────────────┘
```

**After Generation**:
- Outline appears in editor
- Each section expandable
- "Generate draft for section" buttons
- Accept/Edit/Regenerate options

#### Flow 2: Rewrite Text

**Interaction**:
1. User selects text in editor
2. Floating toolbar appears above selection
3. "Rewrite" button with dropdown:
   - Clarify
   - Condense
   - Expand with examples
   - Make more technical
   - Make more accessible
   - Change tone...
4. Click option → AI processes
5. Result shown in side-by-side view
6. Accept/Reject buttons

**Visual**:
```
┌──────────────────────┬──────────────────────┐
│  Original            │  AI Rewrite          │
│  ─────────────       │  ─────────────       │
│  [Original text...]  │  [Rewritten text...] │
│                      │                      │
│                      │  Confidence: 85%     │
│                      │                      │
│                      │  [Accept] [Reject]   │
└──────────────────────┴──────────────────────┘
```

#### Flow 3: AI Ghostwriter (Assist Mode)

**Interaction**:
- User writing in editor
- AI panel shows "Continue writing?" suggestion
- Click → AI generates next paragraph
- Shown as ghost text (gray, italic)
- Tab to accept, Esc to reject

**Visual**:
```
Your written text here.

[AI suggestion in gray italic...]
This continues the thought naturally.

[Tab to accept | Esc to dismiss]
```

---

### 6. Comments & Collaboration

**Layout** (in Editor):
```
┌──────────────────────────────────────────────────┐
│  Editor content...                               │
│                                                  │
│  This text has a comment attached. ⁽¹⁾           │
│                                                  │
│  More content...                                 │
└──────────────────────────────────────────────────┘

Right Panel:
┌────────────────────────────┐
│ Comments                   │
├────────────────────────────┤
│ ⁽¹⁾ Jane Doe               │
│    "Should we add data?"   │
│                            │
│    You (reply):            │
│    ┌────────────────────┐ │
│    │ [Type reply...]    │ │
│    └────────────────────┘ │
│    [Reply] [Resolve]       │
└────────────────────────────┘
```

**Features**:
- Click highlighted text → jump to comment
- Add comment → select text, click "+" icon
- Threaded replies
- Resolve button → grays out comment
- Filter: All / Open / Resolved

---

### 7. Export Modal

**Layout**:
```
┌─────────────────────────────────────────────────┐
│  Export "Your Book Title"                       │
├─────────────────────────────────────────────────┤
│                                                 │
│  Format:                                        │
│  ● Markdown  ○ Microsoft Word  ○ PDF           │
│                                                 │
│  Include:                                       │
│  ☑ Table of Contents                            │
│  ☑ Chapter headings                             │
│  ☑ Research notes (as appendix)                 │
│  ☑ Citations (as footnotes)                     │
│  ☐ Comments                                     │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ Preview export structure...             │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│         [Cancel]  [Export]                      │
└─────────────────────────────────────────────────┘
```

**After Export**:
- Progress bar (if processing takes >2s)
- Download automatically starts
- Toast: "Export complete! File downloading..."

---

## Interactive States & Animations

### Loading States

**Skeleton Loaders**:
- Project cards: Pulsing gray boxes
- Chapter list: Lines of varying width
- Editor: Full-height shimmer

**Spinners**:
- Button states: Small spinner replaces text
- Page loading: Centered spinner with logo
- AI processing: Gradient spinner with "Thinking..."

### Transitions

**Page Navigation**:
- Fade out current → Fade in next (200ms)
- No jarring content shifts

**Modal Enter/Exit**:
- Backdrop fade in (300ms)
- Modal scale from 0.95 → 1.0 (300ms, spring easing)
- Exit: Reverse

**Sidebar Drawer** (mobile):
- Slide from left (250ms)
- Backdrop fade in
- Body scroll locked

**AI Suggestions Appearing**:
- Slide up from bottom + fade in (400ms)
- Gentle bounce at end (spring easing)

### Micro-interactions

**Button Click**:
- Scale down to 0.95 on press
- Return to 1.0 on release

**Card Hover**:
- Lift up 2px
- Shadow intensifies
- Border color changes
- Duration: 200ms

**Drag & Drop**:
- Item follows cursor
- Semi-transparent ghost
- Drop zone highlights (blue border)
- Smooth reordering animation

---

## Error States

### Form Validation Errors

**Visual**:
```
┌─────────────────────────────────────────────┐
│  Chapter Title                              │
│  ┌───────────────────────────────────────┐ │
│  │                                       │ │ ← Red border
│  └───────────────────────────────────────┘ │
│  ⚠ Title is required                       │ ← Red text
└─────────────────────────────────────────────┘
```

### API Errors

**Toast Notification**:
- Red accent border
- X icon
- Error message: "Failed to save. Retrying..."
- Retry button

### Network Offline

**Full-page Overlay**:
```
┌─────────────────────────────────────────────┐
│                                             │
│           🔌                                │
│      You're offline                         │
│                                             │
│  Your work is saved locally.                │
│  Changes will sync when you reconnect.      │
│                                             │
│         [Try Again]                         │
│                                             │
└─────────────────────────────────────────────┘
```

---

## Keyboard Shortcuts

### Global Shortcuts

- `Cmd/Ctrl + K`: Command palette
- `Cmd/Ctrl + N`: New chapter
- `Cmd/Ctrl + P`: Project search
- `Cmd/Ctrl + /`: Toggle sidebar
- `Cmd/Ctrl + \`: Toggle right panel
- `Cmd/Ctrl + ,`: Settings

### Editor Shortcuts

- `Cmd/Ctrl + B`: Bold
- `Cmd/Ctrl + I`: Italic
- `Cmd/Ctrl + Shift + A`: AI assist
- `Cmd/Ctrl + Shift + R`: Rewrite selection
- `Cmd/Ctrl + Alt + C`: Add comment
- `Cmd/Ctrl + S`: Save (auto-saves already)

### Navigation Shortcuts

- `Cmd/Ctrl + 1-9`: Switch between chapters
- `Alt + Up/Down`: Move between sections
- `Cmd/Ctrl + Shift + F`: Focus search

---

## Accessibility Features

### Screen Reader Support

- Landmark regions: `<nav>`, `<main>`, `<aside>`
- Heading hierarchy: Proper H1-H6 structure
- Alt text on all images
- ARIA labels on icon buttons
- Live regions for AI status updates

### Keyboard Navigation

- All features accessible via keyboard
- Focus indicators on all interactive elements
- Modal focus trap
- Skip links

### High Contrast Mode

- Respects system preference
- All text meets WCAG AA contrast ratios
- Focus indicators highly visible

---

**Version**: 1.0  
**Last Updated**: 2025-12-07  
**Maintained By**: The Brain Design Team

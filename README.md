# **1. MVP Feature Set — Non-Fiction AI Authoring Platform**

## **1. Core Drafting Engine**

### **1.1. Structured Chapter/Section Generator**

* User enters topic + purpose → system outputs chapter outline.
* Click-to-expand: generate subsections, summaries, bullet points.

### **1.2. Fact-Driven Paragraph Generator**

* Takes user notes or bullets → expands into coherent prose.
* Includes inline source suggestions or citations (not verified automatically, just suggested).

### **1.3. Rewrite & Transform Tools**

* “Clarify”
* “Condense”
* “Expand with examples”
* “Make more technical”
* “Make more accessible”
* “Turn bullets into narrative”
* “Turn narrative into bullets”

### **1.4. Voice & Style Controls**

* Presets: academic, professional, journalistic, narrative nonfiction, punchy business writing.
* User can upload a few samples → mimic voice.

---

## **2. Research Assistance**

### **2.1. Quick Fact Panels**

* User highlights text → “Get background info” panel.
* Return: definitions, context, timelines, concept breakdown.

### **2.2. Citation Builder**

* Suggests likely sources (title, author, year).
* Semi-automatic bibliography generation (APA, MLA, Chicago).

### **2.3. Source Consistency Checker (Lite)**

* Flags claims that usually require citations.
* Alerts for outdated stats or weasel terms.

*Note: No live web crawling needed for MVP — can be model-based heuristics.*

---

## **3. Organizational Tools**

### **3.1. Book Dashboard**

* High-level outline.
* Drag-and-drop restructuring.
* Status markers: “drafted,” “needs research,” “needs edit.”

### **3.2. Knowledge Vault / Research Notes**

* User stores clippings, quotes, facts, summaries.
* AI can reference these when writing.

### **3.3. Cross-Chapter Consistency Assistant**

* Tracks key terms, definitions, data points.
* Flags contradictions.

---

## **4. Collaborative Features**

### **4.1. Multi-Author Concurrency (Lightweight)**

* Shared project.
* Commenting.
* Simple version history (not full Git).

### **4.2. AI Ghostwriter Mode**

* Two modes:

  * **Assist Mode:** user writes, AI suggests next paragraph.
  * **Ghost Mode:** AI produces full drafts based on outline sections.

---

## **5. UX & Workflow**

### **5.1. Distraction-Free Editor**

* Markdown or rich text.
* Side-by-side outline + chapter view.

### **5.2. “Ask the Book” Query**

* Users can ask: “Where did I mention X?” → returns relevant sections.

### **5.3. Export**

* Markdown
* Word
* PDF (basic)
* Scrivener (optional but useful)

---

## **6. AI Safety / Accuracy Controls**

### **6.1. Claim Uncertainty Tagging**

* AI labels lines with:

  * “Likely factual”
  * “Needs source”
  * “Speculative phrasing”

### **6.2. Fact-Lock**

* Users can lock verified statements.
* AI cannot rewrite them without explicit override.

---

## **7. Authentication & Infrastructure (Minimum)**

* Email + password auth.
* Project storage (Postgres or SQLite + object store).
* API layer for model interactions.

---

# **What You *Do Not* Need for MVP**

* Full citations with verified URLs.
* Real-time internet search.
* Advanced graphics or diagrams.
* Full publishing tools (layout, covers).
* Marketplace or community features.

---

# **2. Technical Architecture (Direct, High-Level, Implementable)**

## **Core System Architecture**

**Frontend:**

* React (Next.js recommended)
* TipTap or Lexical for rich-text editing
* WebSocket layer for multi-author collaboration (Ot.js or Y.js)

**Backend:**

* FastAPI / Node (Express or Nest) for API
* Background workers (Celery / BullMQ) for long-running requests
* Authentication (JWT + refresh tokens)

**Database:**

* PostgreSQL for structured data:

  * Projects
  * Chapters
  * Notes
  * User profiles
  * Versions
* Object storage (S3-compatible) for research documents, file uploads

**AI Layer:**

* One service wrapper that supports multiple LLMs.
* Abstractions:

  * `generate_chapter()`
  * `expand_bullets()`
  * `research_summary()`
  * `rewrite_text(style)`
  * `consistency_check()`
* Allow model swapping: OpenAI, Anthropic, Gemini, local LLMs.

**Document Model**
Each book contains:

* Outline (JSON tree)
* Chapters (Markdown or HTML)
* Metadata
* Research notes
* Citation objects
* AI generation logs

**Editor Architecture**

* Left pane: outline
* Center: editor
* Right pane: AI tools + research + citations

**Versioning**

* Per-chapter version snapshots.
* Diff view: JSON-diff for outline, text-diff for content.
* Soft-deletes on all content.

**Collaboration**

* CRDTs via Y.js or Automerge
* Realtime cursors
* Comment threads tied to text ranges

**Compute**

* Stateless backend servers + horizontal scaling
* AI calls routed through a job queue when >10s
* Local caching of recent AI completions (Redis)

**Security**

* Rate-limiting per-user
* Audit logs for admin
* Minimal personally identifiable data stored
* Encryption at rest for user-generated research files

---

# **3. Full Product Requirements Document (PRD) — “Non-Fiction AI Ghostwriter Platform”**

Below is a **complete, copyable PRD in Markdown**.

---

## **Product Requirements Document (PRD)**

## **Project: Non-Fiction AI Ghostwriting Platform (MVP)**

## **Version: 0.1**

---

## **1. Overview**

A web-based platform that helps non-fiction authors plan, research, draft, and revise books with AI. Inspired by Sudowrite but optimized for factual writing, structure, clarity, and voice consistency.

---

## **2. Goals**

* Speed up non-fiction book production.
* Improve clarity, structure, and research quality.
* Support multi-author teams.
* Eliminate repetitive drafting tasks.
* Enable AI-assisted but human-directed writing.

---

## **3. Non-Goals (MVP)**

* No real-time web research.
* No automated fact verification.
* No advanced publishing/layout workflows.
* No marketplace or community features.

---

## **4. Target Users**

* Non-fiction authors
* Business authors
* Memoir writers
* Thought leaders and content creators
* Editors and book coaches
* Multi-author research teams

---

## **5. User Stories**

### **5.1 Drafting**

* “I want the AI to turn my outline into draft-level text.”
* “I want to convert raw notes into polished prose.”
* “I want to rewrite paragraphs in different styles.”

### **5.2 Research**

* “I want a place to store my research snippets.”
* “I want AI to summarize reference material I upload.”
* “I want help finding where I need citations.”

### **5.3 Organization**

* “I want to see my book outline and reorganize chapters easily.”
* “I want AI to ensure I don’t contradict myself across chapters.”

### **5.4 Collaboration**

* “I want multiple authors to work in one project.”
* “I want to track edits, comments, and versions.”

### **5.5 Exporting**

* “I want clean Markdown or DOCX exporting for editors/publishers.”

---

## **6. Feature Requirements**

## **6.1 Drafting Engine**

**Functional Requirements:**

* Generate initial drafts from chapter titles + outlines.
* Expand user-provided bullets into paragraphs.
* Rewrite text for clarity, tone, depth, or accessibility.
* Style presets: academic, journalistic, narrative, business.
* Custom voice modeling (small sample upload).

**Acceptance Criteria:**

* User can input bullets and receive 3–7 paragraphs.
* System returns rewrites in <6 seconds for 500 words.

---

## **6.2 Research Assistant**

**Functional Requirements:**

* Research vault where users store text snippets, facts, quotes.
* AI summaries of uploaded PDFs/text (first 10 pages for MVP).
* Inline side panel offering:

  * Background knowledge
  * Concept breakdown
  * Suggested citations (title, author, year only)

**Acceptance Criteria:**

* Highlight → “Explain this” returns a reference panel ≤4 seconds.
* Upload ≤10MB PDF → summary generated.

---

## **6.3 Organizational Tools**

**Functional Requirements:**

* Book dashboard showing chapter/section hierarchy.
* Drag-and-drop reordering.
* “Ask the Book” query search.
* Consistency checker:

  * Flags terms used inconsistently
  * Flags numbers/data inconsistencies
  * Flags repeated paragraphs

**Acceptance Criteria:**

* Outline updates reflect immediately in editor.
* Query response returns relevant passages with scores.

---

## **6.4 Collaboration**

**Functional Requirements:**

* Multi-author editing with presence indicators.
* Comment threads.
* Version history with snapshot compare.

**Acceptance Criteria:**

* Edits show in <200ms to collaborators.
* Users can revert to any saved version.

---

## **6.5 Editor**

**Functional Requirements:**

* Rich-text or Markdown editing.
* Split view: outline | editor | assistant.
* Dark/light mode.
* Autosave.

**Acceptance Criteria:**

* Edits saved within 100ms.
* Editor handles 50,000+ words without slowdown.

---

## **6.6 Export**

**Functional Requirements:**

* Export to Markdown and DOCX.
* Preserve headings, lists, footnotes.

**Acceptance Criteria:**

* DOCX imports cleanly into Word with correct hierarchy.

---

## **7. Data Model**

### **Project**

* id
* owner_user_id
* title
* metadata JSON
* created_at
* updated_at

### **Chapter**

* id
* project_id
* title
* slug
* order
* content (Markdown)
* version_id

### **ResearchNote**

* id
* project_id
* title
* content
* source_url (optional)
* tags
* uploaded_file_path

### **Version**

* id
* chapter_id
* content_snapshot

---

## **8. Technical Requirements**

* REST + WebSocket hybrid.
* AI abstraction layer with model-agnostic API.
* Redis caching for recent completions.
* S3-compatible storage for uploads.
* CRDT-based collaborative editing.

---

## **9. Performance Requirements**

* AI operations <8 seconds.
* Editor stable with 80k+ word manuscripts.
* Collaboration latency <200ms.

---

## **10. Security Requirements**

* JWT auth.
* HTTPS mandatory.
* Encrypt all file uploads.
* Soft-delete all content with restore period.

---

## **11. Analytics (Optional for MVP)**

* Track feature usage.
* Track time spent drafting vs. rewriting.
* Track chapter-level velocity.

---
Below is **#5: System Diagrams** — provided as **ASCII architecture + sequence diagrams** you can paste directly into docs, GitHub, or engineering specs.

No fluff. No narrative. Just clean diagrams.

---

# **4. System Diagrams**

---

## **4.1 High-Level Architecture Diagram (ASCII)**

```
                     ┌────────────────────────┐
                     │        Frontend        │
                     │  (Next.js / React)     │
                     │                        │
                     │  • Editor (TipTap)     │
                     │  • Outline Panel       │
                     │  • Research Panel      │
                     │  • Collaboration UI    │
                     └────────────┬───────────┘
                                  │
                                  │ HTTPS / WSS
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        │                         │                         │
        ▼                         ▼                         ▼
┌──────────────┐        ┌──────────────────┐       ┌──────────────────┐
│  API Server  │        │ Collaboration Svc│       │  AI Gateway Svc  │
│ (FastAPI/TS) │        │   (Y.js/CRDT)    │       │ (Model Abstraction)
│              │        │                  │       │                  │
│• Auth        │        │• Sync docs       │       │• Draft generation│
│• CRUD ops    │        │• Presence        │       │• Rewrites        │
│• Exports     │        │• Text diffs      │       │• Summaries       │
└──────┬───────┘        └─────────┬────────┘       └─────────┬────────┘
       │                           │                          │
       │                           │                          │
       ▼                           ▼                          ▼
┌──────────────┐        ┌──────────────────┐       ┌──────────────────┐
│   Postgres   │        │     Redis        │       │     Worker Pool  │
│ Projects     │        │ Collaboration    │       │  (Background AI  │
│ Chapters     │        │ Cache            │       │   Jobs > 10s)    │
│ Notes        │        └──────────────────┘       └──────────────────┘
└──────┬───────┘                                           │
       │                                                   │
       ▼                                                   ▼
┌──────────────────┐                             ┌────────────────────┐
│   Object Store    │                             │ AI Providers (LLMs)│
│    (S3, etc.)     │<----------------------------▶ OpenAI / Anthropic │
│ Research PDFs     │                             │ Gemini / Local LLM │
└──────────────────┘                             └────────────────────┘
```

---

## **4.2 Sequence Diagram — “User Generates a Chapter Draft”**

```
User         Frontend         API Server         AI Gateway       Model Provider
 |               |                |                   |                 |
 | Click "Draft"|                |                   |                 |
 |-------------->|                |                   |                 |
 |               | POST /draft    |                   |                 |
 |               |--------------->|                   |                 |
 |               |                | Validate input    |                 |
 |               |                |------------------>|                 |
 |               |                |                   |  Build prompt   |
 |               |                |                   |---------------->|
 |               |                |                   |                 |
 |               |                |                   |<----------------|
 |               |                |                   |   AI response   |
 |               |                |   Return draft    |                 |
 |               |<---------------|                   |                 |
 |  Render text  |                |                   |                 |
 |<--------------|                |                   |                 |
```

---

## **4.3 Sequence Diagram — “User & Co-Author Edit Simultaneously”**

```
Author A        Frontend A      Collab Svc      Redis Cache      Frontend B     Author B
    |               |               |               |               |             |
    | Type text     |               |               |               |             |
    |-------------->|               |               |               |             |
    |               | CRDT update   |               |               |             |
    |               |-------------->|               |               |             |
    |               |               | Store update  |               |             |
    |               |               |-------------->|               |             |
    |               |               |               | Push update   |             |
    |               |               |<--------------|               |             |
    |               | Broadcast change              |               |             |
    |               |---------------------------------------------->|             |
    |               |                                              | Render diff |
    |               |<----------------------------------------------|------------|
```

---

## **4.4 Sequence Diagram — “AI Summarizes Uploaded Research PDF”**

```
User        Frontend        API Server    Object Storage     Worker Pool       AI Provider
 |             |               |               |                 |                 |
 | Upload PDF  |               |               |                 |                 |
 |------------>|               |               |                 |                 |
 |             | PUT /upload   |               |                 |                 |
 |             |-------------->|               |                 |                 |
 |             |               | Upload file   |                 |                 |
 |             |               |-------------->|                 |                 |
 |             |               |               | Return URL      |                 |
 |             |<- - - - - - - |               |                 |                 |
 | Request summary             |               |                 |                 |
 |------------>|               |               |                 |                 |
 |             | POST /summ    |               |                 |                 |
 |             |-------------->| Queue job     |                 |                 |
 |             |               |-------------->|                 |                 |
 | Show spinner |              |               |                 |                 |
 |             |               |               | Worker fetch PDF|                 |
 |             |               |               |---------------->| Process PDF     |
 |             |               |               |                 |---------------->|
 |             |               |               |                 |   AI response   |
 |             |               |               |                 |<----------------|
 | Poll status |               | Return summary|                 |                 |
 |<------------|               |<--------------|                 |                 |
 | Display     |               |               |                 |                 |
```

---

## **4.5 Data Flow Diagram — “Writing Session”**

```
+---------------+          +----------------+          +----------------+
|   User Input  |  ----->  |   Frontend     |  ----->  |   API Server   |
+---------------+          +----------------+          +----------------+
                                 |                             |
                                 v                             v
                          +-------------+              +----------------+
                          |  Local CRDT | <--------->  | Collab Service |
                          +-------------+              +----------------+
                                 |                             |
                                 v                             v
                          +-------------+              +----------------+
                          | Redis Cache | <---------→  |   Postgres    |
                          +-------------+              +----------------+
                                 |
                                 v
                           +----------+
                           | LLM Calls|
                           +----------+
                                 |
                                 v
                         +----------------+
                         | Model Provider |
                         +----------------+
```

---

## **4.6 Component Interaction Diagram**

```
                ┌──────────────┐
                │   Frontend   │
                └──────┬───────┘
                       │
                       ▼
          ┌──────────────────────────┐
          │        API Layer         │
          │  Auth / CRUD / Export    │
          └──────┬───────────────────┘
                 │
   ┌─────────────┴───────────────┐
   │                             │
   ▼                             ▼
┌─────────────┐          ┌────────────────┐
│ AI Gateway  │          │ Collaboration  │
│ Drafting    │          │ Y.js / CRDT    │
│ Summaries   │          └────────────────┘
└──────┬──────┘                 │
       │                        │
       ▼                        ▼
┌─────────────┐         ┌────────────────┐
│ Worker Pool │         │ Redis / Cache  │
└──────┬──────┘         └────────────────┘
       │
       ▼
┌─────────────┐
│ AI Provider │
└─────────────┘
```



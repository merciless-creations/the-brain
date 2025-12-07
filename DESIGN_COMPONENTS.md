# Design Components

## Component Library

This document defines the visual design and behavior of all UI components in The Brain platform.

---

## Buttons

### Primary Button

**Purpose**: Main actions, CTAs

**Visual Specs**:
- Background: `var(--primary-500)`
- Text: `var(--text-inverse)`
- Font: `var(--font-medium)`, `var(--text-base)`
- Padding: `var(--padding-btn)`
- Border Radius: `var(--radius-sm)`
- Shadow: `var(--shadow-sm)`
- Transition: `var(--transition-colors)`

**States**:
```css
/* Default */
background: var(--primary-500);
color: var(--text-inverse);

/* Hover */
background: var(--primary-600);
transform: translateY(-1px);
box-shadow: var(--shadow-md);

/* Active */
background: var(--primary-700);
transform: translateY(0);

/* Disabled */
background: var(--primary-400);
opacity: 0.5;
cursor: not-allowed;

/* Loading */
/* Show spinner, disable interaction */
```

### Secondary Button

**Purpose**: Secondary actions

**Visual Specs**:
- Background: `transparent`
- Border: `1px solid var(--neutral-300)`
- Text: `var(--text-primary)`
- Hover: `background: var(--neutral-100)`

### Ghost Button

**Purpose**: Tertiary actions, icon buttons

**Visual Specs**:
- Background: `transparent`
- Text: `var(--text-secondary)`
- Hover: `background: var(--neutral-100)`, `color: var(--text-primary)`

### AI Action Button

**Purpose**: AI-powered features

**Visual Specs**:
- Background: `linear-gradient(135deg, var(--secondary-500), var(--primary-500))`
- Text: `white`
- Icon: Sparkle/wand icon
- Animation: Subtle shimmer on hover

### Sizes

```css
/* Small */
padding: var(--padding-btn-sm);
font-size: var(--text-sm);

/* Medium (default) */
padding: var(--padding-btn);
font-size: var(--text-base);

/* Large */
padding: var(--padding-btn-lg);
font-size: var(--text-lg);
```

---

## Input Fields

### Text Input

**Visual Specs**:
- Background: `var(--bg-primary)`
- Border: `1px solid var(--neutral-300)`
- Text: `var(--text-primary)`
- Padding: `var(--padding-input)`
- Border Radius: `var(--radius-sm)`
- Font: `var(--font-sans)`, `var(--text-base)`

**States**:
```css
/* Default */
border-color: var(--neutral-300);

/* Focus */
border-color: var(--primary-500);
box-shadow: var(--focus-ring);

/* Error */
border-color: var(--accent-red);

/* Disabled */
background: var(--neutral-100);
cursor: not-allowed;
```

### Textarea

Same as text input, with:
- Min height: `6rem` (96px)
- Resize: `vertical` only
- Line height: `var(--leading-relaxed)`

### Select Dropdown

- Same styling as text input
- Custom dropdown icon (chevron-down)
- Dropdown menu: Card style with shadow

---

## Cards

### Base Card

**Purpose**: Container for related content

**Visual Specs**:
- Background: `var(--bg-elevated)`
- Border: `1px solid var(--neutral-200)`
- Border Radius: `var(--radius-md)`
- Padding: `var(--padding-card)`
- Shadow: `var(--shadow-sm)`
- Transition: `var(--transition-all)`

**Hover State** (if interactive):
```css
transform: translateY(-2px);
box-shadow: var(--shadow-lg);
border-color: var(--primary-200);
```

### Chapter Card

**Purpose**: Represents a chapter in the dashboard

**Visual Specs**:
- Extends base card
- Header: Chapter number + title
- Body: Excerpt (3 lines, truncated)
- Footer: Status badge + word count
- Draggable handle indicator

**States**:
- `draft`: Border color `var(--neutral-300)`
- `needs-research`: Border color `var(--accent-blue)`
- `needs-edit`: Border color `var(--accent-yellow)`
- `final`: Border color `var(--accent-green)`

### AI Suggestion Card

**Purpose**: Displays AI-generated content

**Visual Specs**:
- Background: `gradient from var(--primary-50) to var(--secondary-50)`
- Border: `1px solid var(--primary-200)`
- Corner badge: "AI" with sparkle icon
- Accept/Reject buttons at bottom

---

## Editor Components

### Editor Container

**Layout**:
```
┌─────────────────────────────────────────────┐
│  Toolbar (Fixed)                            │
├─────────────────────────────────────────────┤
│                                             │
│  Editor Content (Scrollable)                │
│  - Serif font for body text                │
│  - Generous line height                    │
│  - Max width: 65ch (optimal reading)       │
│                                             │
└─────────────────────────────────────────────┘
```

**Visual Specs**:
- Background: `var(--bg-primary)`
- Content font: `var(--font-serif)`
- Content size: `var(--text-lg)`
- Line height: `var(--leading-relaxed)`
- Max width: `65ch` (centered)
- Padding: `var(--spacing-12)` horizontal

### Toolbar

**Visual Specs**:
- Background: `var(--bg-secondary)`
- Border bottom: `1px solid var(--neutral-200)`
- Padding: `var(--spacing-3)` vertical
- Sticky positioning
- Z-index: `var(--z-sticky)`

**Button Groups**:
- Separated by divider (`|`)
- Icon buttons with tooltips
- Active state: `background: var(--primary-100)`

### Floating Toolbar

**Purpose**: Context menu for text selection

**Visual Specs**:
- Background: `var(--neutral-900)` (dark theme always)
- Text: `white`
- Border Radius: `var(--radius-md)`
- Shadow: `var(--shadow-xl)`
- Padding: `var(--spacing-2)`
- Position: Above selection
- Animation: Fade in + scale from 0.95

---

## Sidebar / Navigation

### Main Sidebar

**Layout**:
```
┌──────────────┐
│ Logo         │
├──────────────┤
│ Nav Items    │
│              │
│              │
│              │
├──────────────┤
│ User Menu    │
└──────────────┘
```

**Visual Specs**:
- Width: `16rem` (256px)
- Background: `var(--bg-secondary)`
- Border right: `1px solid var(--neutral-200)`
- Fixed position

**Nav Item**:
```css
/* Default */
padding: var(--spacing-3) var(--spacing-4);
color: var(--text-secondary);
border-radius: var(--radius-sm);

/* Hover */
background: var(--neutral-100);
color: var(--text-primary);

/* Active */
background: var(--primary-100);
color: var(--primary-700);
font-weight: var(--font-medium);
```

### Outline Panel

**Purpose**: Chapter/section navigation

**Visual Specs**:
- Width: `18rem` (288px)
- Collapsible
- Nested items indented by `var(--spacing-4)`
- Drag handles visible on hover
- Active item highlighted

---

## Modals & Dialogs

### Modal Container

**Visual Specs**:
- Background: `var(--bg-elevated)`
- Border Radius: `var(--radius-lg)`
- Shadow: `var(--shadow-2xl)`
- Padding: `var(--spacing-6)`
- Max width: `32rem` (512px) for small, `48rem` (768px) for large
- Animation: Fade in + scale from 0.95

**Backdrop**:
```css
background: var(--bg-overlay);
backdrop-filter: blur(4px);
```

**Header**:
- Title: `var(--text-2xl)`, `var(--font-bold)`
- Close button: Ghost style, top-right

**Footer**:
- Right-aligned buttons
- Primary + Secondary actions

### Confirmation Dialog

**Purpose**: Destructive actions

**Visual Specs**:
- Small modal
- Icon: Warning triangle (red)
- Primary button: Red (destructive)
- Message: Bold, clear consequences

---

## Badges & Pills

### Status Badge

**Purpose**: Display status indicators

**Visual Specs**:
- Font: `var(--text-xs)`, `var(--font-medium)`
- Padding: `var(--spacing-1) var(--spacing-3)`
- Border Radius: `var(--radius-full)`
- Text: Uppercase

**Variants**:
```css
/* Draft */
background: var(--neutral-100);
color: var(--neutral-700);

/* Needs Research */
background: var(--accent-blue) / 10%;
color: var(--accent-blue);

/* Needs Edit */
background: var(--accent-yellow) / 10%;
color: var(--accent-yellow);

/* Final */
background: var(--accent-green) / 10%;
color: var(--accent-green);

/* AI Generated */
background: linear-gradient(135deg, var(--secondary-500), var(--primary-500));
color: white;
```

### Count Badge

**Purpose**: Notification counts

**Visual Specs**:
- Size: `1.25rem` (20px) diameter
- Background: `var(--accent-red)`
- Text: `white`, `var(--text-xs)`, `var(--font-bold)`
- Position: Top-right of parent
- Min width: `1.25rem` (expands for 10+)

---

## Loading States

### Spinner

**Visual Specs**:
- Size: `1.5rem` (24px)
- Border: `2px solid var(--neutral-200)`
- Border top: `2px solid var(--primary-500)`
- Border Radius: `var(--radius-full)`
- Animation: 360° rotation, 0.6s

### Skeleton Loader

**Purpose**: Content placeholders

**Visual Specs**:
- Background: `var(--neutral-200)`
- Border Radius: `var(--radius-sm)`
- Animation: Shimmer effect (light sweep)

**Variants**:
- Text line: Height `1rem`, varying widths
- Card: Full card dimensions
- Circle: Avatar placeholder

### Progress Bar

**Visual Specs**:
- Height: `0.5rem` (8px)
- Background: `var(--neutral-200)`
- Fill: `var(--primary-500)`
- Border Radius: `var(--radius-full)`
- Animation: Smooth fill transition

---

## Tooltips & Popovers

### Tooltip

**Purpose**: Short hints on hover

**Visual Specs**:
- Background: `var(--neutral-900)`
- Text: `white`, `var(--text-sm)`
- Padding: `var(--spacing-2) var(--spacing-3)`
- Border Radius: `var(--radius-sm)`
- Shadow: `var(--shadow-md)`
- Arrow: 6px triangle pointing to target
- Max width: `16rem` (256px)

**Animation**:
- Delay: 500ms
- Fade in + slide from direction
- Duration: `var(--duration-fast)`

### Popover

**Purpose**: Additional content/actions

**Visual Specs**:
- Background: `var(--bg-elevated)`
- Border: `1px solid var(--neutral-200)`
- Border Radius: `var(--radius-md)`
- Shadow: `var(--shadow-xl)`
- Padding: `var(--spacing-4)`
- Arrow: Same as tooltip

---

## Tables

### Data Table

**Visual Specs**:
- Background: `var(--bg-primary)`
- Border: `1px solid var(--neutral-200)`
- Border Radius: `var(--radius-md)`

**Header**:
```css
background: var(--bg-secondary);
border-bottom: 1px solid var(--neutral-300);
font-weight: var(--font-semibold);
text-transform: uppercase;
font-size: var(--text-xs);
letter-spacing: 0.05em;
padding: var(--spacing-3) var(--spacing-4);
```

**Row**:
```css
padding: var(--spacing-4);
border-bottom: 1px solid var(--neutral-200);

/* Hover */
background: var(--neutral-50);

/* Selected */
background: var(--primary-50);
```

---

## Notifications / Toasts

### Toast Notification

**Position**: Top-right corner

**Visual Specs**:
- Width: `22rem` (352px)
- Background: `var(--bg-elevated)`
- Border: `1px solid var(--neutral-200)`
- Border Radius: `var(--radius-md)`
- Shadow: `var(--shadow-xl)`
- Padding: `var(--spacing-4)`

**Variants**:
```css
/* Success */
border-left: 4px solid var(--accent-green);
icon: checkmark-circle (green);

/* Error */
border-left: 4px solid var(--accent-red);
icon: x-circle (red);

/* Warning */
border-left: 4px solid var(--accent-yellow);
icon: alert-triangle (yellow);

/* Info */
border-left: 4px solid var(--accent-blue);
icon: info-circle (blue);
```

**Animation**:
- Enter: Slide from right + fade in
- Exit: Slide to right + fade out
- Auto-dismiss: 5 seconds
- Progress bar at bottom

---

## AI-Specific Components

### AI Processing Indicator

**Purpose**: Show AI is working

**Visual Specs**:
- Animated gradient background
- Pulsing sparkle icon
- Text: "AI is thinking..."
- Semi-transparent overlay over content area

### Confidence Meter

**Purpose**: Show AI confidence level

**Visual Specs**:
- Horizontal bar with gradient
- Low (red) → Medium (yellow) → High (green)
- Tooltip shows percentage

### Fact-Lock Badge

**Purpose**: Indicate locked facts

**Visual Specs**:
- Icon: Lock
- Color: `var(--accent-green)`
- Tooltip: "This fact is locked and won't be changed by AI"
- Border: Subtle green border around text

---

## Empty States

### No Content

**Visual Specs**:
- Centered vertically and horizontally
- Illustration: Simple line art (192px)
- Heading: `var(--text-2xl)`, `var(--font-semibold)`
- Description: `var(--text-base)`, `var(--text-secondary)`
- CTA button: Primary style
- Max width: `28rem` (448px)

**Examples**:
- "No chapters yet" → "Create your first chapter"
- "No research notes" → "Start adding research"
- "Search returned no results" → "Try different keywords"

---

## Responsive Behavior

### Mobile Adaptations

**<640px**:
- Sidebar collapses to drawer (slide-in from left)
- Editor full width
- Toolbar: Essential actions only, overflow menu
- Cards: Full width, reduced padding

**640px - 1024px**:
- Sidebar visible but narrower (`12rem`)
- Editor content: `60ch` max width
- Two-column layouts become single column

**1024px+**:
- Full desktop layout
- Three-panel view (sidebar, editor, panel)
- Hover states enabled

---

## Dark Mode Differences

### Key Adjustments

1. **Reduce brightness**: All colors slightly desaturated
2. **Increase contrast**: Text must be lighter for readability
3. **Soften shadows**: Use black with higher opacity
4. **Border colors**: Lighter borders (`var(--neutral-700)`)
5. **Focus rings**: Use lighter primary colors

### Dark Mode Toggle

**Visual Specs**:
- Position: User menu or toolbar
- Icon: Sun (light) / Moon (dark)
- Smooth transition: 300ms on all color properties

---

## Accessibility Patterns

### Keyboard Navigation

- All interactive elements: `tabindex` and focus states
- Modal trap: Focus locked inside modal
- Skip links: "Skip to main content"
- Arrow keys: Navigate lists and menus

### ARIA Labels

- Icon-only buttons: `aria-label`
- Complex components: `aria-labelledby`, `aria-describedby`
- Live regions: `aria-live` for toasts, AI status

### Color Independence

- Never use color alone to convey meaning
- Icons + text for status
- Patterns in charts, not just colors

---

**Version**: 1.0  
**Last Updated**: 2025-12-07  
**Maintained By**: The Brain Design Team

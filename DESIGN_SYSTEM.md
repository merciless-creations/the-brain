# Design System

## Overview

The Brain's design system is bold, modern, and writing-focused, inspired by tools like Sudowrite and AutoCrit. The interface prioritizes clarity, reduces cognitive load, and keeps writers in flow state.

## Design Philosophy

### Core Principles

1. **Writing-First**: Content is king. UI elements support, never distract.
2. **Bold & Confident**: Strong typography, clear hierarchy, purposeful color.
3. **Distraction-Free**: Minimal chrome, generous whitespace, focused layouts.
4. **Intelligent Feedback**: AI features feel helpful, not intrusive.
5. **Performance**: Smooth interactions, instant feedback, no jank.

### Inspiration

- **Sudowrite**: Bold colors, playful AI interactions, card-based UI
- **AutoCrit**: Clean analytics, clear data visualization, professional tone
- **Notion**: Flexible layouts, inline editing, smooth transitions
- **Linear**: Sharp typography, fast interactions, keyboard-first

---

## Color System

### Light Mode

#### Primary Colors
```css
--primary-500: #6366F1    /* Indigo - Primary actions, links */
--primary-600: #4F46E5    /* Hover state */
--primary-700: #4338CA    /* Active state */
--primary-400: #818CF8    /* Disabled state */
--primary-100: #E0E7FF    /* Backgrounds */
--primary-50: #EEF2FF     /* Subtle backgrounds */
```

#### Secondary Colors
```css
--secondary-500: #EC4899  /* Pink - AI features, highlights */
--secondary-600: #DB2777  /* Hover */
--secondary-400: #F472B6  /* Light accent */
--secondary-100: #FCE7F3  /* Backgrounds */
```

#### Accent Colors
```css
--accent-green: #10B981   /* Success, completion */
--accent-yellow: #F59E0B  /* Warning, needs attention */
--accent-red: #EF4444     /* Error, delete */
--accent-blue: #3B82F6    /* Info, research */
--accent-purple: #8B5CF6  /* AI processing */
```

#### Neutrals
```css
--neutral-50: #FAFAFA
--neutral-100: #F5F5F5
--neutral-200: #E5E5E5
--neutral-300: #D4D4D4
--neutral-400: #A3A3A3
--neutral-500: #737373
--neutral-600: #525252
--neutral-700: #404040
--neutral-800: #262626
--neutral-900: #171717
--neutral-950: #0A0A0A
```

#### Text Colors
```css
--text-primary: #171717       /* Body text */
--text-secondary: #525252     /* Supporting text */
--text-tertiary: #737373      /* Muted text */
--text-inverse: #FAFAFA       /* On dark backgrounds */
```

#### Background Colors
```css
--bg-primary: #FFFFFF
--bg-secondary: #FAFAFA
--bg-tertiary: #F5F5F5
--bg-elevated: #FFFFFF        /* Cards, modals */
--bg-overlay: rgba(0,0,0,0.5) /* Modal backdrop */
```

### Dark Mode

#### Primary Colors
```css
--primary-500: #818CF8    /* Lighter for contrast */
--primary-600: #6366F1    
--primary-700: #4F46E5    
--primary-400: #A5B4FC    
--primary-100: #312E81    /* Darker backgrounds */
--primary-50: #1E1B4B     
```

#### Secondary Colors
```css
--secondary-500: #F472B6  
--secondary-600: #EC4899  
--secondary-400: #F9A8D4  
--secondary-100: #831843  
```

#### Neutrals (Dark Mode)
```css
--neutral-50: #0A0A0A
--neutral-100: #171717
--neutral-200: #262626
--neutral-300: #404040
--neutral-400: #525252
--neutral-500: #737373
--neutral-600: #A3A3A3
--neutral-700: #D4D4D4
--neutral-800: #E5E5E5
--neutral-900: #F5F5F5
--neutral-950: #FAFAFA
```

#### Text Colors (Dark Mode)
```css
--text-primary: #F5F5F5
--text-secondary: #D4D4D4
--text-tertiary: #A3A3A3
--text-inverse: #171717
```

#### Background Colors (Dark Mode)
```css
--bg-primary: #0A0A0A
--bg-secondary: #171717
--bg-tertiary: #262626
--bg-elevated: #171717
--bg-overlay: rgba(0,0,0,0.8)
```

---

## Typography

### Font Families

```css
/* Headings & UI */
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;

/* Editor Content */
--font-serif: 'Merriweather', Georgia, 'Times New Roman', serif;

/* Code & Technical */
--font-mono: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
```

### Font Sizes

```css
--text-xs: 0.75rem;      /* 12px - Labels, captions */
--text-sm: 0.875rem;     /* 14px - Secondary text */
--text-base: 1rem;       /* 16px - Body text */
--text-lg: 1.125rem;     /* 18px - Large body */
--text-xl: 1.25rem;      /* 20px - Small headings */
--text-2xl: 1.5rem;      /* 24px - Headings */
--text-3xl: 1.875rem;    /* 30px - Large headings */
--text-4xl: 2.25rem;     /* 36px - Display */
--text-5xl: 3rem;        /* 48px - Hero */
```

### Font Weights

```css
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;
```

### Line Heights

```css
--leading-tight: 1.25;    /* Headings */
--leading-snug: 1.375;    
--leading-normal: 1.5;    /* Body text */
--leading-relaxed: 1.625; /* Editor content */
--leading-loose: 2;       /* Spacing emphasis */
```

### Typography Scale

```css
/* Display (Hero sections) */
.text-display {
  font-size: var(--text-5xl);
  font-weight: var(--font-extrabold);
  line-height: var(--leading-tight);
  letter-spacing: -0.02em;
}

/* Heading 1 */
.text-h1 {
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
}

/* Heading 2 */
.text-h2 {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
}

/* Heading 3 */
.text-h3 {
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  line-height: var(--leading-snug);
}

/* Body Large */
.text-body-lg {
  font-size: var(--text-lg);
  font-weight: var(--font-normal);
  line-height: var(--leading-relaxed);
}

/* Body */
.text-body {
  font-size: var(--text-base);
  font-weight: var(--font-normal);
  line-height: var(--leading-normal);
}

/* Body Small */
.text-body-sm {
  font-size: var(--text-sm);
  font-weight: var(--font-normal);
  line-height: var(--leading-normal);
}

/* Caption */
.text-caption {
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  line-height: var(--leading-normal);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

---

## Spacing System

### Scale (8pt Grid)

```css
--spacing-0: 0;
--spacing-1: 0.25rem;   /* 4px */
--spacing-2: 0.5rem;    /* 8px */
--spacing-3: 0.75rem;   /* 12px */
--spacing-4: 1rem;      /* 16px */
--spacing-5: 1.25rem;   /* 20px */
--spacing-6: 1.5rem;    /* 24px */
--spacing-8: 2rem;      /* 32px */
--spacing-10: 2.5rem;   /* 40px */
--spacing-12: 3rem;     /* 48px */
--spacing-16: 4rem;     /* 64px */
--spacing-20: 5rem;     /* 80px */
--spacing-24: 6rem;     /* 96px */
```

### Component Spacing

```css
/* Padding */
--padding-btn-sm: var(--spacing-2) var(--spacing-3);
--padding-btn: var(--spacing-3) var(--spacing-5);
--padding-btn-lg: var(--spacing-4) var(--spacing-6);

--padding-input: var(--spacing-3) var(--spacing-4);
--padding-card: var(--spacing-6);
--padding-section: var(--spacing-12);

/* Gaps */
--gap-xs: var(--spacing-2);
--gap-sm: var(--spacing-3);
--gap-md: var(--spacing-4);
--gap-lg: var(--spacing-6);
--gap-xl: var(--spacing-8);
```

---

## Border Radius

```css
--radius-sm: 0.375rem;   /* 6px - Buttons, inputs */
--radius-md: 0.5rem;     /* 8px - Cards */
--radius-lg: 0.75rem;    /* 12px - Modals */
--radius-xl: 1rem;       /* 16px - Large cards */
--radius-2xl: 1.5rem;    /* 24px - Special elements */
--radius-full: 9999px;   /* Circular */
```

---

## Shadows

### Light Mode

```css
--shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
--shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
```

### Dark Mode

```css
--shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.3);
--shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.4), 0 1px 2px -1px rgb(0 0 0 / 0.3);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.5), 0 2px 4px -2px rgb(0 0 0 / 0.4);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.6), 0 4px 6px -4px rgb(0 0 0 / 0.5);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.7), 0 8px 10px -6px rgb(0 0 0 / 0.6);
--shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.8);
```

---

## Animation & Transitions

### Duration

```css
--duration-fast: 150ms;
--duration-base: 200ms;
--duration-slow: 300ms;
--duration-slower: 500ms;
```

### Easing

```css
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
```

### Common Transitions

```css
--transition-colors: color var(--duration-base) var(--ease-out),
                     background-color var(--duration-base) var(--ease-out),
                     border-color var(--duration-base) var(--ease-out);

--transition-transform: transform var(--duration-base) var(--ease-out);

--transition-all: all var(--duration-base) var(--ease-out);

--transition-fade: opacity var(--duration-base) var(--ease-out);
```

---

## Z-Index Scale

```css
--z-base: 0;
--z-dropdown: 100;
--z-sticky: 200;
--z-fixed: 300;
--z-modal-backdrop: 400;
--z-modal: 500;
--z-popover: 600;
--z-tooltip: 700;
--z-notification: 800;
```

---

## Breakpoints

```css
/* Mobile first approach */
--screen-sm: 640px;   /* Tablet */
--screen-md: 768px;   /* Small laptop */
--screen-lg: 1024px;  /* Desktop */
--screen-xl: 1280px;  /* Large desktop */
--screen-2xl: 1536px; /* Extra large */
```

### Usage

```css
/* Mobile (default) */
.container { width: 100%; }

/* Tablet and up */
@media (min-width: 640px) {
  .container { max-width: 640px; }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .container { max-width: 1024px; }
}
```

---

## Accessibility

### Focus States

```css
--focus-ring: 0 0 0 3px var(--primary-100);
--focus-ring-dark: 0 0 0 3px var(--primary-50);

/* Apply to all interactive elements */
.focus-visible {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
}
```

### Color Contrast

All text must meet WCAG AA standards:
- Normal text: 4.5:1 contrast ratio
- Large text (18pt+): 3:1 contrast ratio
- UI components: 3:1 contrast ratio

### Screen Reader Text

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

---

## Implementation Notes

### CSS Variables Setup

```css
:root {
  color-scheme: light;
  /* Light mode variables */
}

[data-theme="dark"] {
  color-scheme: dark;
  /* Dark mode variables */
}

/* Respect system preference */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    /* Apply dark mode */
  }
}
```

### Tailwind Configuration

This design system maps directly to Tailwind CSS configuration. See `DESIGN_COMPONENTS.md` for component-specific implementations.

---

**Version**: 1.0  
**Last Updated**: 2025-12-07  
**Maintained By**: The Brain Design Team

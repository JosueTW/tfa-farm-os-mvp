# TFA Color System Reference Guide

**Version:** 2.0 (Updated January 2026)  
**Status:** Active  
**Last Updated:** January 26, 2026

---

## 📋 Overview

This document provides the complete TFA color system for developers building the Farm Operating System. All colors are defined as CSS custom properties and Tailwind utility classes.

---

## 🎨 Brand Colors

### Primary — "Cactus Green"

The signature TFA green representing growth, sustainability, and agriculture.

```css
--tfa-primary: #2B7035;
--tfa-primary-light: #3D8F47;
--tfa-primary-dark: #1F5227;
--tfa-primary-50: rgba(43, 112, 53, 0.1);
--tfa-primary-100: rgba(43, 112, 53, 0.2);
```

**Tailwind Classes:**
- `bg-tfa-primary` / `text-tfa-primary` / `border-tfa-primary`
- `bg-tfa-primary-light` / `text-tfa-primary-light`
- `bg-tfa-primary-dark` / `text-tfa-primary-dark`

**Usage:**
- Logo mark
- Success states
- Checkmarks
- Primary CTAs (light mode)
- Positive metrics (+5%, growth indicators)

**Examples:**
```tsx
<button className="bg-tfa-primary hover:bg-tfa-primary-dark text-white">
  Confirm
</button>

<div className="border-l-4 border-tfa-primary bg-tfa-primary-50 p-4">
  Success message
</div>
```

---

### Secondary — "TerraFerm Blue"

Deep blue representing energy, technology, and professionalism.

```css
--tfa-secondary: #025373;
--tfa-secondary-light: #0A6B8F;
--tfa-secondary-dark: #094C6A;
```

**Tailwind Classes:**
- `bg-tfa-secondary` / `text-tfa-secondary` / `border-tfa-secondary`
- `bg-tfa-secondary-light`
- `bg-tfa-secondary-dark`

**Usage:**
- Headlines
- Slide titles
- Informational badges
- Links (light mode)
- Secondary CTAs

**Examples:**
```tsx
<h1 className="text-4xl font-bold text-tfa-secondary">
  Farm Operations Dashboard
</h1>

<span className="inline-flex items-center px-3 py-1 bg-tfa-secondary/10 text-tfa-secondary rounded-full">
  Info
</span>
```

---

### Accent — "Teal Cyan"

Vibrant teal for highlights, active states, and drawing attention.

```css
--tfa-accent: #01E3C2;
--tfa-accent-light: #33EACD;
--tfa-accent-dark: #01AB93;
--tfa-accent-muted: #018F7B;
```

**Tailwind Classes:**
- `bg-tfa-accent` / `text-tfa-accent` / `border-tfa-accent`
- `bg-tfa-accent-light`
- `bg-tfa-accent-dark` (preferred for light mode)
- `bg-tfa-accent-muted`

**Usage:**
- Metrics and KPIs (dark mode)
- Highlights
- Active states
- Focus indicators
- Interactive elements
- Loading spinners

**Examples:**
```tsx
// Dark mode KPI card
<div className="bg-tfa-bg-secondary border-tfa-accent/20 border-2">
  <span className="text-3xl font-bold text-tfa-accent">
    1,234
  </span>
  <span className="text-tfa-text-muted">Plants Today</span>
</div>

// Active navigation item
<a className="border-l-4 border-tfa-accent bg-tfa-accent/10">
  Dashboard
</a>
```

---

### Tertiary — "Earth Gold"

Warm gold for warnings, accents, and agricultural warmth.

```css
--tfa-tertiary: #A37A51;
--tfa-tertiary-light: #B8936A;
--tfa-tertiary-dark: #8B6644;
```

**Tailwind Classes:**
- `bg-tfa-tertiary` / `text-tfa-tertiary` / `border-tfa-tertiary`
- `bg-tfa-tertiary-light`
- `bg-tfa-tertiary-dark`

**Usage:**
- Underlines
- Subtitles
- Warning accents (non-critical)
- Decorative elements
- Warm highlights

**Examples:**
```tsx
<h2 className="text-xl text-white">
  Field Observations
  <span className="block h-1 w-20 bg-tfa-tertiary mt-2"></span>
</h2>
```

---

## ⚠️ Semantic Colors

### Success

```css
--tfa-success: #2B7035; /* Same as primary */
```

**Tailwind:** `bg-success` / `text-success`

**Usage:**
- Positive outcomes
- Completed tasks ✓
- Above-target metrics
- Confirmation messages

---

### Warning

```css
--tfa-warning: #D35230;
--tfa-warning-dark: #B84520;
```

**Tailwind:** `bg-warning` / `text-warning`

**Usage:**
- Caution states
- Approaching thresholds
- Non-critical issues
- "Needs attention" states

**Example:**
```tsx
<div className="bg-warning/10 border-warning border-l-4 p-4">
  <p className="text-warning font-semibold">Warning</p>
  <p className="text-tfa-text-secondary">
    Planting rate 15% below target for 2 days
  </p>
</div>
```

---

### Error

```css
--tfa-error: #D94848;
--tfa-error-dark: #C03030;
```

**Tailwind:** `bg-error` / `text-error`

**Usage:**
- Critical issues
- Failed operations
- Pain points
- Below-target metrics (critical)

**Example:**
```tsx
<div className="bg-error/10 border-error border rounded-lg p-4">
  <p className="text-error font-semibold">Critical Alert</p>
  <p className="text-tfa-text-secondary">
    Survival rate dropped to 82% in Plot 3B
  </p>
</div>
```

---

### Info

```css
--tfa-info: #025373; /* Same as secondary */
```

**Tailwind:** `bg-info` / `text-info`

**Usage:**
- Informational messages
- Tips and suggestions
- Neutral notifications

---

## 🌗 Surface Colors

### Dark Mode (Default)

```css
html.theme-dark {
  --tfa-bg-primary: #0A0F0A;     /* Base background */
  --tfa-bg-secondary: #141A14;   /* Cards, panels */
  --tfa-bg-tertiary: #1E261E;    /* Elevated surfaces, inputs */
  --tfa-bg-elevated: #283028;    /* Highest elevation */
  
  --tfa-text-primary: #FFFFFF;   /* Headlines, body text */
  --tfa-text-secondary: #C8D0C8; /* Secondary text */
  --tfa-text-muted: #9AA89A;     /* Muted text, labels */
  
  --tfa-border: #2A352A;         /* Card borders */
  --tfa-border-light: #3A453A;   /* Subtle borders */
}
```

**Tailwind Classes:**

**Backgrounds:**
- `bg-tfa-bg-primary` - Page background
- `bg-tfa-bg-secondary` - Cards, panels
- `bg-tfa-bg-tertiary` - Input fields, elevated surfaces
- `bg-tfa-bg-elevated` - Modals, dropdowns

**Text:**
- `text-tfa-text-primary` - Headlines, important text
- `text-tfa-text-secondary` - Body text
- `text-tfa-text-muted` - Labels, placeholders

**Borders:**
- `border-tfa-border` - Default borders
- `border-tfa-border-light` - Subtle dividers

**Usage Example:**
```tsx
<div className="min-h-screen bg-tfa-bg-primary">
  <div className="bg-tfa-bg-secondary border border-tfa-border rounded-lg p-6">
    <h2 className="text-tfa-text-primary text-xl font-semibold mb-2">
      Operations Overview
    </h2>
    <p className="text-tfa-text-secondary mb-4">
      View real-time metrics from your farm operations
    </p>
    <span className="text-tfa-text-muted text-sm">
      Last updated: 5 minutes ago
    </span>
  </div>
</div>
```

---

### Light Mode

```css
html.theme-light {
  --tfa-bg-primary: #F5F7F5;
  --tfa-bg-secondary: #FFFFFF;
  --tfa-bg-tertiary: #E8EDE8;
  --tfa-bg-elevated: #FFFFFF;
  
  --tfa-text-primary: #1A1F1A;
  --tfa-text-secondary: #3A4A3A;
  --tfa-text-muted: #4A5A4A;
  
  --tfa-border: #D0D8D0;
  --tfa-border-light: #E0E8E0;
  
  /* Note: Accent is darker in light mode for contrast */
  --tfa-accent: #01AB93;
}
```

**Important:** Light mode is secondary to dark mode. Always test components in dark mode first.

---

## 🎨 Gradients

### Primary Gradient (Cactus Green)

```css
--tfa-gradient-primary: linear-gradient(135deg, #2B7035 0%, #1F5227 100%);
```

**Tailwind:** `bg-tfa-gradient-primary`

**Usage:** Buttons, hero sections, headers

```tsx
<button className="bg-tfa-gradient-primary text-white px-6 py-3 rounded-lg">
  Get Started
</button>
```

---

### Accent Gradient (Teal)

```css
--tfa-gradient-accent: linear-gradient(135deg, #01E3C2 0%, #01AB93 100%);
```

**Tailwind:** `bg-tfa-gradient-accent`

**Usage:** Highlights, special features, CTAs

---

### Hero Gradient (Dark Background)

```css
--tfa-gradient-hero: linear-gradient(180deg, #0A0F0A 0%, #141A14 50%, #1E261E 100%);
```

**Tailwind:** `bg-tfa-gradient-hero`

**Usage:** Page backgrounds, hero sections

```tsx
<div className="min-h-screen bg-tfa-gradient-hero">
  {/* Content */}
</div>
```

---

### Energy Flow Gradient (Brand Spectrum)

```css
--tfa-gradient-energy: linear-gradient(90deg, #2B7035 0%, #01AB93 33%, #025373 66%, #A37A51 100%);
```

**Tailwind:** `bg-tfa-gradient-energy`

**Usage:** Progress bars, decorative elements, charts

```tsx
<div className="h-2 bg-tfa-gradient-energy rounded-full"></div>
```

---

## 💡 Usage Guidelines

### Color Hierarchy

1. **Primary (Green):** Main brand color, use sparingly for impact
2. **Accent (Teal):** Draws attention, use for interactive elements
3. **Secondary (Blue):** Professional touch, use for information
4. **Tertiary (Gold):** Warmth and warnings, use as accents

### Accessibility

**Contrast Ratios (WCAG AA):**

| Combination | Ratio | Pass |
|-------------|-------|------|
| `text-tfa-accent` on `bg-tfa-bg-primary` | 9.2:1 | ✅ AAA |
| `text-tfa-primary` on `bg-white` | 4.8:1 | ✅ AA |
| `text-tfa-text-secondary` on `bg-tfa-bg-primary` | 12.1:1 | ✅ AAA |
| `text-warning` on `bg-white` | 4.2:1 | ✅ AA |

**Always test color combinations** for sufficient contrast, especially for:
- Text on backgrounds
- Icons and buttons
- Critical alerts

### Best Practices

**DO:**
- Use accent color sparingly for maximum impact
- Maintain consistent color meaning (green = success, red = error)
- Use opacity variants for subtle backgrounds
- Test in both light and dark mode

**DON'T:**
- Mix too many colors in one component
- Use pure black (#000000) or pure white (#FFFFFF) for text
- Use accent colors for large background areas
- Forget about colorblind users (use icons + text)

---

## 📱 Responsive Design

Colors automatically adapt to theme and device:

```tsx
// Automatic theme detection
<div className="bg-tfa-bg-primary dark:bg-tfa-bg-primary">
  {/* Same in both modes since dark is default */}
</div>

// Theme-specific overrides
<div className="bg-white dark:bg-tfa-bg-secondary">
  {/* White in light, dark green in dark mode */}
</div>
```

---

## 🧪 Testing Colors

```tsx
// Color palette showcase component
export function ColorPalette() {
  const colors = [
    { name: 'Primary', class: 'bg-tfa-primary' },
    { name: 'Primary Light', class: 'bg-tfa-primary-light' },
    { name: 'Primary Dark', class: 'bg-tfa-primary-dark' },
    { name: 'Accent', class: 'bg-tfa-accent' },
    { name: 'Accent Dark', class: 'bg-tfa-accent-dark' },
    { name: 'Secondary', class: 'bg-tfa-secondary' },
    { name: 'Tertiary', class: 'bg-tfa-tertiary' },
    { name: 'Success', class: 'bg-success' },
    { name: 'Warning', class: 'bg-warning' },
    { name: 'Error', class: 'bg-error' },
  ];

  return (
    <div className="grid grid-cols-5 gap-4 p-8">
      {colors.map((color) => (
        <div key={color.name} className="text-center">
          <div className={`${color.class} h-20 rounded-lg mb-2`}></div>
          <p className="text-sm text-tfa-text-muted">{color.name}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## 📚 Quick Reference

### Common Patterns

**KPI Card (Dark Mode):**
```tsx
<div className="bg-tfa-bg-secondary border-2 border-tfa-accent/20 rounded-lg p-6">
  <div className="text-3xl font-bold text-tfa-accent">1,234</div>
  <div className="text-tfa-text-muted text-sm">Cladodes Planted</div>
</div>
```

**Alert Banner (Warning):**
```tsx
<div className="bg-warning/10 border-l-4 border-warning p-4 rounded">
  <div className="flex items-center gap-3">
    <span className="text-2xl">⚠️</span>
    <div>
      <p className="text-warning font-semibold">Warning</p>
      <p className="text-tfa-text-secondary text-sm">Action required</p>
    </div>
  </div>
</div>
```

**Button (Primary):**
```tsx
<button className="bg-tfa-primary hover:bg-tfa-primary-dark text-white font-medium px-6 py-3 rounded-lg transition-colors">
  Confirm Planting
</button>
```

**Input Field:**
```tsx
<input
  type="text"
  className="w-full bg-tfa-bg-tertiary border border-tfa-border text-tfa-text-primary rounded-lg px-4 py-2 focus:border-tfa-accent focus:outline-none focus:ring-2 focus:ring-tfa-accent/20"
  placeholder="Plot name"
/>
```

---

## 🔗 Related Documentation

- [TFA_Farm_OS_PRD.md](./TFA_Farm_OS_PRD.md) - Full product requirements
- [tailwind.config.ts](../tailwind.config.ts) - Tailwind configuration
- [TFA Brand Guidelines](./TFA_UX_UI_Product_Dashboard_v2.md) - Complete brand system

---

**Last Updated:** January 26, 2026  
**Version:** 2.0  
**Maintained by:** TFA Engineering Team

# TFA Farm OS - Changelog

## [Unreleased]

### Added
- Comprehensive color system documentation (`docs/TFA_COLOR_SYSTEM.md`)
- Enhanced gradient definitions in Tailwind config
- Light mode surface color palette

### Changed
- **[BREAKING]** Updated TFA brand color system to v2.0 (January 2026)
- Updated primary background colors from gray-tinted to green-tinted palette
  - Old: `#0F1419` (charcoal) → New: `#0A0F0A` (green-tinted dark)
  - Old: `#1A2332` (slate) → New: `#141A14` (green-tinted secondary)
- Refined semantic colors for better accessibility
  - Warning: `#F59E0B` → `#D35230` (warmer, more orange)
  - Error: `#EF4444` → `#D94848` (slightly softer red)
  - Success: `#10B981` → `#2B7035` (aligned with primary green)
- Enhanced accent color system with light/dark/muted variants
- Updated dashboard component to use new color classes
- Updated Tailwind config with comprehensive color tokens

### Deprecated
- Legacy color classes (still available for backward compatibility):
  - `tfa-charcoal` (use `tfa-bg-primary` instead)
  - `tfa-slate` (use `tfa-bg-secondary` instead)
  - Generic `success`, `warning`, `error` classes (use TFA-specific variants)

## [1.0.0] - 2026-01-26

### Added
- Initial MVP implementation
- Database schema with 10 core tables
- WhatsApp webhook integration with Twilio
- Claude AI processing engine
- Supabase client configuration
- Sample dashboard page
- Complete project structure for Cursor AI development
- Comprehensive PRD documentation

### Technical Stack
- Next.js 14 (App Router)
- Supabase (PostgreSQL + PostGIS)
- Anthropic Claude Sonnet 4
- Tailwind CSS with TFA brand colors
- Mapbox GL JS for mapping

---

## Migration Guide: v1.0 → v2.0 (Color System)

### Step 1: Update Tailwind Config

Replace your `tailwind.config.ts` with the new version that includes:
- Enhanced color tokens
- New surface color system
- Gradient definitions

### Step 2: Update Component Classes

**Old → New:**

```tsx
// Backgrounds
bg-tfa-charcoal    → bg-tfa-bg-primary
bg-tfa-slate       → bg-tfa-bg-secondary

// Accent colors
text-tfa-teal      → text-tfa-accent
border-tfa-teal    → border-tfa-accent

// Text colors
text-tfa-text-muted → text-tfa-text-muted (unchanged, but value updated)

// Success/Error
bg-green-500       → bg-success or bg-tfa-primary
bg-red-500         → bg-error
```

**Example Migration:**

```tsx
// BEFORE
<div className="bg-tfa-charcoal border-tfa-border">
  <h1 className="text-tfa-teal">Dashboard</h1>
  <p className="text-tfa-text-muted">Welcome</p>
</div>

// AFTER
<div className="bg-tfa-bg-primary border-tfa-border">
  <h1 className="text-tfa-accent">Dashboard</h1>
  <p className="text-tfa-text-muted">Welcome</p>
</div>
```

### Step 3: Test Visual Regression

Key areas to check:
- Dashboard header colors
- KPI card backgrounds and borders
- Alert banner severity colors
- Button hover states
- Input field focus states

### Step 4: Update Custom CSS (if any)

If you have custom CSS using old color values, update:

```css
/* BEFORE */
.custom-header {
  background-color: #0F1419;
  border-color: #1A2332;
}

/* AFTER */
.custom-header {
  background-color: var(--tfa-bg-primary);
  border-color: var(--tfa-bg-secondary);
}
```

---

## Color System Version History

### v2.0 (January 2026) - Current
- Green-tinted dark mode palette for agricultural theme
- Enhanced accent color system with variants
- Refined semantic colors (warning, error, success)
- Comprehensive gradient system
- Light mode surface colors
- Improved accessibility contrast ratios

### v1.0 (January 2026) - Initial
- Basic TFA brand colors
- Gray-tinted dark mode palette
- Simple gradient system
- Generic semantic colors

---

## Breaking Changes

### v2.0

**Color Values Changed:**
- Background colors now have green tint (from gray)
- Warning color changed from yellow to orange-red
- Text muted color changed from blue-gray to green-gray

**Class Names Deprecated (but still work):**
- `bg-tfa-charcoal` → use `bg-tfa-bg-primary`
- `bg-tfa-slate` → use `bg-tfa-bg-secondary`

**New Required Classes:**
- Components should use semantic surface colors (`bg-tfa-bg-*`)
- Avoid hardcoded color values in favor of CSS variables

**Impact Assessment:**
- **Low Impact:** Most components use Tailwind classes that map to new values automatically
- **Medium Impact:** Components with inline styles or custom CSS need updates
- **High Impact:** External integrations using old hex values need updating

---

## Rollback Plan

If issues arise with the new color system:

1. Revert `tailwind.config.ts` to v1.0
2. Revert component files to use old classes
3. Clear browser cache and rebuild

```bash
# Rollback commands
git revert HEAD  # Reverts latest color system commit
npm run build    # Rebuild with old colors
```

---

## Future Roadmap

### Planned for v2.1
- [ ] High contrast mode for accessibility
- [ ] Color-blind friendly palette alternatives
- [ ] Additional semantic states (info-dark, warning-light)
- [ ] Animation-safe color transitions

### Planned for v3.0
- [ ] Dynamic theming API
- [ ] User-customizable accent colors
- [ ] Regional color preferences
- [ ] Seasonal theme variants

---

**Maintained by:** TFA Engineering Team  
**Last Updated:** January 26, 2026

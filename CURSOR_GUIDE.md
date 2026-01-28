# Cursor AI - Quick Start Guide for Next Steps

**You are here:** ✅ Dashboard UI is rendering beautifully!  
**Next:** Complete Phase 1 - Core Functionality

---

## 🎯 IMMEDIATE NEXT STEPS (Priority Order)

### 1. Setup Supabase (15 minutes)

**What you need:**
- Supabase account (free tier)
- Database for storing plots, activities, alerts

**Steps:**
1. Go to https://supabase.com → Sign up
2. Create new project: "tfa-farm-os"
3. Wait for database to provision (~2 min)
4. Copy credentials from Project Settings → API:
   - Project URL
   - Anon (public) key
   - Service role key (secret)
5. Add to `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

**Run the database migration:**
```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link your project (get project ref from dashboard URL)
supabase link --project-ref your-project-ref

# Run the migration
supabase db push
```

---

### 2. Create Dashboard API Route (30 minutes)

**Cursor Prompt:**
```
Create app/api/dashboard/overview/route.ts that:
1. Queries the database for plots, activities, and alerts
2. Calculates these KPIs:
   - Total area planted vs target
   - Current planting rate (last 7 days average)
   - Average plant density
   - Overall survival rate
   - Cost per hectare
3. Returns JSON matching this interface:

interface DashboardData {
  summary: {
    total_area_planted_ha: number;
    total_area_target_ha: number;
    planting_progress_percent: number;
    current_planting_rate_per_day: number;
    target_planting_rate_per_day: number;
    avg_plant_density_per_ha: number;
    overall_survival_rate_percent: number;
    cost_per_hectare_actual: number;
    cost_per_hectare_budget: number;
  };
  kpis: Array<{
    metric: string;
    current: string;
    target: string;
    delta_percent: number;
    trend: 'up' | 'down' | 'stable';
    status: 'success' | 'warning' | 'error';
  }>;
  recent_activities: Array<{
    id: string;
    activity_type: string;
    plot_code: string;
    date: string;
    description: string;
  }>;
  active_alerts: Array<{
    id: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    description: string;
  }>;
  last_updated: string;
}

Use supabaseAdmin from lib/supabase/client.ts.
Follow the database schema in supabase/migrations/001_initial_schema.sql.
Include error handling.
```

---

### 3. Connect Dashboard to Real Data (15 minutes)

**Update:** `app/(dashboard)/page.tsx`

**Cursor Prompt:**
```
Update app/(dashboard)/page.tsx to fetch real data from /api/dashboard/overview instead of using mock data.

Keep the existing UI and styling.
Replace the mock data state with actual API calls.
Handle loading states with the existing spinner.
Handle errors gracefully with a user-friendly message.
```

---

### 4. Create KPICard Component (20 minutes)

**Cursor Prompt:**
```
Create components/dashboard/KPICard.tsx with these features:
1. Accepts props: metric, current, target, delta_percent, trend, status
2. Shows metric name, current value, target value
3. Displays delta badge (e.g., "-29%") with color coding:
   - success (green): positive change for growth metrics
   - warning (orange): -10% to -20% off target
   - error (red): >20% off target
4. Shows trend arrow (↑↓→)
5. Progress bar showing current vs target
6. Use TFA color system from tailwind.config.ts
7. Tooltip with explanation on hover

Reference the design in docs/TFA_Farm_OS_PRD.md section "3.1 TFA Command Center".
```

---

### 5. Create AlertBanner Component (20 minutes)

**Cursor Prompt:**
```
Create components/dashboard/AlertBanner.tsx with:
1. Props: id, severity, title, description, recommended_action
2. Color-coded by severity:
   - critical: bg-error/10 border-error
   - high: bg-warning/10 border-warning  
   - medium: bg-info/10 border-info
   - low: bg-tfa-text-muted/10 border-tfa-text-muted
3. Severity badge
4. Dismiss button (X icon)
5. Action buttons: [Acknowledge] [View Details]
6. Click handlers for actions
7. Responsive design (mobile-friendly)

Use Lucide React icons for alert icons and close button.
Use TFA colors from tailwind.config.ts.
```

---

### 6. Create ActivityTimeline Component (30 minutes)

**Cursor Prompt:**
```
Create components/dashboard/ActivityTimeline.tsx showing:
1. List of recent activities (last 7 days)
2. Each item shows:
   - Activity type icon (🌱 planting, 🔍 inspection, 🚜 clearing)
   - Description (e.g., "Planted 400 cladodes with 6 workers")
   - Plot code (e.g., "Plot 2A")
   - Timestamp (relative: "2 hours ago")
   - Photo thumbnail if available
3. Grouped by date with date headers
4. Click to expand for full details
5. Smooth animations on expand/collapse
6. Empty state message if no activities

Use date-fns for date formatting.
Use Lucide React for icons.
Responsive: Stack on mobile, two columns on desktop.
```

---

### 7. Enhance MapView Component (45 minutes)

**Cursor Prompt:**
```
Update components/dashboard/MapView.tsx to:
1. Fetch plot boundaries from database (GeoJSON)
2. Add plots as polygons on map
3. Color-code by status:
   - completed: tfa-primary (green)
   - planting: warning (orange)
   - pending: tfa-text-muted (gray)
4. Add click handler to show plot details in popup
5. Add activity markers (recent 48h)
6. Add legend showing status colors
7. Add layer toggle: [Satellite] [Streets]
8. Center on Steelpoort: [-24.7333, 29.9167]
9. Zoom controls
10. Loading state

Use the Mapbox GL JS API.
Query plots from /api/plots endpoint.
Use TFA colors for plot styling.
```

---

## 🤖 Using Cursor Composer (Cmd/Ctrl + I)

For each task above:

1. **Open Composer** (Cmd/Ctrl + I)
2. **Add context files:**
   - `docs/TFA_Farm_OS_PRD.md`
   - `docs/TFA_COLOR_SYSTEM.md`
   - `tailwind.config.ts`
   - `supabase/migrations/001_initial_schema.sql`
3. **Paste the prompt** from above
4. **Review generated code**
5. **Accept or iterate**

---

## 🧪 Testing As You Go

After each component, create a test:

```bash
# Example: After creating KPICard
npm test -- KPICard.test.tsx --watch
```

**Cursor Prompt for Tests:**
```
Create unit tests for components/dashboard/KPICard.tsx using Jest and React Testing Library.

Tests should cover:
1. Renders with all props correctly
2. Shows correct trend indicator based on delta
3. Applies correct color based on status
4. Progress bar reflects current/target ratio
5. Handles edge cases (0 values, negative deltas)

Place test file at: components/dashboard/KPICard.test.tsx
```

---

## 🎨 Design Consistency Checklist

Before marking a component complete:

- [ ] Uses TFA color system (no hardcoded colors)
- [ ] Dark mode friendly (test with light bg to verify contrast)
- [ ] Responsive (looks good on mobile 375px → desktop 1920px)
- [ ] Accessible (keyboard navigation, ARIA labels)
- [ ] Follows existing patterns (similar to other components)
- [ ] Has hover states for interactive elements
- [ ] Loading states for async operations
- [ ] Error states with user-friendly messages

---

## 📁 File Organization

When creating new files, follow this structure:

```
components/
├── dashboard/          # Dashboard-specific
│   ├── KPICard.tsx
│   ├── KPICard.test.tsx
│   ├── AlertBanner.tsx
│   └── ...
├── field/             # Field worker app
├── shared/            # Shared across app
└── ui/                # shadcn/ui base components

lib/
├── hooks/             # Custom React hooks
├── utils/             # Utility functions
├── api/               # API client wrappers
└── types/             # TypeScript types

app/
├── (dashboard)/       # Dashboard routes
├── field/             # Field worker routes
└── api/               # API routes
```

---

## 🚀 Productivity Tips

**1. Use Cursor's Auto-complete**
- Start typing component/function names
- Let Cursor suggest implementations
- Accept with Tab

**2. Use Chat for Quick Questions**
- Cmd/Ctrl + L for chat
- "How do I query Supabase for the last 7 days of activities?"
- "What's the correct way to handle errors in Next.js API routes?"

**3. Use Find & Replace**
- Cmd/Ctrl + H
- Update multiple files at once
- Preserve consistent naming

**4. Use Multiple Cursors**
- Option/Alt + Click
- Edit multiple lines simultaneously

---

## 🐛 Common Issues & Solutions

**Issue: "Cannot find module '@/lib/...'**
```bash
# Make sure tsconfig.json has:
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

**Issue: "Supabase client not initialized"**
```bash
# Check .env.local has all keys
# Restart dev server after adding keys
npm run dev
```

**Issue: "Module not found: Can't resolve 'mapbox-gl'"**
```bash
npm install mapbox-gl @types/mapbox-gl
```

**Issue: Map not loading**
```bash
# Check .env.local has:
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ...

# Restart server
npm run dev
```

---

## 📊 Progress Tracking

Update TODO.md as you complete items:

```markdown
- [x] Setup Supabase Project
- [x] Create Dashboard API Route
- [ ] Create KPICard Component
- [ ] Create AlertBanner Component
```

---

## 🎯 Daily Goals

**Day 1-2:** Database + API Routes  
**Day 3-4:** Dashboard Components  
**Day 5-6:** Map Integration  
**Day 7:** Testing + Bug Fixes

---

## 💡 Pro Tips

1. **Start with the data model** - If you understand the database, everything else follows
2. **Build components in isolation** - Test each one independently before integrating
3. **Use TypeScript** - Let the compiler catch errors early
4. **Test early, test often** - Don't wait until the end to write tests
5. **Keep the PRD open** - Reference it constantly for design decisions

---

## 🆘 Need Help?

**Resources:**
- PRD: `docs/TFA_Farm_OS_PRD.md`
- Color System: `docs/TFA_COLOR_SYSTEM.md`
- Database Schema: `supabase/migrations/001_initial_schema.sql`
- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs
- Mapbox Docs: https://docs.mapbox.com

**Ask Cursor:**
- "How does [component] work in this codebase?"
- "What's the pattern for [API routes / data fetching / error handling]?"
- "Generate a component that follows the existing style"

---

**You've got this! 🚀**

Start with Step 1 (Supabase setup), then work through the components one by one. Each small win builds momentum!

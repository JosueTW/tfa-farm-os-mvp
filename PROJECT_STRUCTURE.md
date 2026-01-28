# TFA FARM OS - PROJECT STRUCTURE

## 📁 Complete Directory Structure

```
tfa-farm-os-mvp/
│
├── 📄 README.md                          # Main documentation
├── 📄 QUICKSTART.md                      # Quick setup guide
├── 📄 package.json                       # Dependencies
├── 📄 .env.example                       # Environment variables template
├── 📄 tailwind.config.ts                 # Tailwind with TFA brand colors
├── 📄 tsconfig.json                      # TypeScript configuration
├── 📄 next.config.js                     # Next.js configuration
│
├── 📂 app/                               # Next.js 14 App Router
│   ├── 📄 layout.tsx                     # Root layout
│   ├── 📄 page.tsx                       # Landing page (redirect to dashboard)
│   ├── 📄 globals.css                    # Global styles
│   │
│   ├── 📂 (dashboard)/                   # Dashboard route group
│   │   ├── 📄 layout.tsx                 # Dashboard shell (sidebar, header)
│   │   ├── 📄 page.tsx                   # ✅ Operations overview (CREATED)
│   │   │
│   │   ├── 📂 plots/
│   │   │   ├── 📄 page.tsx               # Plots list view
│   │   │   └── 📄 [id]/page.tsx          # Plot detail view
│   │   │
│   │   ├── 📂 activities/
│   │   │   ├── 📄 page.tsx               # Activities log
│   │   │   └── 📄 [id]/page.tsx          # Activity detail
│   │   │
│   │   ├── 📂 alerts/
│   │   │   └── 📄 page.tsx               # Alert center
│   │   │
│   │   └── 📂 reports/
│   │       └── 📄 page.tsx               # Reports & analytics
│   │
│   ├── 📂 field/                         # Field worker PWA
│   │   ├── 📄 layout.tsx                 # Mobile-optimized layout
│   │   ├── 📄 page.tsx                   # Daily check-in screen
│   │   │
│   │   └── 📂 tasks/
│   │       └── 📄 page.tsx               # Task management
│   │
│   └── 📂 api/                           # API routes (serverless)
│       ├── 📂 activities/
│       │   └── 📄 route.ts               # CRUD for activities
│       │
│       ├── 📂 plots/
│       │   ├── 📄 route.ts               # CRUD for plots
│       │   └── 📄 [id]/route.ts          # Single plot operations
│       │
│       ├── 📂 ai/
│       │   ├── 📄 process-message/route.ts   # Claude message processing
│       │   └── 📄 analyze-image/route.ts     # Image analysis
│       │
│       ├── 📂 webhooks/
│       │   └── 📂 whatsapp/
│       │       └── 📄 route.ts           # ✅ Twilio WhatsApp webhook (CREATED)
│       │
│       └── 📂 dashboard/
│           ├── 📄 overview/route.ts      # Dashboard summary data
│           └── 📄 metrics/route.ts       # KPI calculations
│
├── 📂 components/                        # React components
│   ├── 📂 ui/                            # shadcn/ui base components
│   │   ├── 📄 button.tsx
│   │   ├── 📄 card.tsx
│   │   ├── 📄 input.tsx
│   │   ├── 📄 select.tsx
│   │   └── ...                           # (generate with shadcn CLI)
│   │
│   ├── 📂 dashboard/                     # Dashboard-specific components
│   │   ├── 📄 KPICard.tsx                # Metric display card
│   │   ├── 📄 AlertBanner.tsx            # Alert display
│   │   ├── 📄 ActivityTimeline.tsx       # Activity feed
│   │   ├── 📄 MapView.tsx                # Mapbox integration
│   │   ├── 📄 WeeklyTrends.tsx           # Chart component
│   │   └── 📄 PlotCard.tsx               # Plot summary card
│   │
│   ├── 📂 field/                         # Field app components
│   │   ├── 📄 VoiceRecorder.tsx          # Voice note capture
│   │   ├── 📄 PhotoCapture.tsx           # Camera with GPS
│   │   ├── 📄 TaskChecklist.tsx          # Task UI
│   │   └── 📄 ProgressBar.tsx            # Daily progress
│   │
│   └── 📂 shared/                        # Shared components
│       ├── 📄 Header.tsx
│       ├── 📄 Sidebar.tsx
│       ├── 📄 LoadingSpinner.tsx
│       └── 📄 ErrorBoundary.tsx
│
├── 📂 lib/                               # Utilities & services
│   ├── 📂 supabase/
│   │   ├── 📄 client.ts                  # ✅ Browser client (CREATED)
│   │   ├── 📄 server.ts                  # Server client
│   │   └── 📄 types.ts                   # Generated types (from DB)
│   │
│   ├── 📂 ai/
│   │   ├── 📄 claude.ts                  # ✅ Anthropic Claude client (CREATED)
│   │   ├── 📄 prompts.ts                 # Prompt templates
│   │   └── 📄 extractors.ts              # Data extraction logic
│   │
│   ├── 📂 api/
│   │   ├── 📄 weather.ts                 # OpenWeatherMap integration
│   │   ├── 📄 whatsapp.ts                # Twilio helpers
│   │   └── 📄 maps.ts                    # Mapbox utilities
│   │
│   ├── 📂 utils/
│   │   ├── 📄 calculations.ts            # Metric calculations
│   │   ├── 📄 formatters.ts              # Data formatting
│   │   ├── 📄 validators.ts              # Input validation
│   │   └── 📄 constants.ts               # App constants
│   │
│   └── 📂 hooks/
│       ├── 📄 useActivities.ts           # Activity data hook
│       ├── 📄 usePlots.ts                # Plot data hook
│       ├── 📄 useRealtime.ts             # Supabase Realtime
│       ├── 📄 useAlerts.ts               # Alerts management
│       └── 📄 useGeolocation.ts          # GPS tracking
│
├── 📂 supabase/                          # Supabase configuration
│   ├── 📂 migrations/
│   │   ├── 📄 001_initial_schema.sql     # ✅ Core tables (CREATED)
│   │   ├── 📄 002_add_indexes.sql        # Performance indexes
│   │   └── 📄 003_rls_policies.sql       # Row-level security
│   │
│   ├── 📂 functions/
│   │   └── 📂 process-message/
│   │       └── 📄 index.ts               # Edge function for processing
│   │
│   └── 📄 config.toml                    # Supabase config
│
├── 📂 public/                            # Static assets
│   ├── 📂 icons/
│   │   ├── 📄 icon-192.png               # PWA icon
│   │   ├── 📄 icon-512.png
│   │   └── 📄 favicon.ico
│   │
│   ├── 📂 images/
│   │   └── 📄 logo-tfa.png               # TFA logo
│   │
│   └── 📄 manifest.json                  # PWA manifest
│
├── 📂 scripts/                           # Utility scripts
│   ├── 📄 seed-dev-data.ts               # Seed sample data
│   ├── 📄 generate-types.ts              # Supabase type generation
│   └── 📄 deploy.sh                      # Deployment script
│
└── 📂 docs/                              # Documentation
    ├── 📄 TFA_Farm_OS_PRD.md             # ✅ Product Requirements (CREATED)
    ├── 📄 API.md                         # API documentation
    ├── 📄 COMPONENTS.md                  # Component library
    ├── 📄 DATABASE.md                    # Database schema docs
    └── 📄 DEPLOYMENT.md                  # Deployment guide
```

## 📝 File Status Legend

- ✅ **CREATED** - File exists and is ready to use
- 📝 **TODO** - File structure defined, needs implementation
- 🔧 **OPTIONAL** - Can be added later as needed

## 🎯 Priority Implementation Order

### Phase 1: Foundation (Week 1-2)
1. ✅ Database schema (`001_initial_schema.sql`)
2. ✅ Supabase client setup (`lib/supabase/client.ts`)
3. ✅ API routes structure (`app/api/...`)
4. 📝 Basic dashboard layout (`app/(dashboard)/layout.tsx`)
5. ✅ Dashboard overview page (`app/(dashboard)/page.tsx`)

### Phase 2: Intelligence (Week 3-4)
1. ✅ Claude AI integration (`lib/ai/claude.ts`)
2. ✅ WhatsApp webhook (`app/api/webhooks/whatsapp/route.ts`)
3. 📝 Dashboard components (`components/dashboard/...`)
4. 📝 API endpoints (`app/api/activities/route.ts`, etc.)

### Phase 3: Field App (Week 5-6)
1. 📝 Field worker PWA (`app/field/...`)
2. 📝 Voice & photo capture (`components/field/...`)
3. 📝 Offline support (service worker)
4. 📝 Push notifications

### Phase 4: Polish (Week 7-8)
1. 🔧 Computer vision (`lib/ai/vision.ts`)
2. 🔧 Predictive analytics
3. 🔧 Weekly reports
4. 🔧 Performance optimization

## 🚀 Quick Commands

```bash
# Generate Supabase types
npm run types:generate

# Run database migrations
npm run db:migrate

# Seed sample data
npm run db:seed

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

## 📦 Key Dependencies

```json
{
  "dependencies": {
    "next": "^14.1.0",                    // Framework
    "@supabase/supabase-js": "^2.39.0",   // Database
    "@anthropic-ai/sdk": "^0.20.0",       // AI processing
    "mapbox-gl": "^3.1.0",                // Maps
    "twilio": "^4.20.0",                  // WhatsApp
    "@radix-ui/react-*": "latest",        // UI components
    "tailwindcss": "^3.4.0"               // Styling
  }
}
```

## 🔗 Related Documentation

- [QUICKSTART.md](./QUICKSTART.md) - Setup guide
- [README.md](./README.md) - Project overview
- [docs/TFA_Farm_OS_PRD.md](./docs/TFA_Farm_OS_PRD.md) - Full PRD
- [.env.example](./.env.example) - Environment variables

---

**This structure follows Next.js 14 App Router best practices and is optimized for:**
- ✅ Cursor AI development (clear file organization)
- ✅ Vercel deployment (serverless API routes)
- ✅ Supabase integration (PostgreSQL + Realtime)
- ✅ Mobile-first PWA (offline support)
- ✅ TFA brand consistency (dark mode, color palette)

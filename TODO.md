# TFA Farm OS MVP - Development TODO

**Current Status:** ✅ Dashboard UI, Mapbox, Supabase DB, Theme system, API routes (partial)  
**Next Phase:** Complete API routes, authentication, dashboard components, and data hooks  
**Target:** Production-ready MVP in 6 weeks

---

## 🎯 PHASE 1: Core Functionality (Week 1-2) - CURRENT PRIORITY

### Database & Backend

- [x] **Setup Supabase Project**
  - [x] Create account at supabase.com
  - [x] Create new project: `tfa-farm-os`
  - [x] Get credentials (URL, anon key, service key)
  - [x] Add to `.env.local`
  - [x] Run migrations (plots table, geometry column, plots_with_geojson view, coordinate transformation SQL)
  
- [ ] **Create API Routes** (Partial - GET routes working)
  - [x] `app/api/dashboard/overview/route.ts` - Dashboard summary data
    - [x] Query plots, activities, alerts from database
    - [x] Calculate KPIs (planting rate, survival %, cost/ha)
    - [x] Return JSON matching DashboardData interface
  
  - [ ] `app/api/plots/route.ts` - CRUD for plots
    - [x] GET: List all plots with status (working via plots_with_geojson view)
    - [ ] POST: Create new plot with GeoJSON boundary
    - [ ] PUT: Update plot status/metadata
    - [ ] DELETE: Remove plot (soft delete)
  
  - [ ] `app/api/plots/[id]/route.ts` - Single plot operations
    - [ ] GET: Plot details with activities, health data
    - [ ] PUT: Update specific plot
  
  - [ ] `app/api/activities/route.ts` - Activity logging
    - [ ] GET: List activities (filter by plot, date, type)
    - [ ] POST: Create new activity
    - [ ] PUT: Update activity
  
  - [ ] `app/api/activities/[id]/route.ts`
    - [ ] GET: Single activity details
    - [ ] PUT: Update activity
    - [ ] DELETE: Remove activity

- [ ] **Authentication Setup**
  - [ ] Configure Supabase Auth (magic links)
  - [ ] Create `lib/auth.ts` helpers
  - [ ] Add middleware for protected routes
  - [ ] Create login page: `app/login/page.tsx`
  - [ ] Add logout functionality
  - [ ] Setup RLS policies on database

### Dashboard Components

- [ ] **KPICard Component** (`components/dashboard/KPICard.tsx`)
  - [ ] Props: metric, current, target, delta, trend, status
  - [ ] Color coding based on status (success/warning/error)
  - [ ] Trend indicator (↑↓)
  - [ ] Progress bar
  - [ ] Tooltip with explanation

- [ ] **AlertBanner Component** (`components/dashboard/AlertBanner.tsx`)
  - [ ] Props: severity, title, description, action
  - [ ] Color-coded by severity (low/medium/high/critical)
  - [ ] Dismiss functionality
  - [ ] Action buttons (Acknowledge, Resolve)
  - [ ] Link to related plot/activity

- [ ] **ActivityTimeline Component** (`components/dashboard/ActivityTimeline.tsx`)
  - [ ] Reverse chronological list
  - [ ] Activity type icons (planting, inspection, etc.)
  - [ ] Photo thumbnails
  - [ ] Click to expand details
  - [ ] Filter by type, date, plot

- [ ] **MapView Component** (`components/dashboard/MapView.tsx`) - Partial
  - [x] Initialize Mapbox with Steelpoort coordinates (-24.721643, 30.194722)
  - [x] Load plot boundaries from database (GeoJSON via plots_with_geojson view)
  - [x] Color-code plots by status (active/completed/pending)
  - [ ] Add activity markers (recent 48h)
  - [x] Click plot → show popup with details
  - [ ] Heatmap layer for planting density
  - [ ] Layer toggle (satellite/streets)
  - [x] Legend (plot status colors)

- [ ] **WeeklyTrends Component** (`components/dashboard/WeeklyTrends.tsx`)
  - [ ] Line chart: Daily planting rate
  - [ ] Bar chart: Labor productivity
  - [ ] Area chart: Cumulative area planted
  - [ ] Use Recharts library
  - [ ] Export as PNG functionality

### Data Fetching Hooks

- [ ] **useActivities Hook** (`lib/hooks/useActivities.ts`)
  - [ ] Fetch activities with filters
  - [ ] Real-time updates via Supabase Realtime
  - [ ] Pagination support
  - [ ] Loading/error states

- [ ] **usePlots Hook** (`lib/hooks/usePlots.ts`)
  - [ ] Fetch all plots
  - [ ] Subscribe to plot updates
  - [ ] Cache with React Query

- [ ] **useAlerts Hook** (`lib/hooks/useAlerts.ts`)
  - [ ] Fetch active alerts
  - [ ] Acknowledge/resolve actions
  - [ ] Real-time notifications

- [ ] **useDashboard Hook** (`lib/hooks/useDashboard.ts`)
  - [ ] Fetch overview data
  - [ ] Auto-refresh every 60 seconds
  - [ ] Combine multiple data sources

---

## 🤖 PHASE 2: AI Integration (Week 3-4)

### Claude AI Processing

- [ ] **Setup Anthropic Account**
  - [ ] Sign up at console.anthropic.com
  - [ ] Get API key
  - [ ] Add to `.env.local`: `ANTHROPIC_API_KEY`

- [ ] **AI Processing API Routes**
  - [ ] `app/api/ai/process-message/route.ts`
    - [ ] Accept text message from field
    - [ ] Call Claude API with prompt
    - [ ] Parse structured JSON response
    - [ ] Create activity record
    - [ ] Create observations if issues detected
    - [ ] Return confidence score
  
  - [ ] `app/api/ai/analyze-image/route.ts`
    - [ ] Accept image upload
    - [ ] Send to Claude for analysis
    - [ ] Extract plant health, spacing, issues
    - [ ] Store analysis in database
    - [ ] Return recommendations

- [ ] **Test AI Extraction**
  - [ ] Create test page: `app/test/ai/page.tsx`
  - [ ] Input box for sample messages
  - [ ] Display extracted JSON
  - [ ] Test various message formats
  - [ ] Validate confidence scores

### WhatsApp Integration

- [ ] **Setup Twilio Account**
  - [ ] Sign up at twilio.com
  - [ ] Get WhatsApp sandbox number
  - [ ] Get Account SID and Auth Token
  - [ ] Add to `.env.local`

- [ ] **WhatsApp Webhook** (Already created, needs testing)
  - [ ] Deploy webhook endpoint
  - [ ] Configure Twilio webhook URL
  - [ ] Test message reception
  - [ ] Test media download
  - [ ] Test AI processing flow
  - [ ] Test activity creation
  - [ ] Test alert generation

- [ ] **WhatsApp Testing**
  - [ ] Join Twilio sandbox
  - [ ] Send test messages
  - [ ] Verify activity creation
  - [ ] Check photo uploads
  - [ ] Test voice notes

### Alert System

- [ ] **Alert Rule Engine** (`lib/alerts/rules.ts`)
  - [ ] Define alert triggers
    - [ ] Planting rate < 80% for 2+ days
    - [ ] Survival rate < 90%
    - [ ] Cost > 105% of budget
    - [ ] Quality issues detected
    - [ ] Resource shortages
  - [ ] Calculate priority scores
  - [ ] Generate alert text

- [ ] **Alert Notifications**
  - [ ] Email notifications (via Supabase)
  - [ ] SMS via Twilio (optional)
  - [ ] Push notifications (PWA)
  - [ ] In-app notifications

---

## 📱 PHASE 3: Field Worker App (Week 5-6)

### Mobile PWA Setup

- [ ] **PWA Configuration**
  - [ ] Create `public/manifest.json`
  - [ ] Generate app icons (192x192, 512x512)
  - [ ] Configure service worker
  - [ ] Add offline support
  - [ ] Test "Add to Home Screen"

- [ ] **Field App Layout** (`app/field/layout.tsx`)
  - [ ] Mobile-optimized header
  - [ ] Bottom navigation
  - [ ] No sidebar (mobile-first)
  - [ ] Large touch targets

- [ ] **Daily Check-In** (`app/field/page.tsx`)
  - [ ] Welcome message with name
  - [ ] Daily goal display
  - [ ] Current progress
  - [ ] Big action buttons
  - [ ] Voice recording button
  - [ ] Photo capture button
  - [ ] Task checklist

### Field App Components

- [ ] **VoiceRecorder Component** (`components/field/VoiceRecorder.tsx`)
  - [ ] Browser MediaRecorder API
  - [ ] Start/stop recording
  - [ ] Audio waveform visualization
  - [ ] Upload to Supabase Storage
  - [ ] Queue for offline mode
  - [ ] Transcribe with Claude

- [ ] **PhotoCapture Component** (`components/field/PhotoCapture.tsx`)
  - [ ] Camera access
  - [ ] Capture photo
  - [ ] Extract GPS from EXIF
  - [ ] Compress image
  - [ ] Upload to Supabase Storage
  - [ ] Offline queue

- [ ] **TaskChecklist Component** (`components/field/TaskChecklist.tsx`)
  - [ ] Fetch daily tasks
  - [ ] Checkbox UI (large)
  - [ ] Mark complete
  - [ ] Progress indicator
  - [ ] Confetti on completion 🎉

### Offline Support

- [ ] **Service Worker** (`public/sw.js`)
  - [ ] Cache static assets
  - [ ] Cache API responses
  - [ ] Background sync for queued operations
  - [ ] Update notification

- [ ] **Offline Queue** (`lib/offline/queue.ts`)
  - [ ] Queue activities when offline
  - [ ] Store in IndexedDB
  - [ ] Sync when online
  - [ ] Show sync status

---

## 🗺️ PHASE 4: Advanced Features (Week 7-8)

### Plot Management

- [ ] **Plots List Page** (`app/(dashboard)/plots/page.tsx`)
  - [ ] Grid/list view toggle
  - [ ] Search and filter
  - [ ] Sort by status, date, area
  - [ ] Bulk actions

- [ ] **Plot Detail Page** (`app/(dashboard)/plots/[id]/page.tsx`)
  - [ ] Plot info card
  - [ ] Performance metrics
  - [ ] Activity history
  - [ ] Photo gallery
  - [ ] Map with plot boundary
  - [ ] Edit button

- [ ] **Create/Edit Plot Form** (`components/dashboard/PlotForm.tsx`)
  - [ ] Plot code input
  - [ ] Draw boundary on map
  - [ ] Calculate area automatically
  - [ ] Set target density
  - [ ] Set target completion date

### Activities Management

- [ ] **Activities Page** (`app/(dashboard)/activities/page.tsx`)
  - [ ] Table view with filters
  - [ ] Date range picker
  - [ ] Export to CSV
  - [ ] Bulk edit

- [ ] **Activity Detail** (`app/(dashboard)/activities/[id]/page.tsx`)
  - [ ] Full activity details
  - [ ] Photos/voice notes
  - [ ] AI extraction data
  - [ ] Edit/delete
  - [ ] Link to plot

### Reports

- [ ] **Reports Page** (`app/(dashboard)/reports/page.tsx`)
  - [ ] Weekly summary
  - [ ] Monthly trends
  - [ ] Cost analysis
  - [ ] Labor productivity
  - [ ] Export PDF

- [ ] **PDF Generation** (`lib/reports/pdf.ts`)
  - [ ] Use jsPDF or similar
  - [ ] Weekly report template
  - [ ] Charts and tables
  - [ ] TFA branding
  - [ ] Email delivery option

### Weather Integration

- [ ] **Weather Service** (`lib/api/weather.ts`)
  - [ ] Setup OpenWeatherMap account
  - [ ] Get API key
  - [ ] Fetch current conditions
  - [ ] Fetch 7-day forecast
  - [ ] Store in database
  - [ ] Update hourly

- [ ] **Weather Widget** (`components/dashboard/WeatherWidget.tsx`)
  - [ ] Current conditions
  - [ ] 7-day forecast
  - [ ] Planting recommendations
  - [ ] Rainfall totals

---

## 🧪 PHASE 5: Testing (Throughout Development)

### Unit Tests

- [ ] **Setup Testing Framework**
  - [ ] Install Jest: `npm install -D jest @testing-library/react @testing-library/jest-dom`
  - [ ] Configure `jest.config.js`
  - [ ] Setup test utilities

- [ ] **Component Tests**
  - [ ] `components/dashboard/KPICard.test.tsx`
    - [ ] Renders correctly with props
    - [ ] Shows correct trend indicator
    - [ ] Color codes by status
  
  - [ ] `components/dashboard/AlertBanner.test.tsx`
    - [ ] Renders all severity levels
    - [ ] Dismiss functionality works
    - [ ] Action buttons fire callbacks
  
  - [ ] `components/dashboard/MapView.test.tsx`
    - [ ] Initializes with correct center
    - [ ] Loads plot boundaries
    - [ ] Handles click events

- [ ] **API Route Tests**
  - [ ] `app/api/activities/route.test.ts`
    - [ ] GET returns activities
    - [ ] POST creates activity
    - [ ] Validates input
    - [ ] Returns errors correctly
  
  - [ ] `app/api/plots/route.test.ts`
    - [ ] CRUD operations work
    - [ ] GeoJSON validation
    - [ ] Authorization checks

- [ ] **Utility Tests**
  - [ ] `lib/ai/claude.test.ts`
    - [ ] Extracts data correctly
    - [ ] Handles errors
    - [ ] Validates confidence scores
  
  - [ ] `lib/utils/calculations.test.ts`
    - [ ] Metric calculations accurate
    - [ ] Edge cases handled

### Integration Tests

- [ ] **Setup Playwright**
  - [ ] Install: `npm install -D @playwright/test`
  - [ ] Configure `playwright.config.ts`
  - [ ] Setup test database

- [ ] **End-to-End Flows**
  - [ ] `tests/e2e/dashboard.spec.ts`
    - [ ] User can view dashboard
    - [ ] KPIs load correctly
    - [ ] Map displays plots
    - [ ] Alerts are visible
  
  - [ ] `tests/e2e/activity-logging.spec.ts`
    - [ ] User can create activity
    - [ ] Form validation works
    - [ ] Activity appears in list
    - [ ] Dashboard updates
  
  - [ ] `tests/e2e/whatsapp-flow.spec.ts`
    - [ ] Message processed by webhook
    - [ ] AI extraction creates activity
    - [ ] Alert generated if needed
    - [ ] Dashboard reflects changes
  
  - [ ] `tests/e2e/field-worker.spec.ts`
    - [ ] Daily check-in works
    - [ ] Voice recording uploads
    - [ ] Photo capture saves
    - [ ] Offline mode queues actions

### Performance Tests

- [ ] **Lighthouse Audit**
  - [ ] Score > 90 on Performance
  - [ ] Score > 90 on Accessibility
  - [ ] Score > 90 on Best Practices
  - [ ] Score > 90 on SEO

- [ ] **Load Testing**
  - [ ] Test with 100 plots
  - [ ] Test with 1,000 activities
  - [ ] Test with 10 concurrent users
  - [ ] Measure API response times

---

## 🚀 PHASE 6: Deployment & Production

### Pre-Deployment Checklist

- [ ] **Environment Variables**
  - [ ] All production keys added to Vercel
  - [ ] No hardcoded secrets in code
  - [ ] `.env.local` in `.gitignore`

- [ ] **Security**
  - [ ] RLS policies enabled on all tables
  - [ ] API routes require authentication
  - [ ] Input validation on all forms
  - [ ] SQL injection prevention
  - [ ] XSS protection
  - [ ] CORS configured correctly

- [ ] **Performance Optimization**
  - [ ] Images optimized (Next.js Image)
  - [ ] Code splitting enabled
  - [ ] Lazy loading for heavy components
  - [ ] API response caching
  - [ ] Database indexes on queries

### Deployment Steps

- [ ] **Supabase Production**
  - [ ] Create production project
  - [ ] Run migrations
  - [ ] Configure RLS policies
  - [ ] Setup scheduled backups

- [ ] **Vercel Deployment**
  - [ ] Connect GitHub repo
  - [ ] Add environment variables
  - [ ] Configure build settings
  - [ ] Deploy to production
  - [ ] Setup custom domain (optional)

- [ ] **Post-Deployment**
  - [ ] Update Twilio webhook URL to production
  - [ ] Test WhatsApp integration
  - [ ] Smoke test all major features
  - [ ] Setup error monitoring (Sentry)
  - [ ] Configure analytics

### Monitoring & Maintenance

- [ ] **Error Tracking**
  - [ ] Setup Sentry
  - [ ] Configure error boundaries
  - [ ] Alert on critical errors

- [ ] **Analytics**
  - [ ] Setup Vercel Analytics
  - [ ] Track key user actions
  - [ ] Monitor API usage

- [ ] **Database Monitoring**
  - [ ] Supabase dashboard alerts
  - [ ] Query performance monitoring
  - [ ] Storage usage tracking

---

## 📚 Documentation

- [ ] **Developer Documentation**
  - [ ] Update README.md with deployment steps
  - [ ] Document API endpoints
  - [ ] Component library guide
  - [ ] Database schema documentation

- [ ] **User Documentation**
  - [ ] Dashboard user guide
  - [ ] Field worker training guide
  - [ ] WhatsApp message format examples
  - [ ] Troubleshooting FAQ

- [ ] **Video Tutorials**
  - [ ] Dashboard walkthrough (5 min)
  - [ ] Field worker app demo (3 min)
  - [ ] WhatsApp integration guide (2 min)

---

## 🎯 Success Criteria

### MVP Launch Checklist

- [ ] ✅ Dashboard displays real-time data
- [ ] ✅ WhatsApp messages auto-create activities
- [ ] ✅ Map shows plot boundaries and status
- [ ] ✅ Alerts generate for critical issues
- [ ] ✅ Field worker app works offline
- [ ] ✅ All tests passing (unit + e2e)
- [ ] ✅ Performance score > 90
- [ ] ✅ Deployed to production
- [ ] ✅ 5 users successfully onboarded

### 4-Week Success Metrics

- [ ] 80%+ daily worker app usage
- [ ] <15 minutes to generate ExCo report
- [ ] >85% AI extraction accuracy
- [ ] <4 hours average alert response time
- [ ] 100% field activities logged within 24h

---

## 🔧 Development Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm run start            # Start production server

# Testing
npm test                 # Run unit tests
npm run test:watch       # Watch mode
npm run test:e2e         # Run Playwright tests
npm run test:coverage    # Coverage report

# Database
npm run db:migrate       # Run migrations
npm run db:seed          # Seed test data
npm run db:reset         # Reset database
npm run types:generate   # Generate types from DB

# Code Quality
npm run lint             # ESLint
npm run format           # Prettier
npm run type-check       # TypeScript check

# Deployment
vercel                   # Deploy to Vercel
vercel --prod            # Deploy to production
```

---

## 📝 Notes for Cursor AI

When implementing features, use these prompts:

**For Components:**
```
Create the [ComponentName] component based on the spec in docs/TFA_Farm_OS_PRD.md.
Use TFA color system from docs/TFA_COLOR_SYSTEM.md.
Follow the pattern in components/dashboard/[ExistingComponent].tsx.
```

**For API Routes:**
```
Create [route] API endpoint with [operations].
Use Supabase client from lib/supabase/client.ts.
Return JSON matching the [Interface] type.
Include error handling and validation.
```

**For Tests:**
```
Create unit tests for [component/function].
Use Jest and React Testing Library.
Cover happy path, edge cases, and errors.
Aim for >80% coverage.
```

---

**Current Phase:** 🎯 PHASE 1 (Core Functionality)  
**Estimated Time:** 6 weeks to production-ready MVP  
**Last Updated:** January 28, 2026

---

## ✅ Completed Items (Summary)

### Infrastructure & Backend
- [x] Supabase project created and configured
- [x] Database schema: `plots` table with PostGIS geometry column
- [x] Database columns added: `budget_per_ha`, `lo29_boundary_coords`, `datum_source`, `coordinate_confidence`, `grid_station_count`, `grid_spacing_m`, `gross_area_ha`, `last_verified_date`, `notes`
- [x] Database VIEW: `plots_with_geojson` for GeoJSON conversion
- [x] Coordinate transformation SQL (Lo29 → WGS84)
- [x] Plot data inserted (BLOCK-A, BLOCK-B with WGS84 GeoJSON geometry)
- [x] Environment variables configured in `.env.local`

### API Routes
- [x] `GET /api/plots` - Fetches plots with GeoJSON geometry
- [x] `GET /api/dashboard/overview` - Returns dashboard summary data

### UI/UX
- [x] Dashboard UI rendering with TFA brand colors
- [x] Theme system (light/dark mode toggle with custom ThemeContext)
- [x] Contrast ratio improvements across all pages (Activities, Alerts, Reports, Dashboard, Plots)
- [x] Dark mode support for alert cards and Mapbox popups
- [x] "Add Media" and "Log Activity" buttons in dashboard header
- [x] Hydration error fix for "Last Updated" timestamp

### Mapbox Integration
- [x] Mapbox GL JS integrated with satellite view
- [x] Steelpoort Nursery coordinates (-24.721643, 30.194722)
- [x] Plot boundaries rendered as polygons
- [x] Status-based color coding (active/completed/pending)
- [x] Interactive popups on plot click
- [x] Legend for plot status colors
- [x] Center marker with popup

---

*Use this checklist to track progress. Check items off as you complete them. Good luck! 🚀*

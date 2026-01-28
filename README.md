# TFA Farm Operating System (FOS) - MVP

> **"Your boss is data"** — Building TerraFerm Africa's AI-powered farm operations digital twin

## 🎯 Quick Start

```bash
# Clone and install
git clone <repo-url>
cd tfa-farm-os
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your Supabase + API keys

# Initialize database
npm run db:setup

# Run development server
npm run dev

# Deploy (Vercel)
npx vercel
```

## 📁 Project Structure

```
tfa-farm-os/
├── app/                          # Next.js 14 App Router
│   ├── (dashboard)/              # Dashboard routes
│   │   ├── layout.tsx            # Dashboard shell
│   │   ├── page.tsx              # Operations overview
│   │   ├── plots/                # Plot management
│   │   ├── activities/           # Activity logs
│   │   ├── alerts/               # Alert center
│   │   └── reports/              # Reports & analytics
│   ├── api/                      # API routes (serverless)
│   │   ├── activities/           # Activity CRUD
│   │   ├── plots/                # Plot management
│   │   ├── ai/                   # Claude AI processing
│   │   ├── webhooks/             # External integrations
│   │   └── dashboard/            # Dashboard data
│   ├── field/                    # Field worker PWA
│   │   ├── layout.tsx            # Mobile-optimized layout
│   │   ├── page.tsx              # Daily check-in
│   │   └── tasks/                # Task management
│   ├── globals.css               # Tailwind + custom styles
│   └── layout.tsx                # Root layout
├── components/                   # React components
│   ├── ui/                       # shadcn/ui components
│   ├── dashboard/                # Dashboard-specific
│   │   ├── KPICard.tsx           # Metric cards
│   │   ├── AlertBanner.tsx       # Alert display
│   │   ├── ActivityTimeline.tsx  # Activity feed
│   │   └── MapView.tsx           # Mapbox integration
│   ├── field/                    # Field app components
│   │   ├── VoiceRecorder.tsx     # Voice note capture
│   │   ├── PhotoCapture.tsx      # Camera integration
│   │   └── TaskChecklist.tsx     # Task UI
│   └── shared/                   # Shared components
├── lib/                          # Utilities & services
│   ├── supabase/                 # Supabase client
│   │   ├── client.ts             # Browser client
│   │   ├── server.ts             # Server client
│   │   └── types.ts              # Generated types
│   ├── ai/                       # AI processing
│   │   ├── claude.ts             # Anthropic Claude client
│   │   ├── prompts.ts            # Prompt templates
│   │   └── extractors.ts         # Data extraction logic
│   ├── api/                      # External APIs
│   │   ├── weather.ts            # OpenWeatherMap
│   │   ├── whatsapp.ts           # Twilio WhatsApp
│   │   └── maps.ts               # Mapbox helpers
│   ├── utils/                    # Helper functions
│   │   ├── calculations.ts       # Metric calculations
│   │   ├── formatters.ts         # Data formatting
│   │   └── validators.ts         # Input validation
│   └── hooks/                    # Custom React hooks
│       ├── useActivities.ts      # Activity data
│       ├── usePlots.ts           # Plot data
│       └── useRealtime.ts        # Supabase Realtime
├── supabase/                     # Supabase config
│   ├── migrations/               # Database migrations
│   │   ├── 001_initial_schema.sql
│   │   ├── 002_add_indexes.sql
│   │   └── 003_rls_policies.sql
│   ├── functions/                # Edge functions
│   │   └── process-message/      # WhatsApp processor
│   └── config.toml               # Supabase config
├── public/                       # Static assets
│   ├── icons/                    # App icons
│   ├── images/                   # Images
│   └── manifest.json             # PWA manifest
├── scripts/                      # Utility scripts
│   ├── seed-dev-data.ts          # Dev data seeding
│   └── generate-types.ts         # Type generation
├── .env.example                  # Environment template
├── next.config.js                # Next.js config
├── tailwind.config.ts            # Tailwind config
├── tsconfig.json                 # TypeScript config
└── package.json                  # Dependencies
```

## 🛠️ Tech Stack

- **Frontend:** Next.js 14 (App Router), React 18, Tailwind CSS, shadcn/ui
- **Backend:** Supabase (PostgreSQL + PostGIS + Auth + Storage + Realtime)
- **AI:** Anthropic Claude Sonnet 4 (via API)
- **Maps:** Mapbox GL JS
- **Deployment:** Vercel (frontend), Supabase Cloud (backend)

## 🔑 Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key

# Anthropic Claude
ANTHROPIC_API_KEY=your-api-key

# Mapbox
NEXT_PUBLIC_MAPBOX_TOKEN=your-mapbox-token

# Twilio WhatsApp
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# OpenWeatherMap
OPENWEATHER_API_KEY=your-api-key

# Steelpoort Coordinates (for default map center)
NEXT_PUBLIC_DEFAULT_LAT=-24.7333
NEXT_PUBLIC_DEFAULT_LNG=29.9167
```

## 📦 Key Dependencies

```json
{
  "dependencies": {
    "next": "^14.1.0",
    "react": "^18.2.0",
    "@supabase/supabase-js": "^2.39.0",
    "@anthropic-ai/sdk": "^0.20.0",
    "mapbox-gl": "^3.1.0",
    "@radix-ui/react-*": "latest",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0",
    "date-fns": "^3.0.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/node": "^20.11.0",
    "@types/react": "^18.2.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
```

## 🚀 Development Workflow

### 1. Initial Setup

```bash
# Install dependencies
npm install

# Generate Supabase types
npm run types:generate

# Run migrations
npm run db:migrate

# Seed development data
npm run db:seed
```

### 2. Development Server

```bash
npm run dev
# Open http://localhost:3000
```

### 3. Database Changes

```bash
# Create new migration
npx supabase migration new migration_name

# Apply migrations
npm run db:migrate

# Reset database (caution: destroys data)
npm run db:reset
```

### 4. Deployment

```bash
# Deploy to Vercel
vercel --prod

# Push Supabase migrations
npx supabase db push
```

## 📱 PWA Features

The field worker app is a Progressive Web App with:
- ✅ Offline support (service worker)
- ✅ Install to home screen
- ✅ Push notifications
- ✅ Background sync (queue operations when offline)

## 🗺️ Mapbox Integration

Using Mapbox GL JS for:
- Plot boundary visualization (GeoJSON polygons)
- Activity markers with clustering
- Satellite imagery base layer
- Density heatmaps
- Custom TFA brand styling

## 🤖 AI Processing Flow

```
WhatsApp Message → Twilio Webhook → /api/webhooks/whatsapp
                                        ↓
                            Claude API Processing
                            (extract structured data)
                                        ↓
                            Create Activity Record
                                        ↓
                            Trigger Alerts (if needed)
                                        ↓
                            Update Dashboard (Realtime)
```

## 📊 Key Metrics

Dashboard tracks:
- **Area Planted:** Total ha completed
- **Planting Rate:** Cladodes per day
- **Plant Density:** Plants per hectare
- **Survival Rate:** % plants alive
- **Cost Efficiency:** Actual vs budget R/ha
- **Labor Productivity:** Output per worker

## 🔒 Security

- Row-Level Security (RLS) enabled on all tables
- API routes authenticated via Supabase JWT
- Service role key never exposed to client
- WhatsApp webhook validated with Twilio signature

## 🧪 Testing Strategy

```bash
# Run unit tests
npm test

# E2E tests (Playwright)
npm run test:e2e

# Type check
npm run type-check

# Lint
npm run lint
```

## 📖 Documentation

- [PRD](./TFA_Farm_OS_PRD.md) - Product Requirements
- [Database Schema](./supabase/schema.md) - Table structures
- [API Reference](./docs/API.md) - Endpoint documentation
- [Component Library](./docs/COMPONENTS.md) - UI components

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/name`
2. Commit changes: `git commit -m 'Add feature'`
3. Push to branch: `git push origin feature/name`
4. Open Pull Request

## 📞 Support

- **Slack:** #tfa-farm-os
- **Email:** tech@terraferm.africa
- **Issues:** GitHub Issues

---

**Built with ❤️ for TerraFerm Africa**  
*"Turning desert into the energy equivalent of Saudi oil fields"*

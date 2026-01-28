# TFA Farm OS - Deployment Guide

## Overview

TFA Farm OS is deployed on Vercel with Supabase as the backend.

## Prerequisites

- Node.js 18+
- Vercel account
- Supabase project
- Anthropic API key
- (Optional) Twilio account for WhatsApp
- (Optional) Mapbox account for maps

## Environment Variables

Required environment variables for deployment:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Anthropic
ANTHROPIC_API_KEY=sk-ant-api03-...

# Mapbox
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1...

# Optional: Twilio
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=xxxxx
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

## Deployment Steps

### 1. Prepare the Database

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push

# Seed development data (optional)
npm run db:seed
```

### 2. Deploy to Vercel

**Option A: Vercel Dashboard**

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure environment variables
4. Deploy

**Option B: Vercel CLI**

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy to production
vercel --prod
```

**Option C: Use Deploy Script**

```bash
./scripts/deploy.sh production
```

### 3. Configure Webhooks

#### WhatsApp Webhook (Twilio)

1. Go to Twilio Console → Messaging → Settings
2. Navigate to WhatsApp Sandbox Settings
3. Set webhook URL: `https://your-app.vercel.app/api/webhooks/whatsapp`
4. Method: POST
5. Save

#### Database Webhooks (Optional)

In Supabase Dashboard:
1. Go to Database → Webhooks
2. Create webhook for activities table
3. Target URL: `https://your-app.vercel.app/api/webhooks/activity-created`

## Post-Deployment Checklist

- [ ] Verify app loads at production URL
- [ ] Test authentication flow
- [ ] Check dashboard data displays
- [ ] Test activity creation
- [ ] Verify WhatsApp webhook (if configured)
- [ ] Check map displays correctly
- [ ] Test mobile responsiveness
- [ ] Monitor error logs

## CI/CD Setup

Add to `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## Monitoring

### Vercel Dashboard
- View deployments and logs
- Monitor serverless function performance
- Check analytics

### Supabase Dashboard
- Monitor database queries
- View real-time connections
- Check storage usage

### Error Tracking
Consider adding Sentry for error tracking:

```bash
npm install @sentry/nextjs
```

## Rollback

If issues occur after deployment:

```bash
# List recent deployments
vercel list

# Rollback to previous deployment
vercel rollback
```

## Environment-Specific Deployments

### Staging

```bash
vercel --env staging
```

### Preview (Pull Requests)

Vercel automatically creates preview deployments for PRs.

## Performance Optimization

1. **Enable ISR** for static pages
2. **Use Edge Runtime** for API routes
3. **Configure caching** headers
4. **Enable Vercel Analytics**

## Troubleshooting

### Build Fails

```bash
# Check TypeScript errors
npm run build

# Check for missing dependencies
npm ci
```

### API Errors

1. Check environment variables are set
2. Verify Supabase connection
3. Check API route logs in Vercel dashboard

### Database Connection Issues

1. Verify Supabase project is active
2. Check RLS policies
3. Verify service role key for admin operations

## Support

- **Documentation:** `/docs` folder
- **Issues:** GitHub Issues
- **Email:** tech@terraferm.africa

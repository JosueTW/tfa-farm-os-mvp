# TFA FARM OS - QUICKSTART GUIDE

## 🚀 Get Running in 15 Minutes

### Prerequisites

```bash
# Required
Node.js >= 18
npm >= 9
Git

# Accounts needed (all have free tiers)
- Supabase account (https://supabase.com)
- Anthropic account (https://console.anthropic.com)
- Mapbox account (https://account.mapbox.com)
- Twilio account (https://console.twilio.com) - optional for WhatsApp
```

### Step 1: Clone & Install (2 minutes)

```bash
# Clone the repository
git clone <your-repo-url>
cd tfa-farm-os

# Install dependencies
npm install
```

### Step 2: Setup Supabase (5 minutes)

1. **Create a new project** at https://supabase.com
   - Project name: `tfa-farm-os`
   - Database password: (save this!)
   - Region: Choose closest to South Africa

2. **Get your credentials**
   - Go to Project Settings → API
   - Copy `Project URL` and `anon public` key

3. **Run the database migration**
   ```bash
   # Install Supabase CLI
   npm install -g supabase

   # Login
   supabase login

   # Link to your project
   supabase link --project-ref your-project-ref

   # Run migrations
   supabase db push
   ```

### Step 3: Setup Environment Variables (3 minutes)

```bash
# Copy the template
cp .env.example .env.local

# Edit .env.local with your values
nano .env.local
```

**Minimum required variables:**

```bash
# Supabase (from Step 2)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Anthropic Claude
ANTHROPIC_API_KEY=sk-ant-api03-...

# Mapbox
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1...
```

**Optional (can add later):**
- Twilio WhatsApp credentials
- OpenWeatherMap API key

### Step 4: Seed Sample Data (2 minutes)

```bash
# Create sample plots and activities
npm run db:seed
```

This creates:
- 3 sample plots (Plot 1A, 2A, 3B)
- 10 sample activities
- 5 field observations
- Sample weather data

### Step 5: Run Development Server (1 minute)

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### Step 6: Test the System (2 minutes)

**Dashboard Test:**
1. Navigate to http://localhost:3000
2. You should see the Operations Overview dashboard
3. Check that plots appear on the map
4. Verify KPI cards show sample data

**API Test:**
```bash
# Test activity creation
curl -X POST http://localhost:3000/api/activities \
  -H "Content-Type: application/json" \
  -d '{
    "plot_id": "...",
    "activity_type": "planting",
    "activity_date": "2026-01-26",
    "cladodes_planted": 400,
    "workers_count": 6
  }'
```

**WhatsApp Test (if configured):**
1. Save your Twilio WhatsApp number
2. Send a message: "Planted 400 cladodes in Plot 2A with 6 workers"
3. Check dashboard for new activity

---

## 📱 Setting Up WhatsApp Integration

### Step 1: Twilio Setup

1. **Get a Twilio Account** (free trial available)
   - Sign up at https://console.twilio.com
   - Verify your phone number

2. **Enable WhatsApp Sandbox**
   - Go to Messaging → Try it Out → Send a WhatsApp message
   - Follow instructions to join sandbox (send "join <code>" to their number)

3. **Get Credentials**
   - Account SID (from Console Dashboard)
   - Auth Token (from Console Dashboard)
   - WhatsApp number: `whatsapp:+14155238886` (sandbox)

4. **Add to .env.local**
   ```bash
   TWILIO_ACCOUNT_SID=ACxxxxx...
   TWILIO_AUTH_TOKEN=xxxxx...
   TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
   ```

### Step 2: Configure Webhook

**For Development (using ngrok):**

```bash
# Install ngrok
npm install -g ngrok

# Start ngrok tunnel
ngrok http 3000

# Copy the https URL (e.g., https://abc123.ngrok.io)
```

**Set webhook in Twilio:**
1. Go to Messaging → Settings → WhatsApp Sandbox
2. Set "When a message comes in": `https://your-ngrok-url.ngrok.io/api/webhooks/whatsapp`
3. Method: POST
4. Save

**For Production (after deploying to Vercel):**
- Use your Vercel URL: `https://your-app.vercel.app/api/webhooks/whatsapp`

### Step 3: Test WhatsApp

Send a message to your WhatsApp sandbox number:

```
Planted 400 cladodes in Plot 2A today with 6 workers. 
Rows look good but spacing is a bit tight.
```

Check your dashboard - you should see a new activity logged automatically!

---

## 🗺️ Setting Up Mapbox

1. **Create account** at https://account.mapbox.com
2. **Get access token** from Account → Tokens
3. **Add to .env.local**:
   ```bash
   NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1...
   ```

---

## 🌤️ Setting Up Weather Data

1. **Create account** at https://openweathermap.org
2. **Get API key** from My API Keys
3. **Add to .env.local**:
   ```bash
   OPENWEATHER_API_KEY=xxxxx...
   ```

Weather data will auto-update every hour.

---

## 🎨 Customizing for Your Farm

### Add Your Plot Boundaries

1. Go to http://geojson.io
2. Draw your plot boundaries (polygons)
3. Copy the GeoJSON
4. Create plots in database:

```sql
INSERT INTO plots (plot_code, plot_name, geometry, area_ha, planned_density)
VALUES (
  '1A',
  'Main Field North',
  ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[...]}'),
  0.5,
  12000
);
```

### Update Default Location

In `.env.local`, change to your farm coordinates:

```bash
NEXT_PUBLIC_DEFAULT_LAT=-24.7333    # Steelpoort default
NEXT_PUBLIC_DEFAULT_LNG=29.9167
```

---

## 🚨 Common Issues

### "Database unavailable"
- Check Supabase credentials in .env.local
- Verify migrations ran successfully: `supabase db push`
- Check Supabase project is not paused (free tier pauses after 7 days inactivity)

### "Unauthorized" on API calls
- Ensure user is authenticated (Supabase Auth)
- Check RLS policies are enabled
- Verify service role key is set for admin operations

### WhatsApp messages not processing
- Check ngrok tunnel is still active
- Verify webhook URL in Twilio console
- Check Anthropic API key is valid
- View logs: `npm run dev` should show webhook hits

### Map not loading
- Verify Mapbox token is correct
- Check browser console for errors
- Ensure token has correct permissions (default public token works)

---

## 📚 Next Steps

1. **Deploy to Production**
   ```bash
   # Push to GitHub
   git push origin main
   
   # Deploy to Vercel
   vercel --prod
   ```

2. **Add Team Members**
   - Invite users via Supabase Auth
   - Set roles in `user_profiles` table

3. **Configure Alerts**
   - Set notification recipients in .env.local
   - Customize alert thresholds

4. **Build Mobile App**
   - Follow instructions in `/app/field/README.md`
   - Deploy as PWA or native app with Expo

---

## 💡 Pro Tips

**For Claude API Cost Management:**
- Set daily budget limit in .env.local
- Monitor usage in Anthropic console
- Use caching for repeated queries

**For Better AI Accuracy:**
- Encourage workers to use consistent format
- Provide examples: "Planted X in Plot Y with Z workers"
- Review low-confidence extractions regularly

**For Offline Support:**
- Enable service worker in production
- Field app queues operations when offline
- Auto-syncs when connection restored

---

## 📞 Need Help?

- **Documentation:** `/docs` folder
- **Slack:** #tfa-farm-os
- **Email:** tech@terraferm.africa
- **Issues:** GitHub Issues

---

**Built with ❤️ for TerraFerm Africa**  
*"Your boss is data"* — Elon Musk

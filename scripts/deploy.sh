#!/bin/bash

# TFA Farm OS - Deployment Script
# Usage: ./scripts/deploy.sh [environment]

set -e

ENVIRONMENT="${1:-production}"

echo "🚀 Deploying TFA Farm OS to $ENVIRONMENT..."
echo ""

# Check for required environment variables
check_env() {
  if [ -z "${!1}" ]; then
    echo "❌ Error: $1 is not set"
    exit 1
  fi
}

# Pre-deployment checks
echo "📋 Running pre-deployment checks..."

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  echo "❌ Node.js 18+ is required. Current: $(node -v)"
  exit 1
fi
echo "   ✅ Node.js version: $(node -v)"

# Check if package.json exists
if [ ! -f "package.json" ]; then
  echo "❌ package.json not found. Are you in the project root?"
  exit 1
fi
echo "   ✅ package.json found"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm ci --silent

# Run linting
echo ""
echo "🔍 Running linter..."
npm run lint || {
  echo "⚠️  Linting warnings found. Continuing..."
}

# Run type checking
echo ""
echo "📝 Running TypeScript check..."
npx tsc --noEmit || {
  echo "❌ TypeScript errors found. Please fix before deploying."
  exit 1
}

# Build the application
echo ""
echo "🔨 Building application..."
npm run build

# Run tests (if available)
if npm run test --dry-run 2>/dev/null; then
  echo ""
  echo "🧪 Running tests..."
  npm test || {
    echo "❌ Tests failed. Please fix before deploying."
    exit 1
  }
fi

# Deploy based on environment
echo ""
if [ "$ENVIRONMENT" == "production" ]; then
  echo "🚀 Deploying to production..."
  
  # Check for Vercel CLI
  if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm install -g vercel
  fi
  
  # Deploy to Vercel
  vercel --prod
  
elif [ "$ENVIRONMENT" == "staging" ]; then
  echo "🚀 Deploying to staging..."
  vercel
  
else
  echo "🚀 Deploying to $ENVIRONMENT..."
  vercel --env $ENVIRONMENT
fi

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📊 Post-deployment checklist:"
echo "   [ ] Verify the deployment at the provided URL"
echo "   [ ] Check Supabase dashboard for database status"
echo "   [ ] Test WhatsApp webhook (if configured)"
echo "   [ ] Monitor error logs in Vercel dashboard"
echo ""

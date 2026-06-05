# 🚀 Production Deployment Guide

Complete deployment guide with copy-paste scripts for multiple hosting platforms.

---

## Pre-Deployment Checklist

Before deploying to production:

- [ ] All environment variables documented
- [ ] Database schema applied
- [ ] Sample data inserted (optional)
- [ ] Auth0 configured with production URLs
- [ ] S3 bucket created and CORS configured
- [ ] Backend tested locally
- [ ] Frontend tested locally
- [ ] All tests passing
- [ ] No console errors
- [ ] Mobile responsive verified
- [ ] Performance tested

---

## Option 1: Full Stack on Railway (Easiest)

Railway provides both backend and database in one platform.

### Step 1: Install Railway CLI

```bash
npm install -g @railway/cli
railway login
```

### Step 2: Deploy Backend

```bash
cd reglantern-api

# Initialize Railway project
railway init

# Link to your Railway account
railway link

# Add PostgreSQL database
railway add

# Choose: PostgreSQL

# Set environment variables
railway variables set NODE_ENV=production
railway variables set PORT=3000
railway variables set AUTH0_DOMAIN=your-tenant.auth0.com
railway variables set AUTH0_AUDIENCE=https://api.reglantern.com
railway variables set AWS_ACCESS_KEY_ID=your-key
railway variables set AWS_SECRET_ACCESS_KEY=your-secret
railway variables set AWS_S3_BUCKET=reglantern-files-prod
railway variables set AWS_REGION=us-east-1
railway variables set CORS_ORIGIN=https://your-frontend.vercel.app

# Deploy
railway up
```

### Step 3: Get Database URL

```bash
# Railway automatically creates DATABASE_URL
# View it with:
railway variables

# Copy the DATABASE_URL value
```

### Step 4: Run Database Migrations

```bash
# Connect to Railway database
railway run psql $DATABASE_URL

# Copy-paste the schema from DEVELOPER_HANDOFF.md
# Or create a migration file:

# Create migrations/001_initial_schema.sql
# Paste the schema from DEVELOPER_HANDOFF.md

# Run migration
railway run node scripts/migrate.js
```

### Step 5: Get Backend URL

```bash
railway domain
# Output: reglantern-api-production.up.railway.app
```

---

## Option 2: Backend on Heroku

### Deploy to Heroku

```bash
cd reglantern-api

# Login to Heroku
heroku login

# Create app
heroku create reglantern-api

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set AUTH0_DOMAIN=your-tenant.auth0.com
heroku config:set AUTH0_AUDIENCE=https://api.reglantern.com
heroku config:set AWS_ACCESS_KEY_ID=your-key
heroku config:set AWS_SECRET_ACCESS_KEY=your-secret
heroku config:set AWS_S3_BUCKET=reglantern-files-prod
heroku config:set AWS_REGION=us-east-1
heroku config:set CORS_ORIGIN=https://your-frontend.vercel.app

# Create Procfile
echo "web: npm start" > Procfile

# Deploy
git init
git add .
git commit -m "Initial commit"
git push heroku main

# Run migrations
heroku run psql $DATABASE_URL
# Paste schema
```

**Backend URL:** `https://reglantern-api.herokuapp.com`

---

## Option 3: Backend on AWS Elastic Beanstalk

### Create Elastic Beanstalk Application

```bash
# Install EB CLI
pip install awsebcli

# Initialize
cd reglantern-api
eb init -p node.js-18 reglantern-api --region us-east-1

# Create environment
eb create reglantern-production

# Set environment variables
eb setenv NODE_ENV=production \
  AUTH0_DOMAIN=your-tenant.auth0.com \
  AUTH0_AUDIENCE=https://api.reglantern.com \
  AWS_ACCESS_KEY_ID=your-key \
  AWS_SECRET_ACCESS_KEY=your-secret \
  AWS_S3_BUCKET=reglantern-files-prod \
  AWS_REGION=us-east-1 \
  CORS_ORIGIN=https://your-frontend.vercel.app \
  DATABASE_URL=your-rds-connection-string

# Deploy
eb deploy

# Open in browser
eb open
```

---

## Frontend Deployment

### Option 1: Vercel (Recommended)

```bash
cd your-frontend-folder

# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Answer prompts:
# Set up and deploy? Yes
# Which scope? Your account
# Link to existing project? No
# Project name? reglantern
# Directory? ./
# Override settings? No

# Set environment variables in Vercel Dashboard:
# https://vercel.com/your-username/reglantern/settings/environment-variables

# Or set via CLI:
vercel env add VITE_API_BASE_URL production
# Paste: https://reglantern-api-production.up.railway.app/api/v1

vercel env add VITE_AUTH0_DOMAIN production
# Paste: your-tenant.auth0.com

vercel env add VITE_AUTH0_CLIENT_ID production
# Paste: your-client-id

vercel env add VITE_AUTH0_AUDIENCE production
# Paste: https://api.reglantern.com

# Deploy to production
vercel --prod
```

**Frontend URL:** `https://reglantern.vercel.app`

---

### Option 2: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Build
npm run build

# Deploy
netlify deploy --prod

# Set environment variables
netlify env:set VITE_API_BASE_URL "https://reglantern-api-production.up.railway.app/api/v1"
netlify env:set VITE_AUTH0_DOMAIN "your-tenant.auth0.com"
netlify env:set VITE_AUTH0_CLIENT_ID "your-client-id"
netlify env:set VITE_AUTH0_AUDIENCE "https://api.reglantern.com"

# Redeploy with env vars
netlify deploy --prod
```

---

### Option 3: AWS S3 + CloudFront

```bash
# Build
npm run build

# Create S3 bucket
aws s3 mb s3://reglantern-frontend

# Enable static website hosting
aws s3 website s3://reglantern-frontend --index-document index.html --error-document index.html

# Upload files
aws s3 sync dist/ s3://reglantern-frontend --delete

# Create CloudFront distribution (for HTTPS)
aws cloudfront create-distribution \
  --origin-domain-name reglantern-frontend.s3.amazonaws.com \
  --default-root-object index.html
```

---

## Post-Deployment Configuration

### 1. Update Auth0

Go to Auth0 Dashboard → Applications → Your App → Settings:

**Allowed Callback URLs:**
```
https://reglantern.vercel.app,
https://reglantern.vercel.app/callback
```

**Allowed Logout URLs:**
```
https://reglantern.vercel.app
```

**Allowed Web Origins:**
```
https://reglantern.vercel.app
```

**Allowed Origins (CORS):**
```
https://reglantern.vercel.app
```

---

### 2. Update S3 CORS

Go to AWS S3 → Your Bucket → Permissions → CORS configuration:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": [
      "http://localhost:5173",
      "https://reglantern.vercel.app"
    ],
    "ExposeHeaders": ["ETag"]
  }
]
```

---

### 3. Update Backend CORS

In your Railway/Heroku dashboard, update environment variable:

```bash
CORS_ORIGIN=https://reglantern.vercel.app
```

---

### 4. Set Up Custom Domain (Optional)

#### Vercel

```bash
# Add domain
vercel domains add reglantern.com

# Follow instructions to update DNS
# Add CNAME record: reglantern.com → cname.vercel-dns.com
```

#### Railway

1. Go to Railway dashboard
2. Click your project
3. Settings → Domains
4. Add custom domain
5. Update DNS records as instructed

---

## Database Backup Setup

### Automated Backups on Railway

```bash
# Railway includes automatic daily backups

# Manual backup:
railway run pg_dump $DATABASE_URL > backup.sql

# Restore:
railway run psql $DATABASE_URL < backup.sql
```

### Automated Backups on Heroku

```bash
# Enable automatic backups (paid add-on)
heroku addons:create heroku-postgresql-backups:month

# Manual backup
heroku pg:backups:capture

# Download backup
heroku pg:backups:download

# Restore
heroku pg:backups:restore
```

---

## Monitoring Setup

### 1. Sentry (Error Tracking)

```bash
# Install
npm install @sentry/react @sentry/node

# Frontend: src/main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production",
  tracesSampleRate: 1.0,
});

# Backend: src/server.ts
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production",
  tracesSampleRate: 1.0,
});

app.use(Sentry.Handlers.errorHandler());
```

---

### 2. LogRocket (Session Replay)

```bash
# Install
npm install logrocket

# src/main.tsx
import LogRocket from 'logrocket';

LogRocket.init('your-app-id');

// Identify user after login
LogRocket.identify(user.id, {
  name: user.name,
  email: user.email,
});
```

---

### 3. Uptime Monitoring

**UptimeRobot (Free):**

1. Go to https://uptimerobot.com
2. Add Monitor
3. Type: HTTPS
4. URL: `https://reglantern.vercel.app`
5. Interval: 5 minutes
6. Add email alert

---

## CI/CD Setup

### GitHub Actions (Auto-deploy on push)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install Railway CLI
        run: npm install -g @railway/cli
      - name: Deploy to Railway
        run: railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install dependencies
        run: npm install
      - name: Build
        run: npm run build
      - name: Deploy to Vercel
        run: vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
```

Add secrets in GitHub: Settings → Secrets → Actions

---

## Performance Optimization

### 1. Enable Gzip Compression

```typescript
// src/server.ts
import compression from 'compression';

app.use(compression());
```

### 2. Add Response Caching

```typescript
// src/middleware/cache.ts
import cache from 'express-cache-controller';

app.use(cache({ maxAge: 300 })); // 5 minutes
```

### 3. Database Connection Pooling

```typescript
// Already configured in src/config/database.ts
const pool = new Pool({
  max: 20, // maximum number of clients
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

### 4. CDN for Files

Use CloudFront to serve S3 files:

```bash
# Create CloudFront distribution
aws cloudfront create-distribution \
  --origin-domain-name reglantern-files-prod.s3.amazonaws.com

# Update file URLs to use CloudFront
# https://d1234567890.cloudfront.net/files/...
```

---

## Security Hardening

### 1. Rate Limiting

```bash
npm install express-rate-limit
```

```typescript
// src/server.ts
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### 2. Security Headers

```typescript
// Already installed: helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));
```

### 3. HTTPS Only

```typescript
// Force HTTPS
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https' && process.env.NODE_ENV === 'production') {
    res.redirect(`https://${req.header('host')}${req.url}`);
  } else {
    next();
  }
});
```

---

## Health Checks

### Backend Health Check

```typescript
// src/server.ts
app.get('/health', async (req, res) => {
  try {
    // Check database
    await pool.query('SELECT 1');
    
    // Check S3
    // await s3Client.send(new HeadBucketCommand({ Bucket: S3_BUCKET }));
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: 'connected',
      // s3: 'connected',
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message,
    });
  }
});
```

Test it:
```bash
curl https://reglantern-api-production.up.railway.app/health
```

---

## Smoke Tests After Deployment

### 1. Backend Tests

```bash
# Health check
curl https://your-api.com/health

# Get tasks (with auth token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://your-api.com/api/v1/tasks

# Should return: {"data": [...]}
```

### 2. Frontend Tests

Open in browser:
```
https://reglantern.vercel.app
```

Test:
- [ ] Login works
- [ ] Tasks load
- [ ] Can toggle checkbox
- [ ] Can edit task
- [ ] Can upload file
- [ ] Mobile responsive
- [ ] No console errors

---

## Rollback Procedure

### If deployment fails:

#### Railway
```bash
# List deployments
railway status

# Rollback to previous
railway rollback <deployment-id>
```

#### Vercel
```bash
# List deployments
vercel ls

# Rollback
vercel rollback <deployment-url>
```

#### Heroku
```bash
# List releases
heroku releases

# Rollback
heroku rollback v<previous-version>
```

---

## Cost Estimation

### Monthly Costs (Starting)

**Free Tier:**
- Vercel: Free (hobby plan)
- Railway: $5/month (includes database)
- Auth0: Free (up to 7,000 users)
- AWS S3: ~$0.50/month (100GB storage)
- Total: **~$5.50/month**

**Production (1,000 active users):**
- Vercel: Free (hobby) or $20/month (pro)
- Railway: $20/month (better performance)
- Auth0: Free (up to 7,000 users)
- AWS S3: ~$5/month (500GB storage)
- Monitoring (Sentry): $26/month
- Total: **~$51/month** (hobby) or **~$71/month** (pro)

**Scale (10,000 active users):**
- Vercel: $20/month (pro)
- Railway: $50/month (more resources)
- Auth0: $240/month (enterprise)
- AWS S3: ~$50/month (5TB storage)
- Monitoring: $89/month
- Total: **~$449/month**

---

## Launch Day Checklist

### 1 Hour Before Launch

- [ ] Final smoke test on production
- [ ] Database backup created
- [ ] Monitoring active (Sentry, LogRocket)
- [ ] Uptime monitoring configured
- [ ] Error alerts configured
- [ ] Team notified
- [ ] Rollback plan ready

### At Launch

- [ ] Verify health check passes
- [ ] Test login flow
- [ ] Test core features
- [ ] Monitor error rates
- [ ] Monitor API response times
- [ ] Check database connections

### 1 Hour After Launch

- [ ] Check error rates (should be < 1%)
- [ ] Check API response times (should be < 500ms)
- [ ] Verify users can sign up/login
- [ ] Verify tasks persist
- [ ] Verify file uploads work
- [ ] Check mobile experience

### 24 Hours After Launch

- [ ] Review error logs
- [ ] Check user feedback
- [ ] Verify backups ran
- [ ] Check resource usage
- [ ] Plan any hotfixes needed

---

## Support Runbook

### Common Issues

#### Users can't log in
1. Check Auth0 status
2. Verify callback URLs configured
3. Check browser console for errors
4. Verify API is responding

#### Tasks not loading
1. Check backend health check
2. Check database connection
3. Verify API authentication
4. Check CORS configuration

#### Files not uploading
1. Check S3 bucket permissions
2. Verify CORS configuration
3. Check presigned URL generation
4. Verify file size limits

---

## Scaling Guidelines

### When to scale:

**Backend:**
- CPU > 70% for sustained periods
- Response time > 500ms p95
- Error rate > 1%
- Database connections maxed out

**Database:**
- Connection pool exhausted
- Query times > 100ms p95
- Storage > 80% used
- CPU > 70%

**Frontend:**
- Bundle size > 500KB
- Initial load > 3 seconds
- Time to interactive > 5 seconds

---

## Conclusion

You now have:

✅ Complete deployment scripts  
✅ Monitoring setup  
✅ CI/CD pipeline  
✅ Backup strategy  
✅ Rollback procedure  
✅ Security hardening  
✅ Performance optimization  
✅ Support runbook  

**Your app is production-ready!** 🎉

---

## Quick Reference Commands

```bash
# Deploy backend (Railway)
railway up

# Deploy frontend (Vercel)
vercel --prod

# Check backend health
curl https://your-api.com/health

# View backend logs
railway logs

# View frontend logs
vercel logs

# Database backup
railway run pg_dump $DATABASE_URL > backup.sql

# Rollback backend
railway rollback

# Rollback frontend
vercel rollback
```

---

**Need help?** Check the troubleshooting section in DEVELOPER_HANDOFF.md

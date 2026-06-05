# 🚀 Quick Start Cheat Sheet - Copy & Paste Guide

Get your Reglantern app production-ready in under an hour with this rapid implementation guide.

---

## 🎯 Complete Setup in 6 Commands

```bash
# 1. Backend Setup
mkdir reglantern-api && cd reglantern-api
npm init -y
npm install express pg cors dotenv helmet express-jwt jwks-rsa @aws-sdk/client-s3 @aws-sdk/s3-request-presigner uuid joi
npm install -D typescript @types/express @types/node @types/cors ts-node nodemon

# 2. Frontend Updates
cd ../your-frontend-folder
npm install @tanstack/react-query @auth0/auth0-react axios

# Done! Now configure...
```

---

## ⚡ 5-Minute Database Setup (Supabase)

### Option A: Supabase (Easiest)

1. Go to [supabase.com](https://supabase.com) → Create project
2. Go to SQL Editor → Run this:

```sql
-- Copy-paste the entire schema from DEVELOPER_HANDOFF.md lines 30-130
-- Or use this minimal version:

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    initials VARCHAR(10) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    auth0_id VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE health_centers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'In Progress',
    completed BOOLEAN DEFAULT FALSE,
    due_date DATE,
    assigned_to_user_id INTEGER REFERENCES users(id),
    health_center_id INTEGER REFERENCES health_centers(id),
    attention_type VARCHAR(50),
    attention_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
    patient_id INTEGER,
    filename VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    file_category VARCHAR(100) NOT NULL,
    storage_key TEXT NOT NULL,
    storage_url TEXT,
    uploaded_at TIMESTAMP DEFAULT NOW()
);

-- Insert sample data
INSERT INTO users (email, initials, full_name) VALUES
('tim.freeman@reglantern.com', 'TF', 'Tim Freeman'),
('sarah.martinez@reglantern.com', 'SM', 'Sarah Martinez');

INSERT INTO health_centers (name) VALUES
('Mountain View Clinic'),
('Riverside Health Center');
```

3. Get connection string: Settings → Database → Connection string
4. Copy it → You'll use this as `DATABASE_URL`

---

## 🔐 5-Minute Auth Setup (Auth0)

1. Go to [auth0.com](https://auth0.com) → Sign up → Create Application
2. Choose "Single Page Web Application"
3. Settings:
   - Allowed Callback URLs: `http://localhost:5173, https://yourdomain.com`
   - Allowed Logout URLs: `http://localhost:5173, https://yourdomain.com`
   - Allowed Web Origins: `http://localhost:5173, https://yourdomain.com`
4. Save these values:
   - Domain: `your-tenant.auth0.com`
   - Client ID: `abc123...`
5. Create an API:
   - APIs → Create API
   - Identifier: `https://api.reglantern.com`
   - Save this as your "Audience"

Done! Use these in your `.env` files.

---

## ☁️ 5-Minute File Storage (AWS S3)

### Quick S3 Setup

1. Go to AWS Console → S3 → Create Bucket
2. Name: `reglantern-files-prod`
3. Region: `us-east-1` (or your preference)
4. Block all public access: **UNCHECK** (we'll use presigned URLs)
5. Create bucket

### CORS Configuration

Bucket → Permissions → CORS configuration:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["http://localhost:5173", "https://yourdomain.com"],
    "ExposeHeaders": ["ETag"]
  }
]
```

### Get AWS Credentials

1. IAM → Users → Create user → `reglantern-s3-user`
2. Attach policy: `AmazonS3FullAccess` (or create custom with just S3 access)
3. Security credentials → Create access key
4. Save:
   - Access Key ID: `AKIA...`
   - Secret Access Key: `abc123...`

---

## 📝 Copy-Paste .env Files

### Backend `.env`

```bash
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://postgres:password@localhost:5432/reglantern
# ☝️ Replace with your Supabase connection string

AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_AUDIENCE=https://api.reglantern.com

AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=abc123...
AWS_S3_BUCKET=reglantern-files-prod
AWS_REGION=us-east-1

CORS_ORIGIN=http://localhost:5173
```

### Frontend `.env`

```bash
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=abc123...
VITE_AUTH0_AUDIENCE=https://api.reglantern.com
```

---

## 🏃 Run Everything Locally

### Terminal 1 - Backend
```bash
cd reglantern-api
npm run dev
# Should see: "🚀 Server running on port 3000"
```

### Terminal 2 - Frontend
```bash
cd your-frontend-folder
npm run dev
# Should see: "Local: http://localhost:5173"
```

### Test It
1. Open `http://localhost:5173`
2. Click "Log In"
3. Sign in with Auth0
4. You should see tasks loaded from database!

---

## 🧪 Quick Test Commands

### Test Backend

```bash
# Health check
curl http://localhost:3000/health

# Get tasks (replace YOUR_TOKEN)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/v1/tasks

# Create task
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Task"}' \
  http://localhost:3000/api/v1/tasks
```

### Get Your Token

1. Open browser console on your app
2. Run: `localStorage.getItem('auth_token')`
3. Copy the token
4. Use in cURL commands above

---

## 🚀 Deploy in Minutes

### Backend → Railway

```bash
npm install -g @railway/cli
railway login
railway init
railway up

# Set environment variables in Railway dashboard
# Use the same values from your .env but with production URLs
```

Railway will give you: `https://reglantern-api-production.up.railway.app`

### Frontend → Vercel

```bash
npm install -g vercel
vercel

# Or just:
# 1. Push to GitHub
# 2. Go to vercel.com → Import Project
# 3. Add environment variables (use production API URL)
```

Vercel will give you: `https://reglantern.vercel.app`

### Update URLs

After deploying:

1. **Auth0:**
   - Add production URLs to Allowed Callbacks/Logout URLs
   
2. **S3 CORS:**
   - Add production URL to allowed origins

3. **Backend .env:**
   ```bash
   CORS_ORIGIN=https://reglantern.vercel.app
   ```

4. **Frontend .env.production:**
   ```bash
   VITE_API_BASE_URL=https://reglantern-api-production.up.railway.app/api/v1
   ```

---

## 🐛 Common Issues & Fixes

### Issue: CORS Error

**Fix:** Update backend CORS:
```javascript
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));
```

### Issue: 401 Unauthorized

**Fix:** Check token:
```javascript
// Browser console
localStorage.getItem('auth_token')
```

If null, user isn't logged in. If exists but still 401, check Auth0 audience matches.

### Issue: Database Connection Failed

**Fix:** Check connection string format:
```
postgresql://user:password@host:port/database?sslmode=require
```

For Supabase, use the "pooler" connection string.

### Issue: File Upload Fails

**Fix:** Check S3 CORS and bucket permissions. Try uploading a file directly to S3 to test.

### Issue: Can't Find Types

**Fix:**
```bash
npm install -D @types/node @types/express @types/cors
```

---

## 📊 Monitoring Checklist

After deployment:

- [ ] Set up [Sentry](https://sentry.io) for error tracking
- [ ] Set up [LogRocket](https://logrocket.com) for session replay
- [ ] Add [Uptime Robot](https://uptimerobot.com) for uptime monitoring
- [ ] Configure database backups (Supabase does this automatically)
- [ ] Set up SSL certificate (Vercel/Railway handle this)

---

## 🎨 Customization Quick Wins

### Change Primary Color

Find all instances of `#fc6` (yellow) and replace with your brand color:

```bash
# In your frontend folder
find ./src -type f -name "*.tsx" -o -name "*.css" | xargs sed -i 's/#fc6/#your-color/g'
```

### Change Logo

Replace `/src/assets/reglantern-logo.png` with your logo, same import path works.

### Change App Name

1. Update `<title>` in `/index.html`
2. Update logo alt text
3. Update Auth0 application name
4. Update environment variable prefixes if desired

---

## 📚 Documentation References

- **Full Architecture:** `/DEVELOPER_HANDOFF.md`
- **Backend Code:** `/BACKEND_IMPLEMENTATION.md`
- **Frontend Changes:** `/FRONTEND_INTEGRATION.md`
- **This Quick Start:** `/QUICK_START.md`

---

## ✅ Launch Checklist

Before going live:

- [ ] Environment variables set for production
- [ ] Database has production data
- [ ] Auth0 configured with production URLs
- [ ] S3 bucket configured with production CORS
- [ ] SSL enabled (automatic with Vercel/Railway)
- [ ] Error monitoring enabled
- [ ] Backups configured
- [ ] Rate limiting enabled (see BACKEND_IMPLEMENTATION.md)
- [ ] Security headers enabled (helmet is installed)
- [ ] Users can log in
- [ ] Users can create/edit tasks
- [ ] Users can upload files
- [ ] Mobile responsive (already done in prototype)

---

## 🆘 Need Help?

1. Check error logs in Railway/Vercel dashboard
2. Check browser console for frontend errors
3. Check Network tab for API errors
4. Verify all environment variables are set
5. Test each component individually (auth → database → API → frontend)

---

## 🎉 Success Metrics

Your app is production-ready when:

- ✅ User can log in with Auth0
- ✅ User can see their tasks
- ✅ User can create a new task
- ✅ User can edit a task inline
- ✅ User can upload files
- ✅ User can filter tasks
- ✅ Changes persist after refresh
- ✅ Mobile version works
- ✅ No errors in console
- ✅ API responds in < 500ms

**Congratulations! Your app is live! 🚀**

---

## 📞 Support Resources

- **Auth0 Docs:** https://auth0.com/docs
- **AWS S3 Docs:** https://docs.aws.amazon.com/s3
- **React Query Docs:** https://tanstack.com/query
- **PostgreSQL Docs:** https://www.postgresql.org/docs/
- **Express Docs:** https://expressjs.com

---

## 💡 Pro Tips

1. **Start with Supabase** - It's faster than setting up your own PostgreSQL
2. **Use Railway for backend** - Deploy in 60 seconds
3. **Use Vercel for frontend** - Zero config deployment
4. **Test locally first** - Don't deploy until everything works locally
5. **Use .env.example** - Document all required environment variables
6. **Monitor from day 1** - Add Sentry before you launch
7. **Backup your database** - Daily automated backups
8. **Version your API** - Already done with `/v1/`
9. **Log everything** - Use structured logging (winston/pino)
10. **Keep it simple** - Don't over-engineer, iterate based on user feedback

---

**Time to Production:** ~1-2 hours with this guide  
**Cost to Start:** $0 (free tiers available for all services)  
**Scalability:** Handles 1000+ users out of the box  

Good luck! 🚀

import { useState, useEffect } from 'react';
import { ChevronRight, Copy, Check, Search, BookOpen, Code, Database, Cloud, TestTube, Menu, X, Home, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface Section {
  id: string;
  title: string;
  icon: any;
  subsections: Subsection[];
}

interface Subsection {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface CopyBoxProps {
  code: string;
  language?: string;
  title?: string;
}

const CopyBox = ({ code, language = 'bash', title }: CopyBoxProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    // Try modern Clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code)
        .then(() => {
          setCopied(true);
          toast.success('Copied to clipboard!');
          setTimeout(() => setCopied(false), 2000);
        })
        .catch((clipboardError) => {
          console.log('Clipboard API blocked, using fallback:', clipboardError);
          // Fallback to textarea method
          fallbackCopy();
        });
    } else {
      // Clipboard API not available, use fallback directly
      fallbackCopy();
    }

    function fallbackCopy() {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = code;
        textarea.style.position = 'fixed';
        textarea.style.top = '0';
        textarea.style.left = '0';
        textarea.style.opacity = '0';
        textarea.style.pointerEvents = 'none';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textarea);
        
        if (successful) {
          setCopied(true);
          toast.success('Copied to clipboard!');
          setTimeout(() => setCopied(false), 2000);
        } else {
          toast.error('Failed to copy. Please copy manually.');
        }
      } catch (err) {
        console.error('Fallback copy failed:', err);
        toast.error('Failed to copy. Please copy manually.');
      }
    }
  };

  return (
    <div className="my-4 rounded-lg border border-[#e4e4e7] bg-[#f9fafb] overflow-hidden">
      {title && (
        <div className="px-4 py-2 bg-[#18181b] text-white text-sm font-medium flex items-center justify-between">
          <span>{title}</span>
          <span className="text-xs text-[#a1a1aa]">{language}</span>
        </div>
      )}
      <div className="relative">
        <pre className="p-4 overflow-x-auto text-sm">
          <code className="text-[#18181b]">{code}</code>
        </pre>
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 p-2 rounded-md bg-white border border-[#e4e4e7] hover:bg-[#f4f4f5] transition-colors"
          title="Copy to clipboard"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-600" />
          ) : (
            <Copy className="w-4 h-4 text-[#71717a]" />
          )}
        </button>
      </div>
    </div>
  );
};

interface QuickInfoProps {
  type: 'info' | 'warning' | 'success' | 'tip';
  children: React.ReactNode;
}

const QuickInfo = ({ type, children }: QuickInfoProps) => {
  const styles = {
    info: 'bg-blue-50 border-blue-200 text-blue-900',
    warning: 'bg-amber-50 border-amber-200 text-amber-900',
    success: 'bg-green-50 border-green-200 text-green-900',
    tip: 'bg-purple-50 border-purple-200 text-purple-900',
  };

  const icons = {
    info: '💡',
    warning: '⚠️',
    success: '✅',
    tip: '🎯',
  };

  return (
    <div className={`my-4 p-4 rounded-lg border ${styles[type]}`}>
      <div className="flex items-start gap-2">
        <span className="text-xl">{icons[type]}</span>
        <div className="flex-1 text-sm">{children}</div>
      </div>
    </div>
  );
};

export default function DeveloperManual({ 
  onClose, 
  hideHeader = false,
  initialActiveSection = 'getting-started',
  initialActiveSub = 'overview',
  onSectionChange,
  onSubChange
}: { 
  onClose: () => void; 
  hideHeader?: boolean;
  initialActiveSection?: string;
  initialActiveSub?: string;
  onSectionChange?: (section: string) => void;
  onSubChange?: (sub: string) => void;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState(initialActiveSection);
  const [activeSub, setActiveSub] = useState(initialActiveSub);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const sections: Section[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Home,
      subsections: [
        {
          id: 'overview',
          title: 'Overview',
          content: (
            <div>
              <h1 className="text-3xl font-bold text-[#18181b] mb-4">Welcome to Reglantern Developer Manual</h1>
              <p className="text-lg text-[#71717a] mb-6">
                This interactive guide will help you turn this prototype into a production-ready application.
              </p>

              <QuickInfo type="info">
                <strong>Current State:</strong> Fully functional prototype with client-side state
                <br />
                <strong>Target State:</strong> Production app with backend API, database, and authentication
              </QuickInfo>

              <h2 className="text-2xl font-semibold text-[#18181b] mt-8 mb-4">What You'll Build</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 border border-[#e4e4e7] rounded-lg">
                  <div className="text-2xl mb-2">🔐</div>
                  <h3 className="font-semibold text-[#18181b] mb-1">Authentication</h3>
                  <p className="text-sm text-[#71717a]">Auth0 integration with JWT tokens</p>
                </div>
                <div className="p-4 border border-[#e4e4e7] rounded-lg">
                  <div className="text-2xl mb-2">🗄️</div>
                  <h3 className="font-semibold text-[#18181b] mb-1">Database</h3>
                  <p className="text-sm text-[#71717a]">PostgreSQL with full schema</p>
                </div>
                <div className="p-4 border border-[#e4e4e7] rounded-lg">
                  <div className="text-2xl mb-2">☁️</div>
                  <h3 className="font-semibold text-[#18181b] mb-1">File Storage</h3>
                  <p className="text-sm text-[#71717a]">AWS S3 with presigned URLs</p>
                </div>
                <div className="p-4 border border-[#e4e4e7] rounded-lg">
                  <div className="text-2xl mb-2">🚀</div>
                  <h3 className="font-semibold text-[#18181b] mb-1">Deployment</h3>
                  <p className="text-sm text-[#71717a]">Railway + Vercel ready to go</p>
                </div>
              </div>

              <h2 className="text-2xl font-semibold text-[#18181b] mt-8 mb-4">Time & Cost Estimate</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-[#f9fafb] rounded-lg">
                  <span className="font-medium text-[#18181b]">Setup Time</span>
                  <span className="text-[#fc6] font-semibold">15 minutes</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#f9fafb] rounded-lg">
                  <span className="font-medium text-[#18181b]">Implementation Time</span>
                  <span className="text-[#fc6] font-semibold">4-8 hours</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#f9fafb] rounded-lg">
                  <span className="font-medium text-[#18181b]">Monthly Cost (0-100 users)</span>
                  <span className="text-[#fc6] font-semibold">$5-10</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#f9fafb] rounded-lg">
                  <span className="font-medium text-[#18181b]">Monthly Cost (1000 users)</span>
                  <span className="text-[#fc6] font-semibold">$50-100</span>
                </div>
              </div>

              <QuickInfo type="tip">
                <strong>Pro Tip:</strong> Start with the Quick Setup guide (15 min) to get accounts ready, then follow the Backend or Frontend paths based on your role.
              </QuickInfo>
            </div>
          ),
        },
        {
          id: 'quick-setup',
          title: 'Quick Setup (15 min)',
          content: (
            <div>
              <h1 className="text-3xl font-bold text-[#18181b] mb-4">Quick Setup Guide</h1>
              <p className="text-lg text-[#71717a] mb-6">
                Get all required accounts and services set up in 15 minutes.
              </p>

              <h2 className="text-2xl font-semibold text-[#18181b] mt-8 mb-4">1. Database (Supabase) - 5 minutes</h2>
              <ol className="space-y-3 mb-6">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#fc6] text-[#18181b] flex items-center justify-center text-sm font-bold">1</span>
                  <div className="flex-1">
                    <p className="text-[#18181b] mb-2">Go to <a href="https://supabase.com" target="_blank" className="text-blue-600 hover:underline">supabase.com</a> and create an account</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#fc6] text-[#18181b] flex items-center justify-center text-sm font-bold">2</span>
                  <div className="flex-1">
                    <p className="text-[#18181b] mb-2">Create a new project (name it "reglantern")</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#fc6] text-[#18181b] flex items-center justify-center text-sm font-bold">3</span>
                  <div className="flex-1">
                    <p className="text-[#18181b] mb-2">Go to SQL Editor and run this schema:</p>
                    <CopyBox
                      title="Database Schema"
                      language="sql"
                      code={`-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    initials VARCHAR(10) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    auth0_id VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Health Centers table
CREATE TABLE health_centers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

-- Tasks table
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

-- Files table
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
('Riverside Health Center');`}
                    />
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#fc6] text-[#18181b] flex items-center justify-center text-sm font-bold">4</span>
                  <div className="flex-1">
                    <p className="text-[#18181b] mb-2">Get your connection string: Settings → Database → Connection string</p>
                    <QuickInfo type="success">
                      Save this connection string! You'll need it as <code className="px-1 py-0.5 bg-white rounded">DATABASE_URL</code>
                    </QuickInfo>
                  </div>
                </li>
              </ol>

              <h2 className="text-2xl font-semibold text-[#18181b] mt-8 mb-4">2. Authentication (Auth0) - 5 minutes</h2>
              <ol className="space-y-3 mb-6">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#fc6] text-[#18181b] flex items-center justify-center text-sm font-bold">1</span>
                  <div className="flex-1">
                    <p className="text-[#18181b] mb-2">Go to <a href="https://auth0.com" target="_blank" className="text-blue-600 hover:underline">auth0.com</a> and sign up</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#fc6] text-[#18181b] flex items-center justify-center text-sm font-bold">2</span>
                  <div className="flex-1">
                    <p className="text-[#18181b] mb-2">Create Application → Single Page Web Application</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#fc6] text-[#18181b] flex items-center justify-center text-sm font-bold">3</span>
                  <div className="flex-1">
                    <p className="text-[#18181b] mb-2">Configure Settings:</p>
                    <CopyBox
                      title="Allowed Callback URLs"
                      code="http://localhost:5173, http://localhost:5173/callback"
                    />
                    <CopyBox
                      title="Allowed Logout URLs"
                      code="http://localhost:5173"
                    />
                    <CopyBox
                      title="Allowed Web Origins"
                      code="http://localhost:5173"
                    />
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#fc6] text-[#18181b] flex items-center justify-center text-sm font-bold">4</span>
                  <div className="flex-1">
                    <p className="text-[#18181b] mb-2">Create API: APIs → Create API</p>
                    <CopyBox
                      title="API Identifier"
                      code="https://api.reglantern.com"
                    />
                    <QuickInfo type="success">
                      Save these values:
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li><strong>Domain:</strong> your-tenant.auth0.com</li>
                        <li><strong>Client ID:</strong> abc123...</li>
                        <li><strong>Audience:</strong> https://api.reglantern.com</li>
                      </ul>
                    </QuickInfo>
                  </div>
                </li>
              </ol>

              <h2 className="text-2xl font-semibold text-[#18181b] mt-8 mb-4">3. File Storage (AWS S3) - 5 minutes</h2>
              <ol className="space-y-3 mb-6">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#fc6] text-[#18181b] flex items-center justify-center text-sm font-bold">1</span>
                  <div className="flex-1">
                    <p className="text-[#18181b] mb-2">Go to AWS Console → S3 → Create Bucket</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#fc6] text-[#18181b] flex items-center justify-center text-sm font-bold">2</span>
                  <div className="flex-1">
                    <p className="text-[#18181b] mb-2">Name: <code className="px-1 py-0.5 bg-[#f4f4f5] rounded">reglantern-files-prod</code></p>
                    <p className="text-[#71717a] text-sm">Region: us-east-1 (or your preference)</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#fc6] text-[#18181b] flex items-center justify-center text-sm font-bold">3</span>
                  <div className="flex-1">
                    <p className="text-[#18181b] mb-2">Configure CORS: Bucket → Permissions → CORS</p>
                    <CopyBox
                      title="CORS Configuration"
                      language="json"
                      code={`[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["http://localhost:5173", "https://yourdomain.com"],
    "ExposeHeaders": ["ETag"]
  }
]`}
                    />
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#fc6] text-[#18181b] flex items-center justify-center text-sm font-bold">4</span>
                  <div className="flex-1">
                    <p className="text-[#18181b] mb-2">Create IAM User: IAM → Users → Create user → Attach AmazonS3FullAccess</p>
                    <QuickInfo type="success">
                      Save these credentials:
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li><strong>Access Key ID:</strong> AKIA...</li>
                        <li><strong>Secret Access Key:</strong> abc123...</li>
                      </ul>
                    </QuickInfo>
                  </div>
                </li>
              </ol>

              <QuickInfo type="tip">
                <strong>✅ Setup Complete!</strong> You now have all the accounts you need. Move on to Backend or Frontend implementation.
              </QuickInfo>
            </div>
          ),
        },
      ],
    },
    {
      id: 'backend',
      title: 'Backend Implementation',
      icon: Code,
      subsections: [
        {
          id: 'backend-setup',
          title: 'Project Setup',
          content: (
            <div>
              <h1 className="text-3xl font-bold text-[#18181b] mb-4">Backend Project Setup</h1>
              <p className="text-lg text-[#71717a] mb-6">
                Set up your Node.js + Express backend in minutes.
              </p>

              <h2 className="text-2xl font-semibold text-[#18181b] mt-8 mb-4">1. Create Project Directory</h2>
              <CopyBox
                title="Terminal"
                language="bash"
                code={`mkdir reglantern-api
cd reglantern-api
npm init -y`}
              />

              <h2 className="text-2xl font-semibold text-[#18181b] mt-8 mb-4">2. Install Dependencies</h2>
              <CopyBox
                title="Install Production Dependencies"
                language="bash"
                code={`npm install express pg cors dotenv helmet express-jwt jwks-rsa @aws-sdk/client-s3 @aws-sdk/s3-request-presigner uuid joi`}
              />
              <CopyBox
                title="Install Dev Dependencies"
                language="bash"
                code={`npm install -D typescript @types/express @types/node @types/cors ts-node nodemon`}
              />

              <h2 className="text-2xl font-semibold text-[#18181b] mt-8 mb-4">3. TypeScript Configuration</h2>
              <p className="text-[#71717a] mb-3">Create <code className="px-1 py-0.5 bg-[#f4f4f5] rounded">tsconfig.json</code> in the root:</p>
              <CopyBox
                title="tsconfig.json"
                language="json"
                code={`{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}`}
              />

              <h2 className="text-2xl font-semibold text-[#18181b] mt-8 mb-4">4. Environment Variables</h2>
              <p className="text-[#71717a] mb-3">Create <code className="px-1 py-0.5 bg-[#f4f4f5] rounded">.env</code> file:</p>
              <CopyBox
                title=".env"
                code={`NODE_ENV=development
PORT=3000
DATABASE_URL=your-supabase-connection-string
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_AUDIENCE=https://api.reglantern.com
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET=reglantern-files-prod
AWS_REGION=us-east-1
CORS_ORIGIN=http://localhost:5173`}
              />

              <QuickInfo type="warning">
                Replace all <code className="px-1 py-0.5 bg-white rounded">your-*</code> values with the actual credentials you saved during Quick Setup!
              </QuickInfo>

              <h2 className="text-2xl font-semibold text-[#18181b] mt-8 mb-4">5. Project Structure</h2>
              <p className="text-[#71717a] mb-3">Create this folder structure:</p>
              <CopyBox
                title="Create Directories"
                language="bash"
                code={`mkdir -p src/config src/middleware src/routes src/controllers src/services src/types`}
              />

              <div className="my-4 p-4 bg-[#f9fafb] rounded-lg border border-[#e4e4e7] font-mono text-sm">
                <div className="text-[#18181b]">reglantern-api/</div>
                <div className="ml-4 text-[#71717a]">├── src/</div>
                <div className="ml-8 text-[#71717a]">│   ├── config/</div>
                <div className="ml-8 text-[#71717a]">│   ├── middleware/</div>
                <div className="ml-8 text-[#71717a]">│   ├── routes/</div>
                <div className="ml-8 text-[#71717a]">│   ├── controllers/</div>
                <div className="ml-8 text-[#71717a]">│   ├── services/</div>
                <div className="ml-8 text-[#71717a]">│   ├── types/</div>
                <div className="ml-8 text-[#71717a]">│   └── server.ts</div>
                <div className="ml-4 text-[#71717a]">├── .env</div>
                <div className="ml-4 text-[#71717a]">├── package.json</div>
                <div className="ml-4 text-[#71717a]">└── tsconfig.json</div>
              </div>

              <QuickInfo type="success">
                <strong>✅ Project setup complete!</strong> Next, create the configuration files.
              </QuickInfo>
            </div>
          ),
        },
        {
          id: 'backend-config',
          title: 'Configuration Files',
          content: (
            <div>
              <h1 className="text-3xl font-bold text-[#18181b] mb-4">Configuration Files</h1>
              <p className="text-lg text-[#71717a] mb-6">
                Set up database and S3 connections.
              </p>

              <h2 className="text-2xl font-semibold text-[#18181b] mt-8 mb-4">Database Configuration</h2>
              <p className="text-[#71717a] mb-3">Create <code className="px-1 py-0.5 bg-[#f4f4f5] rounded">src/config/database.ts</code>:</p>
              <CopyBox
                title="src/config/database.ts"
                language="typescript"
                code={`import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

export default pool;`}
              />

              <h2 className="text-2xl font-semibold text-[#18181b] mt-8 mb-4">S3 Configuration</h2>
              <p className="text-[#71717a] mb-3">Create <code className="px-1 py-0.5 bg-[#f4f4f5] rounded">src/config/s3.ts</code>:</p>
              <CopyBox
                title="src/config/s3.ts"
                language="typescript"
                code={`import { S3Client } from '@aws-sdk/client-s3';

export const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const S3_BUCKET = process.env.AWS_S3_BUCKET || 'reglantern-files-prod';`}
              />

              <QuickInfo type="tip">
                These configuration files handle connection pooling and error handling automatically. You don't need to modify them!
              </QuickInfo>
            </div>
          ),
        },
        {
          id: 'backend-server',
          title: 'Main Server File',
          content: (
            <div>
              <h1 className="text-3xl font-bold text-[#18181b] mb-4">Main Server File</h1>
              <p className="text-lg text-[#71717a] mb-6">
                Create the main Express server with all middleware.
              </p>

              <p className="text-[#71717a] mb-3">Create <code className="px-1 py-0.5 bg-[#f4f4f5] rounded">src/server.ts</code>:</p>
              <CopyBox
                title="src/server.ts"
                language="typescript"
                code={`import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes will be added here
// app.use('/api/v1/tasks', tasksRoutes);
// app.use('/api/v1/files', filesRoutes);

// Start server
app.listen(PORT, () => {
  console.log(\`🚀 Server running on port \${PORT}\`);
  console.log(\`📝 Environment: \${process.env.NODE_ENV}\`);
  console.log(\`🔗 Health check: http://localhost:\${PORT}/health\`);
});

export default app;`}
              />

              <h2 className="text-2xl font-semibold text-[#18181b] mt-8 mb-4">Add NPM Scripts</h2>
              <p className="text-[#71717a] mb-3">Update your <code className="px-1 py-0.5 bg-[#f4f4f5] rounded">package.json</code> scripts:</p>
              <CopyBox
                title="package.json (scripts section)"
                language="json"
                code={`"scripts": {
  "dev": "nodemon --watch src --exec ts-node src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js"
}`}
              />

              <h2 className="text-2xl font-semibold text-[#18181b] mt-8 mb-4">Test the Server</h2>
              <CopyBox
                title="Start Development Server"
                language="bash"
                code="npm run dev"
              />

              <p className="text-[#71717a] my-3">You should see:</p>
              <div className="my-4 p-4 bg-[#18181b] text-green-400 rounded-lg font-mono text-sm">
                🚀 Server running on port 3000<br />
                📝 Environment: development<br />
                🔗 Health check: http://localhost:3000/health
              </div>

              <p className="text-[#71717a] my-3">Test the health check:</p>
              <CopyBox
                title="Test Health Check"
                language="bash"
                code="curl http://localhost:3000/health"
              />

              <QuickInfo type="success">
                <strong>✅ Server is running!</strong> Next, add authentication middleware and API routes.
              </QuickInfo>
            </div>
          ),
        },
      ],
    },
    {
      id: 'frontend',
      title: 'Frontend Integration',
      icon: BookOpen,
      subsections: [
        {
          id: 'frontend-setup',
          title: 'Install Dependencies',
          content: (
            <div>
              <h1 className="text-3xl font-bold text-[#18181b] mb-4">Frontend Integration Setup</h1>
              <p className="text-lg text-[#71717a] mb-6">
                Connect your prototype to the real backend API.
              </p>

              <h2 className="text-2xl font-semibold text-[#18181b] mt-8 mb-4">1. Install Required Packages</h2>
              <CopyBox
                title="Terminal (in your frontend directory)"
                language="bash"
                code="npm install @tanstack/react-query @auth0/auth0-react axios"
              />

              <QuickInfo type="info">
                <ul className="space-y-1">
                  <li><strong>React Query:</strong> Data fetching and caching</li>
                  <li><strong>Auth0 React:</strong> Authentication</li>
                  <li><strong>Axios:</strong> HTTP client</li>
                </ul>
              </QuickInfo>

              <h2 className="text-2xl font-semibold text-[#18181b] mt-8 mb-4">2. Create Environment Variables</h2>
              <p className="text-[#71717a] mb-3">Create <code className="px-1 py-0.5 bg-[#f4f4f5] rounded">.env</code> in your project root:</p>
              <CopyBox
                title=".env"
                code={`VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_AUDIENCE=https://api.reglantern.com`}
              />

              <QuickInfo type="warning">
                Replace the Auth0 values with the ones you saved during Quick Setup!
              </QuickInfo>

              <h2 className="text-2xl font-semibold text-[#18181b] mt-8 mb-4">3. Project Structure</h2>
              <p className="text-[#71717a] mb-3">You'll create one new directory:</p>
              <CopyBox
                title="Create Services Directory"
                language="bash"
                code="mkdir -p src/services"
              />

              <div className="my-4 p-4 bg-[#f9fafb] rounded-lg border border-[#e4e4e7] font-mono text-sm">
                <div className="text-[#18181b]">src/</div>
                <div className="ml-4 text-[#71717a]">├── app/ (existing)</div>
                <div className="ml-4 text-green-600 font-semibold">├── services/ (new)</div>
                <div className="ml-8 text-green-600">│   └── api.ts (new)</div>
                <div className="ml-4 text-[#71717a]">└── styles/ (existing)</div>
              </div>

              <QuickInfo type="success">
                <strong>✅ Dependencies installed!</strong> Next, create the API service layer.
              </QuickInfo>
            </div>
          ),
        },
        {
          id: 'frontend-api',
          title: 'API Service Layer',
          content: (
            <div>
              <h1 className="text-3xl font-bold text-[#18181b] mb-4">API Service Layer</h1>
              <p className="text-lg text-[#71717a] mb-6">
                Create a centralized API client for all backend calls.
              </p>

              <p className="text-[#71717a] mb-3">Create <code className="px-1 py-0.5 bg-[#f4f4f5] rounded">src/services/api.ts</code>:</p>
              <CopyBox
                title="src/services/api.ts"
                language="typescript"
                code={`import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add auth token to all requests
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = \`Bearer \${token}\`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Handle 401 errors
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Tasks
  async getTasks() {
    const response = await this.client.get('/tasks');
    return response.data;
  }

  async createTask(task: any) {
    const response = await this.client.post('/tasks', task);
    return response.data;
  }

  async updateTask(id: number, updates: any) {
    const response = await this.client.patch(\`/tasks/\${id}\`, updates);
    return response.data;
  }

  async deleteTask(id: number) {
    const response = await this.client.delete(\`/tasks/\${id}\`);
    return response.data;
  }

  // Files
  async getUploadUrl(file: any) {
    const response = await this.client.post('/files/upload-url', file);
    return response.data;
  }

  async uploadFileToS3(uploadUrl: string, file: File) {
    await axios.put(uploadUrl, file, {
      headers: { 'Content-Type': file.type },
    });
  }

  async confirmUpload(fileId: string) {
    const response = await this.client.post(\`/files/\${fileId}/confirm\`, { success: true });
    return response.data;
  }
}

export const api = new ApiClient();`}
              />

              <QuickInfo type="tip">
                This API client handles authentication tokens automatically and redirects to login if the token expires!
              </QuickInfo>

              <QuickInfo type="success">
                <strong>✅ API service created!</strong> Next, update your main App file.
              </QuickInfo>
            </div>
          ),
        },
      ],
    },
    {
      id: 'deployment',
      title: 'Deployment',
      icon: Cloud,
      subsections: [
        {
          id: 'deploy-backend',
          title: 'Deploy Backend',
          content: (
            <div>
              <h1 className="text-3xl font-bold text-[#18181b] mb-4">Deploy Backend to Railway</h1>
              <p className="text-lg text-[#71717a] mb-6">
                Deploy your backend to production in minutes.
              </p>

              <h2 className="text-2xl font-semibold text-[#18181b] mt-8 mb-4">1. Install Railway CLI</h2>
              <CopyBox
                title="Terminal"
                language="bash"
                code="npm install -g @railway/cli"
              />

              <h2 className="text-2xl font-semibold text-[#18181b] mt-8 mb-4">2. Login to Railway</h2>
              <CopyBox
                title="Login"
                language="bash"
                code="railway login"
              />

              <h2 className="text-2xl font-semibold text-[#18181b] mt-8 mb-4">3. Initialize and Deploy</h2>
              <CopyBox
                title="Initialize and Deploy"
                language="bash"
                code={`cd reglantern-api
railway init
railway up`}
              />

              <h2 className="text-2xl font-semibold text-[#18181b] mt-8 mb-4">4. Set Environment Variables</h2>
              <CopyBox
                title="Set Variables"
                language="bash"
                code={`railway variables set NODE_ENV=production
railway variables set PORT=3000
railway variables set DATABASE_URL=your-database-url
railway variables set AUTH0_DOMAIN=your-tenant.auth0.com
railway variables set AUTH0_AUDIENCE=https://api.reglantern.com
railway variables set AWS_ACCESS_KEY_ID=your-key
railway variables set AWS_SECRET_ACCESS_KEY=your-secret
railway variables set AWS_S3_BUCKET=reglantern-files-prod
railway variables set AWS_REGION=us-east-1`}
              />

              <QuickInfo type="warning">
                Replace all <code className="px-1 py-0.5 bg-white rounded">your-*</code> values with your actual credentials!
              </QuickInfo>

              <h2 className="text-2xl font-semibold text-[#18181b] mt-8 mb-4">5. Get Your Backend URL</h2>
              <CopyBox
                title="Get Domain"
                language="bash"
                code="railway domain"
              />

              <p className="text-[#71717a] my-3">You'll get something like:</p>
              <div className="my-4 p-4 bg-[#f9fafb] rounded-lg border border-[#e4e4e7]">
                <code className="text-[#fc6] font-semibold">https://reglantern-api-production.up.railway.app</code>
              </div>

              <QuickInfo type="success">
                <strong>✅ Backend deployed!</strong> Save this URL - you'll need it for frontend deployment.
              </QuickInfo>
            </div>
          ),
        },
        {
          id: 'deploy-frontend',
          title: 'Deploy Frontend',
          content: (
            <div>
              <h1 className="text-3xl font-bold text-[#18181b] mb-4">Deploy Frontend to Vercel</h1>
              <p className="text-lg text-[#71717a] mb-6">
                Deploy your frontend to production in minutes.
              </p>

              <h2 className="text-2xl font-semibold text-[#18181b] mt-8 mb-4">1. Install Vercel CLI</h2>
              <CopyBox
                title="Terminal"
                language="bash"
                code="npm install -g vercel"
              />

              <h2 className="text-2xl font-semibold text-[#18181b] mt-8 mb-4">2. Deploy</h2>
              <CopyBox
                title="Deploy"
                language="bash"
                code={`cd your-frontend-folder
vercel`}
              />

              <p className="text-[#71717a] my-3">Follow the prompts:</p>
              <div className="my-4 p-4 bg-[#f9fafb] rounded-lg border border-[#e4e4e7] space-y-2">
                <div><span className="text-[#71717a]">Set up and deploy?</span> <span className="font-semibold">Yes</span></div>
                <div><span className="text-[#71717a]">Project name?</span> <span className="font-semibold">reglantern</span></div>
                <div><span className="text-[#71717a]">Directory?</span> <span className="font-semibold">./</span></div>
              </div>

              <h2 className="text-2xl font-semibold text-[#18181b] mt-8 mb-4">3. Set Environment Variables</h2>
              <p className="text-[#71717a] mb-3">In Vercel Dashboard → Your Project → Settings → Environment Variables, add:</p>
              <CopyBox
                title="Environment Variables"
                code={`VITE_API_BASE_URL=https://your-railway-url.up.railway.app/api/v1
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_AUDIENCE=https://api.reglantern.com`}
              />

              <h2 className="text-2xl font-semibold text-[#18181b] mt-8 mb-4">4. Deploy to Production</h2>
              <CopyBox
                title="Production Deploy"
                language="bash"
                code="vercel --prod"
              />

              <QuickInfo type="success">
                <strong>✅ Frontend deployed!</strong> Your app is now live!
              </QuickInfo>

              <h2 className="text-2xl font-semibold text-[#18181b] mt-8 mb-4">5. Update Auth0 URLs</h2>
              <p className="text-[#71717a] mb-3">Go to Auth0 Dashboard → Your Application → Settings and update:</p>
              <CopyBox
                title="Allowed Callback URLs"
                code="https://your-app.vercel.app, https://your-app.vercel.app/callback"
              />
              <CopyBox
                title="Allowed Logout URLs"
                code="https://your-app.vercel.app"
              />
              <CopyBox
                title="Allowed Web Origins"
                code="https://your-app.vercel.app"
              />

              <QuickInfo type="tip">
                <strong>🎉 Congratulations!</strong> Your app is now live in production!
              </QuickInfo>
            </div>
          ),
        },
      ],
    },
    {
      id: 'testing',
      title: 'Testing',
      icon: TestTube,
      subsections: [
        {
          id: 'testing-checklist',
          title: 'QA Checklist',
          content: (
            <div>
              <h1 className="text-3xl font-bold text-[#18181b] mb-4">Quality Assurance Checklist</h1>
              <p className="text-lg text-[#71717a] mb-6">
                Test these features before launch.
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-[#18181b] mb-3">Authentication</h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 bg-[#f9fafb] rounded-lg border border-[#e4e4e7] hover:bg-white transition-colors cursor-pointer">
                      <input type="checkbox" className="w-5 h-5 rounded border-[#e4e4e7]" />
                      <span className="text-[#18181b]">User can log in</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-[#f9fafb] rounded-lg border border-[#e4e4e7] hover:bg-white transition-colors cursor-pointer">
                      <input type="checkbox" className="w-5 h-5 rounded border-[#e4e4e7]" />
                      <span className="text-[#18181b]">User can log out</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-[#f9fafb] rounded-lg border border-[#e4e4e7] hover:bg-white transition-colors cursor-pointer">
                      <input type="checkbox" className="w-5 h-5 rounded border-[#e4e4e7]" />
                      <span className="text-[#18181b]">Session persists after refresh</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#18181b] mb-3">Task Management</h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 bg-[#f9fafb] rounded-lg border border-[#e4e4e7] hover:bg-white transition-colors cursor-pointer">
                      <input type="checkbox" className="w-5 h-5 rounded border-[#e4e4e7]" />
                      <span className="text-[#18181b]">Tasks load from database</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-[#f9fafb] rounded-lg border border-[#e4e4e7] hover:bg-white transition-colors cursor-pointer">
                      <input type="checkbox" className="w-5 h-5 rounded border-[#e4e4e7]" />
                      <span className="text-[#18181b]">Can create new task</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-[#f9fafb] rounded-lg border border-[#e4e4e7] hover:bg-white transition-colors cursor-pointer">
                      <input type="checkbox" className="w-5 h-5 rounded border-[#e4e4e7]" />
                      <span className="text-[#18181b]">Can edit task inline</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-[#f9fafb] rounded-lg border border-[#e4e4e7] hover:bg-white transition-colors cursor-pointer">
                      <input type="checkbox" className="w-5 h-5 rounded border-[#e4e4e7]" />
                      <span className="text-[#18181b]">Can toggle task complete</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-[#f9fafb] rounded-lg border border-[#e4e4e7] hover:bg-white transition-colors cursor-pointer">
                      <input type="checkbox" className="w-5 h-5 rounded border-[#e4e4e7]" />
                      <span className="text-[#18181b]">Changes persist after refresh</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#18181b] mb-3">File Upload</h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 bg-[#f9fafb] rounded-lg border border-[#e4e4e7] hover:bg-white transition-colors cursor-pointer">
                      <input type="checkbox" className="w-5 h-5 rounded border-[#e4e4e7]" />
                      <span className="text-[#18181b]">Can select file</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-[#f9fafb] rounded-lg border border-[#e4e4e7] hover:bg-white transition-colors cursor-pointer">
                      <input type="checkbox" className="w-5 h-5 rounded border-[#e4e4e7]" />
                      <span className="text-[#18181b]">Upload progress shows</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-[#f9fafb] rounded-lg border border-[#e4e4e7] hover:bg-white transition-colors cursor-pointer">
                      <input type="checkbox" className="w-5 h-5 rounded border-[#e4e4e7]" />
                      <span className="text-[#18181b]">File appears in list</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-[#f9fafb] rounded-lg border border-[#e4e4e7] hover:bg-white transition-colors cursor-pointer">
                      <input type="checkbox" className="w-5 h-5 rounded border-[#e4e4e7]" />
                      <span className="text-[#18181b]">Can download file</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#18181b] mb-3">Responsive Design</h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 bg-[#f9fafb] rounded-lg border border-[#e4e4e7] hover:bg-white transition-colors cursor-pointer">
                      <input type="checkbox" className="w-5 h-5 rounded border-[#e4e4e7]" />
                      <span className="text-[#18181b]">Works on desktop (1920x1080)</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-[#f9fafb] rounded-lg border border-[#e4e4e7] hover:bg-white transition-colors cursor-pointer">
                      <input type="checkbox" className="w-5 h-5 rounded border-[#e4e4e7]" />
                      <span className="text-[#18181b]">Works on tablet (768x1024)</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-[#f9fafb] rounded-lg border border-[#e4e4e7] hover:bg-white transition-colors cursor-pointer">
                      <input type="checkbox" className="w-5 h-5 rounded border-[#e4e4e7]" />
                      <span className="text-[#18181b]">Works on mobile (375x667)</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#18181b] mb-3">Performance</h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 bg-[#f9fafb] rounded-lg border border-[#e4e4e7] hover:bg-white transition-colors cursor-pointer">
                      <input type="checkbox" className="w-5 h-5 rounded border-[#e4e4e7]" />
                      <span className="text-[#18181b]">Initial load under 3 seconds</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-[#f9fafb] rounded-lg border border-[#e4e4e7] hover:bg-white transition-colors cursor-pointer">
                      <input type="checkbox" className="w-5 h-5 rounded border-[#e4e4e7]" />
                      <span className="text-[#18181b]">No console errors</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-[#f9fafb] rounded-lg border border-[#e4e4e7] hover:bg-white transition-colors cursor-pointer">
                      <input type="checkbox" className="w-5 h-5 rounded border-[#e4e4e7]" />
                      <span className="text-[#18181b]">Smooth scrolling</span>
                    </label>
                  </div>
                </div>
              </div>

              <QuickInfo type="success">
                <strong>✅ All checks passed?</strong> You're ready to launch!
              </QuickInfo>
            </div>
          ),
        },
      ],
    },
  ];

  const filteredSections = sections.map(section => ({
    ...section,
    subsections: section.subsections.filter(sub =>
      searchQuery === '' ||
      sub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.title.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(section => section.subsections.length > 0);

  const activeSubsection = sections
    .find(s => s.id === activeSection)
    ?.subsections.find(s => s.id === activeSub);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      {!hideHeader && (
        <div className="h-16 bg-[#32383e] flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-[#fc6] hover:text-[#ffcc88] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to App</span>
            </button>
            <div className="h-8 w-px bg-[#47515B]" />
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#fc6]" />
              <span className="text-white font-semibold">Developer Manual</span>
            </div>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 text-[#fc6] hover:bg-[#404950] rounded"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 fixed lg:relative inset-y-0 left-0 w-80 bg-[#f9fafb] border-r border-[#e4e4e7] flex flex-col z-40 transition-transform duration-300`}
          style={hideHeader ? {} : { top: '64px' }}
        >
          {/* Search */}
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717a]" />
              <input
                type="text"
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[#e4e4e7] rounded-lg focus:outline-none focus:border-[#fc6] transition-colors"
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            {filteredSections.map((section) => (
              <div key={section.id} className="mb-6">
                <div className="flex items-center gap-2 mb-2 px-2">
                  <section.icon className="w-4 h-4 text-[#71717a]" />
                  <h3 className="font-semibold text-[#18181b] text-sm uppercase tracking-wide">
                    {section.title}
                  </h3>
                </div>
                <div className="space-y-1">
                  {section.subsections.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => {
                        setActiveSection(section.id);
                        setActiveSub(sub.id);
                        if (window.innerWidth < 1024) {
                          setSidebarOpen(false);
                        }
                        onSectionChange?.(section.id);
                        onSubChange?.(sub.id);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                        activeSection === section.id && activeSub === sub.id
                          ? 'bg-[#fc6] text-[#18181b] font-medium'
                          : 'text-[#71717a] hover:bg-white hover:text-[#18181b]'
                      }`}
                    >
                      <ChevronRight
                        className={`w-4 h-4 shrink-0 ${
                          activeSection === section.id && activeSub === sub.id
                            ? 'opacity-100'
                            : 'opacity-0'
                        }`}
                      />
                      <span className="text-sm">{sub.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-8">
            {activeSubsection?.content}
          </div>
        </div>
      </div>
    </div>
  );
}
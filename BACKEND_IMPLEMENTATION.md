# Backend Implementation Guide - Node.js + Express

This guide provides a complete, copy-paste-ready backend implementation for the Reglantern task management system.

## Project Setup

```bash
mkdir reglantern-api
cd reglantern-api
npm init -y
```

## Install Dependencies

```bash
npm install express pg cors dotenv helmet express-jwt jwks-rsa @aws-sdk/client-s3 @aws-sdk/s3-request-presigner uuid joi
npm install -D typescript @types/express @types/node @types/cors ts-node nodemon
```

## TypeScript Configuration

```json
{
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
}
```

Save as `tsconfig.json`

## Project Structure

```
reglantern-api/
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   └── s3.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── errorHandler.ts
│   │   └── validation.ts
│   ├── routes/
│   │   ├── tasks.ts
│   │   ├── files.ts
│   │   ├── users.ts
│   │   └── healthCenters.ts
│   ├── controllers/
│   │   ├── tasksController.ts
│   │   ├── filesController.ts
│   │   ├── usersController.ts
│   │   └── healthCentersController.ts
│   ├── services/
│   │   ├── taskService.ts
│   │   ├── fileService.ts
│   │   └── s3Service.ts
│   ├── types/
│   │   └── index.ts
│   └── server.ts
├── .env
├── .env.example
├── package.json
└── tsconfig.json
```

## Complete Implementation

### 1. Environment Configuration

```bash
# .env.example
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://postgres:password@localhost:5432/reglantern
DATABASE_POOL_MAX=20

# Auth0
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_AUDIENCE=https://api.reglantern.com

# AWS S3
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET=reglantern-files
AWS_REGION=us-east-1

# CORS
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
```

Copy to `.env` and fill in your values.

---

### 2. Database Configuration

```typescript
// src/config/database.ts
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: parseInt(process.env.DATABASE_POOL_MAX || '20'),
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

export default pool;
```

---

### 3. S3 Configuration

```typescript
// src/config/s3.ts
import { S3Client } from '@aws-sdk/client-s3';

export const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const S3_BUCKET = process.env.AWS_S3_BUCKET || 'reglantern-files';
```

---

### 4. Type Definitions

```typescript
// src/types/index.ts
export interface User {
  id: number;
  email: string;
  initials: string;
  full_name: string;
  role: string;
  auth0_id?: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'In Progress' | 'Complete' | 'Blocked';
  completed: boolean;
  due_date?: string;
  assigned_to_user_id?: number;
  health_center_id?: number;
  created_by_user_id?: number;
  attention_type?: 'needs' | 'missing';
  attention_count?: number;
  created_at: Date;
  updated_at: Date;
}

export interface HealthCenter {
  id: number;
  name: string;
  address?: string;
  contact_email?: string;
  contact_phone?: string;
}

export interface File {
  id: string;
  task_id: number;
  patient_id: number;
  filename: string;
  file_size: number;
  file_category: string;
  storage_key: string;
  storage_url?: string;
  mime_type?: string;
  uploaded_by_user_id?: number;
  uploaded_at: Date;
}

export interface AuthRequest extends Request {
  user?: {
    sub: string;
    [key: string]: any;
  };
  currentUser?: User;
}
```

---

### 5. Authentication Middleware

```typescript
// src/middleware/auth.ts
import { expressjwt as jwt } from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import { Request, Response, NextFunction } from 'express';
import { query } from '../config/database';
import { AuthRequest } from '../types';

// JWT verification middleware
export const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
  }) as any,
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256'],
});

// Fetch current user from database
export const getCurrentUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user?.sub) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const auth0Id = req.user.sub;
    const result = await query(
      'SELECT * FROM users WHERE auth0_id = $1',
      [auth0Id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    req.currentUser = result.rows[0];
    next();
  } catch (error) {
    console.error('Error fetching current user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
```

---

### 6. Error Handler Middleware

```typescript
// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';

export interface ApiError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
```

---

### 7. Validation Middleware

```typescript
// src/middleware/validation.ts
import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

export const validate = (schema: Joi.Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return res.status(400).json({ 
        error: 'Validation error',
        details: errors 
      });
    }
    
    next();
  };
};

// Validation schemas
export const taskSchema = Joi.object({
  title: Joi.string().min(1).max(500).required(),
  description: Joi.string().max(5000).optional(),
  status: Joi.string().valid('In Progress', 'Complete', 'Blocked').optional(),
  completed: Joi.boolean().optional(),
  dueDate: Joi.date().iso().optional(),
  assignedToUserId: Joi.number().integer().optional(),
  healthCenterId: Joi.number().integer().optional(),
  collaboratorUserIds: Joi.array().items(Joi.number().integer()).optional(),
});

export const updateTaskSchema = Joi.object({
  title: Joi.string().min(1).max(500).optional(),
  description: Joi.string().max(5000).optional(),
  status: Joi.string().valid('In Progress', 'Complete', 'Blocked').optional(),
  completed: Joi.boolean().optional(),
  dueDate: Joi.date().iso().optional(),
  assignedToUserId: Joi.number().integer().optional(),
  healthCenterId: Joi.number().integer().optional(),
  collaboratorUserIds: Joi.array().items(Joi.number().integer()).optional(),
});

export const fileUploadSchema = Joi.object({
  taskId: Joi.number().integer().required(),
  patientId: Joi.number().integer().required(),
  filename: Joi.string().max(500).required(),
  fileSize: Joi.number().integer().max(50 * 1024 * 1024).required(), // 50MB max
  mimeType: Joi.string().required(),
  category: Joi.string().max(100).required(),
});
```

---

### 8. Task Service

```typescript
// src/services/taskService.ts
import { query } from '../config/database';
import { Task } from '../types';

export class TaskService {
  async getTasks(filters: {
    status?: string;
    assignedTo?: number;
    healthCenter?: number;
    dueDateFilter?: string;
    needsAttention?: boolean;
    search?: string;
  }) {
    let queryText = `
      SELECT 
        t.*,
        json_build_object(
          'id', u.id,
          'initials', u.initials,
          'name', u.full_name,
          'email', u.email
        ) as assigned_to,
        json_build_object(
          'id', hc.id,
          'name', hc.name
        ) as health_center,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', cu.id,
              'initials', cu.initials,
              'name', cu.full_name
            )
          ) FILTER (WHERE cu.id IS NOT NULL),
          '[]'
        ) as collaborators,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'patientId', p.id,
              'patientName', p.patient_name,
              'uploadedFiles', (
                SELECT COALESCE(json_agg(
                  json_build_object(
                    'id', f.id,
                    'name', f.filename,
                    'size', f.file_size,
                    'category', f.file_category,
                    'url', f.storage_url
                  )
                ), '[]')
                FROM files f
                WHERE f.task_id = t.id AND f.patient_id = p.id
              )
            )
          ) FILTER (WHERE p.id IS NOT NULL),
          '[]'
        ) as files
      FROM tasks t
      LEFT JOIN users u ON t.assigned_to_user_id = u.id
      LEFT JOIN health_centers hc ON t.health_center_id = hc.id
      LEFT JOIN task_collaborators tc ON t.id = tc.task_id
      LEFT JOIN users cu ON tc.user_id = cu.id
      LEFT JOIN files f ON t.id = f.task_id
      LEFT JOIN patients p ON f.patient_id = p.id
      WHERE 1=1
    `;

    const params: any[] = [];
    let paramCount = 1;

    // Apply filters
    if (filters.status) {
      queryText += ` AND t.status = $${paramCount}`;
      params.push(filters.status);
      paramCount++;
    }

    if (filters.assignedTo) {
      queryText += ` AND t.assigned_to_user_id = $${paramCount}`;
      params.push(filters.assignedTo);
      paramCount++;
    }

    if (filters.healthCenter) {
      queryText += ` AND t.health_center_id = $${paramCount}`;
      params.push(filters.healthCenter);
      paramCount++;
    }

    if (filters.dueDateFilter) {
      // Parse filter (7d, 14d, 1m, etc.)
      const match = filters.dueDateFilter.match(/^(\d+)([dmyDMY])$/);
      if (match) {
        const [, amount, unit] = match;
        let interval = '';
        switch (unit.toLowerCase()) {
          case 'd': interval = `${amount} days`; break;
          case 'm': interval = `${amount} months`; break;
          case 'y': interval = `${amount} years`; break;
        }
        queryText += ` AND t.due_date <= CURRENT_DATE + INTERVAL '${interval}'`;
      } else {
        // Custom date
        queryText += ` AND t.due_date <= $${paramCount}`;
        params.push(filters.dueDateFilter);
        paramCount++;
      }
    }

    if (filters.needsAttention) {
      queryText += ` AND t.attention_type IS NOT NULL`;
    }

    if (filters.search) {
      queryText += ` AND t.title ILIKE $${paramCount}`;
      params.push(`%${filters.search}%`);
      paramCount++;
    }

    queryText += `
      GROUP BY t.id, u.id, u.initials, u.full_name, u.email, hc.id, hc.name
      ORDER BY t.due_date ASC NULLS LAST, t.created_at DESC
    `;

    const result = await query(queryText, params);
    return result.rows;
  }

  async getTaskById(id: number) {
    const result = await query(
      `SELECT t.*,
        json_build_object(
          'id', u.id,
          'initials', u.initials,
          'name', u.full_name
        ) as assigned_to,
        json_build_object(
          'id', hc.id,
          'name', hc.name
        ) as health_center
      FROM tasks t
      LEFT JOIN users u ON t.assigned_to_user_id = u.id
      LEFT JOIN health_centers hc ON t.health_center_id = hc.id
      WHERE t.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  async createTask(taskData: {
    title: string;
    description?: string;
    status?: string;
    dueDate?: string;
    assignedToUserId?: number;
    healthCenterId?: number;
    createdByUserId: number;
  }) {
    const result = await query(
      `INSERT INTO tasks (
        title, description, status, due_date, 
        assigned_to_user_id, health_center_id, created_by_user_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        taskData.title,
        taskData.description,
        taskData.status || 'In Progress',
        taskData.dueDate,
        taskData.assignedToUserId,
        taskData.healthCenterId,
        taskData.createdByUserId,
      ]
    );
    return result.rows[0];
  }

  async updateTask(id: number, updates: Partial<Task>) {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (updates.title !== undefined) {
      fields.push(`title = $${paramCount}`);
      values.push(updates.title);
      paramCount++;
    }

    if (updates.description !== undefined) {
      fields.push(`description = $${paramCount}`);
      values.push(updates.description);
      paramCount++;
    }

    if (updates.status !== undefined) {
      fields.push(`status = $${paramCount}`);
      values.push(updates.status);
      paramCount++;
    }

    if (updates.completed !== undefined) {
      fields.push(`completed = $${paramCount}`);
      values.push(updates.completed);
      paramCount++;
    }

    if (updates.due_date !== undefined) {
      fields.push(`due_date = $${paramCount}`);
      values.push(updates.due_date);
      paramCount++;
    }

    if (updates.assigned_to_user_id !== undefined) {
      fields.push(`assigned_to_user_id = $${paramCount}`);
      values.push(updates.assigned_to_user_id);
      paramCount++;
    }

    if (updates.health_center_id !== undefined) {
      fields.push(`health_center_id = $${paramCount}`);
      values.push(updates.health_center_id);
      paramCount++;
    }

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(id);
    const result = await query(
      `UPDATE tasks SET ${fields.join(', ')}, updated_at = NOW()
       WHERE id = $${paramCount}
       RETURNING *`,
      values
    );

    return result.rows[0];
  }

  async deleteTask(id: number) {
    await query('DELETE FROM tasks WHERE id = $1', [id]);
  }
}
```

---

### 9. S3 Service

```typescript
// src/services/s3Service.ts
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client, S3_BUCKET } from '../config/s3';

export class S3Service {
  async generatePresignedUrl(
    storageKey: string,
    contentType: string
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: storageKey,
      ContentType: contentType,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return url;
  }

  getPublicUrl(storageKey: string): string {
    return `https://${S3_BUCKET}.s3.amazonaws.com/${storageKey}`;
  }
}
```

---

### 10. File Service

```typescript
// src/services/fileService.ts
import { v4 as uuidv4 } from 'uuid';
import { query } from '../config/database';
import { S3Service } from './s3Service';

export class FileService {
  private s3Service = new S3Service();

  async generateUploadUrl(fileData: {
    taskId: number;
    patientId: number;
    filename: string;
    fileSize: number;
    mimeType: string;
    category: string;
    uploadedByUserId: number;
  }) {
    const fileId = uuidv4();
    const storageKey = `tasks/${fileData.taskId}/patients/${fileData.patientId}/${fileId}/${fileData.filename}`;

    // Generate presigned URL
    const uploadUrl = await this.s3Service.generatePresignedUrl(
      storageKey,
      fileData.mimeType
    );

    // Store file metadata (pending)
    await query(
      `INSERT INTO files (
        id, task_id, patient_id, filename, file_size, 
        file_category, storage_key, mime_type, uploaded_by_user_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        fileId,
        fileData.taskId,
        fileData.patientId,
        fileData.filename,
        fileData.fileSize,
        fileData.category,
        storageKey,
        fileData.mimeType,
        fileData.uploadedByUserId,
      ]
    );

    return { uploadUrl, fileId };
  }

  async confirmUpload(fileId: string) {
    const result = await query(
      'SELECT * FROM files WHERE id = $1',
      [fileId]
    );

    if (result.rows.length === 0) {
      throw new Error('File not found');
    }

    const file = result.rows[0];
    const storageUrl = this.s3Service.getPublicUrl(file.storage_key);

    await query(
      'UPDATE files SET storage_url = $1 WHERE id = $2',
      [storageUrl, fileId]
    );

    return { ...file, storage_url: storageUrl };
  }

  async deleteFile(fileId: string) {
    await query('DELETE FROM files WHERE id = $1', [fileId]);
    // Optionally delete from S3 as well
  }

  async getFilesForTask(taskId: number) {
    const result = await query(
      `SELECT 
        p.id as patient_id,
        p.patient_name,
        COALESCE(
          json_agg(
            json_build_object(
              'id', f.id,
              'name', f.filename,
              'size', f.file_size,
              'category', f.file_category,
              'url', f.storage_url
            )
          ) FILTER (WHERE f.id IS NOT NULL),
          '[]'
        ) as uploaded_files
      FROM patients p
      LEFT JOIN files f ON p.id = f.patient_id AND f.task_id = $1
      WHERE p.id IN (
        SELECT DISTINCT patient_id FROM files WHERE task_id = $1
      )
      GROUP BY p.id, p.patient_name`,
      [taskId]
    );

    return result.rows;
  }
}
```

---

### 11. Controllers

```typescript
// src/controllers/tasksController.ts
import { Response, NextFunction } from 'express';
import { TaskService } from '../services/taskService';
import { AuthRequest } from '../types';

const taskService = new TaskService();

export const getTasks = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const filters = {
      status: req.query.status as string,
      assignedTo: req.query.assigned_to ? parseInt(req.query.assigned_to as string) : undefined,
      healthCenter: req.query.health_center ? parseInt(req.query.health_center as string) : undefined,
      dueDateFilter: req.query.due_date_filter as string,
      needsAttention: req.query.needs_attention === 'true',
      search: req.query.search as string,
    };

    const tasks = await taskService.getTasks(filters);
    res.json({ data: tasks });
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const task = await taskService.getTaskById(parseInt(req.params.id));
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ data: task });
  } catch (error) {
    next(error);
  }
};

export const createTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const task = await taskService.createTask({
      ...req.body,
      createdByUserId: req.currentUser!.id,
    });
    res.status(201).json({ data: task });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const task = await taskService.updateTask(
      parseInt(req.params.id),
      req.body
    );
    res.json({ data: task });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    await taskService.deleteTask(parseInt(req.params.id));
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};
```

```typescript
// src/controllers/filesController.ts
import { Response, NextFunction } from 'express';
import { FileService } from '../services/fileService';
import { AuthRequest } from '../types';

const fileService = new FileService();

export const getUploadUrl = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { uploadUrl, fileId } = await fileService.generateUploadUrl({
      ...req.body,
      uploadedByUserId: req.currentUser!.id,
    });

    res.json({
      data: {
        uploadUrl,
        fileId,
        expiresIn: 3600,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const confirmUpload = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const file = await fileService.confirmUpload(req.params.fileId);
    res.json({ data: file });
  } catch (error) {
    next(error);
  }
};

export const deleteFile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    await fileService.deleteFile(req.params.fileId);
    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getFilesForTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const files = await fileService.getFilesForTask(parseInt(req.params.taskId));
    res.json({ data: files });
  } catch (error) {
    next(error);
  }
};
```

---

### 12. Routes

```typescript
// src/routes/tasks.ts
import { Router } from 'express';
import { getTasks, getTaskById, createTask, updateTask, deleteTask } from '../controllers/tasksController';
import { validate, taskSchema, updateTaskSchema } from '../middleware/validation';

const router = Router();

router.get('/', getTasks);
router.get('/:id', getTaskById);
router.post('/', validate(taskSchema), createTask);
router.patch('/:id', validate(updateTaskSchema), updateTask);
router.delete('/:id', deleteTask);

export default router;
```

```typescript
// src/routes/files.ts
import { Router } from 'express';
import { getUploadUrl, confirmUpload, deleteFile, getFilesForTask } from '../controllers/filesController';
import { validate, fileUploadSchema } from '../middleware/validation';

const router = Router();

router.post('/upload-url', validate(fileUploadSchema), getUploadUrl);
router.post('/:fileId/confirm', confirmUpload);
router.delete('/:fileId', deleteFile);
router.get('/tasks/:taskId/files', getFilesForTask);

export default router;
```

---

### 13. Main Server File

```typescript
// src/server.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { checkJwt, getCurrentUser } from './middleware/auth';
import { errorHandler } from './middleware/errorHandler';
import tasksRoutes from './routes/tasks';
import filesRoutes from './routes/files';

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
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes (protected)
app.use('/api/v1/tasks', checkJwt, getCurrentUser, tasksRoutes);
app.use('/api/v1/files', checkJwt, getCurrentUser, filesRoutes);

// Error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV}`);
});

export default app;
```

---

### 14. Package.json Scripts

```json
{
  "name": "reglantern-api",
  "version": "1.0.0",
  "scripts": {
    "dev": "nodemon --watch src --exec ts-node src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "db:migrate": "node scripts/migrate.js"
  }
}
```

---

## Running the Server

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## Testing with cURL

```bash
# Get tasks
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/v1/tasks

# Create task
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"New Task","status":"In Progress"}' \
  http://localhost:3000/api/v1/tasks

# Update task
curl -X PATCH \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"completed":true}' \
  http://localhost:3000/api/v1/tasks/1
```

## Next Steps

1. Run the database schema from DEVELOPER_HANDOFF.md
2. Configure Auth0 tenant
3. Set up AWS S3 bucket
4. Update .env with your credentials
5. Start the server
6. Update frontend to point to this API

## Production Checklist

- [ ] Add rate limiting (express-rate-limit)
- [ ] Add request logging (morgan)
- [ ] Set up monitoring (Sentry)
- [ ] Configure SSL/TLS
- [ ] Set up database migrations
- [ ] Add database backups
- [ ] Configure CDN for file delivery
- [ ] Add API documentation (Swagger)
- [ ] Set up CI/CD pipeline
- [ ] Add unit tests
- [ ] Add integration tests

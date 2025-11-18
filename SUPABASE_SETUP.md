# 🚀 Supabase + Vercel Setup Guide

## ภาพรวม

การใช้ Supabase + Vercel ให้ประโยชน์:
- ✅ Database (PostgreSQL) ฟรี
- ✅ Auto-scaling
- ✅ Backup อัตโนมัติ
- ✅ Deploy ง่าย
- ✅ Integration ดี

---

## ขั้นตอนที่ 1: สร้าง Supabase Project

### 1.1 สมัคร Supabase
1. ไปที่ https://supabase.com
2. Sign up ด้วย GitHub
3. คลิก "New Project"

### 1.2 ตั้งค่า Project
- **Name**: smart-queue-system
- **Database Password**: สร้าง password ที่แข็งแรง (เก็บไว้!)
- **Region**: เลือกใกล้ที่สุด (Singapore สำหรับไทย)
- **Pricing Plan**: Free (เพียงพอสำหรับเริ่มต้น)

### 1.3 รอสักครู่
Project จะใช้เวลาประมาณ 2-3 นาทีในการสร้าง

---

## ขั้นตอนที่ 2: Setup Database Schema

### 2.1 เข้า SQL Editor
1. ไปที่ Supabase Dashboard
2. คลิก "SQL Editor" ในเมนูซ้าย
3. คลิก "New Query"

### 2.2 รัน SQL Schema
คัดลอกและรัน SQL นี้:

```sql
-- Create enum types
CREATE TYPE station_type AS ENUM ('TRADE_IN', 'PAYMENT', 'DEVICE_CHECK', 'DATA_TRANSFER');
CREATE TYPE status_type AS ENUM ('WAITING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- Customer table
CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  queue_number VARCHAR(10) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  station station_type NOT NULL,
  status status_type DEFAULT 'WAITING',
  custom_field_data JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  branch_id VARCHAR(50) DEFAULT 'default'
);

-- Queue counter table
CREATE TABLE queue_counters (
  id SERIAL PRIMARY KEY,
  branch_id VARCHAR(50) UNIQUE NOT NULL,
  counter INTEGER DEFAULT 1,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Registration settings table
CREATE TABLE registration_settings (
  id SERIAL PRIMARY KEY,
  branch_id VARCHAR(50) UNIQUE NOT NULL,
  logo_url TEXT,
  title VARCHAR(200) DEFAULT 'Smart Queue',
  subtitle VARCHAR(200) DEFAULT 'กรอกข้อมูลเพื่อรับบัตรคิว',
  theme_color VARCHAR(7) DEFAULT '#0ea5e9',
  custom_fields JSONB,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Branch table
CREATE TABLE branches (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  address TEXT,
  phone VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_customers_station_status ON customers(station, status);
CREATE INDEX idx_customers_branch ON customers(branch_id);
CREATE INDEX idx_customers_created ON customers(created_at);

-- Insert default branch
INSERT INTO branches (id, name) VALUES ('default', 'Main Branch');

-- Insert default queue counter
INSERT INTO queue_counters (branch_id, counter) VALUES ('default', 1);

-- Insert default settings
INSERT INTO registration_settings (branch_id) VALUES ('default');
```

คลิก "Run" เพื่อสร้าง tables

---

## ขั้นตอนที่ 3: ดึง Connection String

### 3.1 ไปที่ Settings
1. คลิก "Project Settings" (ไอคอนเฟือง)
2. คลิก "Database" ในเมนูซ้าย

### 3.2 คัดลอก Connection String
1. หา "Connection string" section
2. เลือก "URI" tab
3. คัดลอก connection string
4. แทนที่ `[YOUR-PASSWORD]` ด้วย password จริง

ตัวอย่าง:
```
postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

---

## ขั้นตอนที่ 4: Deploy Backend to Vercel

### 4.1 เตรียม Backend
```bash
cd server

# สร้าง vercel.json
cat > vercel.json << 'EOF'
{
  "version": 2,
  "builds": [
    {
      "src": "src/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/index.ts"
    }
  ]
}
EOF
```

### 4.2 Deploy
```bash
# Install Vercel CLI (ถ้ายังไม่มี)
npm install -g vercel

# Login
vercel login

# Deploy
vercel
```

### 4.3 ตั้งค่า Environment Variables
ใน Vercel Dashboard:
1. ไปที่ Project Settings
2. คลิก "Environment Variables"
3. เพิ่ม:
   - `DATABASE_URL` = [Supabase connection string]
   - `CORS_ORIGIN` = [Frontend URL]
   - `NODE_ENV` = production

### 4.4 Redeploy
```bash
vercel --prod
```

---

## ขั้นตอนที่ 5: Deploy Frontend to Vercel

### 5.1 อัปเดต Environment Variables
สร้าง `.env.production`:
```env
VITE_API_URL=https://your-backend.vercel.app/api
VITE_WS_URL=https://your-backend.vercel.app
API_KEY=your_gemini_api_key
```

### 5.2 Deploy
```bash
# ที่ root directory
vercel --prod
```

---

## ขั้นตอนที่ 6: ทดสอบ

### 6.1 ทดสอบ Backend
```bash
curl https://your-backend.vercel.app/health
```

### 6.2 ทดสอบ Frontend
เปิด browser ไปที่ frontend URL

### 6.3 ทดสอบ WebSocket
ดูใน browser console ว่ามี "WebSocket connected"

---

## Troubleshooting

### Database Connection Error
- ตรวจสอบ connection string
- ตรวจสอบว่า password ถูกต้อง
- ตรวจสอบว่า Supabase project active

### CORS Error
- เพิ่ม frontend URL ใน `CORS_ORIGIN`
- Redeploy backend

### WebSocket Error
- Vercel Serverless Functions ไม่รองรับ WebSocket
- ต้องใช้ Vercel Edge Functions หรือ deploy backend ที่อื่น

---

## Alternative: Deploy Backend ที่ Railway

ถ้า WebSocket ไม่ทำงานบน Vercel:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
cd server
railway up
```

---

## สรุป

✅ Supabase = Database (ฟรี)
✅ Vercel = Frontend + Backend (ฟรี)
✅ Railway = Backend alternative (ถ้า WebSocket ไม่ทำงาน)

**ระบบพร้อมใช้งาน! 🎉**

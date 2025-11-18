# 🚀 Backend Setup Guide - Smart Queue System v3.0

## ภาพรวม

Smart Queue System v3.0 เพิ่ม Backend + Database + WebSocket เพื่อ:
- ✅ Sync ข้อมูลระหว่างอุปกรณ์ทุกเครือข่าย
- ✅ เก็บข้อมูลถาวรใน Database
- ✅ Real-time updates ด้วย WebSocket
- ✅ รองรับหลายสาขา (Multi-branch)
- ✅ API สำหรับ integration

---

## สถาปัตยกรรม

```
┌─────────────┐     WebSocket      ┌─────────────┐
│   Client    │ ←─────────────────→ │   Server    │
│  (React)    │                     │  (Node.js)  │
└─────────────┘                     └─────────────┘
       │                                    │
       │ HTTP/REST API                      │
       └────────────────────────────────────┘
                                            │
                                            ↓
                                    ┌─────────────┐
                                    │  PostgreSQL │
                                    │  (Database) │
                                    └─────────────┘
```

---

## Tech Stack

### Backend
- **Node.js** + **Express** - Web server
- **Socket.IO** - WebSocket server
- **Prisma** - ORM
- **PostgreSQL** - Database
- **TypeScript** - Type safety

### Frontend Integration
- **Socket.IO Client** - WebSocket client
- **Fetch API** - HTTP requests

---

## การติดตั้ง

### 1. ติดตั้ง PostgreSQL

#### macOS (Homebrew)
```bash
brew install postgresql@15
brew services start postgresql@15
```

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

#### Windows
ดาวน์โหลดจาก: https://www.postgresql.org/download/windows/

#### Docker (แนะนำสำหรับ Development)
```bash
docker run --name smartqueue-db \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=smartqueue \
  -p 5432:5432 \
  -d postgres:15
```

### 2. สร้าง Database
```bash
# เข้า PostgreSQL
psql postgres

# สร้าง database
CREATE DATABASE smartqueue;

# สร้าง user (optional)
CREATE USER smartqueue_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE smartqueue TO smartqueue_user;

# ออกจาก psql
\q
```

### 3. ติดตั้ง Dependencies

```bash
# ติดตั้ง server dependencies
cd server
npm install

# กลับไปที่ root
cd ..

# ติดตั้ง socket.io-client สำหรับ frontend
npm install socket.io-client
```

### 4. ตั้งค่า Environment Variables

```bash
# สร้างไฟล์ .env ใน server/
cd server
cp .env.example .env
```

แก้ไข `server/.env`:
```env
DATABASE_URL="postgresql://smartqueue_user:your_password@localhost:5432/smartqueue?schema=public"
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
GEMINI_API_KEY=your_gemini_api_key_here
```

### 5. Setup Database Schema

```bash
cd server

# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push

# (Optional) Open Prisma Studio to view data
npm run db:studio
```

### 6. รัน Backend Server

```bash
cd server
npm run dev
```

Server จะรันที่: `http://localhost:3001`

### 7. ตั้งค่า Frontend

สร้างไฟล์ `.env.local` ใน root:
```env
VITE_API_URL=http://localhost:3001/api
VITE_WS_URL=http://localhost:3001
API_KEY=your_gemini_api_key_here
```

### 8. รัน Frontend

```bash
npm run dev
```

Frontend จะรันที่: `http://localhost:5173`

---

## API Endpoints

### Customers

#### GET /api/customers
ดึงรายการลูกค้าทั้งหมด

**Query Parameters:**
- `branchId` (required) - Branch ID
- `station` (optional) - Filter by station
- `status` (optional) - Filter by status

**Response:**
```json
[
  {
    "id": 1,
    "queueNumber": "A001",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "0812345678",
    "station": "TRADE_IN",
    "status": "WAITING",
    "createdAt": "2024-01-01T10:00:00Z",
    "branchId": "default"
  }
]
```

#### POST /api/customers
สร้างลูกค้าใหม่

**Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "0812345678",
  "customFieldData": {},
  "branchId": "default"
}
```

#### PATCH /api/customers/:id/move
ย้ายลูกค้าไปสเตชั่นถัดไป/ก่อนหน้า

**Body:**
```json
{
  "direction": "next" // or "previous"
}
```

#### PATCH /api/customers/:id/status
เปลี่ยนสถานะลูกค้า

**Body:**
```json
{
  "status": "IN_PROGRESS" // or "WAITING"
}
```

#### PATCH /api/customers/:id/complete
ทำเครื่องหมายว่าเสร็จสิ้น

### Settings

#### GET /api/settings/:branchId
ดึงการตั้งค่าของสาขา

#### PUT /api/settings/:branchId
อัปเดตการตั้งค่า

### Statistics

#### GET /api/stats/:branchId
ดึงสถิติ

#### GET /api/stats/:branchId/completed
ดึงรายการลูกค้าที่เสร็จสิ้นแล้ว

---

## WebSocket Events

### Client → Server

#### join-branch
เข้าร่วม branch room
```javascript
socket.emit('join-branch', branchId);
```

#### join-station
เข้าร่วม station room
```javascript
socket.emit('join-station', { branchId, station });
```

#### request-queue
ขอข้อมูลคิวปัจจุบัน
```javascript
socket.emit('request-queue', branchId);
```

### Server → Client

#### customer-added
มีลูกค้าใหม่
```javascript
socket.on('customer-added', (customer) => {
  console.log('New customer:', customer);
});
```

#### customer-updated
ข้อมูลลูกค้าอัปเดต
```javascript
socket.on('customer-updated', (customer) => {
  console.log('Customer updated:', customer);
});
```

#### customer-moved
ลูกค้าย้ายสเตชั่น
```javascript
socket.on('customer-moved', (data) => {
  console.log('Customer moved:', data);
});
```

#### customer-completed
ลูกค้าเสร็จสิ้น
```javascript
socket.on('customer-completed', (customerId) => {
  console.log('Customer completed:', customerId);
});
```

#### status-changed
สถานะเปลี่ยน
```javascript
socket.on('status-changed', (data) => {
  console.log('Status changed:', data);
});
```

#### queue-data
ข้อมูลคิวทั้งหมด
```javascript
socket.on('queue-data', (customers) => {
  console.log('Queue data:', customers);
});
```

---

## การใช้งานใน Frontend

### 1. ใช้ useWebSocket Hook

```typescript
import { useWebSocket } from './hooks/useWebSocket';

function App() {
  const { emitCustomerAdded, emitCustomerMoved } = useWebSocket({
    branchId: 'default',
    station: 'TRADE_IN',
    onCustomerAdded: (customer) => {
      console.log('New customer:', customer);
      // Update UI
    },
    onCustomerMoved: (data) => {
      console.log('Customer moved:', data);
      // Update UI
    }
  });

  // ...
}
```

### 2. ใช้ API Client

```typescript
import { apiClient } from './api/client';

// Create customer
const customer = await apiClient.createCustomer({
  firstName: 'John',
  lastName: 'Doe',
  phone: '0812345678',
  branchId: 'default'
});

// Move customer
await apiClient.moveCustomer(customer.id, 'next');

// Get statistics
const stats = await apiClient.getStatistics('default');
```

---

## การ Deploy

### Backend (Vercel/Railway/Render)

#### Vercel
```bash
cd server
vercel
```

#### Railway
```bash
cd server
railway up
```

#### Render
1. เชื่อม GitHub repository
2. เลือก `server` directory
3. ตั้งค่า environment variables
4. Deploy

### Database (Supabase/Railway/Neon)

#### Supabase (แนะนำ)
1. สร้าง project ที่ https://supabase.com
2. คัดลอก DATABASE_URL
3. อัปเดต `.env`

#### Railway
```bash
railway add postgresql
railway variables
# คัดลอก DATABASE_URL
```

---

## Troubleshooting

### Database Connection Error
```bash
# ตรวจสอบว่า PostgreSQL รันอยู่
pg_isready

# ตรวจสอบ connection string
psql "postgresql://user:password@localhost:5432/smartqueue"
```

### WebSocket Connection Error
- ตรวจสอบว่า server รันอยู่
- ตรวจสอบ CORS settings
- ตรวจสอบ firewall

### Prisma Error
```bash
# Reset database
cd server
npx prisma migrate reset

# Regenerate client
npm run db:generate
```

---

## Next Steps

1. ✅ ติดตั้ง Backend เรียบร้อย
2. ✅ ทดสอบ API endpoints
3. ✅ ทดสอบ WebSocket connection
4. ✅ Integrate กับ Frontend
5. ✅ Deploy to production

---

**Happy Coding! 🚀**

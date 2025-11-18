# 🎯 Smart Queue System

ระบบจัดการคิวอัจฉริยะสำหรับธุรกิจที่มีหลายจุดบริการ พร้อมระบบวิเคราะห์ด้วย AI

## ✨ ฟีเจอร์หลัก

### 📋 การจัดการคิว
- ✅ ระบบหมายเลขคิวอัตโนมัติ (A001, A002, ...)
- ✅ จัดการคิวผ่าน 4 สเตชั่น: Trade-in, Payment, Device Check, Data Transfer
- ✅ สถานะคิว: รอคิว (WAITING) และ กำลังให้บริการ (IN_PROGRESS)
- ✅ ย้ายคิวระหว่างสเตชั่นได้
- ✅ พิมพ์บัตรคิว

### 🎨 การปรับแต่ง
- ✅ Custom fields (TEXT, CHECKBOX) สำหรับเก็บข้อมูลเพิ่มเติม
- ✅ ปรับแต่งหน้าลงทะเบียน (logo, title, subtitle, theme color)
- ✅ QR Code สำหรับเข้าถึงหน้าลงทะเบียน

### 📊 สถิติและรายงาน
- ✅ Dashboard แสดงสถิติแบบ real-time
- ✅ วิเคราะห์เวลารอเฉลี่ย
- ✅ สถิติแต่ละสเตชั่น
- ✅ วิเคราะห์ช่วงเวลาที่มีคนมากที่สุด
- ✅ ส่งออกรายงาน CSV

### 🤖 AI-Powered Analytics
- ✅ วิเคราะห์ข้อมูลคิวด้วย Google Gemini AI
- ✅ คาดการณ์ bottlenecks
- ✅ แนะนำการปรับปรุงประสิทธิภาพ

### 💾 การจัดการข้อมูล
- ✅ Backup/Restore ข้อมูล (JSON)
- ✅ Export รายงาน (CSV)
- ✅ แสดงการใช้พื้นที่จัดเก็บ
- ✅ ลบข้อมูลทั้งหมด

### 📺 Display Board
- ✅ หน้าจอแสดงคิวสำหรับลูกค้า
- ✅ แสดงคิวที่กำลังให้บริการ
- ✅ แสดงคิวที่รอแต่ละสเตชั่น
- ✅ อัปเดตแบบ real-time

### 🔔 การแจ้งเตือน
- ✅ เสียงแจ้งเตือนเมื่อมีคิวใหม่
- ✅ Toast notifications
- ✅ Browser notifications (ถ้าอนุญาต)

### ⌨️ Keyboard Shortcuts
- `Ctrl/Cmd + N` - เพิ่มลูกค้าใหม่
- `Ctrl/Cmd + S` - เปิดสถิติ
- `Escape` - ปิด modals

## 🚀 การติดตั้งและใช้งาน

### Prerequisites
- Node.js (v16+)
- Gemini API Key (สำหรับ AI Analytics)

### ติดตั้ง

1. Install dependencies:
```bash
npm install
```

2. ตั้งค่า API Key:
สร้างไฟล์ `.env.local` และเพิ่ม:
```
API_KEY=your_gemini_api_key_here
```

3. รันแอป:
```bash
npm run dev
```

## 📱 การใช้งาน

### สำหรับเจ้าหน้าที่

1. **เลือกสเตชั่น** - เลือกสเตชั่นสำหรับอุปกรณ์แต่ละเครื่อง
2. **เพิ่มลูกค้า** - กดปุ่ม "เพิ่มลูกค้า" หรือให้ลูกค้าลงทะเบียนเองผ่าน QR Code
3. **จัดการคิว** - กด "เริ่มให้บริการ" เมื่อพร้อม, ย้ายคิวไปสเตชั่นถัดไป หรือ เสร็จสิ้น
4. **ดูสถิติ** - กดปุ่ม 📊 เพื่อดูสถิติและรายงาน
5. **AI Analysis** - กดปุ่ม AI เพื่อวิเคราะห์ข้อมูลด้วย Gemini

### สำหรับลูกค้า

1. **ลงทะเบียน** - เข้า `#/register` หรือสแกน QR Code
2. **รับบัตรคิว** - กรอกข้อมูลและรับหมายเลขคิว
3. **ดูคิว** - ดูหน้าจอ Display Board (`#/display`)

## 🏗️ สถาปัตยกรรม

### Frontend Stack
- **React 19** + TypeScript
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Google Gemini AI** - AI Analytics

### State Management
- React Hooks (useState, useCallback, useEffect)
- localStorage สำหรับ persistence
- Custom hooks: `useQueue`, `useRegistrationSettings`

### Routes
- `/` - หน้าจัดการคิว (ต้องเลือกสเตชั่นก่อน)
- `#/register` - หน้าลงทะเบียนสำหรับลูกค้า
- `#/display` - Display Board (เปิดในหน้าต่างใหม่)

## 📦 โครงสร้างโปรเจค

```
├── components/          # React components
│   ├── AnalysisModal.tsx
│   ├── CustomerCard.tsx
│   ├── DataManagementModal.tsx
│   ├── DisplayBoard.tsx
│   ├── Header.tsx
│   ├── StatisticsModal.tsx
│   ├── Toast.tsx
│   └── ...
├── hooks/              # Custom React hooks
│   ├── useQueue.ts
│   └── useRegistrationSettings.ts
├── pages/              # Page components
│   ├── DisplayBoardPage.tsx
│   ├── RegistrationPage.tsx
│   └── StationSelectionPage.tsx
├── utils/              # Utility functions
│   ├── notifications.ts
│   ├── statistics.ts
│   └── storage.ts
├── types.ts            # TypeScript types
├── constants.ts        # Constants
└── App.tsx            # Main app component
```

## 🎯 Use Cases

- ร้านค้าโทรศัพท์มือถือ
- ศูนย์บริการ
- คลินิก/โรงพยาบาล
- ธนาคาร
- หน่วยงานราชการ
- ร้านอาหาร

## 🔄 Cross-Tab Synchronization

ระบบรองรับการ sync ข้อมูลแบบ real-time ระหว่าง:
- ✅ แท็บเดียวกัน (same tab)
- ✅ แท็บต่างๆ (different tabs)
- ✅ หน้าต่างต่างๆ (different windows)
- ✅ Display Board อัปเดตทันที

**วิธีการทำงาน:**
- ใช้ `SyncManager` utility สำหรับ broadcast changes
- ใช้ storage event สำหรับ cross-tab sync
- ใช้ custom event สำหรับ same-tab sync

ดูรายละเอียดใน [SYNC_FIX.md](./SYNC_FIX.md)

## 🔒 ข้อจำกัด

- ข้อมูลเก็บใน localStorage (ไม่มี backend)
- ไม่มี sync ระหว่างอุปกรณ์ต่างเครือข่าย (ต้องใช้เบราว์เซอร์เดียวกัน)
- จำกัดขนาดข้อมูล (~5-10MB)

## 🚀 การพัฒนาต่อ

แนะนำให้เพิ่ม:
- Backend API (Node.js + Express/NestJS)
- Database (PostgreSQL/MongoDB)
- WebSocket สำหรับ real-time sync
- Authentication & Authorization
- Mobile App (React Native)
- Printer integration
- SMS/Email notifications

## 📄 License

MIT License

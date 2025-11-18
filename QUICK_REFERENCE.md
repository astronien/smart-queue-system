# 📋 Quick Reference - Smart Queue System v2.0

## 🚀 Commands

```bash
# Development
npm run dev              # Start dev server (port 3000)
npm run build            # Build for production
npm run preview          # Preview production build
npm run type-check       # Check TypeScript types
npm run clean            # Clean build files

# Deployment
npm run pre-deploy       # Check before deploy
npm run deploy           # Deploy to Vercel (requires CLI)
vercel                   # Deploy preview
vercel --prod            # Deploy production
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + N` | เพิ่มลูกค้าใหม่ |
| `Ctrl/Cmd + S` | เปิดสถิติ |
| `Escape` | ปิด modals |

---

## 🌐 Routes

| Route | Description |
|-------|-------------|
| `/` | หน้าจัดการคิว (Main) |
| `#/register` | หน้าลงทะเบียนลูกค้า |
| `#/display` | Display Board |

---

## 🎯 Header Buttons

| Icon | Function | Shortcut |
|------|----------|----------|
| 📺 | Display Board | - |
| 📊 | Statistics | `Ctrl+S` |
| 💾 | Data Management | - |
| 🔄 | Change Station | - |
| 📱 | QR Code | - |
| ⚙️ | Settings | - |
| 🧠 | AI Analytics | - |
| ➕ | Add Customer | `Ctrl+N` |

---

## 📊 Customer Status

| Status | Description | Color |
|--------|-------------|-------|
| WAITING | รอคิว | Amber |
| IN_PROGRESS | กำลังให้บริการ | Green |

---

## 🎨 Station Colors

| Station | Color | Code |
|---------|-------|------|
| Trade-in | Sky | `#0c4a6e` |
| Payment | Teal | `#115e59` |
| Device Check | Amber | `#78350f` |
| Data Transfer | Indigo | `#3730a3` |

---

## 💾 localStorage Keys

| Key | Description |
|-----|-------------|
| `smartq_customers` | Customer queue data |
| `smartq_counter` | Queue number counter |
| `smartq_station_id` | Selected station |
| `smartq_registration_settings` | Registration settings |
| `smartq_completed_customers` | Completed customers (last 100) |
| `smartq_app_settings` | App settings |

---

## 🔧 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `API_KEY` | No | Gemini API Key for AI Analytics |
| `NODE_ENV` | No | Environment mode (auto-set) |

---

## 📁 Project Structure

```
smart-queue-system/
├── components/          # React components
│   ├── modals/         # Modal components
│   └── ui/             # UI components
├── pages/              # Page components
├── hooks/              # Custom hooks
├── utils/              # Utility functions
├── types.ts            # TypeScript types
├── constants.ts        # Constants
└── App.tsx            # Main app
```

---

## 🎯 Common Tasks

### เพิ่มลูกค้า
1. คลิก "เพิ่มลูกค้า" หรือ `Ctrl+N`
2. กรอกข้อมูล
3. คลิก "เพิ่มลูกค้า"

### จัดการคิว
1. คลิก "เริ่มให้บริการ"
2. ให้บริการลูกค้า
3. คลิก "ถัดไป" หรือ "เสร็จสิ้น"

### ค้นหาคิว
1. พิมพ์ในช่องค้นหา
2. ผลลัพธ์แสดงทันที

### Backup ข้อมูล
1. คลิกปุ่ม 💾
2. คลิก "ส่งออกข้อมูลสำรอง"
3. ไฟล์ JSON จะถูกดาวน์โหลด

### Export รายงาน
1. คลิกปุ่ม 💾
2. คลิก "ส่งออกรายงาน (CSV)"
3. ไฟล์ CSV จะถูกดาวน์โหลด

---

## 🐛 Troubleshooting

### ข้อมูลหาย
- ตรวจสอบว่าไม่ได้ล้าง browser cache
- ไม่ใช้ Incognito mode
- Restore จาก backup

### AI ไม่ทำงาน
- ตรวจสอบ API_KEY
- ตรวจสอบ internet connection
- ดู console errors

### Display Board ไม่อัปเดต
- Refresh หน้า
- ตรวจสอบ localStorage
- เปิดใหม่

---

## 📞 Support

| Resource | Link |
|----------|------|
| Documentation | `README.md` |
| Quick Start | `QUICK_START.md` |
| Features | `FEATURES.md` |
| Deployment | `DEPLOYMENT.md` |
| GitHub | [Repository URL] |

---

## 🔗 Useful Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Gemini API**: https://aistudio.google.com/app/apikey
- **Vite Docs**: https://vitejs.dev
- **React Docs**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com

---

## 📊 Performance Tips

1. **ใช้ Search** - หาคิวได้เร็ว
2. **Keyboard Shortcuts** - ทำงานเร็วขึ้น
3. **Display Board** - ลดการถามเจ้าหน้าที่
4. **Backup ทุกวัน** - ป้องกันข้อมูลหาย
5. **ตรวจสอบสถิติ** - ปรับปรุงประสิทธิภาพ

---

## 🎓 Best Practices

### สำหรับเจ้าหน้าที่
- ✅ เริ่มให้บริการก่อนย้ายคิว
- ✅ ใช้ search หาคิวเร็ว
- ✅ Backup ข้อมูลทุกวัน
- ✅ ตรวจสอบสถิติเป็นประจำ

### สำหรับผู้ดูแลระบบ
- ✅ ตั้งค่า API_KEY สำหรับ AI
- ✅ เปิด Display Board ให้ลูกค้าเห็น
- ✅ Export รายงานประจำวัน
- ✅ Monitor performance

---

## 🔐 Security Checklist

- [ ] API_KEY เก็บใน environment variables
- [ ] ไม่ commit `.env.local` ขึ้น Git
- [ ] ใช้ HTTPS (Vercel auto)
- [ ] Backup ข้อมูลเป็นประจำ
- [ ] ตรวจสอบ access logs

---

## 📈 Version History

| Version | Date | Changes |
|---------|------|---------|
| 2.0.0 | 2024-11-18 | Major update with 7 new features |
| 1.0.0 | - | Initial release |

---

**Quick Reference v2.0 - Smart Queue System 🎯**

# 🚀 Deployment Guide - Smart Queue System

## การ Deploy ขึ้น Vercel

### วิธีที่ 1: Deploy ผ่าน Vercel Dashboard (แนะนำ)

#### ขั้นตอนที่ 1: เตรียม Repository
```bash
# 1. สร้าง Git repository (ถ้ายังไม่มี)
git init

# 2. Add ไฟล์ทั้งหมด
git add .

# 3. Commit
git commit -m "Initial commit - Smart Queue System v2.0"

# 4. Push ขึ้น GitHub
git remote add origin https://github.com/YOUR_USERNAME/smart-queue-system.git
git branch -M main
git push -u origin main
```

#### ขั้นตอนที่ 2: Deploy บน Vercel
1. ไปที่ [vercel.com](https://vercel.com)
2. Sign in ด้วย GitHub account
3. คลิก "Add New Project"
4. เลือก repository ของคุณ
5. Configure project:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

#### ขั้นตอนที่ 3: ตั้งค่า Environment Variables
1. ไปที่ Project Settings → Environment Variables
2. เพิ่ม environment variable:
   - **Name**: `API_KEY`
   - **Value**: `your_gemini_api_key_here`
   - **Environment**: Production, Preview, Development

3. คลิก "Save"

#### ขั้นตอนที่ 4: Deploy
1. คลิก "Deploy"
2. รอสักครู่ (ประมาณ 1-2 นาที)
3. เสร็จแล้ว! 🎉

---

### วิธีที่ 2: Deploy ผ่าน Vercel CLI

#### ติดตั้ง Vercel CLI
```bash
npm install -g vercel
```

#### Login
```bash
vercel login
```

#### Deploy
```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

#### ตั้งค่า Environment Variables
```bash
vercel env add API_KEY
# จากนั้นใส่ค่า API key
```

---

## การตั้งค่า Custom Domain (Optional)

### ขั้นตอนที่ 1: เพิ่ม Domain
1. ไปที่ Project Settings → Domains
2. เพิ่ม domain ของคุณ (เช่น `queue.yourdomain.com`)
3. คลิก "Add"

### ขั้นตอนที่ 2: ตั้งค่า DNS
เพิ่ม DNS records ที่ domain provider ของคุณ:

**สำหรับ Subdomain (แนะนำ):**
```
Type: CNAME
Name: queue
Value: cname.vercel-dns.com
```

**สำหรับ Root Domain:**
```
Type: A
Name: @
Value: 76.76.21.21
```

### ขั้นตอนที่ 3: รอ DNS Propagation
- รอประมาณ 5-10 นาที
- ตรวจสอบที่ [dnschecker.org](https://dnschecker.org)

---

## การอัปเดตแอป

### อัปเดตผ่าน Git (Auto-deploy)
```bash
# 1. แก้ไขโค้ด
# 2. Commit
git add .
git commit -m "Update: description"

# 3. Push
git push origin main

# Vercel จะ auto-deploy ให้อัตโนมัติ!
```

### อัปเดตผ่าน CLI
```bash
vercel --prod
```

---

## Environment Variables

### ตัวแปรที่จำเป็น

#### API_KEY (Required for AI Analytics)
- **Description**: Google Gemini API Key
- **Get from**: https://aistudio.google.com/app/apikey
- **Example**: `AIzaSyD...`

### ตัวแปรเพิ่มเติม (Optional)

#### NODE_ENV
- **Description**: Environment mode
- **Value**: `production`
- **Default**: `production`

---

## การตรวจสอบหลัง Deploy

### ✅ Checklist

1. **หน้าแรก**
   - [ ] โหลดได้ปกติ
   - [ ] เลือกสเตชั่นได้
   - [ ] UI แสดงผลถูกต้อง

2. **ฟีเจอร์หลัก**
   - [ ] เพิ่มลูกค้าได้
   - [ ] จัดการคิวได้
   - [ ] Search ทำงาน
   - [ ] Keyboard shortcuts ทำงาน

3. **Modals**
   - [ ] Statistics Modal เปิดได้
   - [ ] Data Management Modal เปิดได้
   - [ ] QR Code Modal เปิดได้
   - [ ] AI Analytics ทำงาน (ถ้าตั้ง API_KEY)

4. **Display Board**
   - [ ] เปิด `#/display` ได้
   - [ ] แสดงคิวถูกต้อง
   - [ ] อัปเดต real-time

5. **Registration Page**
   - [ ] เปิด `#/register` ได้
   - [ ] ลงทะเบียนได้
   - [ ] แสดงหมายเลขคิว

6. **Performance**
   - [ ] โหลดเร็ว (<2s)
   - [ ] Animations ลื่นไหล
   - [ ] ไม่มี console errors

---

## Troubleshooting

### ปัญหา: Build Failed

**สาเหตุ:**
- Dependencies ไม่ครบ
- TypeScript errors

**วิธีแก้:**
```bash
# ลอง build ใน local ก่อน
npm run build

# ถ้ามี error แก้ไขให้เรียบร้อย
# จากนั้น push ใหม่
```

### ปัญหา: API_KEY ไม่ทำงาน

**สาเหตุ:**
- ไม่ได้ตั้งค่า environment variable
- API key ไม่ถูกต้อง

**วิธีแก้:**
1. ตรวจสอบ Environment Variables ใน Vercel
2. ตรวจสอบว่า API key ถูกต้อง
3. Redeploy

### ปัญหา: Routes ไม่ทำงาน

**สาเหตุ:**
- SPA routing ไม่ได้ตั้งค่า

**วิธีแก้:**
- ตรวจสอบว่ามีไฟล์ `vercel.json` แล้ว
- ตรวจสอบ rewrites configuration

### ปัญหา: localStorage หาย

**สาเหตุ:**
- เปลี่ยน domain
- ล้าง browser cache

**วิธีแก้:**
- Backup ข้อมูลก่อนเปลี่ยน domain
- Import ข้อมูลกลับ

---

## Performance Optimization

### 1. Enable Compression
Vercel เปิด compression ให้อัตโนมัติแล้ว

### 2. Cache Static Assets
ตั้งค่าใน `vercel.json` แล้ว:
```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### 3. Optimize Images
- ใช้ WebP format
- Compress images ก่อน upload
- ใช้ lazy loading

### 4. Code Splitting
Vite ทำให้อัตโนมัติแล้ว

---

## Monitoring

### Vercel Analytics
1. ไปที่ Project → Analytics
2. ดูข้อมูล:
   - Page views
   - Unique visitors
   - Performance metrics
   - Error rates

### Custom Monitoring (Optional)
เพิ่ม monitoring tools:
- Google Analytics
- Sentry (error tracking)
- LogRocket (session replay)

---

## Security

### Best Practices

1. **Environment Variables**
   - ไม่ commit `.env.local` ขึ้น Git
   - ใช้ Vercel Environment Variables

2. **API Keys**
   - เก็บใน environment variables
   - ไม่ hardcode ในโค้ด

3. **HTTPS**
   - Vercel ใช้ HTTPS อัตโนมัติ

4. **CORS**
   - ตั้งค่า CORS ถ้าต้องการ

---

## Backup Strategy

### 1. Code Backup
- เก็บใน Git repository
- Push ขึ้น GitHub/GitLab

### 2. Data Backup
- Export ข้อมูลเป็นประจำ
- เก็บ backup files ไว้ที่ปลอดภัย

### 3. Database Backup (ถ้ามี backend)
- Auto backup ทุกวัน
- เก็บ backup หลายเวอร์ชัน

---

## Cost Estimation

### Vercel Free Plan
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Custom domains
- ✅ Preview deployments

**เหมาะสำหรับ:**
- ธุรกิจขนาดเล็ก-กลาง
- Traffic ไม่เกิน 100GB/month

### Vercel Pro Plan ($20/month)
- ✅ 1TB bandwidth/month
- ✅ Advanced analytics
- ✅ Password protection
- ✅ Team collaboration

**เหมาะสำหรับ:**
- ธุรกิจขนาดกลาง-ใหญ่
- Traffic สูง

---

## Support

### Vercel Support
- Documentation: https://vercel.com/docs
- Community: https://github.com/vercel/vercel/discussions
- Support: support@vercel.com

### Project Support
- GitHub Issues
- Documentation ในโปรเจค
- Email support

---

## Quick Commands

```bash
# Build locally
npm run build

# Preview build
npm run preview

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs

# Remove deployment
vercel rm [deployment-url]
```

---

## 🎉 เสร็จแล้ว!

แอปของคุณพร้อม deploy แล้ว!

**Next Steps:**
1. Deploy ขึ้น Vercel
2. ตั้งค่า Environment Variables
3. ทดสอบทุกฟีเจอร์
4. Share URL กับทีม
5. เริ่มใช้งาน! 🚀

---

**Happy Deploying! 🎯**

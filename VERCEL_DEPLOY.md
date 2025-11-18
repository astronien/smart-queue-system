# 🚀 Deploy ขึ้น Vercel - คู่มือฉบับย่อ

## ⚡ Quick Deploy (5 นาที)

### ขั้นตอนที่ 1: Push ขึ้น GitHub

```bash
# ถ้ายังไม่มี Git repository
git init
git add .
git commit -m "Ready for deployment"

# สร้าง repository ใหม่บน GitHub
# จากนั้น push
git remote add origin https://github.com/YOUR_USERNAME/smart-queue-system.git
git branch -M main
git push -u origin main
```

### ขั้นตอนที่ 2: Deploy บน Vercel

1. ไปที่ **[vercel.com/new](https://vercel.com/new)**
2. **Import** repository ของคุณ
3. **Configure Project:**
   - Framework Preset: **Vite**
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Add Environment Variable:**
   - Key: `API_KEY`
   - Value: `your_gemini_api_key_here`
   - (Get from: https://aistudio.google.com/app/apikey)

5. คลิก **Deploy** 🚀

### ขั้นตอนที่ 3: เสร็จแล้ว! 🎉

Vercel จะให้ URL เช่น: `https://smart-queue-system.vercel.app`

---

## 📋 Checklist หลัง Deploy

- [ ] เปิด URL ได้
- [ ] เลือกสเตชั่นได้
- [ ] เพิ่มลูกค้าได้
- [ ] Display Board ทำงาน (`#/display`)
- [ ] Registration ทำงาน (`#/register`)
- [ ] AI Analytics ทำงาน (ถ้าตั้ง API_KEY)

---

## 🔄 การอัปเดต

```bash
# แก้ไขโค้ด
git add .
git commit -m "Update features"
git push

# Vercel จะ auto-deploy ให้อัตโนมัติ!
```

---

## 🌐 Custom Domain (Optional)

1. ไปที่ **Project Settings → Domains**
2. เพิ่ม domain: `queue.yourdomain.com`
3. ตั้งค่า DNS:
   ```
   Type: CNAME
   Name: queue
   Value: cname.vercel-dns.com
   ```

---

## 🆘 ปัญหาที่พบบ่อย

### Build Failed?
```bash
# ลอง build ใน local ก่อน
npm run build

# ถ้าผ่าน แสดงว่าโค้ดไม่มีปัญหา
# ตรวจสอบ Environment Variables บน Vercel
```

### API_KEY ไม่ทำงาน?
1. ตรวจสอบ Environment Variables
2. ตรวจสอบว่า key ถูกต้อง
3. Redeploy

---

## 📞 ต้องการความช่วยเหลือ?

- 📖 [DEPLOYMENT.md](./DEPLOYMENT.md) - คู่มือฉบับเต็ม
- 📚 [Vercel Docs](https://vercel.com/docs)
- 💬 [GitHub Issues](https://github.com/YOUR_USERNAME/smart-queue-system/issues)

---

**Happy Deploying! 🎯**

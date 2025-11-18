# 🤖 GitHub Actions - Auto Deploy

## การตั้งค่า Auto-Deploy ด้วย GitHub Actions (Optional)

GitHub Actions จะทำการ deploy อัตโนมัติทุกครั้งที่ push ขึ้น main branch

---

## ขั้นตอนการตั้งค่า

### 1. ติดตั้ง Vercel CLI (ถ้ายังไม่มี)

```bash
npm install -g vercel
```

### 2. Login และ Link Project

```bash
# Login
vercel login

# Link project
vercel link
```

### 3. ดึงข้อมูล Project

```bash
# ดึง Project ID และ Org ID
vercel project ls

# หรือดูใน .vercel/project.json
cat .vercel/project.json
```

### 4. สร้าง Vercel Token

1. ไปที่ [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. คลิก "Create Token"
3. ตั้งชื่อ: `GitHub Actions`
4. Scope: Full Account
5. คัดลอก token (จะแสดงครั้งเดียว!)

### 5. เพิ่ม Secrets ใน GitHub

1. ไปที่ GitHub repository
2. Settings → Secrets and variables → Actions
3. เพิ่ม secrets ต่อไปนี้:

#### VERCEL_TOKEN
- Value: Token ที่ได้จากขั้นตอนที่ 4

#### VERCEL_ORG_ID
- Value: ดูจาก `.vercel/project.json` หรือ Vercel dashboard
- Example: `team_xxxxxxxxxxxxx`

#### VERCEL_PROJECT_ID
- Value: ดูจาก `.vercel/project.json`
- Example: `prj_xxxxxxxxxxxxx`

#### API_KEY (Optional)
- Value: Gemini API Key
- สำหรับ AI Analytics

---

## การใช้งาน

### Auto-Deploy

```bash
# Push ขึ้น main branch
git add .
git commit -m "Update features"
git push origin main

# GitHub Actions จะ:
# 1. Install dependencies
# 2. Type check
# 3. Build
# 4. Deploy to Vercel (Production)
```

### Preview Deploy (Pull Request)

```bash
# สร้าง branch ใหม่
git checkout -b feature/new-feature

# แก้ไขโค้ด
git add .
git commit -m "Add new feature"
git push origin feature/new-feature

# สร้าง Pull Request บน GitHub
# GitHub Actions จะ deploy preview version
```

---

## Workflow Details

### Triggers
- **Push to main**: Deploy to Production
- **Pull Request**: Deploy to Preview

### Steps
1. **Checkout code** - ดึงโค้ดจาก repository
2. **Setup Node.js** - ติดตั้ง Node.js 18
3. **Install dependencies** - `npm ci`
4. **Type check** - ตรวจสอบ TypeScript (continue on error)
5. **Build** - `npm run build`
6. **Deploy** - Deploy ขึ้น Vercel

---

## ตรวจสอบ Workflow

### ดู Workflow Status
1. ไปที่ GitHub repository
2. คลิกแท็บ "Actions"
3. ดู workflow runs

### ดู Logs
1. คลิกที่ workflow run
2. คลิกที่ job "deploy"
3. ดู logs แต่ละ step

---

## Troubleshooting

### Build Failed?

**ตรวจสอบ:**
1. Logs ใน GitHub Actions
2. ลอง build ใน local: `npm run build`
3. ตรวจสอบ TypeScript errors

### Deploy Failed?

**ตรวจสอบ:**
1. Vercel Token ถูกต้องหรือไม่
2. Project ID และ Org ID ถูกต้องหรือไม่
3. Secrets ตั้งค่าครบหรือไม่

### Type Check Failed?

**ไม่เป็นไปร:**
- Workflow ตั้งค่า `continue-on-error: true`
- จะไม่หยุด workflow แม้ type check fail
- แต่ควรแก้ไข TypeScript errors

---

## การปิด Auto-Deploy

### วิธีที่ 1: ลบ Workflow File
```bash
rm .github/workflows/deploy.yml
git add .
git commit -m "Remove auto-deploy"
git push
```

### วิธีที่ 2: Disable Workflow
1. ไปที่ GitHub → Actions
2. เลือก workflow "Deploy to Vercel"
3. คลิก "..." → Disable workflow

---

## Best Practices

### 1. Protected Branches
ตั้งค่า branch protection สำหรับ main:
1. Settings → Branches → Add rule
2. Branch name pattern: `main`
3. เปิด:
   - Require pull request reviews
   - Require status checks to pass

### 2. Environment Secrets
แยก secrets ตาม environment:
- Development
- Preview
- Production

### 3. Notifications
ตั้งค่า notifications:
- Email
- Slack
- Discord

---

## Alternative: Vercel Git Integration

ถ้าไม่ต้องการใช้ GitHub Actions สามารถใช้ Vercel Git Integration:

### ข้อดี:
- ✅ ตั้งค่าง่ายกว่า
- ✅ ไม่ต้องจัดการ secrets
- ✅ Auto-deploy โดยอัตโนมัติ

### ข้อเสีย:
- ❌ Customize workflow ไม่ได้
- ❌ ไม่มี type check ก่อน deploy
- ❌ ไม่มี custom steps

### วิธีใช้:
1. ไปที่ Vercel Dashboard
2. Import Git Repository
3. เสร็จแล้ว! Auto-deploy ทำงานอัตโนมัติ

---

## สรุป

### ใช้ GitHub Actions ถ้า:
- ต้องการ custom workflow
- ต้องการ type check ก่อน deploy
- ต้องการ custom steps (tests, linting, etc.)

### ใช้ Vercel Git Integration ถ้า:
- ต้องการความง่าย
- ไม่ต้องการ custom workflow
- ต้องการ setup เร็ว

---

**Happy Auto-Deploying! 🤖**

# 🔄 Cross-Tab Synchronization Fix

## ปัญหาที่พบ

เมื่อลงทะเบียนลูกค้าใหม่ที่หน้า Registration (`#/register`) ข้อมูลไม่ปรากฏในหน้าจัดการคิวทันที

### สาเหตุ

1. **localStorage ไม่ sync ในแท็บเดียวกัน**
   - Browser's storage event ทำงานเฉพาะ cross-tab
   - ไม่ trigger ในแท็บที่เปลี่ยนแปลงข้อมูล

2. **ไม่มีกลไกแจ้งเตือนระหว่างหน้า**
   - Registration page บันทึกข้อมูล
   - Main page ไม่รู้ว่ามีการเปลี่ยนแปลง

---

## วิธีแก้ไข

### 1. สร้าง SyncManager Utility

ไฟล์: `utils/sync.ts`

**Features:**
- ✅ Broadcast changes ไปทุกแท็บ (รวมแท็บปัจจุบัน)
- ✅ ใช้ storage event สำหรับ cross-tab
- ✅ ใช้ custom event สำหรับ same-tab
- ✅ API ที่ใช้งานง่าย

**API:**
```typescript
// Broadcast change to all tabs
SyncManager.broadcastChange(key, value);

// Listen for changes
const cleanup = SyncManager.onChange(key, (value) => {
  console.log('Changed:', value);
});

// Get value
const value = SyncManager.get(key);
```

---

### 2. อัปเดต RegistrationPage

**Before:**
```typescript
localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(updatedCustomers));
localStorage.setItem(COUNTER_KEY, String(updatedCounter));
```

**After:**
```typescript
SyncManager.broadcastChange(CUSTOMERS_KEY, updatedCustomers);
SyncManager.broadcastChange(COUNTER_KEY, updatedCounter);
```

---

### 3. อัปเดต useQueue Hook

**เพิ่ม listener สำหรับ custom event:**
```typescript
// Listen for storage event (cross-tab)
window.addEventListener('storage', handleStorageChange);

// Listen for custom event (same-tab)
window.addEventListener('local-storage-change', handleLocalStorageChange);
```

**อัปเดต functions ให้ broadcast:**
- `addCustomer()` - broadcast เมื่อเพิ่มลูกค้า
- `moveCustomer()` - broadcast เมื่อย้ายคิว
- `completeCustomer()` - broadcast เมื่อเสร็จสิ้น
- `setCustomerStatus()` - broadcast เมื่อเปลี่ยนสถานะ

---

## การทำงาน

### Scenario 1: Same Tab
```
Registration Page → SyncManager.broadcastChange()
                 ↓
            Custom Event ('local-storage-change')
                 ↓
            useQueue Hook → Update State
                 ↓
            UI Updates ✅
```

### Scenario 2: Different Tabs
```
Registration Page → SyncManager.broadcastChange()
                 ↓
            Storage Event ('storage')
                 ↓
            Other Tabs → useQueue Hook → Update State
                 ↓
            UI Updates ✅
```

### Scenario 3: Different Windows
```
Window A → SyncManager.broadcastChange()
        ↓
   Storage Event
        ↓
Window B → Receives Update ✅
```

---

## ทดสอบ

### Test Case 1: Same Tab
1. เปิดหน้าจัดการคิว
2. เปิดหน้าลงทะเบียนในแท็บเดียวกัน (`#/register`)
3. ลงทะเบียนลูกค้าใหม่
4. กลับไปหน้าจัดการคิว
5. **Expected:** เห็นลูกค้าใหม่ทันที ✅

### Test Case 2: Different Tabs
1. เปิดหน้าจัดการคิวในแท็บ A
2. เปิดหน้าลงทะเบียนในแท็บ B
3. ลงทะเบียนลูกค้าใหม่ในแท็บ B
4. ดูแท็บ A
5. **Expected:** เห็นลูกค้าใหม่ทันที ✅

### Test Case 3: Display Board
1. เปิด Display Board (`#/display`)
2. ลงทะเบียนลูกค้าใหม่
3. **Expected:** Display Board อัปเดตทันที ✅

---

## ข้อดี

### ✅ Real-time Sync
- ข้อมูลอัปเดตทันทีในทุกแท็บ/หน้าต่าง
- ไม่ต้อง refresh

### ✅ Works Everywhere
- Same tab ✅
- Different tabs ✅
- Different windows ✅
- Display Board ✅

### ✅ No Infinite Loops
- ใช้ direct localStorage.setItem ใน useEffect
- ใช้ SyncManager.broadcastChange เฉพาะใน actions

### ✅ Backward Compatible
- ไม่กระทบโค้ดเดิม
- localStorage format เหมือนเดิม

---

## ข้อจำกัด

### ⚠️ Still localStorage-based
- ยังคงใช้ localStorage (ไม่มี backend)
- ข้อมูลอยู่ในเครื่องเท่านั้น
- ไม่ sync ระหว่างอุปกรณ์ต่างเครือข่าย

### ⚠️ Browser Limitations
- localStorage limit ~5-10MB
- ต้องเปิดเบราว์เซอร์เดียวกัน

---

## การพัฒนาต่อ

### Backend Integration (แนะนำ)
```typescript
// Replace SyncManager with API calls
await api.addCustomer(customer);

// Use WebSocket for real-time
socket.on('customer-added', (customer) => {
  setCustomers(prev => [...prev, customer]);
});
```

### Benefits:
- ✅ Sync ระหว่างอุปกรณ์
- ✅ Persistent data
- ✅ Multi-user support
- ✅ Better scalability

---

## สรุป

การแก้ไขนี้ทำให้:
1. ✅ ลงทะเบียนแล้วเห็นข้อมูลทันที
2. ✅ Sync ระหว่างแท็บ/หน้าต่าง
3. ✅ Display Board อัปเดต real-time
4. ✅ ไม่ต้อง refresh

**Status:** ✅ Fixed!

---

**Note:** สำหรับการใช้งานจริงในระยะยาว แนะนำให้เพิ่ม backend + WebSocket เพื่อ sync ระหว่างอุปกรณ์

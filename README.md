# 🎓 CoSaPl (cosapl.web.app) — O'quv ishlari savdosi va buyurtmalar platformasi

Talabalar, professional mualliflar jamoasi va o'quv markazlari uchun mo'ljallangan — tayyor kurs ishlari, MDI (malakaviy bitiruv ishlari), referatlar, taqdimotlarni xarid qilish, sotish hamda individual va ommaviy buyurtmalarni boshqarish ekotizimi (**Web Platforma + Telegram Mini App & Bot + Firebase**).

---

## 📌 1. Loyiha Maqsadi va Asosiy Vazifalari

Platforma barcha turdagi akademik va o'quv ishlarini **CoSaPl** brendi ostida yagona avtomatlashtirilgan xavfsiz maydonda jamlaydi:

### 🛍️ A. Xaridorlar (Talabalar) uchun:
- **Tayyor ishlar do'koni (Marketplace):** Barcha oliy o'quv yurtlari fanlari bo'yicha tayyor kurs ishlari, MDI (BMI/Diplom), referatlar, mustaqil ishlar, taqdimotlar va ilmiy maqolalarni ko'rish.
- **Namunani o'qish (Preview):** Ishning mundarijasi, kirish qismi, adabiyotlar ro'yxati va suv belgili (watermark) namunalarini bepul o'qib ko'rish.
- **Tezkor xarid:** Click, Payme yoki shaxsiy balans orqali to'lov qilib, to'liq tahrirlanadigan (.docx, .pptx) faylni darhol yuklab olish.

### 📝 B. Individual va Ommaviy Buyurtmalar Tizimi:
- **Majburiy Avtorizatsiya:** Buyurtma berish uchun foydalanuvchi tizimdan ro'yxatdan o'tgan / tizimga kirgan bo'lishi shart (buyurtma monitoringi va chat uchun).
- **24-48 soat ichida BEPUL sifatli reja tayyorlash:**
  - Talaba mavzu, talablar, muddat va metodik qo'llanmani biriktirib buyurtma beradi (individual yoki guruh uchun ommaviy mavzular ro'yxati).
  - Buyurtma tushgach, **Mualliflarning maxsus jamoasi (inson mutaxassislar)** 24–48 soat ichida ish rejasini mutlaqo bepul va yuqori sifatda ishlab chiqadi.
- **Ichki Suhbat Chati (Order Chat Room):**
  - Har bir buyurtma uchun buyurtmachi (talaba) va mas'ul muallif/admin o'rtasida shaxsiy onlayn suhbat chati ochiladi.
  - Chat orqali to'g'ridan-to'g'ri savol-javob, talablarni aniqlashtirish, qo'shimcha fayllar almashish va tahrirlarni kelishish amalga oshiriladi.

### 🛡️ C. Antiplagiat Tekshiruvi va Sertifikat Xizmati (Alohida pullik xizmat):
- Istalgan talaba yoki muallif o'z ishini tekshirish uchun topshirishi mumkin.
- Alohida to'lov evaziga ish maxsus antiplagiat tizimlarida tekshiriladi.
- Natijada foydalanuvchiga:
  1. **Rasmiy Sertifikat** (O'ziga xoslik foizi ko'rsatilgan QR-kodli hujjat).
  2. **To'liq Batafsil Hisobot (Report)** (Qaysi jumlalar qayerdan olinganligi ko'rsatilgan PDF tahlil).

### 💼 D. Sotuvchilar (Mualliflar va Mutaxassislar) uchun:
- **Ishlarni sotuvga qo'yish:** O'zlarining tayyor kurs ishlari, MDI, taqdimot va referatlarini fani, mavzusi va tavsifi bilan yuklash.
- **Narxlarni belgilash:** Har bir ish uchun mustaqil narx belgilash.
- **Daromad olish va hisobdan yechish:** Sotilgan ishlardan tushgan mablag'ni shaxsiy kabinetda kuzatish va bank kartasiga yechib olish.
- **Buyurtmalar birjasi:** Tushgan individual va ommaviy buyurtmalarni olib bajarish orqali daromad topish.

### 📢 E. Hamjamiyat va Muloqot (Telegram Ekotizimi):
- **Admin User (@CoSaPl_Admin):** Mijozlar va sotuvchilar bilan individual aloqa, tezkor qo'llab-quvvatlash (Support).
- **Telegram Kanal (@CoSaPl_Kanal):** Yangi yuklangan sara ishlar, chegirmalar, aksiyalar va o'quv yangiliklari.
- **Telegram Guruh (@CoSaPl_Guruh):** Talabalar va mualliflar o'rtasida erkin muhokama va tajriba almashish.

---

## 🛠️ 2. Texnologik Stack & Firebase Integratsiyasi

```javascript
// CoSaPl Web App Firebase Konfiguratsiyasi
const firebaseConfig = {
  apiKey: "AIzaSyB1ZPzbl0QqPLQjFGijL7P4doJgfPF9yWY",
  authDomain: "cosapl.firebaseapp.com",
  databaseURL: "https://cosapl-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "cosapl",
  storageBucket: "cosapl.firebasestorage.app",
  messagingSenderId: "399794136852",
  appId: "1:399794136852:web:00eb878646ac544a6e4401",
  measurementId: "G-19NG576H67"
};
```

| Qatlam | Texnologiya | Tavsifi va Vazifasi |
| :--- | :--- | :--- |
| **Frontend** | **Next.js 14+ (React)**, TypeScript, Tailwind CSS, Lucide Icons | Chaqqon, mobilga mos, zamonaviy interfeys |
| **Hosting** | **Firebase Hosting** (`cosapl.web.app`) | Global CDN, tezkor yuklanish va SSL himoya |
| **Ma'lumotlar bazasi** | **Firebase Cloud Firestore & RTDB** | Real-time chat va buyurtma monitoringi |
| **Autentifikatsiya** | **Firebase Auth** | Telefon raqam (SMS OTP), Google va Telegram Login |
| **Fayllar ombori** | **Firebase Cloud Storage** | Hujjatlar (.docx, .pdf, sertifikatlar) xavfsiz saqlanishi |
| **Telegram Bot & TMA** | **Telegraf.js / Grammy** | Telegram orqali xarid va bildirishnomalar |
| **To'lov tizimlari** | **Click API, Payme** + **Admin orqali** (Chek tasdiqlash) | Avtomatlashtirilgan hamda qo'lda to'lovlar |

---

## 🚀 3. Firebase Hosting ga Joylash (Deploy) Yo'riqnomasi

1. Loyihani statik formatda yig'ish (build):
```bash
npm run build
```

2. Firebase hisobiga kirish:
```bash
npx firebase login
```

3. `cosapl.web.app` ga yuklash:
```bash
npx firebase deploy --only hosting
```

Platforma muvaffaqiyatli tarzda **https://cosapl.web.app** manzilida ishlaydi!

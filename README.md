# سیستم کنترل پروژه پایپینگ

یک سیستم جامع و ماژولار برای مدیریت پروژه‌های پایپینگ صنعتی با قابلیت‌های پیشرفته.

## 🎯 ویژگی‌های اصلی

### ✅ پیاده‌سازی شده

- **داشبورد مدیریت**: نمای کلی از وضعیت پروژه‌ها و فعالیت‌ها
- **مدیریت پروژه‌ها**: ثبت و ویرایش اطلاعات پروژه‌ها
- **جوینت هیستوری QC**: مدیریت وضعیت فیتاپ، جوش و NDT جوینت‌ها
- **اطلاعات جوشکاران**: مدیریت صلاحیت‌ها و اطلاعات جوشکاران
- **DataGrid پیشرفته**: جستجو، فیلتر، مرتب‌سازی، صفحه‌بندی
- **تم تاریک/روشن**: پشتیبانی کامل از Dark/Light Mode
- **تاریخ شمسی**: انتخابگر تاریخ جلالی
- **طراحی ریسپانسیو**: سازگار با موبایل، تبلت و دسکتاپ
- **پالت رنگی سازمانی**: استفاده از رنگ‌های تعریف شده

### 🚧 در حال توسعه

- جوینت هیستوری دفترفنی
- MTO متریال
- تراکنش‌های انبار
- موجودی انبار
- کسری و خرید
- رزرو متریال
- گزارش روزانه
- پیشرفت پروژه
- لیست کارکنان

## 📁 ساختار پروژه

```
src/
├── components/          # کامپوننت‌های مشترک
│   ├── DataGrid.tsx    # جدول داده پیشرفته
│   ├── Header.tsx      # هدر اصلی
│   ├── Sidebar.tsx     # منوی کناری
│   ├── JalaliDatePicker.tsx  # انتخابگر تاریخ شمسی
│   └── JalaliDatePicker.css
├── pages/              # صفحات اصلی
│   ├── ProjectsPage.tsx
│   ├── QCJointHistoryPage.tsx
│   └── WeldersPage.tsx
├── types/              # تعریف انواع داده
│   └── index.ts
├── data/               # داده‌های نمونه
│   └── sampleData.ts
├── hooks/              # هوک‌های سفارشی
│   ├── useClock.ts
│   ├── useJalaliDate.ts
│   └── useRememberMe.ts
├── context/            # Context ها
│   └── ThemeContext.tsx
├── App.tsx             # کامپوننت اصلی
├── main.tsx            # نقطه ورود
└── index.css           # استایل‌های سراسری
```

## 🎨 پالت رنگی

### Light Mode
- **Primary Background**: `#F7F6FB`
- **Surface**: `#FFFFFF`
- **Brand**: `#4C35A3`
- **Text Primary**: `#171421`
- **Text Secondary**: `#6B6780`

### Dark Mode
- **Primary Background**: `#151117`
- **Surface**: `#291C4C`
- **Brand**: `#3D2980`
- **Text Primary**: `#F1EEFD`
- **Text Secondary**: `#B8B1D8`

## 📊 جداول سیستم

### 1. tblProjects - مشخصات پروژه
- ProjectID, ProjectCode, ProjectName
- ClientName, MainContractor, Subcontractor
- StartDate, PlannedFinishDate, ProjectStatus

### 2. tblJH-Qc - جوینت هیستوری QC
- LineNo, JointNo, IsoNo
- FitupReportNo, WeldReportNo
- NDTStatus, ActiveJoint
- و 50+ فیلد دیگر

### 3. tblWelders - اطلاعات جوشکاران
- WelderStamp, WelderName
- WQTNo, Process, WeldPosition
- MaterialType, THKApproved

### 4. tblJointHistory - جوینت هیستوری دفترفنی
- در حال توسعه

### 5. tblMTOItems - MTO متریال
- در حال توسعه

### 6. tblInventoryTransactions - تراکنش‌های انبار
- در حال توسعه

### 7. tblMaterialShortage - کسری و خرید
- در حال توسعه

### 8. tblMaterialReservations - رزرو متریال
- در حال توسعه

### 9. tblDailyProgress - گزارش روزانه
- در حال توسعه

## 🔧 امکانات DataGrid

- ✅ جستجوی سریع در تمامی فیلدها
- ✅ مرتب‌سازی ستون‌ها
- ✅ صفحه‌بندی (Pagination)
- ✅ انتخاب تعداد رکوردهای هر صفحه
- ✅ دکمه‌های ویرایش و حذف
- ✅ نمایش وضعیت خالی بودن جدول
- ✅ خروجی Excel (در حال توسعه)
- ✅ خروجی PDF (در حال توسعه)
- ✅ چاپ (در حال توسعه)

## 🚀 نحوه اجرا

```bash
# نصب وابستگی‌ها
npm install

# اجرای در حالت توسعه
npm run dev

# ساخت نسخه production
npm run build
```

## 📝 نکات مهم

1. **ماژولار بودن**: تمامی کامپوننت‌ها به صورت ماژولار طراحی شده‌اند و به راحتی قابل توسعه هستند.

2. **آماده برای Backend**: ساختار داده‌ها و API ها به گونه‌ای طراحی شده‌اند که به راحتی می‌توان آن‌ها را به SQLite یا هر دیتابیس دیگری متصل کرد.

3. **توسعه آینده**: جداول تکمیلی (Support, Personnel, ControlProject, TestPackage, Users) در معماری پیش‌بینی شده‌اند و می‌توان بدون تغییر در کدهای قبلی اضافه شدند.

4. **اعتبارسنجی**: تمامی فرم‌ها دارای اعتبارسنجی کامل هستند.

5. **Accessibility**: رعایت استانداردهای دسترسی‌پذیری.

## 🎯 قوانین تجاری

- هیچ دو جوینتی از یک LineNo نباید شماره JointNo مشابه داشته باشند
- ویرایش جوینت‌ها سابقه قبلی را پاک نمی‌کند (ActiveJoint = 0)
- تمامی گزارش‌های NDT حفظ می‌شوند
- رزرو متریال با خروج واقعی از انبار متفاوت است
- موجودی از تراکنش‌ها محاسبه می‌شود، نه ورودی دستی

## 📄 لایسنس

© ۱۴۰۳ - تمامی حقوق محفوظ است

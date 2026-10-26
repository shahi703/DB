/**
 * کامپوننت اصلی اپلیکیشن
 * صفحه لاگین - فاز ۱ (Front-End فقط)
 * 
 * ساختار:
 * - هدر: ساعت، تاریخ، تغییر تم
 * - بخش راست: فرم ورود
 * - بخش چپ: معرفی ویژگی‌ها
 */
import { ThemeProvider, useThemeContext } from './context/ThemeContext';
import { Header } from './components/Header';
import { LoginForm } from './components/LoginForm';
import { Features } from './components/Features';

function LoginLayout() {
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';

  return (
    <div
      className="min-h-screen flex flex-col transition-colors duration-300"
      style={{
        backgroundColor: 'var(--color-bg-primary)',
        fontFamily: "'Vazirmatn', sans-serif",
      }}
    >
      {/* هدر */}
      <Header />

      {/* محتوای اصلی */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 md:py-12">
        <div
          className="w-full max-w-5xl rounded-2xl overflow-hidden transition-all duration-300"
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            boxShadow: isDark
              ? '0 8px 40px rgba(0, 0, 0, 0.4), 0 0 60px rgba(107, 85, 186, 0.05)'
              : '0 8px 40px rgba(23, 20, 33, 0.06)',
          }}
        >
          <div className="flex flex-col lg:flex-row min-h-[520px]">
            {/* سمت راست - فرم ورود */}
            <div className="w-full lg:w-1/2 p-8 md:p-12 flex items-center">
              <LoginForm />
            </div>

            {/* جداکننده */}
            <div
              className="hidden lg:block w-px"
              style={{ backgroundColor: 'var(--color-divider)' }}
            />

            {/* سمت چپ - ویژگی‌ها */}
            <div
              className="w-full lg:w-1/2 p-8 md:p-12 flex items-center"
              style={{
                backgroundColor: isDark ? 'var(--color-bg-secondary)' : 'var(--color-highlight)',
              }}
            >
              <Features />
            </div>
          </div>
        </div>
      </main>

      {/* فوتر */}
      <footer
        className="w-full text-center py-4 text-xs"
        style={{
          color: 'var(--color-text-muted)',
          borderTop: '1px solid var(--color-divider)',
        }}
      >
        <p>© ۱۴۰۵ — تمامی حقوق محفوظ است</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LoginLayout />
    </ThemeProvider>
  );
}

/**
 * صفحه اصلی - ترکیب فرم لاگین و انتخابگر تاریخ
 * نمایش قابلیت ماژولار بودن کامپوننت‌ها
 */
import { ThemeProvider, useThemeContext } from './context/ThemeContext';
import { Header } from './components/Header';
import { LoginForm } from './components/LoginForm';
import { JalaliDatePicker } from './components/JalaliDatePicker';
import { useState } from 'react';
import { Calendar, Shield, Zap, BarChart3 } from 'lucide-react';

function MainLayout() {
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';
  
  const [loginDate, setLoginDate] = useState('');

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
          <div className="flex flex-col lg:flex-row min-h-[600px]">
            {/* سمت راست - فرم ورود */}
            <div className="w-full lg:w-1/2 p-8 md:p-12 flex items-center">
              <div className="w-full">
                <LoginForm />
                
                {/* انتخابگر تاریخ در فرم */}
                <div className="mt-6 pt-6" style={{ borderTop: '1px dashed var(--color-divider)' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar size={16} style={{ color: 'var(--color-brand)' }} />
                    <label
                      className="text-sm font-medium"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      تاریخ ورود (اختیاری)
                    </label>
                  </div>
                  <JalaliDatePicker
                    value={loginDate}
                    onChange={setLoginDate}
                    placeholder="تاریخ ورود خود را انتخاب کنید"
                  />
                  {loginDate && (
                    <p
                      className="text-xs mt-2"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      تاریخ انتخاب‌شده: <code dir="ltr" className="font-mono">{loginDate}</code>
                    </p>
                  )}
                </div>
              </div>
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
              <div className="animate-slide-left w-full">
                {/* عنوان بخش */}
                <div className="mb-10">
                  <h2
                    className="text-2xl font-bold mb-3"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    چرا سامانه مدیریت هوشمند؟
                  </h2>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    ابزاری قدرتمند برای مدیریت یکپارچه سازمان شما
                  </p>
                </div>

                {/* لیست ویژگی‌ها */}
                <div className="space-y-6">
                  {[
                    {
                      icon: <Shield size={22} strokeWidth={1.5} />,
                      title: 'امنیت بالا',
                      description: 'رمزنگاری پیشرفته داده‌ها و احراز هویت چندمرحله‌ای',
                    },
                    {
                      icon: <Zap size={22} strokeWidth={1.5} />,
                      title: 'عملکرد سریع',
                      description: 'پردازش آنی اطلاعات با بهینه‌ترین الگوریتم‌ها',
                    },
                    {
                      icon: <BarChart3 size={22} strokeWidth={1.5} />,
                      title: 'گزارش‌های هوشمند',
                      description: 'تحلیل داده‌ها و ارائه گزارش‌های جامع و کاربردی',
                    },
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 group transition-all duration-300 ease-out"
                      style={{ animationDelay: `${index * 150}ms` }}
                    >
                      {/* آیکون */}
                      <div
                        className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                        style={{
                          backgroundColor: isDark ? 'var(--color-surface-elevated)' : 'var(--color-highlight)',
                          border: `1px solid ${isDark ? '#4A397A' : '#E5E1EF'}`,
                          color: isDark ? '#A18CE5' : '#4C35A3',
                          boxShadow: isDark ? '0 2px 8px rgba(161, 140, 229, 0.1)' : 'none',
                        }}
                      >
                        {feature.icon}
                      </div>

                      {/* متن */}
                      <div>
                        <h3
                          className="text-sm font-semibold mb-1 transition-colors duration-200"
                          style={{ color: 'var(--color-text-primary)' }}
                        >
                          {feature.title}
                        </h3>
                        <p
                          className="text-xs leading-relaxed"
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* فوتر کوچک */}
                <div
                  className="mt-10 pt-6"
                  style={{ borderTop: '1px solid var(--color-divider)' }}
                >
                  <p
                    className="text-xs"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    نسخه ۱.۰.۰ — طراحی‌شده برای سازمان‌های مدرن
                  </p>
                </div>
              </div>
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
        <p>© ۱۴۰۳ — تمامی حقوق محفوظ است</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainLayout />
    </ThemeProvider>
  );
}

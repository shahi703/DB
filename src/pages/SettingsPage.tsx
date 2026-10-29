/**
 * صفحه تنظیمات
 */
import { useThemeContext } from '../context/ThemeContext';
import { Settings, Sun, Moon, Database, Bell, Shield } from 'lucide-react';

export function SettingsPage() {
  const { theme, toggleTheme } = useThemeContext();
  const isDark = theme === 'dark';

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>تنظیمات</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>مدیریت تنظیمات سیستم</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* تم */}
        <div className="p-5 rounded-xl" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--color-highlight)' }}>
              {isDark ? <Moon size={18} style={{ color: 'var(--color-brand)' }} /> : <Sun size={18} style={{ color: 'var(--color-brand)' }} />}
            </div>
            <div>
              <h3 className="font-bold text-sm" style={{ color: 'var(--color-text-primary)' }}>ظاهر برنامه</h3>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>انتخاب حالت روشن یا تاریک</p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="w-full py-2.5 rounded-lg text-sm font-medium transition-all hover:scale-[1.02]"
            style={{
              backgroundColor: 'var(--color-highlight)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-primary)',
            }}
          >
            {isDark ? '🌙 حالت تاریک فعال است — کلیک برای روشن' : '☀️ حالت روشن فعال است — کلیک برای تاریک'}
          </button>
        </div>

        {/* دیتابیس */}
        <div className="p-5 rounded-xl" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--color-highlight)' }}>
              <Database size={18} style={{ color: 'var(--color-brand)' }} />
            </div>
            <div>
              <h3 className="font-bold text-sm" style={{ color: 'var(--color-text-primary)' }}>پایگاه داده</h3>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>مدیریت اتصال به دیتابیس</p>
            </div>
          </div>
          <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--color-success-bg)' }}>
            <p className="text-xs" style={{ color: 'var(--color-success)' }}>✅ اتصال برقرار — حالت آفلاین (LocalStorage)</p>
          </div>
        </div>

        {/* نوتیفیکیشن */}
        <div className="p-5 rounded-xl" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--color-highlight)' }}>
              <Bell size={18} style={{ color: 'var(--color-brand)' }} />
            </div>
            <div>
              <h3 className="font-bold text-sm" style={{ color: 'var(--color-text-primary)' }}>اعلان‌ها</h3>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>تنظیمات اعلان‌های سیستم</p>
            </div>
          </div>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>اعلان‌ها فعال هستند</p>
        </div>

        {/* امنیت */}
        <div className="p-5 rounded-xl" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--color-highlight)' }}>
              <Shield size={18} style={{ color: 'var(--color-brand)' }} />
            </div>
            <div>
              <h3 className="font-bold text-sm" style={{ color: 'var(--color-text-primary)' }}>امنیت</h3>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>تنظیمات امنیتی</p>
            </div>
          </div>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>نسخه ۱.۰.۰ — آخرین به‌روزرسانی: ۱۴۰۳/۰۸/۱۵</p>
        </div>
      </div>
    </div>
  );
}

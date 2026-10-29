/**
 * صفحه داشبورد اصلی
 */
import { useThemeContext } from '../context/ThemeContext';
import { LayoutDashboard, Shield, FileText, Package, TrendingUp, Users, FolderKanban } from 'lucide-react';

export function DashboardPage() {
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';

  const stats = [
    { title: 'پروژه‌های فعال', value: '۲', icon: <FolderKanban size={20} />, color: '#4C35A3' },
    { title: 'جوینت‌های QC', value: '۲', icon: <Shield size={20} />, color: '#16A34A' },
    { title: 'جوشکاران فعال', value: '۲', icon: <Users size={20} />, color: '#D97706' },
    { title: 'تراکنش‌های انبار', value: '۰', icon: <Package size={20} />, color: '#3B82F6' },
  ];

  const recentActivities = [
    { text: 'جوینت J-001 فیتاپ تأیید شد', time: '۲ ساعت پیش', type: 'success' },
    { text: 'جوینت J-002 NDT رد شد - Porosity', time: '۵ ساعت پیش', type: 'error' },
    { text: 'جوشکار W-001 صلاحیت تمدید شد', time: '۱ روز پیش', type: 'info' },
    { text: 'پروژه SPDP-1403 به‌روزرسانی شد', time: '۲ روز پیش', type: 'info' },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      {/* عنوان */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
          داشبورد
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
          خلاصه وضعیت پروژه‌ها و واحدها
        </p>
      </div>

      {/* کارت‌های آماری */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl transition-all hover:scale-105"
            style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                {stat.icon}
              </div>
            </div>
            <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>{stat.title}</p>
          </div>
        ))}
      </div>

      {/* فعالیت‌های اخیر */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-5 rounded-xl" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <h3 className="font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>فعالیت‌های اخیر</h3>
          <div className="space-y-3">
            {recentActivities.map((activity, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--color-highlight)' }}>
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0`} style={{
                  backgroundColor: activity.type === 'success' ? 'var(--color-success)' : activity.type === 'error' ? 'var(--color-error)' : 'var(--color-brand)'
                }} />
                <div className="flex-1">
                  <p className="text-sm" style={{ color: 'var(--color-text-primary)' }}>{activity.text}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 rounded-xl" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <h3 className="font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>دسترسی سریع</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: <Shield size={18} />, label: 'واحد QC', color: '#4C35A3' },
              { icon: <FileText size={18} />, label: 'دفترفنی', color: '#3B82F6' },
              { icon: <Package size={18} />, label: 'انبار', color: '#16A34A' },
              { icon: <TrendingUp size={18} />, label: 'کنترل پروژه', color: '#D97706' },
            ].map((item, idx) => (
              <button
                key={idx}
                className="flex items-center gap-2 p-3 rounded-lg transition-all hover:scale-105"
                style={{ backgroundColor: 'var(--color-highlight)', border: '1px solid var(--color-border)' }}
              >
                <span style={{ color: item.color }}>{item.icon}</span>
                <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * کامپوننت اصلی اپلیکیشن
 * سیستم کنترل پروژه پایپینگ
 */
import { useState } from 'react';
import { ThemeProvider, useThemeContext } from './context/ThemeContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ProjectsPage } from './pages/ProjectsPage';
import { QCJointHistoryPage } from './pages/QCJointHistoryPage';
import { WeldersPage } from './pages/WeldersPage';
import { LayoutDashboard, Construction } from 'lucide-react';

function PlaceholderPage({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div
        className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
        style={{
          backgroundColor: 'var(--color-highlight)',
          color: 'var(--color-brand)',
        }}
      >
        <Construction size={40} strokeWidth={1.5} />
      </div>
      <h2
        className="text-xl font-bold mb-3"
        style={{ color: 'var(--color-text-primary)' }}
      >
        {title}
      </h2>
      <p
        className="text-sm text-center max-w-md"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        {description}
      </p>
    </div>
  );
}

function DashboardPage() {
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';

  return (
    <div>
      <div className="mb-8">
        <h1
          className="text-2xl font-bold mb-2"
          style={{ color: 'var(--color-text-primary)' }}
        >
          داشبورد مدیریت
        </h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          نمای کلی از وضعیت پروژه‌ها و فعالیت‌ها
        </p>
      </div>

      {/* کارت‌های آماری */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'پروژه‌های فعال', value: '۲', icon: '📊', color: 'var(--color-brand)' },
          { label: 'جوینت‌های کل', value: '۲', icon: '🔧', color: 'var(--color-success)' },
          { label: 'جوشکاران فعال', value: '۲', icon: '👷', color: 'var(--color-warning)' },
          { label: 'NDT قبول', value: '۱', icon: '✓', color: 'var(--color-success)' },
        ].map((stat, i) => (
          <div
            key={i}
            className="p-6 rounded-xl transition-all hover:scale-105"
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              boxShadow: isDark
                ? '0 4px 20px rgba(0,0,0,0.3)'
                : '0 4px 20px rgba(23,20,33,0.06)',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">{stat.icon}</span>
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${stat.color}20` }}
              >
                <LayoutDashboard size={20} style={{ color: stat.color }} />
              </div>
            </div>
            <p className="text-3xl font-bold mb-1" style={{ color: stat.color }}>
              {stat.value}
            </p>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* اطلاعات سریع */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          className="p-6 rounded-xl"
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
          }}
        >
          <h3
            className="text-lg font-bold mb-4"
            style={{ color: 'var(--color-text-primary)' }}
          >
            آخرین فعالیت‌ها
          </h3>
          <div className="space-y-3">
            {[
              { text: 'جوینت J-001 فیتاپ شد', time: '۲ ساعت پیش', color: 'var(--color-success)' },
              { text: 'جوینت J-002 جوشکاری شد', time: '۵ ساعت پیش', color: 'var(--color-success)' },
              { text: 'NDT جوینت J-002 رد شد', time: '۱ روز پیش', color: 'var(--color-error)' },
            ].map((activity, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-lg"
                style={{ backgroundColor: 'var(--color-highlight)' }}
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: activity.color }}
                />
                <div className="flex-1">
                  <p className="text-sm" style={{ color: 'var(--color-text-primary)' }}>
                    {activity.text}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className="p-6 rounded-xl"
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
          }}
        >
          <h3
            className="text-lg font-bold mb-4"
            style={{ color: 'var(--color-text-primary)' }}
          >
            وضعیت پروژه‌ها
          </h3>
          <div className="space-y-4">
            {[
              { name: 'فاز ۱۴ پارس جنوبی', progress: 35, status: 'active' },
              { name: 'پالایشگاه تهران', progress: 15, status: 'active' },
            ].map((project, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                    {project.name}
                  </span>
                  <span className="text-sm font-bold" style={{ color: 'var(--color-brand)' }}>
                    {project.progress}%
                  </span>
                </div>
                <div
                  className="w-full h-2 rounded-full overflow-hidden"
                  style={{ backgroundColor: 'var(--color-highlight)' }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${project.progress}%`,
                      background: 'linear-gradient(90deg, var(--color-brand), var(--color-brand-hover))',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AppLayout() {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';

  const renderPage = () => {
    switch (activeMenu) {
      case 'dashboard':
        return <DashboardPage />;
      case 'projects-list':
      case 'projects-settings':
        return <ProjectsPage />;
      case 'qc-joint-history':
        return <QCJointHistoryPage />;
      case 'qc-welders':
        return <WeldersPage />;
      case 'qc-reports':
        return <PlaceholderPage title="گزارشات QC" description="این بخش در حال توسعه است و به زودی فعال خواهد شد." />;
      case 'office-joint-history':
        return <PlaceholderPage title="جوینت هیستوری دفترفنی" description="این بخش در حال توسعه است و به زودی فعال خواهد شد." />;
      case 'office-mto':
        return <PlaceholderPage title="MTO متریال" description="این بخش در حال توسعه است و به زودی فعال خواهد شد." />;
      case 'warehouse-transactions':
        return <PlaceholderPage title="تراکنش‌های انبار" description="این بخش در حال توسعه است و به زودی فعال خواهد شد." />;
      case 'warehouse-inventory':
        return <PlaceholderPage title="موجودی انبار" description="این بخش در حال توسعه است و به زودی فعال خواهد شد." />;
      case 'warehouse-shortage':
        return <PlaceholderPage title="کسری و خرید" description="این بخش در حال توسعه است و به زودی فعال خواهد شد." />;
      case 'warehouse-reservations':
        return <PlaceholderPage title="رزرو متریال" description="این بخش در حال توسعه است و به زودی فعال خواهد شد." />;
      case 'control-daily':
        return <PlaceholderPage title="گزارش روزانه" description="این بخش در حال توسعه است و به زودی فعال خواهد شد." />;
      case 'control-progress':
        return <PlaceholderPage title="پیشرفت پروژه" description="این بخش در حال توسعه است و به زودی فعال خواهد شد." />;
      case 'personnel-list':
        return <PlaceholderPage title="لیست کارکنان" description="این بخش در حال توسعه است و به زودی فعال خواهد شد." />;
      case 'settings':
        return <PlaceholderPage title="تنظیمات" description="این بخش در حال توسعه است و به زودی فعال خواهد شد." />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div
      className="min-h-screen flex transition-colors duration-300"
      style={{
        backgroundColor: 'var(--color-bg-primary)',
        fontFamily: "'Vazirmatn', sans-serif",
      }}
    >
      {/* Sidebar */}
      <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />

      {/* محتوای اصلی */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-6 md:p-8 overflow-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppLayout />
    </ThemeProvider>
  );
}

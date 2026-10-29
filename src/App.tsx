/**
 * App.tsx - کامپوننت اصلی برنامه
 * مدیریت احراز هویت، روتینگ، و ساختار کلی
 */
import { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LoginForm } from './components/LoginForm';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { QCModule } from './pages/QCModule';
import { ProjectsPage } from './pages/ProjectsPage';
import { WeldersPage } from './pages/WeldersPage';
import { DashboardPage } from './pages/DashboardPage';
import { OfficeModule } from './pages/OfficeModule';
import { WarehouseModule } from './pages/WarehouseModule';
import { ControlModule } from './pages/ControlModule';
import { PersonnelModule } from './pages/PersonnelModule';
import { SettingsPage } from './pages/SettingsPage';
import { Menu, X } from 'lucide-react';

const AUTH_KEY = 'isAuthenticated';

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem(AUTH_KEY) === 'true';
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('dashboard');

  // ذخیره وضعیت احراز هویت
  useEffect(() => {
    localStorage.setItem(AUTH_KEY, String(isAuthenticated));
  }, [isAuthenticated]);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_KEY);
  };

  // اگر احراز هویت نشده، فرم ورود را نشان بده
  if (!isAuthenticated) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: 'var(--color-bg-primary)' }}
      >
        <LoginForm onLogin={handleLogin} />
      </div>
    );
  }

  // رندر صفحه فعال
  const renderPage = () => {
    switch (activeMenu) {
      case 'dashboard':
        return <DashboardPage />;
      case 'projects-list':
        return <ProjectsPage />;
      case 'projects-settings':
        return <ProjectsPage settingsMode />;
      case 'qc':
      case 'qc-dashboard':
      case 'qc-joint-history':
      case 'qc-welders':
      case 'qc-reports':
        return <QCModule activeTab={activeMenu} onTabChange={setActiveMenu} />;
      case 'office':
      case 'office-joint-history':
      case 'office-mto':
        return <OfficeModule activeTab={activeMenu} onTabChange={setActiveMenu} />;
      case 'warehouse':
      case 'warehouse-transactions':
      case 'warehouse-inventory':
      case 'warehouse-shortage':
      case 'warehouse-reservations':
        return <WarehouseModule activeTab={activeMenu} onTabChange={setActiveMenu} />;
      case 'control':
      case 'control-daily':
      case 'control-progress':
        return <ControlModule activeTab={activeMenu} onTabChange={setActiveMenu} />;
      case 'personnel':
      case 'personnel-list':
        return <PersonnelModule activeTab={activeMenu} onTabChange={setActiveMenu} />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      {/* Overlay برای موبایل */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static z-40 h-full transition-all duration-300 ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0 lg:w-0 lg:overflow-hidden'
        }`}
      >
        <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />
      </div>

      {/* محتوای اصلی */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* هدر با دکمه همبرگر */}
        <div className="flex items-center" style={{ borderBottom: '1px solid var(--color-divider)' }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-3 m-2 rounded-xl transition-all hover:scale-105"
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-primary)',
            }}
            title={sidebarOpen ? 'بستن منو' : 'باز کردن منو'}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex-1">
            <Header onLogout={handleLogout} />
          </div>
        </div>

        {/* محتوای صفحه */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;

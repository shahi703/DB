/**
 * کامپوننت Sidebar - منوی کناری
 * منوی قابل باز شدن برای هر واحد
 */
import { useState } from 'react';
import { useThemeContext } from '../context/ThemeContext';
import {
  LayoutDashboard,
  FolderKanban,
  Shield,
  Users,
  FileText,
  Package,
  ClipboardList,
  TrendingUp,
  ChevronDown,
  ChevronLeft,
  Settings,
} from 'lucide-react';

interface SidebarProps {
  activeMenu: string;
  onMenuChange: (menuId: string) => void;
}

interface MenuItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  children?: { id: string; title: string }[];
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    title: 'داشبورد',
    icon: <LayoutDashboard size={20} />,
  },
  {
    id: 'projects',
    title: 'اطلاعات پروژه',
    icon: <FolderKanban size={20} />,
    children: [
      { id: 'projects-list', title: 'لیست پروژه‌ها' },
      { id: 'projects-settings', title: 'تنظیمات پروژه' },
    ],
  },
  {
    id: 'qc',
    title: 'واحد QC',
    icon: <Shield size={20} />,
    children: [
      { id: 'qc-joint-history', title: 'جوینت هیستوری QC' },
      { id: 'qc-welders', title: 'اطلاعات جوشکاران' },
      { id: 'qc-reports', title: 'گزارشات QC' },
    ],
  },
  {
    id: 'office',
    title: 'واحد دفترفنی',
    icon: <FileText size={20} />,
    children: [
      { id: 'office-joint-history', title: 'جوینت هیستوری دفترفنی' },
      { id: 'office-mto', title: 'MTO متریال' },
    ],
  },
  {
    id: 'warehouse',
    title: 'واحد انبار',
    icon: <Package size={20} />,
    children: [
      { id: 'warehouse-transactions', title: 'تراکنش‌های انبار' },
      { id: 'warehouse-inventory', title: 'موجودی انبار' },
      { id: 'warehouse-shortage', title: 'کسری و خرید' },
      { id: 'warehouse-reservations', title: 'رزرو متریال' },
    ],
  },
  {
    id: 'control',
    title: 'واحد کنترل پروژه',
    icon: <TrendingUp size={20} />,
    children: [
      { id: 'control-daily', title: 'گزارش روزانه' },
      { id: 'control-progress', title: 'پیشرفت پروژه' },
    ],
  },
  {
    id: 'personnel',
    title: 'واحد اداری',
    icon: <Users size={20} />,
    children: [
      { id: 'personnel-list', title: 'لیست کارکنان' },
    ],
  },
  {
    id: 'settings',
    title: 'تنظیمات',
    icon: <Settings size={20} />,
  },
];

export function Sidebar({ activeMenu, onMenuChange }: SidebarProps) {
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['qc']);

  const toggleMenu = (menuId: string) => {
    setExpandedMenus((prev) =>
      prev.includes(menuId) ? prev.filter((id) => id !== menuId) : [...prev, menuId]
    );
  };

  return (
    <aside
      className="w-64 min-h-screen flex flex-col transition-all duration-300"
      style={{
        backgroundColor: isDark ? '#211735' : '#211A35',
        borderLeft: `1px solid ${isDark ? '#4A397A' : '#E8E4F2'}`,
      }}
    >
      {/* لوگو */}
      <div
        className="p-6 flex items-center gap-3"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #4C35A3, #6B55BA)',
            boxShadow: '0 4px 12px rgba(107, 85, 186, 0.3)',
          }}
        >
          <ClipboardList size={20} strokeWidth={2} color="#fff" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-white">سیستم کنترل پروژه</h1>
          <p className="text-xs" style={{ color: '#B8B1D8' }}>
            پایپینگ صنعتی
          </p>
        </div>
      </div>

      {/* منو */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {menuItems.map((item) => (
          <div key={item.id} className="mb-1">
            <button
              onClick={() => {
                if (item.children) {
                  toggleMenu(item.id);
                } else {
                  onMenuChange(item.id);
                }
              }}
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium transition-all hover:bg-white/5"
              style={{
                color: activeMenu === item.id ? '#A18CE5' : '#B8B1D8',
                backgroundColor: activeMenu === item.id ? 'rgba(161, 140, 229, 0.1)' : 'transparent',
              }}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span>{item.title}</span>
              </div>
              {item.children && (
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    expandedMenus.includes(item.id) ? 'rotate-180' : ''
                  }`}
                />
              )}
            </button>

            {/* زیرمنو */}
            {item.children && expandedMenus.includes(item.id) && (
              <div className="mr-4 mt-1 space-y-1">
                {item.children.map((child) => (
                  <button
                    key={child.id}
                    onClick={() => onMenuChange(child.id)}
                    className="w-full text-right px-4 py-2 text-xs rounded-lg transition-all hover:bg-white/5"
                    style={{
                      color: activeMenu === child.id ? '#A18CE5' : '#7A7399',
                      backgroundColor: activeMenu === child.id ? 'rgba(161, 140, 229, 0.1)' : 'transparent',
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <ChevronLeft size={12} />
                      <span>{child.title}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* فوتر */}
      <div
        className="p-4 text-center"
        style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}
      >
        <p className="text-xs" style={{ color: '#7A7399' }}>
          نسخه ۱.۰.۰
        </p>
      </div>
    </aside>
  );
}

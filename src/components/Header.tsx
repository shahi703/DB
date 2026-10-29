/**
 * کامپوننت هدر
 * شامل: دکمه تغییر تم، ساعت زنده، تاریخ شمسی، دکمه خروج
 */
import { useThemeContext } from '../context/ThemeContext';
import { useClock } from '../hooks/useClock';
import { useJalaliDate } from '../hooks/useJalaliDate';
import { Sun, Moon, LogOut } from 'lucide-react';

interface HeaderProps {
  onLogout: () => void;
}

export function Header({ onLogout }: HeaderProps) {
  const { theme, toggleTheme } = useThemeContext();
  const time = useClock();
  const date = useJalaliDate();

  return (
    <header
      className="w-full flex items-center justify-between px-4 md:px-6 py-3 md:py-4"
    >
      {/* تاریخ و ساعت */}
      <div className="flex items-center gap-4 md:gap-6">
        {/* ساعت */}
        <div
          className="flex items-center gap-2 text-sm md:text-base font-medium tabular-nums"
          style={{ color: 'var(--color-text-primary)', direction: 'ltr' }}
          aria-label={`ساعت: ${time}`}
        >
          <span className="hidden sm:inline" style={{ color: 'var(--color-text-secondary)' }}>
            ساعت
          </span>
          <span className="font-semibold tracking-wider">{time}</span>
        </div>

        {/* جداکننده */}
        <div
          className="hidden sm:block w-px h-5"
          style={{ backgroundColor: 'var(--color-divider)' }}
        />

        {/* تاریخ */}
        <div
          className="hidden sm:flex items-center gap-2 text-sm"
          style={{ color: 'var(--color-text-secondary)' }}
          aria-label={`تاریخ: ${date}`}
        >
          <span>{date}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* دکمه تغییر تم */}
        <button
          onClick={toggleTheme}
          className="relative flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300 ease-out hover:scale-105 focus:outline-none focus:ring-2"
          style={{
            backgroundColor: theme === 'dark' ? 'var(--color-surface-elevated)' : 'var(--color-highlight)',
            color: theme === 'dark' ? '#A18CE5' : 'var(--color-brand)',
            border: '1px solid var(--color-border)',
          }}
          aria-label={theme === 'dark' ? 'تغییر به حالت روشن' : 'تغییر به حالت تاریک'}
          title={theme === 'dark' ? 'حالت روشن' : 'حالت تاریک'}
        >
          {theme === 'dark' ? (
            <Sun size={16} strokeWidth={1.8} />
          ) : (
            <Moon size={16} strokeWidth={1.8} />
          )}
        </button>

        {/* دکمه خروج */}
        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105"
          style={{
            backgroundColor: 'var(--color-error-bg)',
            color: 'var(--color-error)',
            border: '1px solid var(--color-error)',
          }}
          title="خروج از سیستم"
        >
          <LogOut size={14} />
          <span className="hidden sm:inline">خروج</span>
        </button>
      </div>
    </header>
  );
}

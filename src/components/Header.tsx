/**
 * کامپوننت هدر
 * شامل: دکمه تغییر تم، ساعت زنده، تاریخ شمسی
 */
import { useThemeContext } from '../context/ThemeContext';
import { useClock } from '../hooks/useClock';
import { useJalaliDate } from '../hooks/useJalaliDate';
import { Sun, Moon } from 'lucide-react';

export function Header() {
  const { theme, toggleTheme } = useThemeContext();
  const time = useClock();
  const date = useJalaliDate();

  return (
    <header
      className="w-full flex items-center justify-between px-6 py-4 md:px-10 md:py-5"
      style={{ borderBottom: '1px solid var(--color-divider)' }}
    >
      {/* تاریخ و ساعت */}
      <div className="flex items-center gap-4 md:gap-6">
        {/* ساعت */}
        <div
          className="flex items-center gap-2 text-sm md:text-base font-medium tabular-nums"
          style={{ color: 'var(--color-text)', direction: 'ltr' }}
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

      {/* دکمه تغییر تم */}
      <button
        onClick={toggleTheme}
        className="relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ease-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2"
        style={{
          backgroundColor: 'var(--color-surface)',
          color: 'var(--color-text)',
          border: '1px solid var(--color-border)',

        }}
        aria-label={theme === 'dark' ? 'تغییر به حالت روشن' : 'تغییر به حالت تاریک'}
        title={theme === 'dark' ? 'حالت روشن' : 'حالت تاریک'}
      >
        {theme === 'dark' ? (
          <Sun size={18} strokeWidth={1.8} />
        ) : (
          <Moon size={18} strokeWidth={1.8} />
        )}
      </button>
    </header>
  );
}

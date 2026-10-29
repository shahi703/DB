/**
 * انتخابگر تاریخ شمسی (Jalali Date Picker)
 * قابلیت: انتخاب روز، ماه، سال
 * سازگار با پالت رنگی سازمانی و تم Dark/Light
 * فونت: وزیرمتن | جهت: RTL
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { useThemeContext } from '../context/ThemeContext';
import * as jalaali from 'jalaali-js';
import './JalaliDatePicker.css';

const MONTHS = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
];

const WD_SHORT = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];
const WD_FULL = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];

interface JalaliDate {
  jy: number;
  jm: number;
  jd: number;
}

interface JalaliDatePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export function JalaliDatePicker({ value, onChange, placeholder = 'انتخاب تاریخ…', label }: JalaliDatePickerProps) {
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';
  
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<'days' | 'months' | 'years'>('days');
  const [selectedDate, setSelectedDate] = useState<JalaliDate | null>(null);
  const [viewYear, setViewYear] = useState(0);
  const [viewMonth, setViewMonth] = useState(0);
  const [yearRangeStart, setYearRangeStart] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  // دریافت تاریخ امروز
  const today = useCallback((): JalaliDate => {
    const now = new Date();
    return jalaali.toJalaali(now.getFullYear(), now.getMonth() + 1, now.getDate());
  }, []);

  // مقداردهی اولیه
  useEffect(() => {
    const t = today();
    if (value) {
      const parsed = parseDate(value);
      if (parsed) {
        setSelectedDate(parsed);
        setViewYear(parsed.jy);
        setViewMonth(parsed.jm);
        setYearRangeStart(parsed.jy - 6);
      }
    } else {
      setViewYear(t.jy);
      setViewMonth(t.jm);
      setYearRangeStart(t.jy - 6);
    }
  }, [value, today]);

  // بستن picker با کلیک بیرون
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  // تبدیل عدد به فارسی
  const toFa = (n: number | string): string => {
    const fa = '۰۱۲۳۴۵۶۷۸۹';
    return String(n).replace(/\d/g, (d) => fa[parseInt(d)]);
  };

  const padFa = (n: number): string => {
    return toFa((n < 10 ? '0' : '') + n);
  };

  // تجزیه تاریخ از رشته
  function parseDate(str: string): JalaliDate | null {
    if (!str) return null;
    const parts = str.replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))).split('/');
    if (parts.length !== 3) return null;
    const jy = parseInt(parts[0]);
    const jm = parseInt(parts[1]);
    const jd = parseInt(parts[2]);
    if (isNaN(jy) || isNaN(jm) || isNaN(jd)) return null;
    if (jm < 1 || jm > 12 || jd < 1 || jd > jalaali.jalaaliMonthLength(jy, jm)) return null;
    return { jy, jm, jd };
  }

  // فرمت تاریخ برای نمایش
  const formatDisplay = (date: JalaliDate): string => {
    return `${toFa(date.jy)}/${padFa(date.jm)}/${padFa(date.jd)}`;
  };

  // فرمت تاریخ برای خروجی
  const formatValue = (date: JalaliDate): string => {
    return `${date.jy}/${(date.jm < 10 ? '0' : '') + date.jm}/${(date.jd < 10 ? '0' : '') + date.jd}`;
  };

  // کلمات کامل تاریخ
  const words = (jy: number, jm: number, jd: number): string => {
    const g = jalaali.toGregorian(jy, jm, jd);
    const date = new Date(g.gy, g.gm - 1, g.gd);
    const dayIndex = (date.getDay() + 1) % 7;
    return `${WD_FULL[dayIndex]} ${toFa(jd)} ${MONTHS[jm - 1]} ${toFa(jy)}`;
  };

  // روز هفته
  const getWeekday = (jy: number, jm: number, jd: number): number => {
    const g = jalaali.toGregorian(jy, jm, jd);
    const date = new Date(g.gy, g.gm - 1, g.gd);
    return (date.getDay() + 1) % 7;
  };

  // انتخاب تاریخ
  const handleSelectDate = (jd: number) => {
    const newDate = { jy: viewYear, jm: viewMonth, jd };
    setSelectedDate(newDate);
    if (onChange) onChange(formatValue(newDate));
    setTimeout(() => setIsOpen(false), 180);
  };

  // انتخاب ماه
  const handleSelectMonth = (jm: number) => {
    setViewMonth(jm);
    setView('days');
  };

  // انتخاب سال
  const handleSelectYear = (jy: number) => {
    setViewYear(jy);
    setView('months');
  };

  // ناوبری
  const handlePrev = () => {
    if (view === 'days') {
      if (viewMonth === 1) {
        setViewMonth(12);
        setViewYear(viewYear - 1);
      } else {
        setViewMonth(viewMonth - 1);
      }
    } else if (view === 'months') {
      setViewYear(viewYear - 1);
    } else {
      setYearRangeStart(yearRangeStart - 12);
    }
  };

  const handleNext = () => {
    if (view === 'days') {
      if (viewMonth === 12) {
        setViewMonth(1);
        setViewYear(viewYear + 1);
      } else {
        setViewMonth(viewMonth + 1);
      }
    } else if (view === 'months') {
      setViewYear(viewYear + 1);
    } else {
      setYearRangeStart(yearRangeStart + 12);
    }
  };

  // رفتن به امروز
  const handleGoToday = () => {
    const t = today();
    setSelectedDate(t);
    setViewYear(t.jy);
    setViewMonth(t.jm);
    setView('days');
    if (onChange) onChange(formatValue(t));
    setTimeout(() => setIsOpen(false), 180);
  };

  // پاک کردن
  const handleClear = () => {
    setSelectedDate(null);
    if (onChange) onChange('');
  };

  // باز کردن picker
  const handleOpen = () => {
    const t = today();
    if (selectedDate) {
      setViewYear(selectedDate.jy);
      setViewMonth(selectedDate.jm);
    } else {
      setViewYear(t.jy);
      setViewMonth(t.jm);
    }
    setYearRangeStart(viewYear - 6);
    setView('days');
    setIsOpen(true);
  };

  // رندر روزها
  const renderDays = () => {
    const t = today();
    const len = jalaali.jalaaliMonthLength(viewYear, viewMonth);
    const first = getWeekday(viewYear, viewMonth, 1);
    
    const days = [];
    for (let i = 0; i < first; i++) {
      days.push(<div key={`pad-${i}`} className="jp-pad" />);
    }
    
    for (let d = 1; d <= len; d++) {
      const col = (first + d - 1) % 7;
      const isFriday = col === 6;
      const isToday = d === t.jd && viewMonth === t.jm && viewYear === t.jy;
      const isSelected = selectedDate && selectedDate.jy === viewYear && selectedDate.jm === viewMonth && selectedDate.jd === d;
      
      let className = 'jp-day';
      if (isFriday) className += ' fr';
      if (isToday) className += ' today';
      if (isSelected) className += ' sel';
      
      days.push(
        <button
          key={d}
          type="button"
          className={className}
          onClick={() => handleSelectDate(d)}
        >
          {toFa(d)}
        </button>
      );
    }
    
    return (
      <>
        <div className="jp-wd">
          {WD_SHORT.map((wd, i) => (
            <span key={i} className={i === 6 ? 'fr' : ''}>{wd}</span>
          ))}
        </div>
        <div className="jp-grid">{days}</div>
      </>
    );
  };

  // رندر ماه‌ها
  const renderMonths = () => {
    const t = today();
    return (
      <div className="jp-months-grid">
        {MONTHS.map((month, i) => {
          const m = i + 1;
          let className = 'jp-month';
          if (m === t.jm && viewYear === t.jy) className += ' today';
          if (m === viewMonth) className += ' sel';
          return (
            <button
              key={i}
              type="button"
              className={className}
              onClick={() => handleSelectMonth(m)}
            >
              {month}
            </button>
          );
        })}
      </div>
    );
  };

  // رندر سال‌ها
  const renderYears = () => {
    const t = today();
    const years = [];
    for (let y = yearRangeStart; y < yearRangeStart + 12; y++) {
      let className = 'jp-year';
      if (y === t.jy) className += ' today';
      if (y === viewYear) className += ' sel';
      years.push(
        <button
          key={y}
          type="button"
          className={className}
          onClick={() => handleSelectYear(y)}
        >
          {toFa(y)}
        </button>
      );
    }
    return <div className="jp-years-grid">{years}</div>;
  };

  const t = today();

  return (
    <div className={`jp-wrap ${isOpen ? 'open' : ''} ${isDark ? 'dark' : ''}`} ref={containerRef}>
      {label && (
        <label className="jp-label">{label}</label>
      )}
      <div className="jp-field">
        <input
          type="text"
          className="jp-input"
          readOnly
          value={selectedDate ? formatDisplay(selectedDate) : ''}
          placeholder={placeholder}
          onClick={handleOpen}
        />
        <svg className="jp-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <rect x="3.5" y="5" width="17" height="16" rx="3"></rect>
          <path d="M3.5 10h17M8 2.8v4M16 2.8v4M8 14.5h2M14 14.5h2M8 17.5h2M14 17.5h2"></path>
        </svg>
        
        <div className={`jp-picker ${isOpen ? 'open' : ''}`} ref={pickerRef} role="dialog">
          <div className="jp-head">
            <button type="button" className="jp-nav jp-prev" onClick={handlePrev}>
              <svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"></path></svg>
            </button>
            <div className="jp-title">
              <button
                type="button"
                className="jp-title-month"
                onClick={() => setView(view === 'months' ? 'days' : 'months')}
                style={{ opacity: view === 'months' ? 0.5 : 1 }}
              >
                {MONTHS[viewMonth - 1]}
              </button>
              <button
                type="button"
                className="jp-title-year"
                onClick={() => {
                  setYearRangeStart(viewYear - 6);
                  setView(view === 'years' ? 'days' : 'years');
                }}
                style={{ opacity: view === 'years' ? 0.5 : 1 }}
              >
                {toFa(viewYear)}
              </button>
            </div>
            <button type="button" className="jp-nav jp-next" onClick={handleNext}>
              <svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"></path></svg>
            </button>
          </div>
          
          <div className="jp-body">
            {view === 'days' && renderDays()}
            {view === 'months' && renderMonths()}
            {view === 'years' && renderYears()}
          </div>
          
          <div className="jp-foot">
            <span className="jp-today-label">
              امروز: {words(t.jy, t.jm, t.jd)}
            </span>
            <div className="jp-actions">
              <button type="button" className="jp-btn jp-ghost jp-clear" onClick={handleClear}>
                پاک‌کردن
              </button>
              <button type="button" className="jp-btn jp-solid jp-gotoday" onClick={handleGoToday}>
                امروز
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

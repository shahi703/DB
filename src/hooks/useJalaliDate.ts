/**
 * هوک نمایش تاریخ شمسی
 * فرمت: دوشنبه ۰۴ آبان ۱۴۰۵
 */
import { useState, useEffect } from 'react';
import * as jalaali from 'jalaali-js';

const PERSIAN_DAYS = [
  'یکشنبه',
  'دوشنبه',
  'سه‌شنبه',
  'چهارشنبه',
  'پنجشنبه',
  'جمعه',
  'شنبه'
];

const PERSIAN_MONTHS = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند'
];

function toPersianDigits(str: string | number): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(str).replace(/[0-9]/g, (d) => persianDigits[parseInt(d)]);
}

export function useJalaliDate() {
  const [date, setDate] = useState(() => getJalaliDate());

  useEffect(() => {
    // بررسی تغییر تاریخ هر دقیقه
    const interval = setInterval(() => {
      setDate(getJalaliDate());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return date;
}

function getJalaliDate(): string {
  const now = new Date();
  const jalaaliDate = jalaali.toJalaali(now);
  const dayName = PERSIAN_DAYS[now.getDay()];
  const day = toPersianDigits(String(jalaaliDate.jd).padStart(2, '0'));
  const month = PERSIAN_MONTHS[jalaaliDate.jm - 1];
  const year = toPersianDigits(jalaaliDate.jy);

  return `${dayName} ${day} ${month} ${year}`;
}

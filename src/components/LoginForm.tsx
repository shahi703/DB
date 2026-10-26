/**
 * کامپوننت فرم ورود
 * شامل: Username, Password, Remember Me, Forgot Password
 * آماده اتصال به Backend در آینده
 */
import { useState, useEffect, FormEvent } from 'react';
import { useRememberMe } from '../hooks/useRememberMe';
import { useThemeContext } from '../context/ThemeContext';
import { User, Lock, Eye, EyeOff, LogIn } from 'lucide-react';

interface FormErrors {
  username?: string;
  password?: string;
}

export function LoginForm() {
  const { theme } = useThemeContext();
  const { savedUsername, rememberMe, setRememberMe, setUsername } = useRememberMe();
  
  const [username, setLocalUsername] = useState(savedUsername);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // بارگذاری نام کاربری ذخیره‌شده
  useEffect(() => {
    if (savedUsername) {
      setLocalUsername(savedUsername);
    }
  }, [savedUsername]);

  /**
   * اعتبارسنجی فرم
   * در آینده این بخش به Backend متصل می‌شود
   */
  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!username.trim()) {
      newErrors.username = 'نام کاربری الزامی است';
    }

    if (!password) {
      newErrors.password = 'رمز عبور الزامی است';
    } else if (password.length < 6) {
      newErrors.password = 'رمز عبور باید حداقل ۶ کاراکتر باشد';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * مدیریت ارسال فرم
   * در آینده: ارسال به API و احراز هویت
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    // ذخیره نام کاربری در صورت فعال بودن Remember Me
    if (rememberMe) {
      setUsername(username);
    }

    // شبیه‌سازی تأخیر شبکه (در آینده حذف می‌شود)
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    
    // TODO: اتصال به Backend برای احراز هویت
    // const response = await api.login({ username, password });
  };

  const isDark = theme === 'dark';

  return (
    <div className="w-full max-w-sm mx-auto animate-fade-in">
      {/* لوگو */}
      <div className="flex flex-col items-center mb-8">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 hover:scale-105"
          style={{
            background: isDark
              ? 'linear-gradient(135deg, #3D2980, #6B55BA)'
              : 'linear-gradient(135deg, #4C35A3, #6652C7)',
            boxShadow: isDark
              ? '0 4px 20px rgba(107, 85, 186, 0.3)'
              : '0 4px 20px rgba(76, 53, 163, 0.2)',
          }}
        >
          <LogIn size={26} strokeWidth={1.8} style={{ color: '#ffffff' }} />
        </div>
        <h1
          className="text-xl font-bold mb-2"
          style={{ color: 'var(--color-text-primary)' }}
        >
          سامانه مدیریت هوشمند
        </h1>
        <p
          className="text-sm text-center leading-relaxed"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          برای دسترسی به پنل مدیریت، وارد حساب کاربری خود شوید
        </p>
      </div>

      {/* فرم */}
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* نام کاربری */}
        <div className="space-y-1.5">
          <label
            htmlFor="username"
            className="block text-sm font-medium"
            style={{ color: 'var(--color-text-primary)' }}
          >
            نام کاربری
          </label>
          <div className="relative">
            <div
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <User size={18} strokeWidth={1.5} />
            </div>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => {
                setLocalUsername(e.target.value);
                if (errors.username) setErrors(prev => ({ ...prev, username: undefined }));
              }}
              placeholder="نام کاربری خود را وارد کنید"
              autoComplete="username"
              className={`w-full pr-10 pl-4 py-3 rounded-xl text-sm transition-all duration-200 outline-none ${
                errors.username ? 'ring-2' : ''
              }`}
              style={{
                backgroundColor: 'var(--color-input-bg)',
                border: `1.5px solid ${errors.username ? 'var(--color-error)' : 'var(--color-input-border)'}`,
                color: 'var(--color-text-primary)',
                ...(errors.username ? { '--tw-ring-color': 'var(--color-error)' } as React.CSSProperties : {}),
              }}
              onFocus={(e) => {
                if (!errors.username) {
                  e.target.style.borderColor = 'var(--color-input-focus)';
                  e.target.style.boxShadow = `0 0 0 3px var(--color-brand-glow)`;
                }
              }}
              onBlur={(e) => {
                e.target.style.borderColor = errors.username ? 'var(--color-error)' : 'var(--color-input-border)';
                e.target.style.boxShadow = 'none';
              }}
              aria-invalid={!!errors.username}
              aria-describedby={errors.username ? 'username-error' : undefined}
            />
          </div>
          {errors.username && (
            <p
              id="username-error"
              className="text-xs mt-1.5 flex items-center gap-1.5"
              style={{ color: 'var(--color-error)' }}
              role="alert"
            >
              <span>⚠</span> {errors.username}
            </p>
          )}
        </div>

        {/* رمز عبور */}
        <div className="space-y-1.5">
          <label
            htmlFor="password"
            className="block text-sm font-medium"
            style={{ color: 'var(--color-text-primary)' }}
          >
            رمز عبور
          </label>
          <div className="relative">
            <div
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <Lock size={18} strokeWidth={1.5} />
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
              }}
              placeholder="رمز عبور خود را وارد کنید"
              autoComplete="current-password"
              className={`w-full pr-10 pl-10 py-3 rounded-xl text-sm transition-all duration-200 outline-none ${
                errors.password ? 'ring-2' : ''
              }`}
              style={{
                backgroundColor: 'var(--color-input-bg)',
                border: `1.5px solid ${errors.password ? 'var(--color-error)' : 'var(--color-input-border)'}`,
                color: 'var(--color-text-primary)',
                ...(errors.password ? { '--tw-ring-color': 'var(--color-error)' } as React.CSSProperties : {}),
              }}
              onFocus={(e) => {
                if (!errors.password) {
                  e.target.style.borderColor = 'var(--color-input-focus)';
                  e.target.style.boxShadow = `0 0 0 3px var(--color-brand-glow)`;
                }
              }}
              onBlur={(e) => {
                e.target.style.borderColor = errors.password ? 'var(--color-error)' : 'var(--color-input-border)';
                e.target.style.boxShadow = 'none';
              }}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'password-error' : undefined}
            />
            {/* دکمه نمایش/مخفی رمز */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-1 rounded-md transition-colors duration-200"
              style={{ color: 'var(--color-text-muted)' }}
              aria-label={showPassword ? 'مخفی کردن رمز عبور' : 'نمایش رمز عبور'}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
            </button>
          </div>
          {errors.password && (
            <p
              id="password-error"
              className="text-xs mt-1.5 flex items-center gap-1.5"
              style={{ color: 'var(--color-error)' }}
              role="alert"
            >
              <span>⚠</span> {errors.password}
            </p>
          )}
        </div>

        {/* Remember Me و فراموشی رمز */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="sr-only peer"
              />
              <div
                className="w-4.5 h-4.5 rounded-md border-2 transition-all duration-200 flex items-center justify-center peer-focus:ring-2 peer-focus:ring-offset-1"
                style={{
                  borderColor: rememberMe ? 'transparent' : 'var(--color-input-border)',
                  backgroundColor: rememberMe
                    ? (isDark ? '#6B55BA' : '#4C35A3')
                    : 'transparent',
                  width: '18px',
                  height: '18px',
                }}
              >
                {rememberMe && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
            </div>
            <span
              className="text-sm select-none transition-colors duration-200"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              مرا به خاطر بسپار
            </span>
          </label>

          <a
            href="#"
            className="text-sm transition-all duration-200 hover:underline underline-offset-2"
            style={{ color: isDark ? '#A18CE5' : '#4C35A3' }}
            onClick={(e) => {
              e.preventDefault();
              // TODO: مسیریابی به صفحه بازیابی رمز عبور
            }}
          >
            فراموشی رمز عبور
          </a>
        </div>

        {/* دکمه ورود */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 ease-out hover:opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2"
          style={{
            background: isDark
              ? 'linear-gradient(135deg, #3D2980, #6B55BA)'
              : 'linear-gradient(135deg, #4C35A3, #6652C7)',
            color: '#ffffff',
            boxShadow: isDark
              ? '0 4px 16px rgba(107, 85, 186, 0.3)'
              : '0 4px 16px rgba(76, 53, 163, 0.25)',
          }}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              در حال ورود...
            </span>
          ) : (
            'ورود به سامانه'
          )}
        </button>
      </form>
    </div>
  );
}

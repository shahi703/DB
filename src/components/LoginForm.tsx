/**
 * کامپوننت فرم ورود
 * شامل: Username, Password, Remember Me, Forgot Password
 */
import { useState, useEffect, FormEvent } from 'react';
import { useRememberMe } from '../hooks/useRememberMe';
import { useThemeContext } from '../context/ThemeContext';
import { User, Lock, Eye, EyeOff, LogIn } from 'lucide-react';

interface LoginFormProps {
  onLogin: () => void;
}

interface FormErrors {
  username?: string;
  password?: string;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const { theme } = useThemeContext();
  const { savedUsername, rememberMe, setRememberMe, setUsername } = useRememberMe();
  
  const [username, setLocalUsername] = useState(savedUsername);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (savedUsername) {
      setLocalUsername(savedUsername);
    }
  }, [savedUsername]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!username.trim()) {
      newErrors.username = 'نام کاربری الزامی است';
    }
    if (!password) {
      newErrors.password = 'رمز عبور الزامی است';
    } else if (password.length < 4) {
      newErrors.password = 'رمز عبور باید حداقل ۴ کاراکتر باشد';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    if (rememberMe) {
      setUsername(username);
    }

    // شبیه‌سازی تأخیر شبکه
    await new Promise(resolve => setTimeout(resolve, 800));

    setIsSubmitting(false);
    
    // احراز هویت موفق - ورود به برنامه
    onLogin();
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
          ورود به سیستم
        </h1>
        <p
          className="text-sm text-center"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          سیستم کنترل پروژه پایپینگ صنعتی
        </p>
      </div>

      {/* فرم */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* نام کاربری */}
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            نام کاربری
          </label>
          <div className="relative">
            <User
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--color-text-muted)' }}
            />
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setLocalUsername(e.target.value);
                if (errors.username) setErrors({ ...errors, username: undefined });
              }}
              placeholder="نام کاربری خود را وارد کنید"
              className="w-full pr-10 pl-4 py-3 rounded-xl text-sm outline-none transition-all"
              style={{
                backgroundColor: 'var(--color-input-bg)',
                border: `1.5px solid ${errors.username ? 'var(--color-error)' : 'var(--color-input-border)'}`,
                color: 'var(--color-text-primary)',
              }}
              onFocus={(e) => {
                if (!errors.username) {
                  e.target.style.borderColor = 'var(--color-brand)';
                  e.target.style.boxShadow = '0 0 0 3px var(--color-brand-glow)';
                }
              }}
              onBlur={(e) => {
                e.target.style.borderColor = errors.username ? 'var(--color-error)' : 'var(--color-input-border)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          {errors.username && (
            <p className="text-xs mt-1" style={{ color: 'var(--color-error)' }}>
              {errors.username}
            </p>
          )}
        </div>

        {/* رمز عبور */}
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            رمز عبور
          </label>
          <div className="relative">
            <Lock
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--color-text-muted)' }}
            />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: undefined });
              }}
              placeholder="رمز عبور خود را وارد کنید"
              className="w-full pr-10 pl-10 py-3 rounded-xl text-sm outline-none transition-all"
              style={{
                backgroundColor: 'var(--color-input-bg)',
                border: `1.5px solid ${errors.password ? 'var(--color-error)' : 'var(--color-input-border)'}`,
                color: 'var(--color-text-primary)',
              }}
              onFocus={(e) => {
                if (!errors.password) {
                  e.target.style.borderColor = 'var(--color-brand)';
                  e.target.style.boxShadow = '0 0 0 3px var(--color-brand-glow)';
                }
              }}
              onBlur={(e) => {
                e.target.style.borderColor = errors.password ? 'var(--color-error)' : 'var(--color-input-border)';
                e.target.style.boxShadow = 'none';
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-1 rounded-md transition-colors"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs mt-1" style={{ color: 'var(--color-error)' }}>
              {errors.password}
            </p>
          )}
        </div>

        {/* Remember Me */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded"
              style={{ accentColor: 'var(--color-brand)' }}
            />
            <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              مرا به خاطر بسپار
            </span>
          </label>
        </div>

        {/* دکمه ورود */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all duration-300 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
          style={{
            background: isDark
              ? 'linear-gradient(135deg, #3D2980, #6B55BA)'
              : 'linear-gradient(135deg, #4C35A3, #6652C7)',
            boxShadow: '0 4px 16px var(--color-brand-glow)',
          }}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>در حال ورود...</span>
            </div>
          ) : (
            'ورود به سیستم'
          )}
        </button>
      </form>

      {/* راهنما */}
      <div
        className="mt-6 p-3 rounded-xl text-center text-xs"
        style={{
          backgroundColor: 'var(--color-highlight)',
          color: 'var(--color-text-muted)',
        }}
      >
        💡 برای ورود: هر نام کاربری و رمزی (حداقل ۴ کاراکتر) وارد کنید
      </div>
    </div>
  );
}

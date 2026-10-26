/**
 * کامپوننت ویژگی‌های سامانه
 * سه ویژگی اصلی با آیکون، عنوان و توضیح
 */
import { Shield, Zap, BarChart3 } from 'lucide-react';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: <Shield size={22} strokeWidth={1.5} />,
    title: 'امنیت بالا',
    description: 'رمزنگاری پیشرفته داده‌ها و احراز هویت چندمرحله‌ای',
  },
  {
    icon: <Zap size={22} strokeWidth={1.5} />,
    title: 'عملکرد سریع',
    description: 'پردازش آنی اطلاعات با بهینه‌ترین الگوریتم‌ها',
  },
  {
    icon: <BarChart3 size={22} strokeWidth={1.5} />,
    title: 'گزارش‌های هوشمند',
    description: 'تحلیل داده‌ها و ارائه گزارش‌های جامع و کاربردی',
  },
];

export function Features() {
  return (
    <div className="animate-slide-left">
      {/* عنوان بخش */}
      <div className="mb-10">
        <h2
          className="text-2xl font-bold mb-3"
          style={{ color: 'var(--color-text)' }}
        >
          چرا سامانه مدیریت هوشمند؟
        </h2>
        <p
          className="text-sm leading-relaxed"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          ابزاری قدرتمند برای مدیریت یکپارچه سازمان شما
        </p>
      </div>

      {/* لیست ویژگی‌ها */}
      <div className="space-y-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex items-start gap-4 group transition-all duration-300 ease-out"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            {/* آیکون */}
            <div
              className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-accent)',
              }}
            >
              {feature.icon}
            </div>

            {/* متن */}
            <div>
              <h3
                className="text-sm font-semibold mb-1 transition-colors duration-200"
                style={{ color: 'var(--color-text)' }}
              >
                {feature.title}
              </h3>
              <p
                className="text-xs leading-relaxed"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* فوتر کوچک */}
      <div
        className="mt-10 pt-6"
        style={{ borderTop: '1px solid var(--color-divider)' }}
      >
        <p
          className="text-xs"
          style={{ color: 'var(--color-text-muted)' }}
        >
          نسخه ۱.۰.۰ — طراحی‌شده برای سازمان‌های مدرن
        </p>
      </div>
    </div>
  );
}

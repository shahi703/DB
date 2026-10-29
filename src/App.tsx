import { useState } from 'react';

function App() {
  const [copiedStep, setCopiedStep] = useState<number | null>(null);
  const [activeSolution, setActiveSolution] = useState(0);

  const copyToClipboard = (text: string, step: number) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(step);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const solutions = [
    {
      title: 'راه‌حل اول: حذف و نصب مجدد (توصیه شده)',
      description: 'این روش مشکل فایل‌های خراب یا ناقص را حل می‌کند.',
      steps: [
        {
          label: '۱. پوشه node_modules و فایل package-lock.json را حذف کنید:',
          command: 'rmdir /s /q node_modules\ndel package-lock.json',
          description: 'ابتدا ترمینال را ببندید، سپس این دستورات را در CMD یا PowerShell اجرا کنید.'
        },
        {
          label: '۲. دوباره پکیج‌ها را نصب کنید:',
          command: 'npm install',
          description: 'این دستور تمام وابستگی‌ها را از نو نصب می‌کند.'
        },
        {
          label: '۳. پروژه را اجرا کنید:',
          command: 'npm run dev',
          description: 'حالا پروژه باید بدون ارور اجرا شود.'
        }
      ]
    },
    {
      title: 'راه‌حل دوم: نصب مستقیم پکیج Rollup',
      description: 'اگر روش اول جواب نداد، مستقیماً پکیج مشکل‌دار را نصب کنید.',
      steps: [
        {
          label: '۱. پکیج rollup را مستقیماً نصب کنید:',
          command: 'npm install @rollup/rollup-win32-x64-msvc',
          description: 'این پکیج باینری مخصوص ویندوز ۶۴ بیتی است.'
        },
        {
          label: '۲. پروژه را اجرا کنید:',
          command: 'npm run dev',
          description: 'اگر باز هم ارور داد، به راه‌حل سوم بروید.'
        }
      ]
    },
    {
      title: 'راه‌حل سوم: تغییر نسخه Node.js',
      description: 'شما از Node.js v24 استفاده می‌کنید که خیلی جدید است و ممکن است با Rollup سازگار نباشد.',
      steps: [
        {
          label: '۱. نسخه فعلی Node.js را بررسی کنید:',
          command: 'node -v',
          description: 'نسخه v24 خیلی جدید است. بهتر است از نسخه LTS استفاده کنید.'
        },
        {
          label: '۲. Node.js LTS (v20 یا v22) را نصب کنید:',
          command: 'nvm install 20\nnvm use 20',
          description: 'اگر nvm ندارید، از سایت nodejs.org نسخه LTS را دانلود کنید.'
        },
        {
          label: '۳. node_modules را حذف و دوباره نصب کنید:',
          command: 'rmdir /s /q node_modules\ndel package-lock.json\nnpm install',
          description: 'بعد از تغییر نسخه Node.js، باید دوباره نصب کنید.'
        },
        {
          label: '۴. پروژه را اجرا کنید:',
          command: 'npm run dev',
          description: 'حالا باید همه چیز درست کار کند.'
        }
      ]
    },
    {
      title: 'راه‌حل چهارم: استفاده از cache پاک',
      description: 'گاهی اوقات cache npm باعث مشکل می‌شود.',
      steps: [
        {
          label: '۱. cache npm را پاک کنید:',
          command: 'npm cache clean --force',
          description: 'این دستور تمام کش npm را حذف می‌کند.'
        },
        {
          label: '۲. node_modules و lock file را حذف کنید:',
          command: 'rmdir /s /q node_modules\ndel package-lock.json',
          description: 'حذف کامل فایل‌های نصب شده قبلی.'
        },
        {
          label: '۳. دوباره نصب کنید:',
          command: 'npm install',
          description: 'نصب تمیز بدون cache.'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white" dir="rtl">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-white/5">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-2xl shadow-lg shadow-red-500/20">
            ⚠️
          </div>
          <div>
            <h1 className="text-xl font-bold">راهنمای رفع ارور Rollup</h1>
            <p className="text-sm text-white/60">حل مشکل @rollup/rollup-win32-x64-msvc</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Error Info Box */}
        <div className="mb-10 p-6 rounded-2xl bg-red-500/10 border border-red-500/30 backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <span className="text-3xl">🔴</span>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-red-300 mb-2">اروری که دریافت کردید:</h2>
              <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-red-200 overflow-x-auto" dir="ltr">
                <p>Error: Cannot find module @rollup/rollup-win32-x64-msvc</p>
                <p className="text-red-400 mt-1">
                  rollup.win32-x64-msvc.node is not a valid Win32 application.
                </p>
                <p className="text-white/40 mt-2">Node.js v24.22.1</p>
              </div>
              <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <p className="text-yellow-200 text-sm">
                  <strong>علت:</strong> فایل باینری Rollup برای ویندوز به درستی نصب نشده یا خراب شده است. 
                  همچنین نسخه Node.js شما (v24) خیلی جدید است و ممکن است با Rollup سازگار نباشد.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Solution Tabs */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">
            🛠️ راه‌حل‌ها
          </h2>
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {solutions.map((sol, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSolution(idx)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeSolution === idx
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                }`}
              >
                راه‌حل {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Active Solution */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-2 text-purple-300">
              {solutions[activeSolution].title}
            </h3>
            <p className="text-white/60 mb-6">{solutions[activeSolution].description}</p>

            <div className="space-y-5">
              {solutions[activeSolution].steps.map((step, stepIdx) => (
                <div key={stepIdx} className="group">
                  <div className="flex items-start gap-3 mb-2">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-sm font-bold text-purple-300">
                      {stepIdx + 1}
                    </span>
                    <p className="font-medium text-white/90 pt-0.5">{step.label}</p>
                  </div>
                  <div className="mr-10">
                    <div className="relative bg-black/50 rounded-xl border border-white/10 overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
                        <span className="text-xs text-white/40 font-mono">terminal</span>
                        <button
                          onClick={() => copyToClipboard(step.command, stepIdx)}
                          className={`text-xs px-3 py-1 rounded-md transition-all duration-300 ${
                            copiedStep === stepIdx
                              ? 'bg-green-500/20 text-green-300'
                              : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
                          }`}
                        >
                          {copiedStep === stepIdx ? '✓ کپی شد!' : '📋 کپی'}
                        </button>
                      </div>
                      <pre className="p-4 text-sm font-mono text-green-300 overflow-x-auto whitespace-pre-wrap" dir="ltr">
                        {step.command}
                      </pre>
                    </div>
                    <p className="text-sm text-white/50 mt-2 mr-0">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Fix Section */}
        <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 backdrop-blur-sm">
          <h3 className="text-lg font-bold text-green-300 mb-3 flex items-center gap-2">
            <span>⚡</span>
            سریع‌ترین راه‌حل (یک‌جا کپی کنید):
          </h3>
          <div className="relative bg-black/50 rounded-xl border border-white/10 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
              <span className="text-xs text-white/40 font-mono">PowerShell</span>
              <button
                onClick={() => copyToClipboard(
                  'Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue; Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue; npm install; npm run dev',
                  99
                )}
                className={`text-xs px-3 py-1 rounded-md transition-all duration-300 ${
                  copiedStep === 99
                    ? 'bg-green-500/20 text-green-300'
                    : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
                }`}
              >
                {copiedStep === 99 ? '✓ کپی شد!' : '📋 کپی همه'}
              </button>
            </div>
            <pre className="p-4 text-sm font-mono text-green-300 overflow-x-auto" dir="ltr">
{`Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
npm install
npm run dev`}
            </pre>
          </div>
          <p className="text-sm text-green-200/70 mt-3">
            💡 این دستورات را در PowerShell در مسیر پروژه‌تان اجرا کنید.
          </p>
        </div>

        {/* Additional Tips */}
        <div className="mt-10 grid md:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <h4 className="font-bold text-blue-300 mb-3 flex items-center gap-2">
              <span>💡</span> نکته مهم درباره Node.js
            </h4>
            <p className="text-sm text-white/70 leading-7">
              نسخه Node.js شما <strong className="text-white">v24.22.1</strong> است که خیلی جدید و آزمایشی است. 
              پیشنهاد می‌شود از نسخه <strong className="text-green-300">LTS (v20.x یا v22.x)</strong> استفاده کنید.
              برای تغییر نسخه می‌توانید از <code className="bg-white/10 px-1.5 py-0.5 rounded text-xs" dir="ltr">nvm-windows</code> استفاده کنید.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <h4 className="font-bold text-orange-300 mb-3 flex items-center gap-2">
              <span>📁</span> مسیر پروژه شما
            </h4>
            <p className="text-sm text-white/70 leading-7 mb-2">
              مسیر پروژه شما شامل حروف فارسی است:
            </p>
            <code className="text-xs bg-black/40 text-orange-200 px-3 py-2 rounded-lg block overflow-x-auto" dir="ltr">
              D:\فلش فلزی\SADB\QWEN\DB-main
            </code>
            <p className="text-sm text-white/50 mt-2">
              ⚠️ بهتر است پروژه را در مسیری بدون حروف فارسی قرار دهید تا مشکلات احتمالی رفع شود.
            </p>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-10 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10">
            <span className="text-2xl">✅</span>
            <p className="text-white/80">
              با اجرای راه‌حل اول یا سریع‌ترین راه‌حل، مشکل شما برطرف خواهد شد.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-16">
        <div className="max-w-5xl mx-auto px-6 py-6 text-center text-sm text-white/40">
          <p>ساخته شده برای رفع مشکل Rollup در پروژه‌های Vite | ۲۰۲۵</p>
        </div>
      </footer>
    </div>
  );
}

export default App;

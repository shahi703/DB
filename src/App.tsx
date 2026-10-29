import { useState } from 'react';

interface Step {
  id: string;
  label: string;
  command: string;
  description: string;
  note?: string;
  isOptional?: boolean;
}

interface Solution {
  id: string;
  title: string;
  icon: string;
  color: string;
  description: string;
  steps: Step[];
  priority: number;
  estimatedTime: string;
}

function App() {
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'solutions' | 'quickfix' | 'info'>('solutions');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleStep = (id: string) => {
    setCompletedSteps(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const solutions: Solution[] = [
    {
      id: 'sol1',
      title: 'حذف و نصب مجدد (توصیه شده)',
      icon: '🔄',
      color: 'from-blue-500 to-cyan-500',
      description: 'این روش فایل‌های خراب یا ناقص را حذف و از نو نصب می‌کند.',
      priority: 1,
      estimatedTime: '۳-۵ دقیقه',
      steps: [
        {
          id: 's1-1',
          label: 'بستن VSCode و ترمینال',
          command: '',
          description: 'ابتدا تمام پنجره‌های VSCode و ترمینال را ببندید تا فایل‌ها قفل نباشند.',
          note: 'این مرحله بسیار مهم است!'
        },
        {
          id: 's1-2',
          label: 'حذف پوشه node_modules',
          command: 'rmdir /s /q node_modules',
          description: 'این دستور پوشه node_modules را به طور کامل حذف می‌کند.',
          note: 'اگر CMD اجرا می‌کنید از rmdir و اگر PowerShell اجرا می‌کنید از Remove-Item استفاده کنید.'
        },
        {
          id: 's1-3',
          label: 'حذف فایل package-lock.json',
          command: 'del package-lock.json',
          description: 'فایل قفل پکیج‌ها حذف می‌شود تا npm از نو وابستگی‌ها را حل کند.'
        },
        {
          id: 's1-4',
          label: 'نصب مجدد پکیج‌ها',
          command: 'npm install',
          description: 'تمام وابستگی‌ها از نو دانلود و نصب می‌شوند.',
          note: 'این مرحله ممکن است چند دقیقه طول بکشد.'
        },
        {
          id: 's1-5',
          label: 'اجرای پروژه',
          command: 'npm run dev',
          description: 'سرور توسعه Vite اجرا می‌شود.',
          note: 'اگر ارور نداد، مشکل حل شده! ✅'
        }
      ]
    },
    {
      id: 'sol2',
      title: 'نصب مستقیم پکیج Rollup',
      icon: '📦',
      color: 'from-purple-500 to-pink-500',
      description: 'اگر روش اول جواب نداد، مستقیماً پکیج مشکل‌دار را نصب کنید.',
      priority: 2,
      estimatedTime: '۲-۳ دقیقه',
      steps: [
        {
          id: 's2-1',
          label: 'نصب پکیج rollup برای ویندوز',
          command: 'npm install @rollup/rollup-win32-x64-msvc',
          description: 'این پکیج فایل باینری مخصوص ویندوز ۶۴ بیتی را نصب می‌کند.'
        },
        {
          id: 's2-2',
          label: 'اجرای پروژه',
          command: 'npm run dev',
          description: 'اگر ارور نداد، مشکل حل شده!'
        }
      ]
    },
    {
      id: 'sol3',
      title: 'تغییر نسخه Node.js به LTS',
      icon: '⬇️',
      color: 'from-orange-500 to-red-500',
      description: 'نسخه Node.js شما (v24) خیلی جدید است. از نسخه پایدار استفاده کنید.',
      priority: 3,
      estimatedTime: '۱۰ دقیقه',
      steps: [
        {
          id: 's3-1',
          label: 'بررسی نسخه فعلی',
          command: 'node -v',
          description: 'نسخه فعلی Node.js را نشان می‌دهد. شما v24 دارید که خیلی جدید است.'
        },
        {
          id: 's3-2',
          label: 'دانلود Node.js LTS',
          command: '',
          description: 'به سایت nodejs.org بروید و نسخه LTS (v20 یا v22) را دانلود و نصب کنید.',
          note: 'لینک: https://nodejs.org/en/download'
        },
        {
          id: 's3-3',
          label: 'بررسی نسخه جدید',
          command: 'node -v',
          description: 'باید نسخه v20.x یا v22.x را نشان دهد.'
        },
        {
          id: 's3-4',
          label: 'حذف و نصب مجدد node_modules',
          command: 'rmdir /s /q node_modules\ndel package-lock.json\nnpm install',
          description: 'بعد از تغییر نسخه Node.js باید دوباره نصب کنید.'
        },
        {
          id: 's3-5',
          label: 'اجرای پروژه',
          command: 'npm run dev',
          description: 'حالا باید بدون ارور اجرا شود.'
        }
      ]
    },
    {
      id: 'sol4',
      title: 'پاک کردن cache و نصب تمیز',
      icon: '🧹',
      color: 'from-green-500 to-emerald-500',
      description: 'cache خراب npm می‌تواند باعث نصب فایل‌های خراب شود.',
      priority: 4,
      estimatedTime: '۵ دقیقه',
      steps: [
        {
          id: 's4-1',
          label: 'پاک کردن cache npm',
          command: 'npm cache clean --force',
          description: 'تمام فایل‌های کش شده npm حذف می‌شوند.'
        },
        {
          id: 's4-2',
          label: 'حذف node_modules و lock file',
          command: 'rmdir /s /q node_modules\ndel package-lock.json',
          description: 'حذف کامل فایل‌های نصب قبلی.'
        },
        {
          id: 's4-3',
          label: 'نصب مجدد',
          command: 'npm install',
          description: 'نصب تمیز بدون cache خراب.'
        },
        {
          id: 's4-4',
          label: 'اجرای پروژه',
          command: 'npm run dev',
          description: 'تست نهایی.'
        }
      ]
    }
  ];

  const quickFixCommands = `# === راه‌حل سریع در PowerShell ===
# مرحله ۱: حذف فایل‌های خراب
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue

# مرحله ۲: پاک کردن cache
npm cache clean --force

# مرحله ۳: نصب مجدد
npm install

# مرحله ۴: اجرای پروژه
npm run dev`;

  const cmdQuickFix = `@echo off
echo === راه‌حل سریع ===
echo.
echo مرحله 1: حذف node_modules...
rmdir /s /q node_modules 2>nul
echo مرحله 2: حذف package-lock.json...
del package-lock.json 2>nul
echo مرحله 3: پاک کردن cache...
npm cache clean --force
echo مرحله 4: نصب مجدد...
npm install
echo مرحله 5: اجرای پروژه...
npm run dev
pause`;

  const totalSteps = solutions.reduce((acc, s) => acc + s.steps.length, 0);
  const completedCount = completedSteps.size;
  const progress = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 backdrop-blur-xl bg-slate-900/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-xl sm:text-2xl shadow-lg shadow-red-500/20">
                🔧
              </div>
              <div>
                <h1 className="text-base sm:text-xl font-bold">راهنمای رفع ارور Rollup</h1>
                <p className="text-xs sm:text-sm text-white/50">حل مشکل @rollup/rollup-win32-x64-msvc در ویندوز</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
              <span className="text-xs text-white/50">پیشرفت:</span>
              <span className="text-sm font-bold text-green-400">{completedCount}/{totalSteps}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Error Display */}
        <div className="mb-8 p-4 sm:p-6 rounded-2xl bg-red-500/10 border border-red-500/30 backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <span className="text-2xl sm:text-3xl flex-shrink-0">🔴</span>
            <div className="flex-1 min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-red-300 mb-2">اروری که دریافت کردید:</h2>
              <div className="bg-black/50 rounded-xl p-3 sm:p-4 font-mono text-xs sm:text-sm text-red-200 overflow-x-auto" dir="ltr">
                <p className="whitespace-nowrap">Error: Cannot find module @rollup/rollup-win32-x64-msvc</p>
                <p className="text-red-400 mt-1 whitespace-nowrap">
                  rollup.win32-x64-msvc.node is not a valid Win32 application
                </p>
                <p className="text-white/30 mt-2">code: ERR_DLOPEN_FAILED | Node.js v24.22.1</p>
              </div>
            </div>
          </div>

          {/* Problem Summary */}
          <div className="mt-4 grid sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
              <p className="text-xs text-yellow-300 font-bold mb-1">⚠️ مشکل ۱</p>
              <p className="text-xs text-yellow-200/70">فایل باینری Rollup خراب یا ناقص نصب شده</p>
            </div>
            <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
              <p className="text-xs text-orange-300 font-bold mb-1">⚠️ مشکل ۲</p>
              <p className="text-xs text-orange-200/70">نسخه Node.js v24 خیلی جدید و ناپایدار است</p>
            </div>
            <div className="p-3 rounded-xl bg-pink-500/10 border border-pink-500/20">
              <p className="text-xs text-pink-300 font-bold mb-1">⚠️ مشکل ۳</p>
              <p className="text-xs text-pink-200/70">مسیر پروژه شامل حروف فارسی است</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/70">پیشرفت رفع مشکل</span>
            <span className="text-sm font-bold text-green-400">{progress}%</span>
          </div>
          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          {progress === 100 && (
            <p className="text-center text-green-400 text-sm mt-3 font-bold animate-pulse">
              🎉 تبریک! تمام مراحل انجام شد!
            </p>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'solutions' as const, label: '🛠️ راه‌حل‌ها', desc: 'مرحله به مرحله' },
            { id: 'quickfix' as const, label: '⚡ راه‌حل سریع', desc: 'یک‌جا کپی کنید' },
            { id: 'info' as const, label: 'ℹ️ اطلاعات', desc: 'نکات مهم' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 px-4 sm:px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/20'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              <span className="block">{tab.label}</span>
              <span className="block text-xs opacity-70 mt-0.5">{tab.desc}</span>
            </button>
          ))}
        </div>

        {/* Solutions Tab */}
        {activeTab === 'solutions' && (
          <div className="space-y-6">
            {solutions.map((solution) => {
              const solutionStepsCompleted = solution.steps.filter(s => completedSteps.has(s.id)).length;
              const allCompleted = solutionStepsCompleted === solution.steps.length;

              return (
                <div
                  key={solution.id}
                  className={`rounded-2xl border backdrop-blur-sm transition-all duration-300 ${
                    allCompleted
                      ? 'bg-green-500/5 border-green-500/30'
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  <div className="p-5 sm:p-6">
                    <div className="flex items-start gap-3 mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${solution.color} flex items-center justify-center text-xl shadow-lg flex-shrink-0`}>
                        {solution.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-lg font-bold">{solution.title}</h3>
                          <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-white/50">
                            اولویت {solution.priority}
                          </span>
                          <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-white/50">
                            ⏱ {solution.estimatedTime}
                          </span>
                          {allCompleted && (
                            <span className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full">
                              ✅ انجام شد
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-white/50 mt-1">{solution.description}</p>
                      </div>
                    </div>

                    {/* Steps */}
                    <div className="space-y-3">
                      {solution.steps.map((step, stepIdx) => {
                        const isCompleted = completedSteps.has(step.id);
                        return (
                          <div
                            key={step.id}
                            className={`rounded-xl border p-4 transition-all duration-300 ${
                              isCompleted
                                ? 'bg-green-500/5 border-green-500/20'
                                : 'bg-black/20 border-white/5 hover:border-white/20'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <button
                                onClick={() => toggleStep(step.id)}
                                className={`flex-shrink-0 w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                                  isCompleted
                                    ? 'bg-green-500 border-green-500 text-white'
                                    : 'border-white/30 hover:border-white/60'
                                }`}
                              >
                                {isCompleted && <span className="text-sm">✓</span>}
                              </button>
                              <div className="flex-1 min-w-0">
                                <p className={`font-medium text-sm ${isCompleted ? 'text-green-300 line-through' : 'text-white/90'}`}>
                                  {step.label}
                                </p>
                                <p className="text-xs text-white/40 mt-1">{step.description}</p>
                                {step.note && (
                                  <p className="text-xs text-yellow-300/70 mt-1">💡 {step.note}</p>
                                )}
                                {step.command && (
                                  <div className="mt-3 relative bg-black/50 rounded-lg border border-white/10 overflow-hidden">
                                    <div className="flex items-center justify-between px-3 py-1.5 bg-white/5 border-b border-white/10">
                                      <span className="text-[10px] text-white/30 font-mono">terminal</span>
                                      <button
                                        onClick={() => copyToClipboard(step.command, step.id)}
                                        className={`text-[10px] px-2 py-0.5 rounded transition-all duration-300 ${
                                          copiedId === step.id
                                            ? 'bg-green-500/20 text-green-300'
                                            : 'bg-white/10 text-white/50 hover:bg-white/20 hover:text-white'
                                        }`}
                                      >
                                        {copiedId === step.id ? '✓ کپی شد' : '📋 کپی'}
                                      </button>
                                    </div>
                                    <pre className="p-3 text-xs font-mono text-green-300 overflow-x-auto whitespace-pre-wrap" dir="ltr">
                                      {step.command}
                                    </pre>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Quick Fix Tab */}
        {activeTab === 'quickfix' && (
          <div className="space-y-6">
            {/* PowerShell Version */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                <span>🔷</span> نسخه PowerShell
              </h3>
              <p className="text-sm text-white/50 mb-4">این دستورات را در PowerShell (ترمینال پیش‌فرض VSCode) کپی و اجرا کنید:</p>
              <div className="relative bg-black/50 rounded-xl border border-white/10 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-xs text-white/40 font-mono">PowerShell</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(quickFixCommands, 'quick-ps')}
                    className={`text-xs px-3 py-1 rounded-md transition-all duration-300 ${
                      copiedId === 'quick-ps'
                        ? 'bg-green-500/20 text-green-300'
                        : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
                    }`}
                  >
                    {copiedId === 'quick-ps' ? '✓ کپی شد!' : '📋 کپی همه'}
                  </button>
                </div>
                <pre className="p-4 text-xs sm:text-sm font-mono text-green-300 overflow-x-auto whitespace-pre-wrap" dir="ltr">
                  {quickFixCommands}
                </pre>
              </div>
            </div>

            {/* CMD Version */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                <span>⬛</span> نسخه CMD (Command Prompt)
              </h3>
              <p className="text-sm text-white/50 mb-4">اگر CMD اجرا می‌کنید، از این دستورات استفاده کنید:</p>
              <div className="relative bg-black/50 rounded-xl border border-white/10 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                    <span className="text-xs text-white/40 font-mono">CMD</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(cmdQuickFix, 'quick-cmd')}
                    className={`text-xs px-3 py-1 rounded-md transition-all duration-300 ${
                      copiedId === 'quick-cmd'
                        ? 'bg-green-500/20 text-green-300'
                        : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
                    }`}
                  >
                    {copiedId === 'quick-cmd' ? '✓ کپی شد!' : '📋 کپی همه'}
                  </button>
                </div>
                <pre className="p-4 text-xs sm:text-sm font-mono text-green-300 overflow-x-auto whitespace-pre-wrap" dir="ltr">
                  {cmdQuickFix}
                </pre>
              </div>
            </div>

            {/* Manual Steps */}
            <div className="p-5 sm:p-6 rounded-2xl bg-yellow-500/5 border border-yellow-500/20 backdrop-blur-sm">
              <h3 className="text-lg font-bold mb-3 text-yellow-300 flex items-center gap-2">
                <span>📝</span> روش دستی (اگر دستورات کار نکرد):
              </h3>
              <ol className="space-y-3 text-sm text-white/70 list-decimal list-inside">
                <li>VSCode را ببندید</li>
                <li>File Explorer را باز کنید و به مسیر پروژه بروید</li>
                <li>پوشه <code className="bg-white/10 px-1.5 py-0.5 rounded text-xs" dir="ltr">node_modules</code> را حذف کنید (Shift+Delete)</li>
                <li>فایل <code className="bg-white/10 px-1.5 py-0.5 rounded text-xs" dir="ltr">package-lock.json</code> را حذف کنید</li>
                <li>VSCode را باز کنید و ترمینال را اجرا کنید</li>
                <li>دستور <code className="bg-white/10 px-1.5 py-0.5 rounded text-xs" dir="ltr">npm install</code> را اجرا کنید</li>
                <li>دستور <code className="bg-white/10 px-1.5 py-0.5 rounded text-xs" dir="ltr">npm run dev</code> را اجرا کنید</li>
              </ol>
            </div>
          </div>
        )}

        {/* Info Tab */}
        {activeTab === 'info' && (
          <div className="space-y-6">
            {/* Node.js Version */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span>⚡</span> مشکل نسخه Node.js
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                  <p className="text-sm font-bold text-red-300 mb-2">❌ نسخه فعلی شما:</p>
                  <p className="text-2xl font-mono font-bold text-red-400">v24.22.1</p>
                  <p className="text-xs text-red-300/60 mt-2">نسخه Current - ناپایدار و آزمایشی</p>
                </div>
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                  <p className="text-sm font-bold text-green-300 mb-2">✅ نسخه پیشنهادی:</p>
                  <p className="text-2xl font-mono font-bold text-green-400">v20.x یا v22.x</p>
                  <p className="text-xs text-green-300/60 mt-2">نسخه LTS - پایدار و تست‌شده</p>
                </div>
              </div>
              <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <p className="text-sm text-blue-200">
                  💡 برای تغییر نسخه، از <strong>nvm-windows</strong> استفاده کنید:
                </p>
                <div className="mt-2 bg-black/40 rounded-lg p-3 font-mono text-xs text-green-300" dir="ltr">
                  <p># دانلود nvm-windows از:</p>
                  <p># https://github.com/coreybutler/nvm-windows/releases</p>
                  <p className="mt-2"># نصب و استفاده:</p>
                  <p>nvm install 20</p>
                  <p>nvm use 20</p>
                </div>
              </div>
            </div>

            {/* Path Issue */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span>📁</span> مشکل مسیر پروژه
              </h3>
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 mb-4">
                <p className="text-sm font-bold text-red-300 mb-2">❌ مسیر فعلی (مشکل‌دار):</p>
                <code className="text-sm font-mono text-red-200 break-all" dir="ltr">
                  D:\فلش فلزی\SADB\QWEN\DB-main
                </code>
                <p className="text-xs text-red-300/60 mt-2">
                  وجود حروف فارسی و فاصله در مسیر می‌تواند باعث مشکلات مختلف شود.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                <p className="text-sm font-bold text-green-300 mb-2">✅ مسیر پیشنهادی:</p>
                <code className="text-sm font-mono text-green-200 break-all" dir="ltr">
                  D:\Projects\DB-main
                </code>
                <p className="text-xs text-green-300/60 mt-2">
                  مسیر کاملاً انگلیسی بدون فاصله و کاراکترهای خاص.
                </p>
              </div>
              <div className="mt-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <p className="text-sm text-yellow-200">
                  📋 برای انتقال پروژه:
                </p>
                <ol className="text-xs text-yellow-200/70 mt-2 space-y-1 list-decimal list-inside">
                  <li>پوشه پروژه را به مسیر جدید کپی کنید</li>
                  <li>node_modules را حذف کنید</li>
                  <li>در VSCode پوشه جدید را باز کنید</li>
                  <li>npm install و npm run dev را اجرا کنید</li>
                </ol>
              </div>
            </div>

            {/* Why This Happens */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span>🔍</span> چرا این ارور رخ می‌دهد؟
              </h3>
              <div className="space-y-3 text-sm text-white/70">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                  <span className="text-lg">۱.</span>
                  <p>
                    <strong className="text-white">Rollup</strong> یک ابزار build است که Vite از آن استفاده می‌کند. 
                    این ابزار نیاز به فایل‌های باینری (native) مخصوص هر سیستم‌عامل دارد.
                  </p>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                  <span className="text-lg">۲.</span>
                  <p>
                    <strong className="text-white">npm bug:</strong> یک باگ شناخته‌شده در npm وجود دارد که گاهی 
                    optional dependencies (مثل فایل باینری مخصوص ویندوز) را به درستی نصب نمی‌کند.
                  </p>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                  <span className="text-lg">۳.</span>
                  <p>
                    <strong className="text-white">Node.js v24:</strong> نسخه‌های خیلی جدید Node.js ممکن است 
                    با native modules سازگار نباشند چون ABI آن‌ها تغییر کرده است.
                  </p>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                  <span className="text-lg">۴.</span>
                  <p>
                    <strong className="text-white">مسیر فارسی:</strong> برخی ابزارهای native نمی‌توانند مسیرهای 
                    شامل کاراکترهای غیر-ASCII را به درستی parse کنند.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-12">
        <div className="max-w-6xl mx-auto px-6 py-6 text-center text-sm text-white/30">
          <p>راهنمای رفع ارور Rollup | ساخته شده برای توسعه‌دهندگان ایرانی 💚</p>
        </div>
      </footer>
    </div>
  );
}

export default App;

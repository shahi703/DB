/**
 * کامپوننت دکمه خروجی Excel
 */
import { useState } from 'react';
import { FileSpreadsheet, Download, CheckCircle, XCircle } from 'lucide-react';
import { exportToExcel, ExportResult } from '../services/ExportService';
import { Column } from '../types';
import { useThemeContext } from '../context/ThemeContext';

interface ExportButtonProps<T> {
  columns: Column<T>[];
  data: T[];
  fileName: string;
  sheetName?: string;
  selectedRows?: T[];
}

export function ExportButton<T extends Record<string, any>>({
  columns,
  data,
  fileName,
  sheetName,
  selectedRows,
}: ExportButtonProps<T>) {
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';
  const [isExporting, setIsExporting] = useState(false);
  const [result, setResult] = useState<ExportResult | null>(null);
  const [showMenu, setShowMenu] = useState(false);

  const handleExport = (exportSelected: boolean = false) => {
    setIsExporting(true);
    setShowMenu(false);

    const exportData = exportSelected && selectedRows ? selectedRows : data;
    const exportFileName = exportSelected ? `${fileName}_selected` : fileName;

    setTimeout(() => {
      const exportResult = exportToExcel({
        columns,
        data: exportData,
        fileName: exportFileName,
        sheetName,
      });

      setResult(exportResult);
      setIsExporting(false);

      // مخفی کردن نتیجه بعد از 3 ثانیه
      setTimeout(() => setResult(null), 3000);
    }, 500);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        disabled={isExporting}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: 'var(--color-success-bg)',
          color: 'var(--color-success)',
          border: '1px solid var(--color-success)',
        }}
      >
        {isExporting ? (
          <>
            <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
            در حال خروجی...
          </>
        ) : (
          <>
            <FileSpreadsheet size={16} />
            خروجی Excel
          </>
        )}
      </button>

      {/* منوی گزینه‌ها */}
      {showMenu && (
        <div
          className="absolute top-full mt-2 left-0 w-56 rounded-xl overflow-hidden shadow-lg z-50"
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
          }}
        >
          <button
            onClick={() => handleExport(false)}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-right transition-colors hover:bg-opacity-50"
            style={{
              color: 'var(--color-text-primary)',
              borderBottom: '1px solid var(--color-border)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-highlight)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <Download size={16} style={{ color: 'var(--color-brand)' }} />
            <div>
              <div className="font-medium">خروجی همه رکوردها</div>
              <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                {data.length} رکورد
              </div>
            </div>
          </button>

          {selectedRows && selectedRows.length > 0 && (
            <button
              onClick={() => handleExport(true)}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-right transition-colors hover:bg-opacity-50"
              style={{ color: 'var(--color-text-primary)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-highlight)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <Download size={16} style={{ color: 'var(--color-success)' }} />
              <div>
                <div className="font-medium">خروجی رکوردهای انتخاب‌شده</div>
                <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  {selectedRows.length} رکورد
                </div>
              </div>
            </button>
          )}
        </div>
      )}

      {/* نمایش نتیجه */}
      {result && (
        <div
          className="fixed bottom-4 left-4 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg z-50 animate-fade-in"
          style={{
            backgroundColor: result.success ? 'var(--color-success)' : 'var(--color-error)',
            color: '#ffffff',
          }}
        >
          {result.success ? (
            <>
              <CheckCircle size={20} />
              <div>
                <div className="font-medium">خروجی با موفقیت ایجاد شد</div>
                <div className="text-xs opacity-90">
                  {result.rowCount} رکورد در فایل {result.fileName}
                </div>
              </div>
            </>
          ) : (
            <>
              <XCircle size={20} />
              <div>
                <div className="font-medium">خطا در ایجاد خروجی</div>
                <div className="text-xs opacity-90">{result.error}</div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

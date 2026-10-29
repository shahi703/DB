/**
 * کامپوننت دکمه خروجی - Universal Export Engine UI
 * خروجی Excel, PDF, Print, Template
 */
import { useState } from 'react';
import { FileSpreadsheet, Download, CheckCircle, XCircle, FileText, Printer, FileDown } from 'lucide-react';
import { exportToExcel, exportTemplate, ExportResult } from '../services/ExportService';
import { Column, FormTemplate } from '../types';
import { useThemeContext } from '../context/ThemeContext';
import { FormTemplateRegistry } from '../services/FormTemplateRegistry';

interface ExportButtonProps<T> {
  columns: Column<T>[];
  data: T[];
  fileName: string;
  sheetName?: string;
  selectedRows?: T[];
  formId?: string;
}

export function ExportButton<T extends Record<string, any>>({
  columns,
  data,
  fileName,
  sheetName,
  selectedRows,
  formId,
}: ExportButtonProps<T>) {
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';
  const [isExporting, setIsExporting] = useState(false);
  const [result, setResult] = useState<ExportResult | null>(null);
  const [showMenu, setShowMenu] = useState(false);

  // دریافت formTemplate از registry
  const formTemplate = formId ? FormTemplateRegistry.get<T>(formId) : undefined;

  const handleExportExcel = (exportSelected: boolean = false) => {
    setIsExporting(true);
    setShowMenu(false);

    const exportData = exportSelected && selectedRows ? selectedRows : data;
    const exportFileName = exportSelected ? `${fileName}_انتخاب_شده` : fileName;

    setTimeout(() => {
      const exportResult = exportToExcel({
        columns,
        data: exportData,
        fileName: exportFileName,
        sheetName,
        formTemplate,
      });

      setResult(exportResult);
      setIsExporting(false);
      setTimeout(() => setResult(null), 3000);
    }, 500);
  };

  const handleExportFiltered = () => {
    setShowMenu(false);
    handleExportExcel(false);
  };

  const handleExportPDF = () => {
    setShowMenu(false);
    setIsExporting(true);
    setTimeout(() => {
      printReport('pdf');
      setIsExporting(false);
    }, 300);
  };

  const handlePrint = () => {
    setShowMenu(false);
    printReport('print');
  };

  const handleDownloadTemplate = () => {
    setShowMenu(false);
    setIsExporting(true);
    setTimeout(() => {
      const exportResult = exportTemplate({
        columns,
        data: [],
        fileName: `${fileName}_قالب_استاندارد`,
        sheetName: 'قالب',
        formTemplate,
      });
      setResult(exportResult);
      setIsExporting(false);
      setTimeout(() => setResult(null), 3000);
    }, 300);
  };

  const printReport = (mode: 'pdf' | 'print') => {
    const headers = columns.map(col => col.title);
    const rows = data.map(item =>
      columns.map(col => {
        const value = item[col.key as keyof T];
        if (typeof value === 'boolean') return value ? 'بله' : 'خیر';
        if (value === null || value === undefined) return '';
        return String(value);
      })
    );

    const html = `
<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head>
  <meta charset="UTF-8">
  <title>${fileName}</title>
  <style>
    @page { size: A4 landscape; margin: 15mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Tahoma, Arial, sans-serif; direction: rtl; padding: 20px; font-size: 11px; }
    .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #4C35A3; padding-bottom: 10px; }
    .header h1 { font-size: 16px; margin-bottom: 5px; color: #4C35A3; }
    .header p { font-size: 10px; color: #666; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th { background: #4C35A3; color: white; padding: 8px 6px; text-align: right; font-size: 10px; border: 1px solid #333; }
    td { padding: 6px; border: 1px solid #ddd; text-align: right; font-size: 10px; }
    tr:nth-child(even) { background: #f9f9f9; }
    .footer { margin-top: 15px; text-align: center; font-size: 9px; color: #999; border-top: 1px solid #ddd; padding-top: 10px; }
    .template-info { background: #f0ecff; padding: 8px; border-radius: 4px; margin-bottom: 10px; font-size: 9px; color: #4C35A3; }
    @media print { body { padding: 0; } .no-print { display: none; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>${fileName}</h1>
    <p>تاریخ چاپ: ${new Date().toLocaleDateString('fa-IR')} | تعداد رکوردها: ${data.length}</p>
  </div>
  ${formTemplate ? `<div class="template-info">الگوی فرم: ${formTemplate.formName} | نسخه: ${formTemplate.version}</div>` : ''}
  <table>
    <thead>
      <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
    </thead>
    <tbody>
      ${rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}
    </tbody>
  </table>
  <div class="footer">سیستم کنترل پروژه پایپینگ صنعتی — Universal Export Engine</div>
  ${mode === 'pdf' ? '<script>window.onload = function() { window.print(); }</script>' : ''}
</body>
</html>`;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      if (mode === 'print') {
        setTimeout(() => printWindow.print(), 500);
      }
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        disabled={isExporting}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: 'var(--color-success-bg)',
          color: 'var(--color-success)',
          border: '1px solid var(--color-success)',
        }}
      >
        {isExporting ? (
          <>
            <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
            <span className="hidden sm:inline">در حال...</span>
          </>
        ) : (
          <>
            <Download size={16} />
            <span className="hidden sm:inline">خروجی</span>
          </>
        )}
      </button>

      {/* منوی گزینه‌ها */}
      {showMenu && (
        <div
          className="absolute top-full mt-2 left-0 w-64 rounded-xl overflow-hidden shadow-lg z-50"
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
          }}
        >
          {/* عنوان */}
          <div className="px-4 py-2 text-xs font-bold" style={{ backgroundColor: 'var(--color-highlight)', color: 'var(--color-text-muted)', borderBottom: '1px solid var(--color-border)' }}>
            Universal Export Engine
          </div>

          {/* Excel - همه */}
          <button
            onClick={() => handleExportExcel(false)}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-right transition-colors"
            style={{ color: 'var(--color-text-primary)', borderBottom: '1px solid var(--color-border)' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-highlight)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <FileSpreadsheet size={16} style={{ color: '#16A34A' }} />
            <div>
              <div className="font-medium">خروجی Excel (همه)</div>
              <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{data.length} رکورد</div>
            </div>
          </button>

          {/* Excel - انتخاب شده */}
          {selectedRows && selectedRows.length > 0 && (
            <button
              onClick={() => handleExportExcel(true)}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-right transition-colors"
              style={{ color: 'var(--color-text-primary)', borderBottom: '1px solid var(--color-border)' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-highlight)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <FileSpreadsheet size={16} style={{ color: '#16A34A' }} />
              <div>
                <div className="font-medium">خروجی Excel (انتخاب‌شده)</div>
                <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{selectedRows.length} رکورد</div>
              </div>
            </button>
          )}

          {/* PDF */}
          <button
            onClick={handleExportPDF}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-right transition-colors"
            style={{ color: 'var(--color-text-primary)', borderBottom: '1px solid var(--color-border)' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-highlight)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <FileText size={16} style={{ color: '#DC2626' }} />
            <div>
              <div className="font-medium">خروجی PDF</div>
              <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>ذخیره به صورت PDF</div>
            </div>
          </button>

          {/* Print */}
          <button
            onClick={handlePrint}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-right transition-colors"
            style={{ color: 'var(--color-text-primary)', borderBottom: '1px solid var(--color-border)' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-highlight)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <Printer size={16} style={{ color: '#3B82F6' }} />
            <div>
              <div className="font-medium">چاپ (Print)</div>
              <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>ارسال به پرینتر</div>
            </div>
          </button>

          {/* دانلود قالب */}
          <button
            onClick={handleDownloadTemplate}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-right transition-colors"
            style={{ color: 'var(--color-text-primary)' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-highlight)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <FileDown size={16} style={{ color: 'var(--color-brand)' }} />
            <div>
              <div className="font-medium">دانلود قالب استاندارد</div>
              <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>فایل خالی برای تکمیل و ورود مجدد</div>
            </div>
          </button>
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
                <div className="text-xs opacity-90">{result.rowCount} رکورد در فایل {result.fileName}</div>
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

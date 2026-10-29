/**
 * کامپوننت مودال ورود اطلاعات از Excel
 */
import { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';
import { importFromExcel, previewExcel, ImportResult } from '../services/ImportService';
import { Column } from '../types';
import { useThemeContext } from '../context/ThemeContext';

interface ImportModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  columns: Column<T>[];
  formType: string;
  onImport: (data: Partial<T>[]) => void;
  validate?: (row: Partial<T>, rowIndex: number) => string[];
}

export function ImportModal<T extends Record<string, any>>({
  isOpen,
  onClose,
  columns,
  formType,
  onImport,
  validate,
}: ImportModalProps<T>) {
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [preview, setPreview] = useState<{
    headers: string[];
    rows: any[][];
    totalRows: number;
  } | null>(null);
  const [result, setResult] = useState<ImportResult<T> | null>(null);
  const [step, setStep] = useState<'upload' | 'preview' | 'result'>('upload');

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // بررسی نوع فایل
    if (!selectedFile.name.endsWith('.xlsx') && !selectedFile.name.endsWith('.xls')) {
      alert('لطفاً فقط فایل Excel (.xlsx یا .xls) انتخاب کنید');
      return;
    }

    setFile(selectedFile);
    setIsProcessing(true);

    try {
      // پیش‌نمایش فایل
      const previewData = await previewExcel(selectedFile);
      setPreview(previewData);
      setStep('preview');
    } catch (error) {
      alert('خطا در خواندن فایل');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setIsProcessing(true);

    try {
      const importResult = await importFromExcel<T>({
        columns,
        file,
        formType,
        validate,
      });

      setResult(importResult);
      setStep('result');
    } catch (error) {
      alert('خطا در پردازش فایل');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmImport = () => {
    if (result && result.data.length > 0) {
      onImport(result.data);
      handleClose();
    }
  };

  const handleClose = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setStep('upload');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'var(--color-overlay)' }}
    >
      <div
        className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl flex flex-col"
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          boxShadow: '0 20px 60px var(--color-shadow-lg)',
        }}
      >
        {/* هدر */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid var(--color-border)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                backgroundColor: 'var(--color-highlight)',
                color: 'var(--color-brand)',
              }}
            >
              <Upload size={20} />
            </div>
            <div>
              <h2
                className="text-lg font-bold"
                style={{ color: 'var(--color-text-primary)' }}
              >
                ورود اطلاعات از Excel
              </h2>
              <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                فرم: {formType}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg transition-all hover:scale-110"
            style={{
              backgroundColor: 'var(--color-highlight)',
              color: 'var(--color-text-secondary)',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* محتوا */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 'upload' && (
            <div className="flex flex-col items-center justify-center py-12">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
                style={{
                  backgroundColor: 'var(--color-highlight)',
                  color: 'var(--color-brand)',
                }}
              >
                <FileSpreadsheet size={40} />
              </div>
              <h3
                className="text-lg font-bold mb-2"
                style={{ color: 'var(--color-text-primary)' }}
              >
                فایل Excel را انتخاب کنید
              </h3>
              <p
                className="text-sm text-center mb-6 max-w-md"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                فایل باید مطابق با قالب استاندارد خروجی سیستم باشد. ساختار ستون‌ها و نام آن‌ها نباید تغییر داده شود.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-white cursor-pointer transition-all hover:scale-105"
                style={{
                  background: isDark
                    ? 'linear-gradient(135deg, #3D2980, #6B55BA)'
                    : 'linear-gradient(135deg, #4C35A3, #6652C7)',
                  boxShadow: '0 4px 12px var(--color-brand-glow)',
                }}
              >
                <Upload size={18} />
                انتخاب فایل
              </label>
            </div>
          )}

          {step === 'preview' && preview && (
            <div>
              <div className="mb-4">
                <h3
                  className="text-lg font-bold mb-2"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  پیش‌نمایش فایل
                </h3>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  {preview.totalRows} ردیف داده شناسایی شد
                </p>
              </div>

              <div
                className="rounded-xl overflow-hidden mb-4"
                style={{
                  border: '1px solid var(--color-border)',
                }}
              >
                <div className="overflow-x-auto max-h-96">
                  <table className="w-full text-sm">
                    <thead>
                      <tr
                        style={{
                          backgroundColor: 'var(--color-highlight)',
                          borderBottom: '2px solid var(--color-border)',
                        }}
                      >
                        <th
                          className="px-3 py-2 text-right font-semibold sticky right-0"
                          style={{
                            color: 'var(--color-text-primary)',
                            backgroundColor: 'var(--color-highlight)',
                            width: '60px',
                          }}
                        >
                          ردیف
                        </th>
                        {preview.headers.map((header, i) => (
                          <th
                            key={i}
                            className="px-3 py-2 text-right font-semibold whitespace-nowrap"
                            style={{ color: 'var(--color-text-primary)' }}
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {preview.rows.map((row, rowIndex) => (
                        <tr
                          key={rowIndex}
                          style={{
                            borderBottom: '1px solid var(--color-border)',
                            backgroundColor: rowIndex % 2 === 0 ? 'transparent' : 'var(--color-highlight)',
                          }}
                        >
                          <td
                            className="px-3 py-2 sticky right-0"
                            style={{
                              color: 'var(--color-text-muted)',
                              backgroundColor: rowIndex % 2 === 0 ? 'var(--color-surface)' : 'var(--color-highlight)',
                            }}
                          >
                            {rowIndex + 1}
                          </td>
                          {row.map((cell, cellIndex) => (
                            <td
                              key={cellIndex}
                              className="px-3 py-2 whitespace-nowrap"
                              style={{ color: 'var(--color-text-primary)' }}
                            >
                              {cell !== undefined && cell !== null ? String(cell) : ''}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {preview.totalRows > 10 && (
                <p
                  className="text-xs text-center"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  نمایش 10 ردیف اول از {preview.totalRows} ردیف
                </p>
              )}
            </div>
          )}

          {step === 'result' && result && (
            <div>
              {/* آمار کلی */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div
                  className="p-4 rounded-xl"
                  style={{
                    backgroundColor: 'var(--color-highlight)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <p className="text-xs mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                    کل ردیف‌ها
                  </p>
                  <p className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                    {result.totalRows}
                  </p>
                </div>
                <div
                  className="p-4 rounded-xl"
                  style={{
                    backgroundColor: 'var(--color-success-bg)',
                    border: '1px solid var(--color-success)',
                  }}
                >
                  <p className="text-xs mb-1" style={{ color: 'var(--color-success)' }}>
                    ردیف‌های معتبر
                  </p>
                  <p className="text-2xl font-bold" style={{ color: 'var(--color-success)' }}>
                    {result.validRows}
                  </p>
                </div>
                <div
                  className="p-4 rounded-xl"
                  style={{
                    backgroundColor: 'var(--color-error-bg)',
                    border: '1px solid var(--color-error)',
                  }}
                >
                  <p className="text-xs mb-1" style={{ color: 'var(--color-error)' }}>
                    ردیف‌های نامعتبر
                  </p>
                  <p className="text-2xl font-bold" style={{ color: 'var(--color-error)' }}>
                    {result.invalidRows}
                  </p>
                </div>
                <div
                  className="p-4 rounded-xl"
                  style={{
                    backgroundColor: result.success ? 'var(--color-success-bg)' : 'var(--color-warning-bg)',
                    border: `1px solid ${result.success ? 'var(--color-success)' : 'var(--color-warning)'}`,
                  }}
                >
                  <p className="text-xs mb-1" style={{ color: result.success ? 'var(--color-success)' : 'var(--color-warning)' }}>
                    وضعیت
                  </p>
                  <p className="text-lg font-bold" style={{ color: result.success ? 'var(--color-success)' : 'var(--color-warning)' }}>
                    {result.success ? 'موفق' : 'دارای خطا'}
                  </p>
                </div>
              </div>

              {/* نمایش خطاها */}
              {result.errors.length > 0 && (
                <div className="mb-6">
                  <h4
                    className="text-sm font-bold mb-3 flex items-center gap-2"
                    style={{ color: 'var(--color-error)' }}
                  >
                    <XCircle size={18} />
                    خطاها ({result.errors.length})
                  </h4>
                  <div
                    className="rounded-xl overflow-hidden max-h-64 overflow-y-auto"
                    style={{
                      border: '1px solid var(--color-error)',
                      backgroundColor: 'var(--color-error-bg)',
                    }}
                  >
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ backgroundColor: 'var(--color-error)', color: '#fff' }}>
                          <th className="px-3 py-2 text-right">ردیف</th>
                          <th className="px-3 py-2 text-right">فیلد</th>
                          <th className="px-3 py-2 text-right">خطا</th>
                          <th className="px-3 py-2 text-right">مقدار</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.errors.slice(0, 50).map((error, i) => (
                          <tr
                            key={i}
                            style={{
                              borderBottom: '1px solid var(--color-border)',
                              color: 'var(--color-text-primary)',
                            }}
                          >
                            <td className="px-3 py-2">{error.row}</td>
                            <td className="px-3 py-2">{error.field}</td>
                            <td className="px-3 py-2">{error.message}</td>
                            <td className="px-3 py-2" style={{ color: 'var(--color-text-muted)' }}>
                              {error.value !== undefined ? String(error.value) : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {result.errors.length > 50 && (
                    <p
                      className="text-xs mt-2 text-center"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      نمایش 50 خطا از {result.errors.length} خطا
                    </p>
                  )}
                </div>
              )}

              {/* نمایش هشدارها */}
              {result.warnings.length > 0 && (
                <div className="mb-6">
                  <h4
                    className="text-sm font-bold mb-3 flex items-center gap-2"
                    style={{ color: 'var(--color-warning)' }}
                  >
                    <AlertCircle size={18} />
                    هشدارها ({result.warnings.length})
                  </h4>
                  <div
                    className="rounded-xl overflow-hidden max-h-48 overflow-y-auto"
                    style={{
                      border: '1px solid var(--color-warning)',
                      backgroundColor: 'var(--color-warning-bg)',
                    }}
                  >
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ backgroundColor: 'var(--color-warning)', color: '#fff' }}>
                          <th className="px-3 py-2 text-right">ردیف</th>
                          <th className="px-3 py-2 text-right">فیلد</th>
                          <th className="px-3 py-2 text-right">هشدار</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.warnings.map((warning, i) => (
                          <tr
                            key={i}
                            style={{
                              borderBottom: '1px solid var(--color-border)',
                              color: 'var(--color-text-primary)',
                            }}
                          >
                            <td className="px-3 py-2">{warning.row}</td>
                            <td className="px-3 py-2">{warning.field}</td>
                            <td className="px-3 py-2">{warning.message}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* فوتر */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderTop: '1px solid var(--color-border)' }}
        >
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105"
            style={{
              backgroundColor: 'var(--color-highlight)',
              color: 'var(--color-text-secondary)',
              border: '1px solid var(--color-border)',
            }}
          >
            انصراف
          </button>

          <div className="flex gap-2">
            {step === 'preview' && (
              <button
                onClick={handleImport}
                disabled={isProcessing}
                className="flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium text-white transition-all hover:scale-105 disabled:opacity-50"
                style={{
                  background: isDark
                    ? 'linear-gradient(135deg, #3D2980, #6B55BA)'
                    : 'linear-gradient(135deg, #4C35A3, #6652C7)',
                  boxShadow: '0 2px 8px var(--color-brand-glow)',
                }}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    در حال پردازش...
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} />
                    بررسی و ثبت
                  </>
                )}
              </button>
            )}

            {step === 'result' && result && result.validRows > 0 && (
              <button
                onClick={handleConfirmImport}
                className="flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium text-white transition-all hover:scale-105"
                style={{
                  backgroundColor: 'var(--color-success)',
                  boxShadow: '0 2px 8px rgba(34, 197, 94, 0.3)',
                }}
              >
                <CheckCircle size={16} />
                ثبت {result.validRows} رکورد معتبر
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * مودال ورود اطلاعات - Universal Import Engine UI
 * مراحل: آپلود → شناسایی → بررسی → خطاها → ثبت → گزارش
 */
import { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, CheckCircle, XCircle, AlertCircle, X, ArrowLeft, ArrowRight, Shield, FileCheck } from 'lucide-react';
import { readFileAndIdentify, validateImportData, ImportValidationResult } from '../services/ImportService';
import { FormTemplate, ImportRowError } from '../types';
import { useThemeContext } from '../context/ThemeContext';

interface ImportModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  columns: any[];
  formType: string;
  formTemplate?: FormTemplate<T>;
  existingData?: T[];
  onImport: (data: Partial<T>[]) => void;
}

type ImportStep = 'upload' | 'identify' | 'validate' | 'errors' | 'confirm' | 'result';

export function ImportModal<T extends Record<string, any>>({
  isOpen,
  onClose,
  formType,
  formTemplate,
  existingData = [],
  onImport,
}: ImportModalProps<T>) {
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<ImportStep>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectedTemplate, setDetectedTemplate] = useState<FormTemplate<T> | null>(null);
  const [validationResult, setValidationResult] = useState<ImportValidationResult<T> | null>(null);
  const [error, setError] = useState<string>('');
  const [importComplete, setImportComplete] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.xlsx') && !selectedFile.name.endsWith('.xls')) {
      setError('لطفاً فقط فایل Excel (.xlsx یا .xls) انتخاب کنید');
      return;
    }

    setFile(selectedFile);
    setError('');
    setIsProcessing(true);
    setStep('identify');

    try {
      const result = await readFileAndIdentify<T>(selectedFile);

      if (!result.success) {
        setError(result.error || 'خطا در شناسایی فرم');
        setStep('upload');
        setIsProcessing(false);
        return;
      }

      setDetectedTemplate(result.formTemplate || null);

      // اعتبارسنجی داده‌ها
      if (result.formTemplate && result.rawData) {
        const validation = validateImportData<T>(
          result.rawData,
          result.formTemplate,
          existingData,
          true
        );
        setValidationResult(validation);

        if (validation.invalidRows > 0) {
          setStep('errors');
        } else {
          setStep('confirm');
        }
      } else {
        setError('امکان پردازش فایل وجود ندارد');
        setStep('upload');
      }
    } catch (err) {
      setError(`خطا: ${err instanceof Error ? err.message : 'خطای نامشخص'}`);
      setStep('upload');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmImport = () => {
    if (!validationResult || validationResult.validData.length === 0) return;

    onImport(validationResult.validData as Partial<T>[]);
    setImportComplete(true);
    setStep('result');
  };

  const handleClose = () => {
    setFile(null);
    setStep('upload');
    setDetectedTemplate(null);
    setValidationResult(null);
    setError('');
    setImportComplete(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'var(--color-overlay)' }}>
      <div
        className="w-full max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden flex flex-col animate-fade-in"
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          boxShadow: '0 25px 50px var(--color-shadow-lg)',
        }}
      >
        {/* هدر */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--color-highlight)' }}>
              <Upload size={18} style={{ color: 'var(--color-brand)' }} />
            </div>
            <div>
              <h3 className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>ورود اطلاعات از Excel</h3>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Universal Import Engine</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-2 rounded-lg transition-all hover:scale-110" style={{ backgroundColor: 'var(--color-highlight)', color: 'var(--color-text-secondary)' }}>
            <X size={18} />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-highlight)' }}>
          {(['upload', 'identify', 'validate', 'confirm', 'result'] as ImportStep[]).map((s, idx) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                step === s ? 'text-white' : 
                (['upload', 'identify', 'validate', 'confirm', 'result'].indexOf(step) > idx) ? 'text-white' : ''
              }`} style={{
                backgroundColor: step === s ? 'var(--color-brand)' : 
                  (['upload', 'identify', 'validate', 'confirm', 'result'].indexOf(step) > idx) ? 'var(--color-success)' : 'var(--color-border)',
                color: (step === s || ['upload', 'identify', 'validate', 'confirm', 'result'].indexOf(step) > idx) ? '#fff' : 'var(--color-text-muted)',
              }}>
                {idx + 1}
              </div>
              {idx < 4 && <div className="w-4 h-0.5" style={{ backgroundColor: 'var(--color-border)' }} />}
            </div>
          ))}
          <div className="mr-auto text-xs" style={{ color: 'var(--color-text-muted)' }}>
            {step === 'upload' && 'آپلود فایل'}
            {step === 'identify' && 'شناسایی فرم'}
            {step === 'validate' && 'اعتبارسنجی'}
            {step === 'errors' && 'بررسی خطاها'}
            {step === 'confirm' && 'تأیید و ثبت'}
            {step === 'result' && 'نتیجه'}
          </div>
        </div>

        {/* محتوا */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* مرحله آپلود */}
          {step === 'upload' && (
            <div className="text-center py-8">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'var(--color-highlight)' }}>
                <FileSpreadsheet size={36} style={{ color: 'var(--color-brand)' }} />
              </div>
              <h4 className="text-lg font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>فایل Excel را انتخاب کنید</h4>
              <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
                فایل باید با قالب استاندارد سیستم ساخته شده باشد
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
                id="import-file-input"
              />
              <label
                htmlFor="import-file-input"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white cursor-pointer transition-all hover:scale-105"
                style={{
                  background: isDark ? 'linear-gradient(135deg, #3D2980, #6B55BA)' : 'linear-gradient(135deg, #4C35A3, #6652C7)',
                  boxShadow: '0 4px 16px var(--color-brand-glow)',
                }}
              >
                <Upload size={18} />
                انتخاب فایل
              </label>
              {error && (
                <div className="mt-4 p-3 rounded-lg flex items-center gap-2" style={{ backgroundColor: 'var(--color-error-bg)' }}>
                  <XCircle size={16} style={{ color: 'var(--color-error)' }} />
                  <p className="text-sm" style={{ color: 'var(--color-error)' }}>{error}</p>
                </div>
              )}
              {isProcessing && (
                <div className="mt-4 flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" style={{ color: 'var(--color-brand)' }} />
                  <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>در حال پردازش...</span>
                </div>
              )}
            </div>
          )}

          {/* مرحله شناسایی */}
          {step === 'identify' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'var(--color-highlight)' }}>
                <FileCheck size={28} style={{ color: 'var(--color-brand)' }} />
              </div>
              <h4 className="text-lg font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>در حال شناسایی فرم...</h4>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                فایل: {file?.name}
              </p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" style={{ color: 'var(--color-brand)' }} />
              </div>
            </div>
          )}

          {/* مرحله خطاها */}
          {step === 'errors' && validationResult && (
            <div>
              <div className="flex items-center gap-3 mb-4 p-4 rounded-xl" style={{ backgroundColor: 'var(--color-error-bg)', border: '1px solid var(--color-error)' }}>
                <AlertCircle size={24} style={{ color: 'var(--color-error)' }} />
                <div>
                  <p className="font-bold" style={{ color: 'var(--color-error)' }}>خطاهایی در فایل یافت شد</p>
                  <p className="text-sm" style={{ color: 'var(--color-error)' }}>
                    {validationResult.invalidRows} ردیف دارای خطا | {validationResult.duplicateRows} ردیف تکراری
                  </p>
                </div>
              </div>

              {/* خلاصه */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="p-3 rounded-lg text-center" style={{ backgroundColor: 'var(--color-highlight)' }}>
                  <p className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>{validationResult.totalRows}</p>
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>کل ردیف‌ها</p>
                </div>
                <div className="p-3 rounded-lg text-center" style={{ backgroundColor: 'var(--color-success-bg)' }}>
                  <p className="text-xl font-bold" style={{ color: 'var(--color-success)' }}>{validationResult.validRows}</p>
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>معتبر</p>
                </div>
                <div className="p-3 rounded-lg text-center" style={{ backgroundColor: 'var(--color-error-bg)' }}>
                  <p className="text-xl font-bold" style={{ color: 'var(--color-error)' }}>{validationResult.invalidRows}</p>
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>نامعتبر</p>
                </div>
              </div>

              {/* لیست خطاها */}
              <div className="max-h-64 overflow-y-auto rounded-lg border" style={{ borderColor: 'var(--color-border)' }}>
                <table className="w-full text-xs">
                  <thead>
                    <tr style={{ backgroundColor: 'var(--color-highlight)' }}>
                      <th className="px-3 py-2 text-right">ردیف</th>
                      <th className="px-3 py-2 text-right">فیلد</th>
                      <th className="px-3 py-2 text-right">خطا</th>
                      <th className="px-3 py-2 text-right">مقدار</th>
                    </tr>
                  </thead>
                  <tbody>
                    {validationResult.errors.slice(0, 50).map((err: ImportRowError, idx: number) => (
                      <tr key={idx} style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td className="px-3 py-2" style={{ color: 'var(--color-text-primary)' }}>{err.row}</td>
                        <td className="px-3 py-2" style={{ color: 'var(--color-brand)' }}>{err.field}</td>
                        <td className="px-3 py-2" style={{ color: 'var(--color-error)' }}>{err.message}</td>
                        <td className="px-3 py-2" style={{ color: 'var(--color-text-muted)' }}>{String(err.value || '')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {validationResult.errors.length > 50 && (
                <p className="text-xs text-center mt-2" style={{ color: 'var(--color-text-muted)' }}>
                  و {validationResult.errors.length - 50} خطای دیگر...
                </p>
              )}
            </div>
          )}

          {/* مرحله تأیید */}
          {step === 'confirm' && validationResult && detectedTemplate && (
            <div>
              <div className="flex items-center gap-3 mb-4 p-4 rounded-xl" style={{ backgroundColor: 'var(--color-success-bg)', border: '1px solid var(--color-success)' }}>
                <CheckCircle size={24} style={{ color: 'var(--color-success)' }} />
                <div>
                  <p className="font-bold" style={{ color: 'var(--color-success)' }}>فایل معتبر است</p>
                  <p className="text-sm" style={{ color: 'var(--color-success)' }}>آماده ثبت در سیستم</p>
                </div>
              </div>

              {/* اطلاعات فرم شناسایی‌شده */}
              <div className="p-4 rounded-xl mb-4" style={{ backgroundColor: 'var(--color-highlight)', border: '1px solid var(--color-border)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <Shield size={16} style={{ color: 'var(--color-brand)' }} />
                  <span className="font-bold text-sm" style={{ color: 'var(--color-text-primary)' }}>فرم شناسایی‌شده</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span style={{ color: 'var(--color-text-muted)' }}>نام فرم: </span>
                    <span style={{ color: 'var(--color-text-primary)' }}>{detectedTemplate.formName}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-text-muted)' }}>نسخه: </span>
                    <span style={{ color: 'var(--color-text-primary)' }}>{detectedTemplate.version}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-text-muted)' }}>تعداد ستون‌ها: </span>
                    <span style={{ color: 'var(--color-text-primary)' }}>{detectedTemplate.columns.length}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-text-muted)' }}>کلید اصلی: </span>
                    <span style={{ color: 'var(--color-text-primary)' }}>{String(detectedTemplate.primaryKey)}</span>
                  </div>
                </div>
              </div>

              {/* خلاصه داده‌ها */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="p-3 rounded-lg text-center" style={{ backgroundColor: 'var(--color-highlight)' }}>
                  <p className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>{validationResult.totalRows}</p>
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>کل ردیف‌ها</p>
                </div>
                <div className="p-3 rounded-lg text-center" style={{ backgroundColor: 'var(--color-success-bg)' }}>
                  <p className="text-xl font-bold" style={{ color: 'var(--color-success)' }}>{validationResult.validRows}</p>
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>آماده ثبت</p>
                </div>
                <div className="p-3 rounded-lg text-center" style={{ backgroundColor: 'var(--color-warning-bg)' }}>
                  <p className="text-xl font-bold" style={{ color: 'var(--color-warning)' }}>{validationResult.duplicateRows}</p>
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>تکراری (رد شده)</p>
                </div>
              </div>

              {validationResult.warnings.length > 0 && (
                <div className="p-3 rounded-lg mb-4" style={{ backgroundColor: 'var(--color-warning-bg)', border: '1px solid var(--color-warning)' }}>
                  <p className="text-sm font-bold" style={{ color: 'var(--color-warning)' }}>
                    ⚠️ {validationResult.warnings.length} هشدار
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'var(--color-warning)' }}>
                    {validationResult.warnings[0].message}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* مرحله نتیجه */}
          {step === 'result' && validationResult && (
            <div className="text-center py-8">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-success-bg)' }}>
                <CheckCircle size={40} style={{ color: 'var(--color-success)' }} />
              </div>
              <h4 className="text-xl font-bold mb-2" style={{ color: 'var(--color-success)' }}>ورود اطلاعات با موفقیت انجام شد</h4>
              <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
                {validationResult.validRows} رکورد با موفقیت ثبت شد
              </p>
              <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--color-highlight)' }}>
                  <p className="text-lg font-bold" style={{ color: 'var(--color-success)' }}>{validationResult.validRows}</p>
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>ثبت شده</p>
                </div>
                <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--color-highlight)' }}>
                  <p className="text-lg font-bold" style={{ color: 'var(--color-warning)' }}>{validationResult.duplicateRows}</p>
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>تکراری رد شده</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* فوتر */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderTop: '1px solid var(--color-border)' }}>
          <button
            onClick={handleClose}
            className="px-5 py-2.5 rounded-lg text-sm font-medium transition-all hover:scale-105"
            style={{ backgroundColor: 'var(--color-highlight)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}
          >
            {importComplete ? 'بستن' : 'انصراف'}
          </button>

          <div className="flex gap-2">
            {step === 'errors' && validationResult && validationResult.validRows > 0 && (
              <button
                onClick={() => setStep('confirm')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all hover:scale-105"
                style={{ backgroundColor: 'var(--color-warning-bg)', color: 'var(--color-warning)', border: '1px solid var(--color-warning)' }}
              >
                ادامه با رکوردهای معتبر
                <ArrowLeft size={14} />
              </button>
            )}
            {step === 'confirm' && (
              <button
                onClick={handleConfirmImport}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold text-white transition-all hover:scale-105"
                style={{
                  background: isDark ? 'linear-gradient(135deg, #3D2980, #6B55BA)' : 'linear-gradient(135deg, #4C35A3, #6652C7)',
                  boxShadow: '0 2px 8px var(--color-brand-glow)',
                }}
              >
                <CheckCircle size={16} />
                ثبت اطلاعات
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

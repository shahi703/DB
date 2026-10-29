/**
 * Universal Import Engine
 * شناسایی خودکار فرم، اعتبارسنجی، جلوگیری از تکرار
 * 
 * مراحل:
 * 1. خواندن فایل
 * 2. شناسایی فرم از metadata یا ستون‌ها
 * 3. بررسی ساختار
 * 4. اعتبارسنجی هر ردیف
 * 5. بررسی تکراری‌ها
 * 6. ثبت اطلاعات
 * 7. گزارش کامل
 */
import * as XLSX from 'xlsx';
import { Column, FormMetadata, FormTemplate, ImportOperationResult, ImportRowError, ImportRowWarning } from '../types';
import { FormTemplateRegistry } from './FormTemplateRegistry';

export interface ImportOptions<T> {
  file: File;
  existingData?: T[];
  mode?: 'insert' | 'update' | 'upsert';
  skipDuplicates?: boolean;
}

export interface ImportValidationResult<T> {
  formId: string;
  formName: string;
  version: string;
  totalRows: number;
  validRows: number;
  invalidRows: number;
  duplicateRows: number;
  errors: ImportRowError[];
  warnings: ImportRowWarning[];
  validData: Partial<T>[];
  allData: Partial<T>[];
  metadata: FormMetadata | null;
}

/**
 * مرحله ۱: خواندن فایل و شناسایی فرم
 */
export async function readFileAndIdentify<T extends Record<string, any>>(
  file: File
): Promise<{
  success: boolean;
  formTemplate?: FormTemplate<T>;
  metadata?: FormMetadata;
  headers?: string[];
  rawData?: any[][];
  error?: string;
}> {
  try {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });

    if (workbook.SheetNames.length === 0) {
      return { success: false, error: 'فایل فاقد شیت معتبر است' };
    }

    // خواندن شیت متادیتا (اگر وجود دارد)
    let metadata: FormMetadata | undefined;
    const metadataSheet = workbook.Sheets['_metadata'];
    if (metadataSheet) {
      const parsed = parseMetadataSheet(metadataSheet);
      if (parsed) metadata = parsed;
    }

    // خواندن شیت داده‌ها
    const dataSheetName = workbook.SheetNames.find(name => !name.startsWith('_')) || workbook.SheetNames[0];
    const dataSheet = workbook.Sheets[dataSheetName];
    const jsonData = XLSX.utils.sheet_to_json<any[]>(dataSheet, { header: 1 });

    if (jsonData.length < 1) {
      return { success: false, error: 'فایل فاقد داده معتبر است' };
    }

    const headers = (jsonData[0] as string[]) || [];
    const rawData = jsonData.slice(1) as any[][];

    // شناسایی فرم
    let formTemplate: FormTemplate<T> | undefined;

    // اولویت ۱: از metadata
    if (metadata?.formId) {
      formTemplate = FormTemplateRegistry.get<T>(metadata.formId);
    }

    // اولویت ۲: از نام فرم
    if (!formTemplate && metadata?.formName) {
      formTemplate = FormTemplateRegistry.getByName<T>(metadata.formName);
    }

    // اولویت ۳: از ستون‌ها
    if (!formTemplate) {
      formTemplate = FormTemplateRegistry.identifyForm(headers) as FormTemplate<T> | undefined;
    }

    if (!formTemplate) {
      return {
        success: false,
        error: 'فرم مربوط به این فایل شناسایی نشد. لطفاً از فایل قالب استاندارد سیستم استفاده کنید.',
        headers,
        rawData,
      };
    }

    return {
      success: true,
      formTemplate,
      metadata: metadata ?? undefined,
      headers,
      rawData,
    };
  } catch (error) {
    return {
      success: false,
      error: `خطا در خواندن فایل: ${error instanceof Error ? error.message : 'خطای نامشخص'}`,
    };
  }
}

/**
 * مرحله ۲: اعتبارسنجی کامل داده‌ها
 */
export function validateImportData<T extends Record<string, any>>(
  rawData: any[][],
  formTemplate: FormTemplate<T>,
  existingData: T[] = [],
  skipDuplicates: boolean = true
): ImportValidationResult<T> {
  const result: ImportValidationResult<T> = {
    formId: formTemplate.formId,
    formName: formTemplate.formName,
    version: formTemplate.version,
    totalRows: 0,
    validRows: 0,
    invalidRows: 0,
    duplicateRows: 0,
    errors: [],
    warnings: [],
    validData: [],
    allData: [],
    metadata: null,
  };

  const columns = formTemplate.columns;
  const primaryKey = formTemplate.primaryKey;
  const uniqueFields = formTemplate.uniqueFields || [];

  // ساخت set از مقادیر موجود برای بررسی تکراری
  const existingKeys = new Set<string>();
  existingData.forEach(item => {
    const key = String(item[primaryKey as keyof T] || '');
    if (key) existingKeys.add(key);
  });

  // بررسی تکراری درون فایل
  const fileKeys = new Set<string>();

  for (let i = 0; i < rawData.length; i++) {
    const rowData = rawData[i];
    const rowIndex = i + 2; // +2 چون ردیف اول هدر است

    // بررسی ردیف خالی
    if (!rowData || rowData.every((cell) => cell === undefined || cell === '' || cell === null)) {
      continue;
    }

    result.totalRows++;

    // تبدیل ردیف به آبجکت
    const rowObject: Partial<T> = {};
    const rowErrors: ImportRowError[] = [];
    const rowWarnings: ImportRowWarning[] = [];

    columns.forEach((col, colIndex) => {
      const value = rowData[colIndex];
      const fieldName = String(col.key);

      // بررسی فیلدهای اجباری
      if (col.required && (value === undefined || value === '' || value === null)) {
        rowErrors.push({
          row: rowIndex,
          field: col.title,
          message: 'این فیلد الزامی است',
          value,
          severity: 'error',
        });
        return;
      }

      // تبدیل نوع داده
      if (value !== undefined && value !== '' && value !== null) {
        const converted = convertValue(value, col.type, col.options);
        if (converted.error) {
          rowErrors.push({
            row: rowIndex,
            field: col.title,
            message: converted.error,
            value,
            severity: 'error',
          });
        } else {
          (rowObject as any)[fieldName] = converted.value;
        }
      }
    });

    // بررسی تکراری بودن
    if (skipDuplicates && rowErrors.length === 0) {
      const primaryKeyValue = String((rowObject as any)[primaryKey as string] || '');
      
      if (primaryKeyValue && existingKeys.has(primaryKeyValue)) {
        result.duplicateRows++;
        rowErrors.push({
          row: rowIndex,
          field: String(primaryKey),
          message: `رکورد تکراری (کلید اصلی "${primaryKeyValue}" قبلاً ثبت شده)`,
          value: primaryKeyValue,
          severity: 'warning',
        });
      }

      // بررسی تکراری درون فایل
      if (primaryKeyValue && fileKeys.has(primaryKeyValue)) {
        rowErrors.push({
          row: rowIndex,
          field: String(primaryKey),
          message: `رکورد تکراری در فایل (کلید "${primaryKeyValue}" در ردیف‌های قبلی وجود دارد)`,
          value: primaryKeyValue,
          severity: 'warning',
        });
      }
      if (primaryKeyValue) fileKeys.add(primaryKeyValue);

      // بررسی سایر فیلدهای یکتا
      uniqueFields.forEach(field => {
        if (String(field) !== String(primaryKey)) {
          const fieldValue = String((rowObject as any)[field as string] || '');
          if (fieldValue) {
            const existsInDb = existingData.some(item => String(item[field as keyof T]) === fieldValue);
            if (existsInDb) {
              const col = columns.find(c => c.key === field);
              rowWarnings.push({
                row: rowIndex,
                field: col?.title || String(field),
                message: `مقدار "${fieldValue}" برای فیلد یکتا قبلاً ثبت شده`,
                value: fieldValue,
              });
            }
          }
        }
      });
    }

    // اعتبارسنجی سفارشی
    if (formTemplate.validators && rowErrors.length === 0) {
      Object.entries(formTemplate.validators).forEach(([field, validator]) => {
        const error = validator((rowObject as any)[field], rowObject);
        if (error) {
          const col = columns.find(c => c.key === field);
          rowErrors.push({
            row: rowIndex,
            field: col?.title || field,
            message: error,
            value: (rowObject as any)[field],
            severity: 'error',
          });
        }
      });
    }

    result.allData.push(rowObject);

    if (rowErrors.length > 0) {
      result.errors.push(...rowErrors);
      result.invalidRows++;
    } else {
      result.validData.push(rowObject);
      result.validRows++;
      if (rowWarnings.length > 0) {
        result.warnings.push(...rowWarnings);
      }
    }
  }

  return result;
}

/**
 * پیش‌نمایش فایل Excel
 */
export async function previewExcel(file: File): Promise<{
  headers: string[];
  rows: any[][];
  totalRows: number;
}> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });
  const dataSheetName = workbook.SheetNames.find(name => !name.startsWith('_')) || workbook.SheetNames[0];
  const worksheet = workbook.Sheets[dataSheetName];
  const jsonData = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1 });

  const headers = (jsonData[0] as string[]) || [];
  const rows = jsonData.slice(1, 11) as any[][];

  return {
    headers,
    rows,
    totalRows: jsonData.length - 1,
  };
}

/**
 * خواندن metadata از شیت
 */
function parseMetadataSheet(sheet: XLSX.WorkSheet): FormMetadata | null {
  const data = XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1 });
  
  if (!data || data.length < 10) return null;

  try {
    const metadata: FormMetadata = {
      formId: findValue(data, 'شناسه فرم') || '',
      formName: findValue(data, 'نام فرم') || '',
      version: findValue(data, 'نسخه الگو') || '1.0.0',
      columnKeys: [],
      columnTitles: [],
      primaryKey: findValue(data, 'کلید اصلی') || '',
      exportedAt: findValue(data, 'تاریخ خروجی') || '',
      exportedBy: findValue(data, 'خروجی توسط') || '',
      totalRecords: parseInt(findValue(data, 'تعداد رکوردها') || '0', 10),
    };

    // خواندن ستون‌ها از جدول مشخصات
    const specsStartRow = data.findIndex(row => row[0] === '=== مشخصات ستون‌ها ===');
    if (specsStartRow >= 0 && specsStartRow + 2 < data.length) {
      for (let i = specsStartRow + 2; i < data.length; i++) {
        const row = data[i];
        if (!row || !row[0] || row[0] === '' || String(row[0]).startsWith('===')) break;
        if (row[1]) metadata.columnKeys.push(String(row[1]));
        if (row[2]) metadata.columnTitles.push(String(row[2]));
      }
    }

    return metadata;
  } catch {
    return null;
  }
}

/**
 * یافتن مقدار بر اساس کلید در شیت metadata
 */
function findValue(data: string[][], key: string): string {
  for (const row of data) {
    if (row && row[0] === key && row[1] !== undefined) {
      return String(row[1]);
    }
  }
  return '';
}

/**
 * تبدیل نوع داده
 */
function convertValue(
  value: any,
  type?: string,
  options?: { value: string; label: string }[]
): { value: any; error?: string } {
  if (value === undefined || value === '' || value === null) {
    return { value: '' };
  }

  switch (type) {
    case 'number':
      const num = Number(value);
      if (isNaN(num)) {
        return { value: null, error: 'مقدار باید عددی باشد' };
      }
      return { value: num };

    case 'date':
      if (typeof value === 'number') {
        // تبدیل Excel date به string
        const date = new Date((value - 25569) * 86400 * 1000);
        return { value: date.toLocaleDateString('fa-IR') };
      }
      if (typeof value === 'string') {
        return { value };
      }
      return { value: String(value) };

    case 'boolean':
      if (typeof value === 'string') {
        const lower = value.toLowerCase();
        if (['بله', 'yes', 'true', '1'].includes(lower)) return { value: true };
        if (['خیر', 'no', 'false', '0'].includes(lower)) return { value: false };
        return { value: null, error: 'مقدار باید بله یا خیر باشد' };
      }
      return { value: Boolean(value) };

    case 'select':
      const strValue = String(value);
      if (options) {
        const validValues = options.map(o => o.value);
        const validLabels = options.map(o => o.label);
        // بررسی بر اساس value
        if (validValues.includes(strValue)) return { value: strValue };
        // بررسی بر اساس label
        const matchedOption = options.find(o => o.label === strValue);
        if (matchedOption) return { value: matchedOption.value };
        return { value: null, error: `مقدار باید یکی از: ${validValues.join(', ')} باشد` };
      }
      return { value: strValue };

    default:
      return { value: String(value) };
  }
}

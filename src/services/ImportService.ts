/**
 * سرویس ورود اطلاعات (Import Service)
 * خواندن فایل Excel و اعتبارسنجی داده‌ها
 */
import * as XLSX from 'xlsx';
import { Column } from '../types';

export interface ImportOptions<T> {
  columns: Column<T>[];
  file: File;
  formType: string;
  validate?: (row: Partial<T>, rowIndex: number) => string[];
}

export interface ImportResult<T> {
  success: boolean;
  data: Partial<T>[];
  errors: ImportError[];
  warnings: ImportWarning[];
  totalRows: number;
  validRows: number;
  invalidRows: number;
}

export interface ImportError {
  row: number;
  field: string;
  message: string;
  value?: any;
}

export interface ImportWarning {
  row: number;
  field: string;
  message: string;
  value?: any;
}

/**
 * خواندن و پردازش فایل Excel
 */
export async function importFromExcel<T extends Record<string, any>>(
  options: ImportOptions<T>
): Promise<ImportResult<T>> {
  const { columns, file, formType, validate } = options;

  const result: ImportResult<T> = {
    success: false,
    data: [],
    errors: [],
    warnings: [],
    totalRows: 0,
    validRows: 0,
    invalidRows: 0,
  };

  try {
    // خواندن فایل
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });

    // بررسی شیت‌ها
    if (workbook.SheetNames.length === 0) {
      result.errors.push({
        row: 0,
        field: 'file',
        message: 'فایل فاقد شیت معتبر است',
      });
      return result;
    }

    // خواندن اولین شیت
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1 });

    if (jsonData.length < 2) {
      result.errors.push({
        row: 0,
        field: 'file',
        message: 'فایل فاقد داده معتبر است',
      });
      return result;
    }

    // بررسی هدر
    const headers = jsonData[0] as string[];
    const expectedHeaders = columns.map((col) => col.title);

    // بررسی تطابق هدرها
    const headerMatch = checkHeaders(headers, expectedHeaders);
    if (!headerMatch.match) {
      result.errors.push({
        row: 1,
        field: 'headers',
        message: `ساختار فایل با فرم ${formType} مطابقت ندارد`,
        value: `ستون‌های نامعتبر: ${headerMatch.missing.join(', ')}`,
      });
      return result;
    }

    // پردازش ردیف‌ها
    result.totalRows = jsonData.length - 1;

    for (let i = 1; i < jsonData.length; i++) {
      const rowData = jsonData[i] as any[];
      
      // بررسی ردیف خالی
      if (!rowData || rowData.every((cell) => cell === undefined || cell === '')) {
        continue;
      }

      // تبدیل ردیف به آبجکت
      const rowObject: Partial<T> = {};
      const rowErrors: ImportError[] = [];
      const rowWarnings: ImportWarning[] = [];

      columns.forEach((col, colIndex) => {
        const value = rowData[colIndex];
        const fieldName = col.title;

        // بررسی فیلدهای اجباری
        if (col.required && (value === undefined || value === '' || value === null)) {
          rowErrors.push({
            row: i + 1,
            field: fieldName,
            message: 'این فیلد الزامی است',
            value,
          });
        }

        // تبدیل نوع داده
        if (value !== undefined && value !== '' && value !== null) {
          const converted = convertValue(value, col.type);
          if (converted.error) {
            rowErrors.push({
              row: i + 1,
              field: fieldName,
              message: converted.error,
              value,
            });
          } else {
            rowObject[col.key as keyof T] = converted.value;
          }
        }
      });

      // اعتبارسنجی سفارشی
      if (validate && rowErrors.length === 0) {
        const customErrors = validate(rowObject, i + 1);
        customErrors.forEach((msg) => {
          rowErrors.push({
            row: i + 1,
            field: 'custom',
            message: msg,
          });
        });
      }

      // اضافه کردن به نتایج
      if (rowErrors.length > 0) {
        result.errors.push(...rowErrors);
        result.invalidRows++;
      } else {
        result.data.push(rowObject);
        result.validRows++;
        if (rowWarnings.length > 0) {
          result.warnings.push(...rowWarnings);
        }
      }
    }

    result.success = result.errors.length === 0;

    return result;
  } catch (error) {
    result.errors.push({
      row: 0,
      field: 'file',
      message: `خطا در خواندن فایل: ${error instanceof Error ? error.message : 'خطای نامشخص'}`,
    });
    return result;
  }
}

/**
 * بررسی تطابق هدرها
 */
function checkHeaders(
  actual: string[],
  expected: string[]
): { match: boolean; missing: string[] } {
  const missing: string[] = [];

  expected.forEach((header) => {
    if (!actual.includes(header)) {
      missing.push(header);
    }
  });

  return {
    match: missing.length === 0,
    missing,
  };
}

/**
 * تبدیل نوع داده
 */
function convertValue(
  value: any,
  type?: string
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
      // بررسی فرمت تاریخ شمسی
      if (typeof value === 'string') {
        const datePattern = /^\d{4}\/\d{2}\/\d{2}$/;
        if (!datePattern.test(value)) {
          return { value: null, error: 'فرمت تاریخ باید YYYY/MM/DD باشد' };
        }
      }
      return { value };

    case 'boolean':
      if (typeof value === 'string') {
        const lower = value.toLowerCase();
        if (['بله', 'yes', 'true', '1'].includes(lower)) {
          return { value: true };
        }
        if (['خیر', 'no', 'false', '0'].includes(lower)) {
          return { value: false };
        }
        return { value: null, error: 'مقدار باید بله یا خیر باشد' };
      }
      return { value: Boolean(value) };

    default:
      return { value: String(value) };
  }
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
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const jsonData = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1 });

  const headers = (jsonData[0] as string[]) || [];
  const rows = jsonData.slice(1, 11) as any[][]; // فقط 10 ردیف اول

  return {
    headers,
    rows,
    totalRows: jsonData.length - 1,
  };
}

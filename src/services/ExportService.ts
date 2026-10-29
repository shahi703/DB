/**
 * Universal Export Engine
 * تولید فایل Excel استاندارد با metadata فرم
 * 
 * ویژگی‌ها:
 * - شیت اول: داده‌ها با هدر ستون‌ها
 * - شیت دوم (_metadata): اطلاعات فرم برای شناسایی خودکار
 * - خروجی فیلتر شده یا انتخاب شده
 * - حفظ ترتیب و نام ستون‌ها مطابق الگو
 */
import * as XLSX from 'xlsx';
import { Column, FormMetadata, FormTemplate } from '../types';

export interface ExportOptions<T> {
  columns: Column<T>[];
  data: T[];
  fileName: string;
  sheetName?: string;
  formTemplate?: FormTemplate<T>;
  includeMetadata?: boolean;
  exportedBy?: string;
}

export interface ExportResult {
  success: boolean;
  fileName: string;
  rowCount: number;
  error?: string;
}

/**
 * خروجی Excel با metadata فرم
 */
export function exportToExcel<T extends Record<string, any>>(
  options: ExportOptions<T>
): ExportResult {
  const {
    columns,
    data,
    fileName,
    sheetName = 'Data',
    formTemplate,
    includeMetadata = true,
    exportedBy = 'system',
  } = options;

  try {
    // ساخت ورک‌بوک
    const workbook = XLSX.utils.book_new();

    // === شیت اول: داده‌ها ===
    const headers = columns.map((col) => col.title);
    const rows = data.map((item) =>
      columns.map((col) => {
        const value = item[col.key as keyof T];
        if (typeof value === 'boolean') return value ? 'بله' : 'خیر';
        if (value === null || value === undefined) return '';
        return value;
      })
    );

    const worksheetData = [headers, ...rows];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // تنظیم عرض ستون‌ها
    worksheet['!cols'] = columns.map((col) => ({
      wch: Math.max(col.title.length * 2.5, 12),
    }));

    // استایل هدر (با استفاده از XLSX styles)
    const headerRange = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
    for (let C = headerRange.s.c; C <= headerRange.e.c; C++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
      if (worksheet[cellAddress]) {
        worksheet[cellAddress].s = {
          font: { bold: true, color: { rgb: 'FFFFFF' } },
          fill: { fgColor: { rgb: '4C35A3' } },
          alignment: { horizontal: 'center', vertical: 'center' },
        };
      }
    }

    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName.substring(0, 31));

    // === شیت دوم: متادیتا ===
    if (includeMetadata) {
      const metadata: FormMetadata = {
        formId: formTemplate?.formId || generateFormId(fileName),
        formName: formTemplate?.formName || fileName,
        version: formTemplate?.version || '1.0.0',
        columnKeys: columns.map((col) => String(col.key)),
        columnTitles: columns.map((col) => col.title),
        primaryKey: formTemplate ? String(formTemplate.primaryKey) : columns[0]?.key ? String(columns[0].key) : '',
        exportedAt: new Date().toISOString(),
        exportedBy,
        totalRecords: data.length,
      };

      const metadataSheet = createMetadataSheet(metadata, columns);
      XLSX.utils.book_append_sheet(workbook, metadataSheet, '_metadata');
    }

    // نوشتن فایل
    const finalFileName = `${fileName}.xlsx`;
    XLSX.writeFile(workbook, finalFileName, { bookType: 'xlsx' });

    return {
      success: true,
      fileName: finalFileName,
      rowCount: data.length,
    };
  } catch (error) {
    return {
      success: false,
      fileName: '',
      rowCount: 0,
      error: error instanceof Error ? error.message : 'خطای نامشخص',
    };
  }
}

/**
 * تولید قالب خالی فرم (Template)
 * فقط هدرها و توضیحات، بدون داده
 */
export function exportTemplate<T extends Record<string, any>>(
  options: ExportOptions<T>
): ExportResult {
  return exportToExcel({
    ...options,
    data: [],
    fileName: `${options.fileName}_قالب`,
    sheetName: 'قالب',
  });
}

/**
 * ساخت شیت متادیتا
 */
function createMetadataSheet<T>(metadata: FormMetadata, columns: Column<T>[]): XLSX.WorkSheet {
  const metadataRows: any[][] = [
    ['=== فرم سیستم کنترل پروژه پایپینگ ==='],
    ['این شیت شامل اطلاعات فرم است و نباید تغییر داده شود'],
    [],
    ['شناسه فرم', metadata.formId],
    ['نام فرم', metadata.formName],
    ['نسخه الگو', metadata.version],
    ['کلید اصلی', metadata.primaryKey],
    ['تاریخ خروجی', new Date().toLocaleString('fa-IR')],
    ['خروجی توسط', metadata.exportedBy],
    ['تعداد رکوردها', metadata.totalRecords],
    [],
    ['=== مشخصات ستون‌ها ==='],
    ['شماره', 'کلید فیلد', 'عنوان نمایشی', 'نوع داده', 'اجباری', 'یکتا', 'توضیحات'],
  ];

  columns.forEach((col, idx) => {
    metadataRows.push([
      idx + 1,
      String(col.key),
      col.title,
      col.type || 'text',
      col.required ? 'بله' : 'خیر',
      col.unique ? 'بله' : 'خیر',
      col.description || '',
    ]);
  });

  metadataRows.push([]);
  metadataRows.push(['=== مقادیر مجاز برای فیلدهای select ===']);
  columns.forEach((col) => {
    if (col.type === 'select' && col.options) {
      const optionsStr = col.options.map(o => `${o.value}=${o.label}`).join(' | ');
      metadataRows.push([col.title, optionsStr]);
    }
  });

  const worksheet = XLSX.utils.aoa_to_sheet(metadataRows);
  worksheet['!cols'] = [
    { wch: 20 },
    { wch: 25 },
    { wch: 25 },
    { wch: 12 },
    { wch: 10 },
    { wch: 10 },
    { wch: 30 },
  ];

  return worksheet;
}

/**
 * تولید شناسه فرم از نام فایل
 */
function generateFormId(fileName: string): string {
  return fileName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '');
}

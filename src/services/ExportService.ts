/**
 * سرویس خروجی اطلاعات (Export Service)
 * تولید فایل Excel استاندارد برای تمامی فرم‌ها
 */
import * as XLSX from 'xlsx';
import { Column } from '../types';

export interface ExportOptions<T> {
  columns: Column<T>[];
  data: T[];
  fileName: string;
  sheetName?: string;
  includeMetadata?: boolean;
}

export interface ExportResult {
  success: boolean;
  fileName: string;
  rowCount: number;
  error?: string;
}

/**
 * تبدیل داده‌ها به فایل Excel
 */
export function exportToExcel<T extends Record<string, any>>(
  options: ExportOptions<T>
): ExportResult {
  const { columns, data, fileName, sheetName = 'Data', includeMetadata = true } = options;

  try {
    // ساخت هدر ستون‌ها
    const headers = columns.map((col) => col.title);

    // تبدیل داده‌ها به آرایه
    const rows = data.map((item) =>
      columns.map((col) => {
        const value = item[col.key as keyof T];
        // تبدیل مقادیر خاص
        if (typeof value === 'boolean') {
          return value ? 'بله' : 'خیر';
        }
        if (value === null || value === undefined) {
          return '';
        }
        return value;
      })
    );

    // ساخت شیت
    const worksheetData = [headers, ...rows];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // تنظیم عرض ستون‌ها
    worksheet['!cols'] = columns.map((col) => ({
      wch: Math.max(col.title.length * 2, 15),
    }));

    // اضافه کردن متادیتا
    if (includeMetadata) {
      const metadata = {
        ExportDate: new Date().toLocaleString('fa-IR'),
        TotalRecords: data.length,
        FormType: sheetName,
        Version: '1.0.0',
      };

      // اضافه کردن متادیتا به انتهای شیت
      const metadataStartRow = rows.length + 3;
      XLSX.utils.sheet_add_aoa(
        worksheet,
        [
          [],
          ['--- متادیتا ---'],
          ['تاریخ خروجی', metadata.ExportDate],
          ['تعداد رکوردها', metadata.TotalRecords],
          ['نوع فرم', metadata.FormType],
          ['نسخه سیستم', metadata.Version],
        ],
        { origin: `A${metadataStartRow}` }
      );
    }

    // ساخت ورک‌بوک
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // نوشتن فایل
    XLSX.writeFile(workbook, `${fileName}.xlsx`);

    return {
      success: true,
      fileName: `${fileName}.xlsx`,
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
 * خروجی از رکوردهای انتخاب شده
 */
export function exportSelectedToExcel<T extends Record<string, any>>(
  options: ExportOptions<T> & { selectedRows: T[] }
): ExportResult {
  return exportToExcel({
    ...options,
    data: options.selectedRows,
    fileName: `${options.fileName}_selected`,
  });
}

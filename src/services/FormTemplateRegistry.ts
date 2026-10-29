/**
 * Form Template Registry
 * ثبت الگوی استاندارد هر فرم
 * این الگو هم برای Export و هم برای Import استفاده می‌شود
 */
import { FormTemplate, Column } from '../types';

class FormTemplateRegistryClass {
  private templates: Map<string, FormTemplate<any>> = new Map();

  /**
   * ثبت یک الگوی فرم
   */
  register<T>(template: FormTemplate<T>): void {
    this.templates.set(template.formId, template);
    console.log(`[FormTemplateRegistry] فرم "${template.formName}" (${template.formId}) ثبت شد`);
  }

  /**
   * دریافت الگوی فرم بر اساس شناسه
   */
  get<T>(formId: string): FormTemplate<T> | undefined {
    return this.templates.get(formId);
  }

  /**
   * دریافت الگوی فرم بر اساس نام
   */
  getByName<T>(formName: string): FormTemplate<T> | undefined {
    for (const template of this.templates.values()) {
      if (template.formName === formName) {
        return template;
      }
    }
    return undefined;
  }

  /**
   * شناسایی فرم بر اساس ستون‌ها
   */
  identifyForm(columnTitles: string[]): FormTemplate<any> | undefined {
    for (const template of this.templates.values()) {
      const expectedTitles = template.columns.map(col => col.title);
      
      // بررسی تطابق کامل
      if (this.arraysMatch(columnTitles, expectedTitles)) {
        return template;
      }
      
      // بررسی تطابق جزئی (حداقل 80% ستون‌ها مطابقت داشته باشد)
      const matchCount = columnTitles.filter(title => expectedTitles.includes(title)).length;
      const matchPercent = matchCount / expectedTitles.length;
      if (matchPercent >= 0.8) {
        return template;
      }
    }
    return undefined;
  }

  /**
   * دریافت تمام الگوهای ثبت‌شده
   */
  getAll(): FormTemplate<any>[] {
    return Array.from(this.templates.values());
  }

  /**
   * بررسی وجود الگو
   */
  has(formId: string): boolean {
    return this.templates.has(formId);
  }

  /**
   * حذف الگو
   */
  remove(formId: string): boolean {
    return this.templates.delete(formId);
  }

  /**
   * دریافت ستون‌های فرم
   */
  getColumns<T>(formId: string): Column<T>[] | undefined {
    const template = this.templates.get(formId);
    return template?.columns;
  }

  /**
   * اعتبارسنجی یک ردیف بر اساس الگوی فرم
   */
  validateRow<T extends Record<string, any>>(
    formId: string,
    row: Partial<T>,
    rowIndex: number
  ): { valid: boolean; errors: { row: number; field: string; message: string; value?: any }[] } {
    const template = this.templates.get(formId);
    if (!template) {
      return {
        valid: false,
        errors: [{ row: rowIndex, field: 'form', message: `الگوی فرم "${formId}" یافت نشد` }],
      };
    }

    const errors: { row: number; field: string; message: string; value?: any }[] = [];

    // بررسی فیلدهای اجباری
    template.columns.forEach(col => {
      const value = row[col.key as keyof T];
      
      if (col.required && (value === undefined || value === '' || value === null)) {
        errors.push({
          row: rowIndex,
          field: col.title,
          message: 'این فیلد الزامی است',
          value,
        });
      }

      // بررسی نوع select
      if (col.type === 'select' && col.options && value) {
        const validOptions = col.options.map(opt => opt.value);
        if (!validOptions.includes(String(value))) {
          errors.push({
            row: rowIndex,
            field: col.title,
            message: `مقدار باید یکی از: ${validOptions.join(', ')}`,
            value,
          });
        }
      }
    });

    // بررسی validators سفارشی
    if (template.validators) {
      Object.entries(template.validators).forEach(([field, validator]) => {
        const error = validator(row[field as keyof T], row);
        if (error) {
          const col = template.columns.find(c => c.key === field);
          errors.push({
            row: rowIndex,
            field: col?.title || field,
            message: error,
            value: row[field as keyof T],
          });
        }
      });
    }

    return { valid: errors.length === 0, errors };
  }

  /**
   * بررسی تطابق دو آرایه
   */
  private arraysMatch(arr1: string[], arr2: string[]): boolean {
    if (arr1.length !== arr2.length) return false;
    return arr1.every((item, index) => item === arr2[index]);
  }
}

// Singleton instance
export const FormTemplateRegistry = new FormTemplateRegistryClass();

/**
 * مودال افزودن رکورد جدید
 * نمایش تمام ستون‌های جدول در فرم
 */
import { useState } from 'react';
import { X, Save } from 'lucide-react';
import { useThemeContext } from '../context/ThemeContext';

interface AddRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: string;
  onSave: (data: Record<string, any>) => void;
}

// تعریف فیلدها بر اساس نوع
const formFields: Record<string, { key: string; label: string; type: string; required?: boolean; options?: string[] }[]> = {
  joint: [
    { key: 'UnitName', label: 'نام یونیت', type: 'text', required: true },
    { key: 'AreaNo', label: 'شماره ناحیه', type: 'text' },
    { key: 'ProjectID', label: 'کد پروژه', type: 'text', required: true },
    { key: 'IsoNo', label: 'شماره آیزومتریک', type: 'text', required: true },
    { key: 'LineNo', label: 'شماره خط', type: 'text', required: true },
    { key: 'JointNo', label: 'شماره جوینت', type: 'text', required: true },
    { key: 'SizeJoint', label: 'سایز جوینت', type: 'text' },
    { key: 'CalSize', label: 'سایز کالیبره', type: 'text' },
    { key: 'Revision', label: 'Revision', type: 'text' },
    { key: 'Sheet', label: 'Sheet', type: 'text' },
    { key: 'Sch', label: 'Schedule', type: 'text' },
    { key: 'Thk', label: 'ضخامت', type: 'text' },
    { key: 'JointType', label: 'نوع اتصال', type: 'select', options: ['BW', 'SW', 'Threaded', 'Flanged'] },
    { key: 'Service', label: 'سرویس', type: 'text' },
    { key: 'SpoolNo', label: 'شماره Spool', type: 'text' },
    { key: 'Place', label: 'محل', type: 'select', options: ['Shop', 'Site'] },
    { key: 'PipeClass', label: 'کلاس لوله', type: 'text' },
    { key: 'MaterialType', label: 'نوع متریال', type: 'select', options: ['C.S', 'S.S', 'Alloy', 'CS', 'SS'] },
    { key: 'NDTPercent', label: 'درصد NDT', type: 'text' },
    { key: 'TestPackage', label: 'Test Package', type: 'text' },
    { key: 'KeyJoint', label: 'Key Joint', type: 'text' },
    { key: 'LineStatus', label: 'وضعیت خط', type: 'select', options: ['In Progress', 'Completed', 'Pending', 'On Hold'] },
  ],
  welder: [
    { key: 'WelderStamp', label: 'کد جوشکار', type: 'text', required: true },
    { key: 'WelderName', label: 'نام جوشکار', type: 'text', required: true },
    { key: 'WQTNo', label: 'شماره WQT', type: 'text', required: true },
    { key: 'WQTDate', label: 'تاریخ WQT', type: 'text' },
    { key: 'Process', label: 'فرآیند جوشکاری', type: 'select', options: ['SMAW', 'GTAW', 'GMAW', 'FCAW', 'SAW'] },
    { key: 'WeldPosition', label: 'پوزیشن جوش', type: 'select', options: ['1G', '2G', '5G', '6G', '6GR'] },
    { key: 'MaterialType', label: 'نوع متریال', type: 'select', options: ['C.S', 'S.S', 'Alloy'] },
    { key: 'PipePlateSize', label: 'سایز لوله/صفحه', type: 'text' },
    { key: 'ElectrodeType', label: 'نوع الکترود', type: 'text' },
    { key: 'FNo', label: 'F Number', type: 'text' },
    { key: 'ANo', label: 'A Number', type: 'text' },
    { key: 'THK', label: 'ضخامت', type: 'text' },
    { key: 'THKApproved', label: 'ضخامت مجاز', type: 'text' },
    { key: 'SizeApproved', label: 'سایز مجاز', type: 'text' },
    { key: 'QualificationRef', label: 'مرجع صلاحیت', type: 'text' },
    { key: 'Remark', label: 'توضیحات', type: 'text' },
  ],
  project: [
    { key: 'ProjectCode', label: 'کد پروژه', type: 'text', required: true },
    { key: 'ProjectName', label: 'نام پروژه', type: 'text', required: true },
    { key: 'ClientName', label: 'نام کارفرما', type: 'text', required: true },
    { key: 'MainContractor', label: 'پیمانکار اصلی', type: 'text' },
    { key: 'Subcontractor', label: 'پیمانکار فرعی', type: 'text' },
    { key: 'SiteLocation', label: 'محل پروژه', type: 'text' },
    { key: 'StartDate', label: 'تاریخ شروع', type: 'text' },
    { key: 'PlannedFinishDate', label: 'تاریخ پایان برنامه‌ای', type: 'text' },
    { key: 'ProjectStatus', label: 'وضعیت', type: 'select', options: ['active', 'stopped', 'completed'] },
    { key: 'RevisionPolicy', label: 'سیاست ویرایش', type: 'text' },
  ],
  office_joint: [
    { key: 'UnitName', label: 'نام یونیت', type: 'text', required: true },
    { key: 'AreaNo', label: 'شماره ناحیه', type: 'text' },
    { key: 'ProjectID', label: 'کد پروژه', type: 'text', required: true },
    { key: 'UnitSubcontractor', label: 'پیمانکار یونیت', type: 'text' },
    { key: 'PIDNo', label: 'شماره P&ID', type: 'text' },
    { key: 'IsoNo', label: 'شماره آیزومتریک', type: 'text', required: true },
    { key: 'LineNo', label: 'شماره خط', type: 'text', required: true },
    { key: 'JointNo', label: 'شماره جوینت', type: 'text', required: true },
    { key: 'SizeJoint', label: 'سایز جوینت', type: 'text' },
    { key: 'CalSize', label: 'سایز کالیبره', type: 'text' },
    { key: 'Rev', label: 'Revision', type: 'text' },
    { key: 'Sheet', label: 'Sheet', type: 'text' },
    { key: 'Sch', label: 'Schedule', type: 'text' },
    { key: 'Thk', label: 'ضخامت', type: 'text' },
    { key: 'JointType', label: 'نوع اتصال', type: 'select', options: ['BW', 'SW', 'Threaded', 'Flanged'] },
    { key: 'MaterialType', label: 'نوع متریال', type: 'text' },
    { key: 'Service', label: 'سرویس', type: 'text' },
    { key: 'SpoolNo', label: 'شماره Spool', type: 'text' },
    { key: 'Place', label: 'محل', type: 'select', options: ['Shop', 'Site'] },
    { key: 'FFW', label: 'FFW', type: 'text' },
    { key: 'PipeClass', label: 'کلاس لوله', type: 'text' },
    { key: 'Priority', label: 'اولویت', type: 'select', options: ['High', 'Medium', 'Low'] },
    { key: 'NDTPercent', label: 'درصد NDT', type: 'text' },
    { key: 'TestPackage', label: 'Test Package', type: 'text' },
    { key: 'StatusJoint', label: 'وضعیت جوینت', type: 'select', options: ['Worked', 'Front', 'Shortage'] },
  ],
  inventory: [
    { key: 'TransactionID', label: 'شماره تراکنش', type: 'text', required: true },
    { key: 'ProjectID', label: 'کد پروژه', type: 'text', required: true },
    { key: 'TransactionType', label: 'نوع تراکنش', type: 'select', options: ['in', 'out', 'return', 'transfer'], required: true },
    { key: 'TransactionDate', label: 'تاریخ تراکنش', type: 'text' },
    { key: 'DocumentNumber', label: 'شماره سند', type: 'text' },
    { key: 'SupplierOrSource', label: 'تامین‌کننده/منبع', type: 'text' },
    { key: 'ItemNo', label: 'شماره آیتم', type: 'text' },
    { key: 'Object', label: 'Object', type: 'text' },
    { key: 'ObjectSize', label: 'سایز', type: 'text' },
    { key: 'MaterialDescription', label: 'توضیحات متریال', type: 'text' },
    { key: 'HeatNumber', label: 'شماره Heat', type: 'text' },
    { key: 'BatchOrLotNumber', label: 'شماره Batch/Lot', type: 'text' },
    { key: 'MTCNumber', label: 'شماره MTC', type: 'text' },
    { key: 'QuantityIn', label: 'مقدار ورودی', type: 'text' },
    { key: 'QuantityOut', label: 'مقدار خروجی', type: 'text' },
    { key: 'Unit', label: 'واحد', type: 'text' },
    { key: 'QCStatus', label: 'وضعیت QC', type: 'select', options: ['free', 'quarantine', 'rejected'] },
    { key: 'Remarks', label: 'توضیحات', type: 'text' },
  ],
  daily_report: [
    { key: 'DailyReportID', label: 'شماره گزارش', type: 'text', required: true },
    { key: 'ReportDate', label: 'تاریخ گزارش', type: 'text', required: true },
    { key: 'ProjectID', label: 'کد پروژه', type: 'text', required: true },
    { key: 'AreaUnit', label: 'یونیت/ناحیه', type: 'text' },
    { key: 'ContractorID', label: 'پیمانکار', type: 'text' },
    { key: 'PlannedFitupQty', label: 'فیتاپ برنامه‌ای', type: 'text' },
    { key: 'ActualFitupQty', label: 'فیتاپ واقعی', type: 'text' },
    { key: 'PlannedWeldQty', label: 'جوش برنامه‌ای', type: 'text' },
    { key: 'ActualWeldQty', label: 'جوش واقعی', type: 'text' },
    { key: 'ActualWeldInchDia', label: 'جوش (اینچ-قطر)', type: 'text' },
    { key: 'NDTRequestedQty', label: 'NDT درخواستی', type: 'text' },
    { key: 'NDTAcceptedQty', label: 'NDT قبول', type: 'text' },
    { key: 'NDTRejectedQty', label: 'NDT رد', type: 'text' },
    { key: 'ManpowerCount', label: 'تعداد نیرو', type: 'text' },
    { key: 'DelayReasonCode', label: 'کد تأخیر', type: 'text' },
    { key: 'Remarks', label: 'توضیحات', type: 'text' },
  ],
  personnel: [
    { key: 'PersonnelCode', label: 'کد پرسنلی', type: 'text', required: true },
    { key: 'FirstName', label: 'نام', type: 'text', required: true },
    { key: 'LastName', label: 'نام خانوادگی', type: 'text', required: true },
    { key: 'NationalCode', label: 'کد ملی', type: 'text' },
    { key: 'Department', label: 'واحد سازمانی', type: 'text' },
    { key: 'Position', label: 'سمت', type: 'text' },
    { key: 'EmploymentDate', label: 'تاریخ استخدام', type: 'text' },
    { key: 'PhoneNumber', label: 'شماره تماس', type: 'text' },
    { key: 'EmergencyContact', label: 'تماس اضطراری', type: 'text' },
    { key: 'Certifications', label: 'گواهینامه‌ها', type: 'text' },
    { key: 'Remarks', label: 'توضیحات', type: 'text' },
  ],
};

const typeToFormType: Record<string, string> = {
  joint: 'joint',
  welder: 'welder',
  project: 'project',
  office_joint: 'office_joint',
  inventory: 'inventory',
  daily_report: 'daily_report',
  personnel: 'personnel',
};

const typeToTitle: Record<string, string> = {
  joint: 'افزودن جوینت جدید',
  welder: 'افزودن جوشکار جدید',
  project: 'افزودن پروژه جدید',
  office_joint: 'افزودن جوینت دفترفنی',
  inventory: 'افزودن تراکنش انبار',
  daily_report: 'افزودن گزارش روزانه',
  personnel: 'افزودن پرسنل جدید',
};

export function AddRecordModal({ isOpen, onClose, type, onSave }: AddRecordModalProps) {
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';
  const formType = typeToFormType[type] || type;
  const fields = formFields[formType] || [];
  const title = typeToTitle[type] || 'افزودن رکورد جدید';

  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
    setFormData({});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'var(--color-overlay)' }}>
      <div
        className="w-full max-w-3xl max-h-[90vh] rounded-2xl overflow-hidden flex flex-col animate-fade-in"
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          boxShadow: '0 25px 50px var(--color-shadow-lg)',
        }}
      >
        {/* هدر */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid var(--color-border)' }}
        >
          <h3 className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-all hover:scale-110"
            style={{ backgroundColor: 'var(--color-highlight)', color: 'var(--color-text-secondary)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* بدنه فرم */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((field) => (
              <div key={field.key} className={field.type === 'text' && field.label === 'توضیحات' ? 'md:col-span-2' : ''}>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {field.type === 'select' ? (
                  <select
                    value={formData[field.key] || ''}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all"
                    style={{
                      backgroundColor: 'var(--color-input-bg)',
                      border: '1.5px solid var(--color-input-border)',
                      color: 'var(--color-text-primary)',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--color-brand)';
                      e.target.style.boxShadow = '0 0 0 3px var(--color-brand-glow)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--color-input-border)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <option value="">انتخاب کنید...</option>
                    {field.options?.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={formData[field.key] || ''}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    placeholder={`${field.label} را وارد کنید`}
                    className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all"
                    style={{
                      backgroundColor: 'var(--color-input-bg)',
                      border: '1.5px solid var(--color-input-border)',
                      color: 'var(--color-text-primary)',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--color-brand)';
                      e.target.style.boxShadow = '0 0 0 3px var(--color-brand-glow)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--color-input-border)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* فوتر */}
        <div
          className="flex items-center justify-end gap-3 px-6 py-4"
          style={{ borderTop: '1px solid var(--color-border)' }}
        >
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg text-sm font-medium transition-all hover:scale-105"
            style={{
              backgroundColor: 'var(--color-highlight)',
              color: 'var(--color-text-secondary)',
              border: '1px solid var(--color-border)',
            }}
          >
            انصراف
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold text-white transition-all hover:scale-105"
            style={{
              background: isDark
                ? 'linear-gradient(135deg, #3D2980, #6B55BA)'
                : 'linear-gradient(135deg, #4C35A3, #6652C7)',
              boxShadow: '0 2px 8px var(--color-brand-glow)',
            }}
          >
            <Save size={16} />
            ذخیره
          </button>
        </div>
      </div>
    </div>
  );
}

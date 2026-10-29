/**
 * ثبت الگوهای استاندارد فرم‌های سیستم
 * این فایل در ابتدای برنامه اجرا می‌شود
 */
import { FormTemplateRegistry } from './FormTemplateRegistry';
import { FormTemplate } from '../types';

// ============================================
// الگوی فرم پروژه‌ها
// ============================================
const projectTemplate: FormTemplate = {
  formId: 'projects',
  formName: 'لیست پروژه‌ها',
  version: '1.0.0',
  description: 'اطلاعات عمومی پروژه‌های در حال اجرا',
  primaryKey: 'ProjectID',
  uniqueFields: ['ProjectCode'],
  columns: [
    { key: 'ProjectID', title: 'کد پروژه', type: 'text', required: true, unique: true },
    { key: 'ProjectCode', title: 'شناسه پروژه', type: 'text', required: true, unique: true },
    { key: 'ProjectName', title: 'نام پروژه', type: 'text', required: true },
    { key: 'ClientName', title: 'کارفرما', type: 'text', required: true },
    { key: 'MainContractor', title: 'پیمانکار اصلی', type: 'text' },
    { key: 'Subcontractor', title: 'پیمانکار فرعی', type: 'text' },
    { key: 'SiteLocation', title: 'محل پروژه', type: 'text' },
    { key: 'StartDate', title: 'تاریخ شروع', type: 'date' },
    { key: 'PlannedFinishDate', title: 'پایان برنامه‌ای', type: 'date' },
    { key: 'ActualFinishDate', title: 'پایان واقعی', type: 'date' },
    { key: 'ProjectStatus', title: 'وضعیت', type: 'select', options: [
      { value: 'active', label: 'فعال' },
      { value: 'stopped', label: 'متوقف' },
      { value: 'completed', label: 'تکمیل‌شده' },
    ]},
    { key: 'RevisionPolicy', title: 'سیاست ویرایش', type: 'text' },
  ],
  validators: {
    ProjectStatus: (value) => {
      if (value && !['active', 'stopped', 'completed'].includes(value)) {
        return 'وضعیت باید یکی از: active, stopped, completed باشد';
      }
      return null;
    },
  },
  createdAt: '1403/08/01',
  updatedAt: '1403/08/01',
};

// ============================================
// الگوی فرم جوینت هیستوری QC
// ============================================
const qcJointHistoryTemplate: FormTemplate = {
  formId: 'qc-joint-history',
  formName: 'جوینت هیستوری QC',
  version: '1.0.0',
  description: 'اطلاعات کامل جوینت‌ها از دیدگاه کنترل کیفیت',
  primaryKey: 'Row',
  uniqueFields: ['KeyJoint'],
  columns: [
    { key: 'Row', title: 'ردیف', type: 'number', required: true },
    { key: 'UnitName', title: 'نام یونیت', type: 'text' },
    { key: 'AreaNo', title: 'شماره ناحیه', type: 'text' },
    { key: 'ProjectID', title: 'کد پروژه', type: 'text', required: true },
    { key: 'IsoNo', title: 'آیزومتریک', type: 'text', required: true },
    { key: 'LineNo', title: 'شماره خط', type: 'text', required: true },
    { key: 'JointNo', title: 'شماره جوینت', type: 'text', required: true },
    { key: 'ActiveJoint', title: 'فعال', type: 'select', options: [
      { value: '1', label: 'بله' },
      { value: '0', label: 'خیر' },
    ]},
    { key: 'SizeJoint', title: 'سایز', type: 'text' },
    { key: 'CalSize', title: 'سایز کالیبره', type: 'text' },
    { key: 'Revision', title: 'Revision', type: 'text' },
    { key: 'Sheet', title: 'Sheet', type: 'text' },
    { key: 'Sch', title: 'Schedule', type: 'text' },
    { key: 'Thk', title: 'ضخامت', type: 'text' },
    { key: 'JointType', title: 'نوع اتصال', type: 'select', options: [
      { value: 'BW', label: 'BW' },
      { value: 'SW', label: 'SW' },
      { value: 'Threaded', label: 'Threaded' },
      { value: 'Flanged', label: 'Flanged' },
    ]},
    { key: 'Service', title: 'سرویس', type: 'text' },
    { key: 'SpoolNo', title: 'Spool', type: 'text' },
    { key: 'Place', title: 'محل', type: 'select', options: [
      { value: 'Shop', label: 'Shop' },
      { value: 'Site', label: 'Site' },
    ]},
    { key: 'PipeClass', title: 'کلاس لوله', type: 'text' },
    { key: 'MaterialType', title: 'متریال', type: 'text' },
    { key: 'NDTPercent', title: 'درصد NDT', type: 'text' },
    { key: 'TestPackage', title: 'Test Package', type: 'text' },
    { key: 'KeyJoint', title: 'Key Joint', type: 'text', unique: true },
    { key: 'LineStatus', title: 'وضعیت خط', type: 'text' },
    { key: 'FitupReportNo', title: 'شماره گزارش فیتاپ', type: 'text' },
    { key: 'FitupReportDate', title: 'تاریخ فیتاپ', type: 'date' },
    { key: 'FitupInspectionStatus', title: 'وضعیت فیتاپ', type: 'select', options: [
      { value: 'Accepted', label: 'قبول' },
      { value: 'Rejected', label: 'رد' },
      { value: 'Pending', label: 'در انتظار' },
    ]},
    { key: 'FitupSubContractor', title: 'پیمانکار فیتاپ', type: 'text' },
    { key: 'FitterID', title: 'کد فیتر', type: 'text' },
    { key: 'RemarkFitup', title: 'توضیحات فیتاپ', type: 'text' },
    { key: 'WeldReportNo', title: 'شماره گزارش جوش', type: 'text' },
    { key: 'WeldReportDate', title: 'تاریخ جوش', type: 'date' },
    { key: 'WeldInspectionStatus', title: 'وضعیت جوش', type: 'select', options: [
      { value: 'Accepted', label: 'قبول' },
      { value: 'Rejected', label: 'رد' },
      { value: 'Pending', label: 'در انتظار' },
    ]},
    { key: 'WelderStamp1', title: 'استمپ جوشکار ۱', type: 'text' },
    { key: 'WelderStamp2', title: 'استمپ جوشکار ۲', type: 'text' },
    { key: 'WeldSubContractor', title: 'پیمانکار جوش', type: 'text' },
    { key: 'WPSRequired', title: 'WPS مورد نیاز', type: 'text' },
    { key: 'RemarkWeld', title: 'توضیحات جوش', type: 'text' },
    { key: 'ErectionRepNo', title: 'شماره گزارش نصب', type: 'text' },
    { key: 'ErectionRepDate', title: 'تاریخ نصب', type: 'date' },
    { key: 'ErcRemark', title: 'توضیحات نصب', type: 'text' },
    { key: 'NDTTestType', title: 'نوع تست NDT', type: 'select', options: [
      { value: 'RT', label: 'RT' },
      { value: 'UT', label: 'UT' },
      { value: 'MT', label: 'MT' },
      { value: 'PT', label: 'PT' },
      { value: 'VT', label: 'VT' },
    ]},
    { key: 'NDTNo1', title: 'شماره NDT', type: 'text' },
    { key: 'NDTReqNo1', title: 'شماره درخواست NDT', type: 'text' },
    { key: 'NDTReqDate1', title: 'تاریخ درخواست NDT', type: 'date' },
    { key: 'NDTResNo', title: 'شماره نتیجه NDT', type: 'text' },
    { key: 'NDTResDate1', title: 'تاریخ نتیجه NDT', type: 'date' },
    { key: 'NDTStatus', title: 'وضعیت NDT', type: 'select', options: [
      { value: 'Accepted', label: 'قبول' },
      { value: 'Rejected', label: 'رد' },
      { value: 'Pending', label: 'در انتظار' },
    ]},
    { key: 'Deffect', title: 'نوع عیب', type: 'text' },
    { key: 'PWHT', title: 'PWHT', type: 'select', options: [
      { value: 'Yes', label: 'بله' },
      { value: 'No', label: 'خیر' },
    ]},
    { key: 'Remark', title: 'توضیحات', type: 'text' },
  ],
  createdAt: '1403/08/01',
  updatedAt: '1403/08/01',
};

// ============================================
// الگوی فرم جوشکاران
// ============================================
const weldersTemplate: FormTemplate = {
  formId: 'qc-welders',
  formName: 'اطلاعات جوشکاران',
  version: '1.0.0',
  description: 'صلاحیت‌ها و اطلاعات جوشکاران پروژه',
  primaryKey: 'WelderStamp',
  uniqueFields: ['WelderStamp', 'WQTNo'],
  columns: [
    { key: 'WelderStamp', title: 'کد جوشکار', type: 'text', required: true, unique: true },
    { key: 'WelderName', title: 'نام جوشکار', type: 'text', required: true },
    { key: 'WQTNo', title: 'شماره WQT', type: 'text', required: true, unique: true },
    { key: 'WQTDate', title: 'تاریخ WQT', type: 'date' },
    { key: 'Process', title: 'فرآیند', type: 'select', options: [
      { value: 'SMAW', label: 'SMAW' },
      { value: 'GTAW', label: 'GTAW' },
      { value: 'GMAW', label: 'GMAW' },
      { value: 'FCAW', label: 'FCAW' },
      { value: 'SAW', label: 'SAW' },
    ]},
    { key: 'WeldPosition', title: 'پوزیشن', type: 'select', options: [
      { value: '1G', label: '1G' },
      { value: '2G', label: '2G' },
      { value: '5G', label: '5G' },
      { value: '6G', label: '6G' },
      { value: '6GR', label: '6GR' },
    ]},
    { key: 'MaterialType', title: 'متریال', type: 'text' },
    { key: 'PipePlateSize', title: 'سایز لوله/صفحه', type: 'text' },
    { key: 'ElectrodeType', title: 'الکترود', type: 'text' },
    { key: 'FNo', title: 'F Number', type: 'text' },
    { key: 'ANo', title: 'A Number', type: 'text' },
    { key: 'THK', title: 'ضخامت', type: 'text' },
    { key: 'THKApproved', title: 'ضخامت مجاز', type: 'text' },
    { key: 'SizeApproved', title: 'سایز مجاز', type: 'text' },
    { key: 'QualificationRef', title: 'مرجع صلاحیت', type: 'text' },
    { key: 'WQTNDTNo', title: 'شماره NDT WQT', type: 'text' },
    { key: 'NDTReqNo', title: 'شماره درخواست NDT', type: 'text' },
    { key: 'NDTReqDate', title: 'تاریخ درخواست NDT', type: 'date' },
    { key: 'NDTResNo', title: 'شماره نتیجه NDT', type: 'text' },
    { key: 'NDTResDate', title: 'تاریخ نتیجه NDT', type: 'date' },
    { key: 'NDTStatus', title: 'وضعیت NDT', type: 'select', options: [
      { value: 'Accepted', label: 'قبول' },
      { value: 'Rejected', label: 'رد' },
      { value: 'Pending', label: 'در انتظار' },
    ]},
    { key: 'Remark', title: 'توضیحات', type: 'text' },
  ],
  createdAt: '1403/08/01',
  updatedAt: '1403/08/01',
};

// ============================================
// الگوی فرم تراکنش‌های انبار
// ============================================
const inventoryTemplate: FormTemplate = {
  formId: 'warehouse-transactions',
  formName: 'تراکنش‌های انبار',
  version: '1.0.0',
  description: 'ثبت ورود و خروج متریال از انبار',
  primaryKey: 'TransactionID',
  uniqueFields: ['TransactionID', 'DocumentNumber'],
  columns: [
    { key: 'Row', title: 'ردیف', type: 'number' },
    { key: 'TransactionID', title: 'شماره تراکنش', type: 'text', required: true, unique: true },
    { key: 'ProjectID', title: 'کد پروژه', type: 'text', required: true },
    { key: 'TransactionType', title: 'نوع تراکنش', type: 'select', required: true, options: [
      { value: 'in', label: 'ورود' },
      { value: 'out', label: 'خروج' },
      { value: 'return', label: 'برگشت' },
      { value: 'transfer', label: 'انتقال' },
    ]},
    { key: 'TransactionDate', title: 'تاریخ تراکنش', type: 'date', required: true },
    { key: 'DocumentNumber', title: 'شماره سند', type: 'text', required: true, unique: true },
    { key: 'SupplierOrSource', title: 'تامین‌کننده/منبع', type: 'text' },
    { key: 'ItemNo', title: 'شماره آیتم', type: 'text' },
    { key: 'Object', title: 'Object', type: 'text' },
    { key: 'ObjectSize', title: 'سایز', type: 'text' },
    { key: 'MaterialDescription', title: 'توضیحات متریال', type: 'text' },
    { key: 'HeatNumber', title: 'شماره Heat', type: 'text' },
    { key: 'BatchOrLotNumber', title: 'شماره Batch/Lot', type: 'text' },
    { key: 'MTCNumber', title: 'شماره MTC', type: 'text' },
    { key: 'QuantityIn', title: 'مقدار ورودی', type: 'text' },
    { key: 'QuantityOut', title: 'مقدار خروجی', type: 'text' },
    { key: 'Unit', title: 'واحد', type: 'text' },
    { key: 'ReservationID', title: 'شناسه رزرو', type: 'text' },
    { key: 'DestinationIsoID', title: 'مقصد (ISO)', type: 'text' },
    { key: 'DestinationLineID', title: 'مقصد (Line)', type: 'text' },
    { key: 'QCStatus', title: 'وضعیت QC', type: 'select', options: [
      { value: 'free', label: 'آزاد' },
      { value: 'quarantine', label: 'قرنطینه' },
      { value: 'rejected', label: 'رد شده' },
    ]},
    { key: 'RecordedBy', title: 'ثبت‌کننده', type: 'text' },
    { key: 'ApprovedBy', title: 'تأییدکننده', type: 'text' },
    { key: 'Remarks', title: 'توضیحات', type: 'text' },
  ],
  createdAt: '1403/08/01',
  updatedAt: '1403/08/01',
};

// ============================================
// الگوی فرم گزارش روزانه
// ============================================
const dailyReportTemplate: FormTemplate = {
  formId: 'control-daily',
  formName: 'گزارش روزانه',
  version: '1.0.0',
  description: 'گزارش پیشرفت روزانه پروژه',
  primaryKey: 'DailyReportID',
  uniqueFields: ['DailyReportID'],
  columns: [
    { key: 'DailyReportID', title: 'شماره گزارش', type: 'text', required: true, unique: true },
    { key: 'ReportDate', title: 'تاریخ گزارش', type: 'date', required: true },
    { key: 'ProjectID', title: 'کد پروژه', type: 'text', required: true },
    { key: 'AreaUnit', title: 'یونیت/ناحیه', type: 'text' },
    { key: 'ContractorID', title: 'پیمانکار', type: 'text' },
    { key: 'PlannedFitupQty', title: 'فیتاپ برنامه‌ای', type: 'number' },
    { key: 'ActualFitupQty', title: 'فیتاپ واقعی', type: 'number' },
    { key: 'PlannedWeldQty', title: 'جوش برنامه‌ای', type: 'number' },
    { key: 'ActualWeldQty', title: 'جوش واقعی', type: 'number' },
    { key: 'ActualWeldInchDia', title: 'جوش (اینچ-قطر)', type: 'number' },
    { key: 'NDTRequestedQty', title: 'NDT درخواستی', type: 'number' },
    { key: 'NDTAcceptedQty', title: 'NDT قبول', type: 'number' },
    { key: 'NDTRejectedQty', title: 'NDT رد', type: 'number' },
    { key: 'ManpowerCount', title: 'تعداد نیرو', type: 'number' },
    { key: 'DelayReasonCode', title: 'کد تأخیر', type: 'text' },
    { key: 'Remarks', title: 'توضیحات', type: 'text' },
  ],
  createdAt: '1403/08/01',
  updatedAt: '1403/08/01',
};

// ============================================
// الگوی فرم پرسنل
// ============================================
const personnelTemplate: FormTemplate = {
  formId: 'personnel-list',
  formName: 'لیست کارکنان',
  version: '1.0.0',
  description: 'اطلاعات پرسنلی کارکنان پروژه',
  primaryKey: 'PersonnelCode',
  uniqueFields: ['PersonnelCode', 'NationalCode'],
  columns: [
    { key: 'PersonnelCode', title: 'کد پرسنلی', type: 'text', required: true, unique: true },
    { key: 'FirstName', title: 'نام', type: 'text', required: true },
    { key: 'LastName', title: 'نام خانوادگی', type: 'text', required: true },
    { key: 'NationalCode', title: 'کد ملی', type: 'text', unique: true },
    { key: 'Department', title: 'واحد سازمانی', type: 'text' },
    { key: 'Position', title: 'سمت', type: 'text' },
    { key: 'EmploymentDate', title: 'تاریخ استخدام', type: 'date' },
    { key: 'PhoneNumber', title: 'شماره تماس', type: 'text' },
    { key: 'EmergencyContact', title: 'تماس اضطراری', type: 'text' },
    { key: 'Certifications', title: 'گواهینامه‌ها', type: 'text' },
    { key: 'Remarks', title: 'توضیحات', type: 'text' },
  ],
  createdAt: '1403/08/01',
  updatedAt: '1403/08/01',
};

// ============================================
// ثبت تمام الگوها
// ============================================
export function registerAllFormTemplates(): void {
  FormTemplateRegistry.register(projectTemplate);
  FormTemplateRegistry.register(qcJointHistoryTemplate);
  FormTemplateRegistry.register(weldersTemplate);
  FormTemplateRegistry.register(inventoryTemplate);
  FormTemplateRegistry.register(dailyReportTemplate);
  FormTemplateRegistry.register(personnelTemplate);
  
  console.log(`[FormTemplateRegistry] ${FormTemplateRegistry.getAll().length} الگوی فرم ثبت شد`);
}

/**
 * تعریف انواع داده (Types) برای سیستم کنترل پروژه پایپینگ
 * این فایل شامل تمامی اینترفیس‌ها و تایپ‌های مشترک است
 */

// ============================================
// انواع مشترک
// ============================================
export interface BaseEntity {
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  isActive: boolean;
}

export interface SelectOption {
  value: string;
  label: string;
}

// ============================================
// جدول اول: مشخصات پروژه — tblProjects
// ============================================
export interface Project extends BaseEntity {
  ProjectID: string;
  ProjectCode: string;
  ProjectName: string;
  ClientName: string;
  MainContractor: string;
  Subcontractor: string;
  SiteLocation: string;
  StartDate: string;
  PlannedFinishDate: string;
  ActualFinishDate: string;
  ProjectStatus: 'active' | 'stopped' | 'completed';
  RevisionPolicy: string;
}

// ============================================
// جدول دوم: جوینت هیستوری QC — tblJH-Qc
// ============================================
export interface QCJointHistory extends BaseEntity {
  Row: number;
  UnitName: string;
  AreaNo: string;
  ProjectID: string;
  IsoNo: string;
  LineNo: string;
  JointNo: string;
  ActiveJoint: 0 | 1;
  SizeJoint: string;
  CalSize: string;
  Revision: string;
  Sheet: string;
  Sch: string;
  Thk: string;
  JointType: string;
  Service: string;
  SpoolNo: string;
  Place: 'Shop' | 'Site' | '';
  PipeClass: string;
  MaterialType: string;
  NDTPercent: string;
  TestPackage: string;
  KeyJoint: string;
  LineStatus: string;
  // Fitup
  FitupReportNo: string;
  FitupReportDate: string;
  FitupInspectionStatus: string;
  FitupSubContractor: string;
  FitterID: string;
  RemarkFitup: string;
  // Weld
  WeldReportNo: string;
  WeldReportDate: string;
  WeldInspectionStatus: string;
  WelderStamp1: string;
  WelderStamp2: string;
  WeldSubContractor: string;
  WPSRequired: string;
  RemarkWeld: string;
  // Erection
  ErectionRepNo: string;
  ErectionRepDate: string;
  ErcRemark: string;
  // NDT
  NDTTestType: string;
  NDTNo1: string;
  NDTReqNo1: string;
  NDTReqDate1: string;
  NDTResNo: string;
  NDTResDate1: string;
  NDTStatus: string;
  Deffect: string;
  PWHT: string;
  Remark: string;
}

// ============================================
// جدول سوم: کنترل جوشکارها — tblWelders
// ============================================
export interface Welder extends BaseEntity {
  WelderStamp: string;
  WelderName: string;
  WQTNo: string;
  WQTDate: string;
  Process: string;
  WeldPosition: string;
  MaterialType: string;
  PipePlateSize: string;
  ElectrodeType: string;
  FNo: string;
  ANo: string;
  THK: string;
  THKApproved: string;
  SizeApproved: string;
  QualificationRef: string;
  WQTNDTNo: string;
  NDTReqNo: string;
  NDTReqDate: string;
  NDTResNo: string;
  NDTResDate: string;
  NDTStatus: string;
  Remark: string;
}

// ============================================
// جدول چهارم: جوینت هیستوری دفترفنی — tblJointHistory
// ============================================
export interface OfficeJointHistory extends BaseEntity {
  Row: number;
  UnitName: string;
  AreaNo: string;
  ProjectID: string;
  UnitSubcontractor: string;
  PIDNo: string;
  IsoNo: string;
  LineNo: string;
  JointNo: string;
  ActiveJoint: 0 | 1;
  SizeJoint: string;
  CalSize: string;
  Rev: string;
  Sheet: string;
  Sch: string;
  Thk: string;
  JointType: string;
  MaterialType: string;
  Service: string;
  SpoolNo: string;
  Place: 'Shop' | 'Site' | '';
  FFW: string;
  PipeClass: string;
  Priority: string;
  NDTPercent: string;
  TestPackage: string;
  KeyJoint: string;
  StatusJoint: 'Worked' | 'Front' | 'Shortage' | '';
  PTNo1: string;
  Object1: string;
  PTNo2: string;
  Object2: string;
  CUT1: string;
  CUT2: string;
  ItemNo1: string;
  ItemNo2: string;
  MTO1: string;
  MTO2: string;
  USED1: string;
  USED2: string;
  ConnectOn: string;
  ConnectTo: string;
  PTLink1: string;
  PTLink2: string;
}

// ============================================
// جدول پنجم: MTO — tblMTOItems
// ============================================
export interface MTOItem extends BaseEntity {
  Row: number;
  UnitName: string;
  AreaNo: string;
  ProjectID: string;
  PIDNo: string;
  IsoNo: string;
  LineNo: string;
  LineSize: string;
  Rev: string;
  MTORevision: string;
  Sheet: string;
  PTNo: string;
  MaterialDescription: string;
  MaterialGrade: string;
  Object: string;
  MatType: string;
  UNI: string;
  Rating: string;
  Service: string;
  ObjectSize: string;
  RequiredQty: string;
  IssuedQty: string;
  InstalledQty: string;
  ItemNo: string;
  Size1: string;
  Size2: string;
  HeatNo: string;
  LotNo: string;
  BachNo: string;
  PTLink1: string;
  PTLink2: string;
}

// ============================================
// جدول ششم: انبار — tblInventoryTransactions
// ============================================
export interface InventoryTransaction extends BaseEntity {
  Row: number;
  TransactionID: string;
  ProjectID: string;
  TransactionType: 'in' | 'out' | 'return' | 'transfer';
  TransactionDate: string;
  DocumentNumber: string;
  SupplierOrSource: string;
  ItemNo: string;
  Object: string;
  ObjectSize: string;
  MaterialDescription: string;
  HeatNumber: string;
  BatchOrLotNumber: string;
  MTCNumber: string;
  QuantityIn: string;
  QuantityOut: string;
  Unit: string;
  ReservationID: string;
  DestinationIsoID: string;
  DestinationLineID: string;
  QCStatus: 'free' | 'quarantine' | 'rejected';
  RecordedBy: string;
  ApprovedBy: string;
  Remarks: string;
}

// ============================================
// جدول هفتم: کسری و خرید — tblMaterialShortage
// ============================================
export interface MaterialShortage extends BaseEntity {
  ShortageID: string;
  ProjectID: string;
  ItemCode: string;
  IsoID: string;
  RequiredQty: string;
  AvailableQty: string;
  ReservedQty: string;
  ShortageQty: string;
  ExcessQty: string;
  PurchaseRequestNo: string;
  PurchaseOrderNo: string;
  ExpectedDeliveryDate: string;
  ProcurementStatus: string;
  Criticality: string;
  LastCalculatedAt: string;
}

// ============================================
// جدول هشتم: رزرو متریال — tblMaterialReservations
// ============================================
export interface MaterialReservation extends BaseEntity {
  ReservationID: string;
  ProjectID: string;
  ItemCode: string;
  IsoID: string;
  LineID: string;
  RequiredQty: string;
  ReservedQty: string;
  IssuedQty: string;
  ReturnedQty: string;
  ReservationDate: string;
  ReservationStatus: 'active' | 'partial' | 'released' | 'closed';
  Remarks: string;
}

// ============================================
// جدول نهم: گزارش روزانه — tblDailyProgress
// ============================================
export interface DailyProgress extends BaseEntity {
  DailyReportID: string;
  ReportDate: string;
  ProjectID: string;
  AreaUnit: string;
  ContractorID: string;
  PlannedFitupQty: string;
  ActualFitupQty: string;
  PlannedWeldQty: string;
  ActualWeldQty: string;
  ActualWeldInchDia: string;
  NDTRequestedQty: string;
  NDTAcceptedQty: string;
  NDTRejectedQty: string;
  ManpowerCount: string;
  DelayReasonCode: string;
  Remarks: string;
}

// ============================================
// انواع منو
// ============================================
export interface MenuItem {
  id: string;
  title: string;
  icon?: string;
  children?: MenuItem[];
}

// ============================================
// انواع DataGrid
// ============================================
export interface Column<T> {
  key: keyof T | string;
  title: string;
  width?: number;
  sortable?: boolean;
  filterable?: boolean;
  type?: 'text' | 'number' | 'date' | 'select' | 'boolean';
  options?: SelectOption[];
  render?: (value: any, row: T) => React.ReactNode;
  editable?: boolean;
  required?: boolean;
  unique?: boolean; // فیلد یکتا برای جلوگیری از تکرار
  defaultValue?: any;
  description?: string;
}

// ============================================
// الگوی استاندارد فرم (Form Template)
// ============================================
export interface FormTemplate<T = any> {
  formId: string;           // شناسه یکتای فرم
  formName: string;         // نام نمایشی فرم
  version: string;          // نسخه الگو
  description?: string;
  columns: Column<T>[];     // ستون‌های فرم
  primaryKey: keyof T | string; // کلید اصلی
  uniqueFields?: (keyof T | string)[]; // فیلدهای یکتا
  validators?: Record<string, (value: any, row: Partial<T>) => string | null>;
  defaultValues?: Partial<T>;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// نتیجه عملیات Import
// ============================================
export interface ImportOperationResult<T = any> {
  success: boolean;
  formId: string;
  formName: string;
  totalRows: number;
  validRows: number;
  invalidRows: number;
  insertedRows: number;
  updatedRows: number;
  skippedRows: number;
  duplicateRows: number;
  errors: ImportRowError[];
  warnings: ImportRowWarning[];
  data: Partial<T>[];
  timestamp: string;
}

export interface ImportRowError {
  row: number;
  field: string;
  message: string;
  value?: any;
  severity: 'error' | 'warning';
}

export interface ImportRowWarning {
  row: number;
  field: string;
  message: string;
  value?: any;
}

// ============================================
// متادیتای فرم در فایل Excel
// ============================================
export interface FormMetadata {
  formId: string;
  formName: string;
  version: string;
  columnKeys: string[];
  columnTitles: string[];
  primaryKey: string;
  exportedAt: string;
  exportedBy: string;
  totalRecords: number;
}

export interface TableConfig<T> {
  columns: Column<T>[];
  title: string;
  description?: string;
  primaryKey: keyof T;
}

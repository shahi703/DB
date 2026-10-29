/**
 * ماژول واحد QC - شامل داشبورد و زیرصفحات با تب
 */
import { useState } from 'react';
import { DataGrid } from '../components/DataGrid';
import { AddRecordModal } from '../components/AddRecordModal';
import { QCJointHistory, Welder, Column } from '../types';
import { sampleQCJoints, sampleWelders } from '../data/sampleData';
import { Shield, ClipboardList, Users, FileBarChart, Activity, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface QCModuleProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'qc-dashboard', title: 'داشبورد QC', icon: <Activity size={16} /> },
  { id: 'qc-joint-history', title: 'جوینت هیستوری', icon: <ClipboardList size={16} /> },
  { id: 'qc-welders', title: 'جوشکاران', icon: <Users size={16} /> },
  { id: 'qc-reports', title: 'گزارشات', icon: <FileBarChart size={16} /> },
];

export function QCModule({ activeTab, onTabChange }: QCModuleProps) {
  const [joints, setJoints] = useState<QCJointHistory[]>(sampleQCJoints);
  const [welders, setWelders] = useState<Welder[]>(sampleWelders);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addModalType, setAddModalType] = useState<string>('');

  const handleAdd = (type: string) => {
    setAddModalType(type);
    setShowAddModal(true);
  };

  // آمار داشبورد
  const totalJoints = joints.length;
  const activeJoints = joints.filter(j => j.ActiveJoint === 1).length;
  const fitupDone = joints.filter(j => j.FitupReportNo).length;
  const weldDone = joints.filter(j => j.WeldReportNo).length;
  const ndtAccepted = joints.filter(j => j.NDTStatus === 'Accepted').length;
  const ndtRejected = joints.filter(j => j.NDTStatus === 'Rejected').length;
  const ndtPending = joints.filter(j => j.ActiveJoint === 1 && !j.NDTStatus).length;

  const jointColumns: Column<QCJointHistory>[] = [
    { key: 'Row', title: 'ردیف', width: 60 },
    { key: 'LineNo', title: 'شماره خط', sortable: true },
    { key: 'JointNo', title: 'شماره جوینت', sortable: true },
    { key: 'IsoNo', title: 'آیزومتریک', sortable: true },
    { key: 'SizeJoint', title: 'سایز', width: 80 },
    { key: 'Thk', title: 'ضخامت', width: 80 },
    { key: 'JointType', title: 'نوع اتصال', width: 100 },
    { key: 'MaterialType', title: 'متریال', width: 100 },
    {
      key: 'ActiveJoint',
      title: 'فعال',
      width: 80,
      render: (value: 0 | 1) => (
        <span
          className="px-2 py-1 rounded text-xs font-medium"
          style={{
            backgroundColor: value === 1 ? 'var(--color-success-bg)' : 'var(--color-error-bg)',
            color: value === 1 ? 'var(--color-success)' : 'var(--color-error)',
          }}
        >
          {value === 1 ? 'بله' : 'خیر'}
        </span>
      ),
    },
    {
      key: 'FitupReportNo',
      title: 'فیتاپ',
      width: 100,
      render: (value: string) =>
        value ? (
          <span style={{ color: 'var(--color-success)' }}>✓ {value}</span>
        ) : (
          <span style={{ color: 'var(--color-text-muted)' }}>—</span>
        ),
    },
    {
      key: 'WeldReportNo',
      title: 'جوش',
      width: 100,
      render: (value: string) =>
        value ? (
          <span style={{ color: 'var(--color-success)' }}>✓ {value}</span>
        ) : (
          <span style={{ color: 'var(--color-text-muted)' }}>—</span>
        ),
    },
    {
      key: 'NDTStatus',
      title: 'NDT',
      width: 100,
      render: (value: string) => {
        if (!value) return <span style={{ color: 'var(--color-text-muted)' }}>—</span>;
        const isAccepted = value === 'Accepted';
        return (
          <span
            className="px-2 py-1 rounded text-xs font-medium"
            style={{
              backgroundColor: isAccepted ? 'var(--color-success-bg)' : 'var(--color-error-bg)',
              color: isAccepted ? 'var(--color-success)' : 'var(--color-error)',
            }}
          >
            {isAccepted ? 'قبول' : 'رد'}
          </span>
        );
      },
    },
    { key: 'Place', title: 'محل', width: 80 },
    { key: 'PipeClass', title: 'کلاس', width: 80 },
  ];

  const welderColumns: Column<Welder>[] = [
    { key: 'WelderStamp', title: 'کد جوشکار', sortable: true },
    { key: 'WelderName', title: 'نام جوشکار', sortable: true },
    { key: 'WQTNo', title: 'شماره WQT', sortable: true },
    { key: 'WQTDate', title: 'تاریخ WQT', sortable: true },
    { key: 'Process', title: 'فرآیند', sortable: true },
    { key: 'WeldPosition', title: 'پوزیشن', sortable: true },
    { key: 'MaterialType', title: 'متریال', sortable: true },
    { key: 'PipePlateSize', title: 'سایز', sortable: true },
    { key: 'ElectrodeType', title: 'الکترود', sortable: true },
    {
      key: 'NDTStatus',
      title: 'وضعیت NDT',
      render: (value: string) => {
        const isAccepted = value === 'Accepted';
        return (
          <span
            className="px-2 py-1 rounded text-xs font-medium"
            style={{
              backgroundColor: isAccepted ? 'var(--color-success-bg)' : 'var(--color-error-bg)',
              color: isAccepted ? 'var(--color-success)' : 'var(--color-error)',
            }}
          >
            {isAccepted ? 'قبول' : 'رد'}
          </span>
        );
      },
    },
    { key: 'THKApproved', title: 'ضخامت مجاز', sortable: true },
    { key: 'SizeApproved', title: 'سایز مجاز', sortable: true },
  ];

  const handleSaveRecord = (data: Record<string, any>) => {
    if (addModalType === 'joint') {
      const newJoint: QCJointHistory = {
        Row: joints.length + 1,
        UnitName: data.UnitName || '',
        AreaNo: data.AreaNo || '',
        ProjectID: data.ProjectID || '',
        IsoNo: data.IsoNo || '',
        LineNo: data.LineNo || '',
        JointNo: data.JointNo || '',
        ActiveJoint: 1,
        SizeJoint: data.SizeJoint || '',
        CalSize: data.CalSize || '',
        Revision: data.Revision || '',
        Sheet: data.Sheet || '',
        Sch: data.Sch || '',
        Thk: data.Thk || '',
        JointType: data.JointType || '',
        Service: data.Service || '',
        SpoolNo: data.SpoolNo || '',
        Place: data.Place || '',
        PipeClass: data.PipeClass || '',
        MaterialType: data.MaterialType || '',
        NDTPercent: data.NDTPercent || '',
        TestPackage: data.TestPackage || '',
        KeyJoint: data.KeyJoint || '',
        LineStatus: data.LineStatus || '',
        FitupReportNo: '',
        FitupReportDate: '',
        FitupInspectionStatus: '',
        FitupSubContractor: '',
        FitterID: '',
        RemarkFitup: '',
        WeldReportNo: '',
        WeldReportDate: '',
        WeldInspectionStatus: '',
        WelderStamp1: '',
        WelderStamp2: '',
        WeldSubContractor: '',
        WPSRequired: '',
        RemarkWeld: '',
        ErectionRepNo: '',
        ErectionRepDate: '',
        ErcRemark: '',
        NDTTestType: '',
        NDTNo1: '',
        NDTReqNo1: '',
        NDTReqDate1: '',
        NDTResNo: '',
        NDTResDate1: '',
        NDTStatus: '',
        Deffect: '',
        PWHT: '',
        Remark: '',
        createdAt: new Date().toLocaleDateString('fa-IR'),
        updatedAt: new Date().toLocaleDateString('fa-IR'),
        createdBy: 'current_user',
        updatedBy: 'current_user',
        isActive: true,
      };
      setJoints([...joints, newJoint]);
    } else if (addModalType === 'welder') {
      const newWelder: Welder = {
        WelderStamp: data.WelderStamp || '',
        WelderName: data.WelderName || '',
        WQTNo: data.WQTNo || '',
        WQTDate: data.WQTDate || '',
        Process: data.Process || '',
        WeldPosition: data.WeldPosition || '',
        MaterialType: data.MaterialType || '',
        PipePlateSize: data.PipePlateSize || '',
        ElectrodeType: data.ElectrodeType || '',
        FNo: data.FNo || '',
        ANo: data.ANo || '',
        THK: data.THK || '',
        THKApproved: data.THKApproved || '',
        SizeApproved: data.SizeApproved || '',
        QualificationRef: data.QualificationRef || '',
        WQTNDTNo: '',
        NDTReqNo: '',
        NDTReqDate: '',
        NDTResNo: '',
        NDTResDate: '',
        NDTStatus: '',
        Remark: data.Remark || '',
        createdAt: new Date().toLocaleDateString('fa-IR'),
        updatedAt: new Date().toLocaleDateString('fa-IR'),
        createdBy: 'current_user',
        updatedBy: 'current_user',
        isActive: true,
      };
      setWelders([...welders, newWelder]);
    }
    setShowAddModal(false);
  };

  return (
    <div className="animate-fade-in">
      {/* تب‌های واحد QC */}
      <div className="flex flex-wrap gap-2 mb-6 p-2 rounded-xl" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
        <div className="flex items-center gap-2 px-3 py-2">
          <Shield size={18} style={{ color: 'var(--color-brand)' }} />
          <span className="font-bold text-sm" style={{ color: 'var(--color-text-primary)' }}>واحد QC</span>
        </div>
        <div className="w-px h-8 self-center" style={{ backgroundColor: 'var(--color-border)' }} />
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'text-white shadow-md'
                : 'hover:bg-white/10'
            }`}
            style={
              activeTab === tab.id
                ? { background: 'linear-gradient(135deg, #4C35A3, #6652C7)', color: '#fff' }
                : { color: 'var(--color-text-secondary)' }
            }
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.title}</span>
          </button>
        ))}
      </div>

      {/* محتوای تب */}
      {(activeTab === 'qc-dashboard' || activeTab === 'qc') && (
        <div className="space-y-6">
          {/* کارت‌های آماری */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              title="کل جوینت‌ها"
              value={totalJoints}
              icon={<ClipboardList size={20} />}
              color="blue"
            />
            <StatCard
              title="فیتاپ انجام‌شده"
              value={fitupDone}
              subtitle={`${Math.round((fitupDone / totalJoints) * 100)}%`}
              icon={<CheckCircle size={20} />}
              color="green"
            />
            <StatCard
              title="جوشکاری انجام‌شده"
              value={weldDone}
              subtitle={`${Math.round((weldDone / totalJoints) * 100)}%`}
              icon={<CheckCircle size={20} />}
              color="purple"
            />
            <StatCard
              title="NDT قبول"
              value={ndtAccepted}
              subtitle={`${ndtRejected} رد`}
              icon={<Activity size={20} />}
              color="emerald"
            />
          </div>

          {/* نمودار پیشرفت */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
              <h3 className="font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>پیشرفت فرآیندها</h3>
              <div className="space-y-4">
                <ProgressBar label="فیتاپ" value={fitupDone} max={totalJoints} color="#4C35A3" />
                <ProgressBar label="جوشکاری" value={weldDone} max={totalJoints} color="#6B55BA" />
                <ProgressBar label="NDT قبول" value={ndtAccepted} max={totalJoints} color="#16A34A" />
                <ProgressBar label="NDT رد" value={ndtRejected} max={totalJoints} color="#DC2626" />
              </div>
            </div>

            <div className="p-5 rounded-xl" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
              <h3 className="font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>وضعیت NDT</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: 'var(--color-success-bg)' }}>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} style={{ color: 'var(--color-success)' }} />
                    <span className="text-sm" style={{ color: 'var(--color-success)' }}>قبول</span>
                  </div>
                  <span className="font-bold" style={{ color: 'var(--color-success)' }}>{ndtAccepted}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: 'var(--color-error-bg)' }}>
                  <div className="flex items-center gap-2">
                    <XCircle size={16} style={{ color: 'var(--color-error)' }} />
                    <span className="text-sm" style={{ color: 'var(--color-error)' }}>رد</span>
                  </div>
                  <span className="font-bold" style={{ color: 'var(--color-error)' }}>{ndtRejected}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: 'var(--color-warning-bg)' }}>
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={16} style={{ color: 'var(--color-warning)' }} />
                    <span className="text-sm" style={{ color: 'var(--color-warning)' }}>در انتظار</span>
                  </div>
                  <span className="font-bold" style={{ color: 'var(--color-warning)' }}>{ndtPending}</span>
                </div>
              </div>
            </div>
          </div>

          {/* خلاصه جوشکاران */}
          <div className="p-5 rounded-xl" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
            <h3 className="font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>خلاصه وضعیت جوشکاران</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'var(--color-highlight)' }}>
                <p className="text-2xl font-bold" style={{ color: 'var(--color-brand)' }}>{welders.length}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>کل جوشکاران</p>
              </div>
              <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'var(--color-success-bg)' }}>
                <p className="text-2xl font-bold" style={{ color: 'var(--color-success)' }}>
                  {welders.filter(w => w.NDTStatus === 'Accepted').length}
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>صلاحیت فعال</p>
              </div>
              <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'var(--color-highlight)' }}>
                <p className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                  {new Set(welders.map(w => w.Process)).size}
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>فرآیند مختلف</p>
              </div>
              <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'var(--color-highlight)' }}>
                <p className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                  {new Set(welders.map(w => w.WeldPosition)).size}
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>پوزیشن مختلف</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'qc-joint-history' && (
        <DataGrid
          columns={jointColumns}
          data={joints}
          title="جوینت هیستوری QC"
          description="مدیریت و پیگیری وضعیت جوینت‌های واحد کنترل کیفیت"
          primaryKey="Row"
          formId="qc-joint-history"
          onAdd={() => handleAdd('joint')}
          onEdit={(joint) => handleAdd('joint')}
          onDelete={(joint) => setJoints(joints.filter(j => j.Row !== joint.Row))}
        />
      )}

      {activeTab === 'qc-welders' && (
        <DataGrid
          columns={welderColumns}
          data={welders}
          title="اطلاعات جوشکاران"
          description="مدیریت صلاحیت‌ها و اطلاعات جوشکاران پروژه"
          primaryKey="WelderStamp"
          formId="qc-welders"
          onAdd={() => handleAdd('welder')}
          onEdit={(welder) => handleAdd('welder')}
          onDelete={(welder) => setWelders(welders.filter(w => w.WelderStamp !== welder.WelderStamp))}
        />
      )}

      {activeTab === 'qc-reports' && (
        <div className="p-8 rounded-xl text-center" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <FileBarChart size={48} className="mx-auto mb-4" style={{ color: 'var(--color-text-muted)' }} />
          <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>گزارشات QC</h3>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            گزارش‌های جامع واحد کنترل کیفیت شامل آمار فیتاپ، جوشکاری و NDT
          </p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              className="p-4 rounded-xl transition-all hover:scale-105"
              style={{ backgroundColor: 'var(--color-highlight)', border: '1px solid var(--color-border)' }}
            >
              <p className="font-bold text-sm" style={{ color: 'var(--color-text-primary)' }}>گزارش فیتاپ</p>
              <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>{fitupDone} مورد انجام شده</p>
            </button>
            <button
              className="p-4 rounded-xl transition-all hover:scale-105"
              style={{ backgroundColor: 'var(--color-highlight)', border: '1px solid var(--color-border)' }}
            >
              <p className="font-bold text-sm" style={{ color: 'var(--color-text-primary)' }}>گزارش جوشکاری</p>
              <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>{weldDone} مورد انجام شده</p>
            </button>
            <button
              className="p-4 rounded-xl transition-all hover:scale-105"
              style={{ backgroundColor: 'var(--color-highlight)', border: '1px solid var(--color-border)' }}
            >
              <p className="font-bold text-sm" style={{ color: 'var(--color-text-primary)' }}>گزارش NDT</p>
              <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>{ndtAccepted + ndtRejected} مورد تست شده</p>
            </button>
          </div>
        </div>
      )}

      {/* مودال افزودن */}
      {showAddModal && (
        <AddRecordModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          type={addModalType}
          onSave={handleSaveRecord}
        />
      )}
    </div>
  );
}

// کامپوننت کارت آماری
function StatCard({ title, value, subtitle, icon, color }: {
  title: string;
  value: number;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
}) {
  const colorMap: Record<string, { bg: string; text: string; icon: string }> = {
    blue: { bg: 'rgba(59,130,246,0.1)', text: '#3B82F6', icon: '#3B82F6' },
    green: { bg: 'rgba(22,163,74,0.1)', text: '#16A34A', icon: '#16A34A' },
    purple: { bg: 'rgba(76,53,163,0.1)', text: '#4C35A3', icon: '#4C35A3' },
    emerald: { bg: 'rgba(16,185,129,0.1)', text: '#10B981', icon: '#10B981' },
  };
  const c = colorMap[color] || colorMap.blue;

  return (
    <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{title}</span>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: c.bg, color: c.icon }}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold" style={{ color: c.text }}>{value}</p>
      {subtitle && <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>{subtitle}</p>}
    </div>
  );
}

// کامپوننت نوار پیشرفت
function ProgressBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const percent = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span style={{ color: 'var(--color-text-secondary)' }}>{label}</span>
        <span style={{ color: 'var(--color-text-primary)' }}>{value}/{max} ({percent}%)</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-highlight)' }}>
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${percent}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

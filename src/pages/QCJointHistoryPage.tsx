/**
 * صفحه جوینت هیستوری QC
 * قلب و مغز واحد QC
 */
import { useState } from 'react';
import { DataGrid } from '../components/DataGrid';
import { QCJointHistory, Column } from '../types';
import { sampleQCJoints } from '../data/sampleData';

export function QCJointHistoryPage() {
  const [joints, setJoints] = useState<QCJointHistory[]>(sampleQCJoints);

  const columns: Column<QCJointHistory>[] = [
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

  const handleAdd = () => {
    alert('فرم افزودن جوینت جدید');
  };

  const handleEdit = (joint: QCJointHistory) => {
    alert(`ویرایش جوینت: ${joint.JointNo} - خط: ${joint.LineNo}`);
  };

  const handleDelete = (joint: QCJointHistory) => {
    setJoints(joints.filter((j) => j.Row !== joint.Row));
  };

  return (
    <div>
      {/* آمار سریع */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'کل جوینت‌ها', value: joints.length, color: 'var(--color-brand)' },
          { label: 'فیتاپ شده', value: joints.filter((j) => j.FitupReportNo).length, color: 'var(--color-success)' },
          { label: 'جوش شده', value: joints.filter((j) => j.WeldReportNo).length, color: 'var(--color-success)' },
          { label: 'NDT قبول', value: joints.filter((j) => j.NDTStatus === 'Accepted').length, color: 'var(--color-success)' },
        ].map((stat, i) => (
          <div
            key={i}
            className="p-4 rounded-xl"
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
            }}
          >
            <p className="text-xs mb-1" style={{ color: 'var(--color-text-secondary)' }}>
              {stat.label}
            </p>
            <p className="text-2xl font-bold" style={{ color: stat.color }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <DataGrid
        columns={columns}
        data={joints}
        title="جوینت هیستوری QC"
        description="مدیریت وضعیت فیتاپ، جوش و NDT جوینت‌ها"
        primaryKey="Row"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

/**
 * صفحه اطلاعات جوشکاران
 */
import { useState } from 'react';
import { DataGrid } from '../components/DataGrid';
import { Welder, Column } from '../types';
import { sampleWelders } from '../data/sampleData';

export function WeldersPage() {
  const [welders, setWelders] = useState<Welder[]>(sampleWelders);

  const columns: Column<Welder>[] = [
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

  const handleAdd = () => {
    alert('فرم افزودن جوشکار جدید');
  };

  const handleEdit = (welder: Welder) => {
    alert(`ویرایش جوشکار: ${welder.WelderName}`);
  };

  const handleDelete = (welder: Welder) => {
    setWelders(welders.filter((w) => w.WelderStamp !== welder.WelderStamp));
  };

  return (
    <DataGrid
      columns={columns}
      data={welders}
      title="اطلاعات جوشکاران"
      description="مدیریت صلاحیت‌ها و اطلاعات جوشکاران پروژه"
      primaryKey="WelderStamp"
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}

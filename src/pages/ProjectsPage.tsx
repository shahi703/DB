/**
 * صفحه لیست پروژه‌ها
 */
import { useState } from 'react';
import { DataGrid } from '../components/DataGrid';
import { Project, Column } from '../types';
import { sampleProjects } from '../data/sampleData';

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(sampleProjects);

  const columns: Column<Project>[] = [
    { key: 'ProjectCode', title: 'کد پروژه', sortable: true },
    { key: 'ProjectName', title: 'نام پروژه', sortable: true },
    { key: 'ClientName', title: 'کارفرما', sortable: true },
    { key: 'MainContractor', title: 'پیمانکار اصلی', sortable: true },
    { key: 'SiteLocation', title: 'محل پروژه', sortable: true },
    { key: 'StartDate', title: 'تاریخ شروع', sortable: true },
    { key: 'PlannedFinishDate', title: 'پایان برنامه‌ای', sortable: true },
    {
      key: 'ProjectStatus',
      title: 'وضعیت',
      sortable: true,
      render: (value: string) => {
        const statusMap = {
          active: { label: 'فعال', color: 'var(--color-success)' },
          stopped: { label: 'متوقف', color: 'var(--color-warning)' },
          completed: { label: 'تکمیل‌شده', color: 'var(--color-brand)' },
        };
        const status = statusMap[value as keyof typeof statusMap];
        return (
          <span
            className="px-3 py-1 rounded-full text-xs font-medium"
            style={{
              backgroundColor: `${status?.color}20`,
              color: status?.color,
            }}
          >
            {status?.label}
          </span>
        );
      },
    },
  ];

  const handleAdd = () => {
    // TODO: باز کردن Modal برای افزودن پروژه جدید
    alert('فرم افزودن پروژه جدید');
  };

  const handleEdit = (project: Project) => {
    // TODO: باز کردن Modal برای ویرایش پروژه
    alert(`ویرایش پروژه: ${project.ProjectName}`);
  };

  const handleDelete = (project: Project) => {
    setProjects(projects.filter((p) => p.ProjectID !== project.ProjectID));
  };

  return (
    <DataGrid
      columns={columns}
      data={projects}
      title="لیست پروژه‌ها"
      description="مدیریت اطلاعات عمومی پروژه‌های در حال اجرا"
      primaryKey="ProjectID"
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}

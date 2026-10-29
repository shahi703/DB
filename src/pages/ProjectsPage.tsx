/**
 * صفحه لیست پروژه‌ها
 */
import { useState } from 'react';
import { DataGrid } from '../components/DataGrid';
import { AddRecordModal } from '../components/AddRecordModal';
import { Project, Column } from '../types';
import { sampleProjects } from '../data/sampleData';
import { Settings } from 'lucide-react';

interface ProjectsPageProps {
  settingsMode?: boolean;
}

export function ProjectsPage({ settingsMode }: ProjectsPageProps) {
  const [projects, setProjects] = useState<Project[]>(sampleProjects);
  const [showAddModal, setShowAddModal] = useState(false);

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
    setShowAddModal(true);
  };

  const handleEdit = (project: Project) => {
    setShowAddModal(true);
  };

  const handleDelete = (project: Project) => {
    setProjects(projects.filter((p) => p.ProjectID !== project.ProjectID));
  };

  const handleSave = (data: Record<string, any>) => {
    const newProject: Project = {
      ProjectID: `PRJ-${String(projects.length + 1).padStart(3, '0')}`,
      ProjectCode: data.ProjectCode || '',
      ProjectName: data.ProjectName || '',
      ClientName: data.ClientName || '',
      MainContractor: data.MainContractor || '',
      Subcontractor: data.Subcontractor || '',
      SiteLocation: data.SiteLocation || '',
      StartDate: data.StartDate || '',
      PlannedFinishDate: data.PlannedFinishDate || '',
      ActualFinishDate: '',
      ProjectStatus: (data.ProjectStatus as 'active' | 'stopped' | 'completed') || 'active',
      RevisionPolicy: data.RevisionPolicy || '',
      createdAt: new Date().toLocaleDateString('fa-IR'),
      updatedAt: new Date().toLocaleDateString('fa-IR'),
      createdBy: 'current_user',
      updatedBy: 'current_user',
      isActive: true,
    };
    setProjects([...projects, newProject]);
    setShowAddModal(false);
  };

  if (settingsMode) {
    return (
      <div className="p-8 rounded-xl text-center" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
        <Settings size={48} className="mx-auto mb-4" style={{ color: 'var(--color-text-muted)' }} />
        <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>تنظیمات پروژه</h3>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          تنظیمات مربوط به تعریف پروژه‌ها و پارامترهای عمومی سیستم
        </p>
      </div>
    );
  }

  return (
    <>
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
      {showAddModal && (
        <AddRecordModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          type="project"
          onSave={handleSave}
        />
      )}
    </>
  );
}

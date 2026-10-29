/**
 * ماژول واحد دفترفنی - با تب
 */
import { useState } from 'react';
import { DataGrid } from '../components/DataGrid';
import { AddRecordModal } from '../components/AddRecordModal';
import { OfficeJointHistory, Column } from '../types';
import { FileText, ClipboardList, Package } from 'lucide-react';

interface OfficeModuleProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'office-joint-history', title: 'جوینت هیستوری دفترفنی', icon: <ClipboardList size={16} /> },
  { id: 'office-mto', title: 'MTO متریال', icon: <Package size={16} /> },
];

export function OfficeModule({ activeTab, onTabChange }: OfficeModuleProps) {
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAdd = () => {
    setShowAddModal(true);
  };

  const handleSave = (data: Record<string, any>) => {
    setShowAddModal(false);
  };

  return (
    <div className="animate-fade-in">
      {/* تب‌ها */}
      <div className="flex flex-wrap gap-2 mb-6 p-2 rounded-xl" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
        <div className="flex items-center gap-2 px-3 py-2">
          <FileText size={18} style={{ color: '#3B82F6' }} />
          <span className="font-bold text-sm" style={{ color: 'var(--color-text-primary)' }}>واحد دفترفنی</span>
        </div>
        <div className="w-px h-8 self-center" style={{ backgroundColor: 'var(--color-border)' }} />
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id ? 'text-white shadow-md' : 'hover:bg-white/10'
            }`}
            style={
              activeTab === tab.id
                ? { background: 'linear-gradient(135deg, #3B82F6, #2563EB)', color: '#fff' }
                : { color: 'var(--color-text-secondary)' }
            }
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.title}</span>
          </button>
        ))}
      </div>

      {/* محتوا */}
      {activeTab === 'office-joint-history' && (
        <div className="p-8 rounded-xl text-center" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <ClipboardList size={48} className="mx-auto mb-4" style={{ color: 'var(--color-text-muted)' }} />
          <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>جوینت هیستوری دفترفنی</h3>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            این جدول شامل اطلاعات کامل جوینت‌ها از دیدگاه دفترفنی است.
          </p>
          <button
            onClick={handleAdd}
            className="mt-4 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #3B82F6, #2563EB)' }}
          >
            افزودن رکورد جدید
          </button>
        </div>
      )}

      {activeTab === 'office-mto' && (
        <div className="p-8 rounded-xl text-center" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <Package size={48} className="mx-auto mb-4" style={{ color: 'var(--color-text-muted)' }} />
          <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>MTO متریال</h3>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            لیست متریال مورد نیاز (Material Take Off) برای پروژه.
          </p>
          <button
            onClick={handleAdd}
            className="mt-4 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #3B82F6, #2563EB)' }}
          >
            افزودن رکورد جدید
          </button>
        </div>
      )}

      {showAddModal && (
        <AddRecordModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          type="office_joint"
          onSave={handleSave}
        />
      )}
    </div>
  );
}

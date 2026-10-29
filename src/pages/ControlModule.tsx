/**
 * ماژول واحد کنترل پروژه - با تب
 */
import { useState } from 'react';
import { AddRecordModal } from '../components/AddRecordModal';
import { TrendingUp, Calendar, BarChart3 } from 'lucide-react';

interface ControlModuleProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'control-daily', title: 'گزارش روزانه', icon: <Calendar size={16} /> },
  { id: 'control-progress', title: 'پیشرفت پروژه', icon: <BarChart3 size={16} /> },
];

export function ControlModule({ activeTab, onTabChange }: ControlModuleProps) {
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAdd = () => setShowAddModal(true);
  const handleSave = (data: Record<string, any>) => setShowAddModal(false);

  return (
    <div className="animate-fade-in">
      {/* تب‌ها */}
      <div className="flex flex-wrap gap-2 mb-6 p-2 rounded-xl" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
        <div className="flex items-center gap-2 px-3 py-2">
          <TrendingUp size={18} style={{ color: '#D97706' }} />
          <span className="font-bold text-sm" style={{ color: 'var(--color-text-primary)' }}>کنترل پروژه</span>
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
                ? { background: 'linear-gradient(135deg, #D97706, #B45309)', color: '#fff' }
                : { color: 'var(--color-text-secondary)' }
            }
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.title}</span>
          </button>
        ))}
      </div>

      {/* محتوا */}
      <div className="p-8 rounded-xl text-center" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
        <TrendingUp size={48} className="mx-auto mb-4" style={{ color: 'var(--color-text-muted)' }} />
        <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
          {tabs.find(t => t.id === activeTab)?.title || 'کنترل پروژه'}
        </h3>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          گزارش‌های روزانه و تحلیل پیشرفت پروژه
        </p>
        <button
          onClick={handleAdd}
          className="mt-4 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all hover:scale-105"
          style={{ background: 'linear-gradient(135deg, #D97706, #B45309)' }}
        >
          افزودن گزارش جدید
        </button>
      </div>

      {showAddModal && (
        <AddRecordModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          type="daily_report"
          onSave={handleSave}
        />
      )}
    </div>
  );
}

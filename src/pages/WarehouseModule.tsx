/**
 * ماژول واحد انبار - با تب
 */
import { useState } from 'react';
import { AddRecordModal } from '../components/AddRecordModal';
import { Package, ArrowLeftRight, Boxes, AlertTriangle, Bookmark } from 'lucide-react';

interface WarehouseModuleProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'warehouse-transactions', title: 'تراکنش‌ها', icon: <ArrowLeftRight size={16} /> },
  { id: 'warehouse-inventory', title: 'موجودی', icon: <Boxes size={16} /> },
  { id: 'warehouse-shortage', title: 'کسری و خرید', icon: <AlertTriangle size={16} /> },
  { id: 'warehouse-reservations', title: 'رزرو متریال', icon: <Bookmark size={16} /> },
];

export function WarehouseModule({ activeTab, onTabChange }: WarehouseModuleProps) {
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAdd = () => setShowAddModal(true);
  const handleSave = (data: Record<string, any>) => setShowAddModal(false);

  return (
    <div className="animate-fade-in">
      {/* تب‌ها */}
      <div className="flex flex-wrap gap-2 mb-6 p-2 rounded-xl" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
        <div className="flex items-center gap-2 px-3 py-2">
          <Package size={18} style={{ color: '#16A34A' }} />
          <span className="font-bold text-sm" style={{ color: 'var(--color-text-primary)' }}>واحد انبار</span>
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
                ? { background: 'linear-gradient(135deg, #16A34A, #15803D)', color: '#fff' }
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
        <Package size={48} className="mx-auto mb-4" style={{ color: 'var(--color-text-muted)' }} />
        <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
          {tabs.find(t => t.id === activeTab)?.title || 'واحد انبار'}
        </h3>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          مدیریت تراکنش‌ها، موجودی، کسری و رزرو متریال پروژه
        </p>
        <button
          onClick={handleAdd}
          className="mt-4 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all hover:scale-105"
          style={{ background: 'linear-gradient(135deg, #16A34A, #15803D)' }}
        >
          افزودن رکورد جدید
        </button>
      </div>

      {showAddModal && (
        <AddRecordModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          type="inventory"
          onSave={handleSave}
        />
      )}
    </div>
  );
}

/**
 * کامپوننت DataGrid مشترک
 * پشتیبانی از: جستجو، فیلتر، مرتب‌سازی، صفحه‌بندی، صادرات
 */
import { useState, useMemo } from 'react';
import { Column } from '../types';
import { Search, Filter, Download, Printer, FileSpreadsheet, FileText, Plus, Edit2, Trash2, ChevronLeft, ChevronRight, Upload } from 'lucide-react';
import { useThemeContext } from '../context/ThemeContext';
import { ExportButton } from './ExportButton';
import { ImportModal } from './ImportModal';

interface DataGridProps<T> {
  columns: Column<T>[];
  data: T[];
  title: string;
  description?: string;
  primaryKey: keyof T;
  formId?: string;
  onAdd?: () => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onImport?: (data: Partial<T>[]) => void;
  pageSize?: number;
  enableExport?: boolean;
  enableImport?: boolean;
}

export function DataGrid<T extends Record<string, any>>({
  columns,
  data,
  title,
  description,
  primaryKey,
  formId,
  onAdd,
  onEdit,
  onDelete,
  onImport,
  pageSize: initialPageSize = 10,
  enableExport = true,
  enableImport = true,
}: DataGridProps<T>) {
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';

  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<keyof T | string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [showFilters, setShowFilters] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  // فیلتر و جستجو
  const filteredData = useMemo(() => {
    let result = [...data];

    // جستجو
    if (searchQuery) {
      result = result.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // مرتب‌سازی
    if (sortColumn) {
      result.sort((a, b) => {
        const aVal = a[sortColumn as keyof T];
        const bVal = b[sortColumn as keyof T];
        const compare = String(aVal).localeCompare(String(bVal), 'fa');
        return sortDirection === 'asc' ? compare : -compare;
      });
    }

    return result;
  }, [data, searchQuery, sortColumn, sortDirection]);

  // صفحه‌بندی
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSort = (column: keyof T | string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleDelete = (item: T) => {
    if (onDelete && window.confirm('آیا از حذف این رکورد اطمینان دارید؟')) {
      onDelete(item);
    }
  };

  return (
    <div className="w-full">
      {/* هدر جدول */}
      <div className="mb-6">
        <h2
          className="text-xl font-bold mb-2"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {title}
        </h2>
        {description && (
          <p
            className="text-sm"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {description}
          </p>
        )}
      </div>

      {/* نوار ابزار */}
      <div
        className="flex flex-col md:flex-row gap-3 mb-4 p-4 rounded-xl"
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
        }}
      >
        {/* جستجو */}
        <div className="flex-1 relative">
          <Search
            size={18}
            className="absolute right-3 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--color-text-muted)' }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="جستجو در تمامی فیلدها..."
            className="w-full pr-10 pl-4 py-2.5 rounded-lg text-sm outline-none transition-all"
            style={{
              backgroundColor: 'var(--color-input-bg)',
              border: '1.5px solid var(--color-input-border)',
              color: 'var(--color-text-primary)',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--color-brand)';
              e.target.style.boxShadow = '0 0 0 3px var(--color-brand-glow)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--color-input-border)';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* دکمه‌ها */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all hover:scale-105"
            style={{
              backgroundColor: 'var(--color-highlight)',
              color: 'var(--color-brand)',
              border: '1px solid var(--color-border)',
            }}
          >
            <Filter size={16} />
            فیلتر
          </button>

          {enableExport && (
            <ExportButton
              columns={columns}
              data={filteredData}
              fileName={title}
              sheetName={title}
              formId={formId}
            />
          )}

          {enableImport && onImport && (
            <button
              onClick={() => setShowImportModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all hover:scale-105"
              style={{
                backgroundColor: 'var(--color-warning-bg)',
                color: 'var(--color-warning)',
                border: '1px solid var(--color-warning)',
              }}
            >
              <Upload size={16} />
              ورود از Excel
            </button>
          )}

          {onAdd && (
            <button
              onClick={onAdd}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white transition-all hover:scale-105"
              style={{
                background: isDark
                  ? 'linear-gradient(135deg, #3D2980, #6B55BA)'
                  : 'linear-gradient(135deg, #4C35A3, #6652C7)',
                boxShadow: '0 2px 8px var(--color-brand-glow)',
              }}
            >
              <Plus size={16} />
              افزودن
            </button>
          )}
        </div>
      </div>

      {/* جدول */}
      <div
        className="rounded-xl overflow-hidden"
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr
                style={{
                  backgroundColor: 'var(--color-highlight)',
                  borderBottom: '2px solid var(--color-border)',
                }}
              >
                {columns.map((col) => (
                  <th
                    key={String(col.key)}
                    className="px-4 py-3 text-right font-semibold cursor-pointer hover:opacity-80 transition-opacity"
                    style={{
                      color: 'var(--color-text-primary)',
                      minWidth: col.width || 'auto',
                    }}
                    onClick={() => col.sortable !== false && handleSort(col.key)}
                  >
                    <div className="flex items-center gap-2">
                      <span>{col.title}</span>
                      {sortColumn === col.key && (
                        <span style={{ color: 'var(--color-brand)' }}>
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
                {(onEdit || onDelete) && (
                  <th
                    className="px-4 py-3 text-center font-semibold"
                    style={{ color: 'var(--color-text-primary)', width: '120px' }}
                  >
                    عملیات
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                    className="px-4 py-12 text-center"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Search size={32} strokeWidth={1.5} />
                      <span>هیچ رکوردی یافت نشد</span>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, index) => (
                  <tr
                    key={String(item[primaryKey])}
                    className="transition-colors hover:bg-opacity-50"
                    style={{
                      backgroundColor: index % 2 === 0 ? 'transparent' : 'var(--color-highlight)',
                      borderBottom: '1px solid var(--color-border)',
                    }}
                  >
                    {columns.map((col) => (
                      <td
                        key={String(col.key)}
                        className="px-4 py-3"
                        style={{ color: 'var(--color-text-primary)' }}
                      >
                        {col.render
                          ? col.render(item[col.key as keyof T], item)
                          : String(item[col.key as keyof T] || '')}
                      </td>
                    ))}
                    {(onEdit || onDelete) && (
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          {onEdit && (
                            <button
                              onClick={() => onEdit(item)}
                              className="p-2 rounded-lg transition-all hover:scale-110"
                              style={{
                                backgroundColor: 'var(--color-highlight)',
                                color: 'var(--color-brand)',
                              }}
                              title="ویرایش"
                            >
                              <Edit2 size={16} />
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => handleDelete(item)}
                              className="p-2 rounded-lg transition-all hover:scale-110"
                              style={{
                                backgroundColor: 'var(--color-error-bg)',
                                color: 'var(--color-error)',
                              }}
                              title="حذف"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* فوتر جدول */}
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-4 p-4"
          style={{
            backgroundColor: 'var(--color-highlight)',
            borderTop: '1px solid var(--color-border)',
          }}
        >
          {/* اطلاعات رکوردها */}
          <div
            className="text-sm"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            نمایش {(currentPage - 1) * pageSize + 1} تا{' '}
            {Math.min(currentPage * pageSize, filteredData.length)} از{' '}
            {filteredData.length} رکورد
          </div>

          {/* صفحه‌بندی */}
          <div className="flex items-center gap-2">
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-2 rounded-lg text-sm outline-none"
              style={{
                backgroundColor: 'var(--color-input-bg)',
                border: '1px solid var(--color-input-border)',
                color: 'var(--color-text-primary)',
              }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-primary)',
                }}
              >
                <ChevronRight size={16} />
              </button>

              <span
                className="px-3 py-2 text-sm font-medium"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {currentPage} / {totalPages || 1}
              </span>

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-primary)',
                }}
              >
                <ChevronLeft size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* مودال ورود اطلاعات */}
      {enableImport && onImport && (
        <ImportModal
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          columns={columns}
          formType={title}
          existingData={data}
          onImport={(importedData: any) => {
            onImport(importedData);
            setShowImportModal(false);
          }}
        />
      )}
    </div>
  );
}

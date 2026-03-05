import { useState, useMemo, useCallback } from 'react';
import { STATUS_CODES, CATEGORIES, CATEGORY_META, type StatusCode, type Category } from './data/statuses';

function CategoryBadge({ category }: { category: Category }) {
  const meta = CATEGORY_META[category];
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-sm"
      style={{ backgroundColor: meta.bg, color: meta.color, border: `1px solid ${meta.border}` }}
    >
      {category}
    </span>
  );
}

function CodeRow({ status, selected, onClick }: { status: StatusCode; selected: boolean; onClick: () => void }) {
  const meta = CATEGORY_META[status.category];
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2 text-left transition-colors rounded-sm"
      style={{
        backgroundColor: selected ? meta.bg : 'transparent',
        border: selected ? `1px solid ${meta.border}` : '1px solid transparent',
        cursor: 'pointer',
      }}
    >
      <span
        className="text-sm font-medium w-10 flex-shrink-0 tabular-nums"
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          color: selected ? meta.color : '#6B7280',
        }}
      >
        {status.code}
      </span>
      <span className="text-sm text-gray-700 truncate">{status.name}</span>
    </button>
  );
}

function DetailSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-xs font-medium uppercase tracking-widest text-gray-400">{label}</p>
      <div className="text-sm text-gray-700 leading-relaxed">{children}</div>
    </div>
  );
}

function StatusDetail({ status }: { status: StatusCode }) {
  const meta = CATEGORY_META[status.category];
  return (
    <div className="flex flex-col gap-6">
      {/* Code + Name header */}
      <div className="flex flex-col gap-2 pb-6 border-b border-gray-100">
        <div className="flex items-start justify-between gap-4">
          <span
            className="text-6xl font-semibold leading-none tabular-nums"
            style={{ fontFamily: "'JetBrains Mono', monospace", color: meta.color }}
          >
            {status.code}
          </span>
          <CategoryBadge category={status.category} />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900">{status.name}</h2>
        <p className="text-sm text-gray-500" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          HTTP {status.code} {status.name}
        </p>
      </div>

      <DetailSection label="Description">
        {status.description}
      </DetailSection>

      <DetailSection label="When to Use">
        {status.whenToUse}
      </DetailSection>

      <DetailSection label="Common Mistakes">
        <span style={{ color: '#EA580C' }}>{status.commonMistakes}</span>
      </DetailSection>

      <DetailSection label="Real-World Example">
        <div
          className="p-3 rounded-sm text-xs leading-relaxed"
          style={{
            backgroundColor: '#F9FAFB',
            border: '1px solid #F3F4F6',
            fontFamily: "'JetBrains Mono', monospace",
            color: '#374151',
          }}
        >
          {status.example}
        </div>
      </DetailSection>
    </div>
  );
}

function EmptyDetail() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
      <div
        className="text-5xl font-semibold tabular-nums"
        style={{ fontFamily: "'JetBrains Mono', monospace", color: '#E5E7EB' }}
      >
        ???
      </div>
      <p className="text-sm text-gray-400">Select a status code to see details</p>
    </div>
  );
}

export default function App() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<StatusCode | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return STATUS_CODES;
    return STATUS_CODES.filter(s =>
      s.code.toString().includes(q) ||
      s.name.toLowerCase().includes(q) ||
      s.category.includes(q)
    );
  }, [query]);

  const groupedFiltered = useMemo(() =>
    CATEGORIES.map(cat => ({
      category: cat,
      items: filtered.filter(s => s.category === cat),
    })).filter(g => g.items.length > 0),
    [filtered]
  );

  const handleSelect = useCallback((status: StatusCode) => {
    setSelected(status);
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Top bar */}
      <header className="flex items-center justify-between px-5 py-3 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <span
            className="text-lg font-semibold text-gray-900"
            style={{ letterSpacing: '-0.02em' }}
          >
            HTTPStatus
          </span>
          <span className="text-xs text-gray-400 hidden sm:inline">
            HTTP status code reference
          </span>
        </div>
        <a
          href="https://github.com/srmdn/httpstatus"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
        >
          github ↗
        </a>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0 flex flex-col border-r border-gray-100 overflow-hidden">
          {/* Search */}
          <div className="px-3 py-3 border-b border-gray-100">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search code or name…"
              className="w-full px-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-sm outline-none focus:border-gray-400 transition-colors"
              autoComplete="off"
              spellCheck={false}
            />
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto px-2 py-2">
            {groupedFiltered.length === 0 && (
              <p className="text-xs text-gray-400 px-2 py-4 text-center">No results</p>
            )}
            {groupedFiltered.map(({ category, items }) => (
              <div key={category} className="mb-3">
                <div className="flex items-center gap-2 px-2 py-1 mb-1">
                  <span
                    className="text-xs font-semibold"
                    style={{ color: CATEGORY_META[category].color, fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {category}
                  </span>
                  <span className="text-xs text-gray-400">{CATEGORY_META[category].label}</span>
                </div>
                {items.map(status => (
                  <CodeRow
                    key={status.code}
                    status={status}
                    selected={selected?.code === status.code}
                    onClick={() => handleSelect(status)}
                  />
                ))}
              </div>
            ))}
          </div>
        </aside>

        {/* Detail panel */}
        <main className="flex-1 overflow-y-auto px-8 py-8">
          {selected ? <StatusDetail status={selected} /> : <EmptyDetail />}
        </main>
      </div>
    </div>
  );
}

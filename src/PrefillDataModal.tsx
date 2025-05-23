import React, { useState } from 'react';

export interface DataFieldNode {
  label: string;
  value: string; // unique identifier for the field
  children?: DataFieldNode[];
}

export interface DataSource {
  label: string;
  nodes: DataFieldNode[];
}

interface PrefillDataModalProps {
  open: boolean;
  sources: DataSource[];
  onSelect: (value: string) => void;
  onCancel: () => void;
}

const PrefillDataModal: React.FC<PrefillDataModalProps> = ({ open, sources, onSelect, onCancel }) => {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [selected, setSelected] = useState<string | null>(null);

  if (!open) return null;

  // Recursively render tree
  const renderNodes = (nodes: DataFieldNode[], parentKey = '') => (
    <ul style={{ listStyle: 'none', margin: 0, paddingLeft: 16 }}>
      {nodes.map((node) => {
        const key = parentKey + node.value;
        const isExpandable = node.children && node.children.length > 0;
        const isVisible = !search || node.label.toLowerCase().includes(search.toLowerCase());
        if (!isVisible && !hasDescendantMatch(node, search)) return null;
        // Make 'first_name' field black on white
        const isFirstName = node.label === 'first_name';
        return (
          <li key={key}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: isFirstName ? '#fff' : (selected === node.value ? '#e3f0fd' : undefined),
                borderRadius: 4,
                padding: '2px 4px',
                cursor: isExpandable ? 'pointer' : 'default',
                marginBottom: 2,
              }}
              onClick={() => {
                if (isExpandable) {
                  setExpanded(e => ({ ...e, [key]: !e[key] }));
                } else {
                  setSelected(node.value);
                }
              }}
            >
              {isExpandable && (
                <span style={{ marginRight: 4, fontSize: 12 }}>
                  {expanded[key] ? '▼' : '▶'}
                </span>
              )}
              <span
                style={{
                  fontWeight: isExpandable ? 500 : 400,
                  color: isFirstName ? '#111' : (isExpandable ? '#222' : '#444'),
                  marginLeft: isExpandable ? 0 : 16,
                  background: isFirstName ? '#fff' : undefined,
                  borderRadius: isFirstName ? 4 : undefined,
                  padding: isFirstName ? '0 2px' : undefined,
                }}
                onClick={isExpandable ? undefined : () => setSelected(node.value)}
              >
                {node.label}
              </span>
            </div>
            {isExpandable && expanded[key] && renderNodes(node.children!, key)}
          </li>
        );
      })}
    </ul>
  );

  function hasDescendantMatch(node: DataFieldNode, search: string): boolean {
    if (!node.children) return false;
    return node.children.some(
      child => child.label.toLowerCase().includes(search.toLowerCase()) || hasDescendantMatch(child, search)
    );
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.08)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 8,
        boxShadow: '0 4px 32px #0002',
        width: 520,
        minHeight: 420,
        maxHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{ padding: '20px 24px 8px 24px', borderBottom: '1px solid #eee', fontWeight: 600, fontSize: 20 }}>
          Select data element to map
        </div>
        <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
          <div style={{ width: 240, borderRight: '1px solid #eee', padding: 16, overflowY: 'auto' }}>
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', marginBottom: 12, padding: 6, borderRadius: 4, border: '1px solid #ccc' }}
            />
            {sources.map((src, i) => (
              <div key={src.label} style={{ marginBottom: 8 }}>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{src.label}</div>
                {renderNodes(src.nodes)}
              </div>
            ))}
          </div>
          <div style={{ flex: 1, padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {selected ? (
              <button
                style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 24px', fontWeight: 500, fontSize: 16 }}
                onClick={() => onSelect(selected)}
              >
                SELECT
              </button>
            ) : (
              <span style={{ color: '#888' }}>Select a field to map</span>
            )}
          </div>
        </div>
        <div style={{ borderTop: '1px solid #eee', padding: 12, textAlign: 'right' }}>
          <button
            style={{ background: 'none', color: '#1976d2', border: 'none', fontWeight: 500, fontSize: 16, marginRight: 8, cursor: 'pointer' }}
            onClick={onCancel}
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrefillDataModal;

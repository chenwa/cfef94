import React from 'react';

interface PrefillPanelProps {
  formId: string;
  fields: string[];
  prefill: Record<string, string | null>;
  onEdit: (field: string) => void;
  onClear: (field: string) => void;
}

const PrefillPanel: React.FC<PrefillPanelProps> = ({ formId, fields, prefill, onEdit, onClear }) => {
  return (
    <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #0002', padding: 24, marginTop: 24, minWidth: 400 }}>
      <h3 style={{ margin: 0 }}>Prefill</h3>
      <div style={{ color: '#666', fontSize: 14, marginBottom: 16 }}>Prefill fields for this form</div>
      <div>
        {fields.map(field => {
          const value = prefill[field];
          if (value) {
            // Show mapped value as black on white for readability
            return (
              <div key={field} style={{ display: 'flex', alignItems: 'center', background: '#fff', borderRadius: 20, padding: '8px 16px', marginBottom: 8, color: '#111', fontWeight: 500, fontSize: 18, border: '1.5px solid #e5e7eb' }}>
                <span style={{ fontWeight: 500 }}>{field}:</span>
                <span style={{ marginLeft: 8 }}>{value}</span>
                <button onClick={() => onClear(field)} style={{ marginLeft: 'auto', background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#888' }} title="Clear">×</button>
              </div>
            );
          }
          return (
            <div key={field} style={{ display: 'flex', alignItems: 'center', border: '1px dashed #2196f3', borderRadius: 8, padding: '8px 16px', marginBottom: 8, background: '#f8fbff', color: '#888', cursor: 'pointer' }} onClick={() => onEdit(field)}>
              <span style={{ marginRight: 8, fontSize: 18 }}>🗄️</span>
              <span>{field}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PrefillPanel;

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchBar = ({ value, onChange, placeholder = 'Search products...' }: SearchBarProps) => {
  return (
    <div style={{ position: 'relative', marginBottom: '12px' }}>
      {/* Search Icon */}
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--st-text-secondary, #94A3B8)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '10px 12px 10px 36px',
          borderRadius: '8px',
          border: '1px solid var(--st-border-color, #334155)',
          background: 'var(--st-bg-input, #334155)',
          color: 'var(--st-text-primary, #F8FAFC)',
          fontSize: '14px',
          outline: 'none',
          boxSizing: 'border-box',
        }}
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            color: 'var(--st-text-secondary, #94A3B8)',
            cursor: 'pointer',
            fontSize: '16px',
            padding: '2px',
          }}
        >
          ×
        </button>
      )}
    </div>
  );
};

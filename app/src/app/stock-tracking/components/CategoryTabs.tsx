interface CategoryTabsProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export const CategoryTabs = ({ categories, activeCategory, onCategoryChange }: CategoryTabsProps) => {
  const allCategories = ['All', ...categories];

  return (
    <div
      style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '8px',
        marginBottom: '12px',
        scrollbarWidth: 'none',
      }}
    >
      {allCategories.map((cat) => {
        const isActive = activeCategory === cat;
        return (
          <button
            key={cat}
            type="button"
            onClick={() => onCategoryChange(cat)}
            style={{
              padding: '6px 14px',
              borderRadius: '16px',
              border: isActive ? 'none' : '1px solid var(--st-border-color, #334155)',
              background: isActive ? 'var(--st-accent-green, #22C55E)' : 'transparent',
              color: isActive ? '#fff' : 'var(--st-text-secondary, #94A3B8)',
              fontSize: '12px',
              fontWeight: isActive ? 600 : 400,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
              flexShrink: 0,
            }}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
};

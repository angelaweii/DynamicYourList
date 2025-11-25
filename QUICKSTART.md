# 🚀 Quick Start

## Start the Project

```bash
cd "/Users/angela.wei/cursor projects/DynamicMyList"
./start.sh
```

**Access:**
- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

---

## What's Available

### ✅ Design System
All Slate Design System tokens loaded and ready to use as CSS variables.

### ✅ Components
- `Button` - 4 variants, 3 sizes
- `Card` - Headers, footers, hover states
- `Input` - Text/textarea, validation

### ✅ Backend API
- Theme management endpoints
- CRUD operations
- Token utilities

---

## Quick Usage

### Import Components
```jsx
import { Button, Card, Input } from './components';
```

### Use Design Tokens
```jsx
<div style={{
  background: 'var(--color-surface-mid)',
  color: 'var(--color-general-text-high)',
  padding: 'var(--space-size-space-padding-medium-regular)'
}}>
  Your content
</div>
```

### Switch Brands
```jsx
import { useTheme } from './theme/ThemeProvider';

function MyComponent() {
  const { brand, setBrand } = useTheme();
  
  return (
    <button onClick={() => setBrand('dplus')}>
      Switch to Discovery+
    </button>
  );
}
```

---

## Available Design Tokens

All tokens are available as CSS variables in the format `--category-subcategory-property-state`:

**Colors:**
- `--color-action-primary-fill-mid`
- `--color-general-text-high`
- `--color-surface-mid`

**Typography:**
- `--font-body-md-font-size`
- `--font-heading-lg-line-height`

**Spacing:**
- `--space-size-space-padding-medium-regular`
- `--space-size-space-horizontal-far-lg`

**Borders:**
- `--border-corner-action-lg`
- `--border-stroke-general-md`

**Motion:**
- `--motion-duration-20`
- `--motion-easing-ease-out`

Inspect the `:root` element in DevTools to see all available variables.

---

## File Structure

```
src/
├── components/       # Button, Card, Input
├── theme/           # ThemeProvider, token utils
├── assets/          # Design tokens (67 JSON files)
└── App.jsx          # Your application (currently empty)
```

---

## Next Steps

1. Edit `src/App.jsx` to build your interface
2. Import and use components from `./components`
3. Style with design token CSS variables
4. Call backend API at `http://localhost:8000`

---

**Everything is set up and ready for development!** 🎯

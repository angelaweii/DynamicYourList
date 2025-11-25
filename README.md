# Dynamic My List

A React + Python starter project with **Slate Design System** fully integrated and ready to use.

## 🎨 What's Set Up

### ✅ Frontend (React + Vite)
- **Design Token System** - All tokens loaded and ready to use
- **Theme Provider** - Brand switching and CSS variable injection
- **Typography** - Handset Sans UI fonts loaded
- **Components** - Button, Card, Input components ready to use
- **Assets** - Fonts, backgrounds, icons, and all design tokens

### ✅ Backend (Python + FastAPI)
- **API Server** - FastAPI with CORS configured
- **Token Utilities** - Load and resolve design tokens
- **Endpoints** - Theme management and list operations
- **Documentation** - Interactive API docs

## 🚀 Quick Start

### Start Both Servers

**Mac/Linux:**
```bash
./start.sh
```

**Windows:**
```bash
start.bat
```

**Or manually:**

**Terminal 1 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Terminal 2 - Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

### Access
- 🌐 Frontend: http://localhost:5173
- 🔌 Backend: http://localhost:8000
- 📚 API Docs: http://localhost:8000/docs

## 🎨 Using the Design System

### Import Components
```jsx
import { Button, Card, Input } from './components';
```

### Use in Your App
```jsx
<Button variant="primary" size="medium">Click Me</Button>
<Card header={<h3>Title</h3>}>Content</Card>
<Input label="Name" placeholder="Enter name" />
```

### Access Design Tokens
All tokens are available as CSS variables:
```css
background: var(--color-action-primary-fill-mid);
color: var(--color-general-text-high);
border-radius: var(--border-corner-action-md);
padding: var(--space-size-space-padding-medium-regular);
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

## 📦 Available Components

### Button
```jsx
<Button variant="primary|secondary|neutral|ghost" size="small|medium|large">
  Text
</Button>
```

### Card
```jsx
<Card 
  header={<h3>Title</h3>}
  footer={<Button>Action</Button>}
  hoverable
  selected
>
  Content
</Card>
```

### Input
```jsx
<Input
  label="Label"
  type="text|email|password"
  placeholder="Placeholder"
  error={boolean}
  errorMessage="Error text"
  helperText="Helper text"
  multiline
/>
```

## 📁 Project Structure

```
DynamicMyList/
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── theme/           # Design system setup
│   │   ├── assets/          # Design tokens
│   │   └── App.jsx          # Your application
│   ├── public/
│   │   ├── fonts/           # Handset Sans UI
│   │   ├── backgrounds/     # Brand backgrounds
│   │   └── icons/           # SVG icons
│   └── package.json
│
├── backend/
│   ├── main.py              # API endpoints
│   ├── tokens.py            # Token utilities
│   ├── design_tokens/       # Token JSON files
│   └── requirements.txt
│
└── README.md
```

## 🎯 Design System Features

- **Colors** - Action, surface, text, utility colors
- **Typography** - Font families, sizes, weights, line heights
- **Spacing** - Grid, horizontal, vertical, padding
- **Borders** - Corner radii and stroke widths
- **Motion** - Duration, easing, transforms
- **Elevation** - Shadow tokens
- **Gradients** - Complex multi-layer gradients
- **Breakpoints** - 7 responsive breakpoints + CTV

## 🌐 Supported Brands

- `max` (Max/HBO Max) - Default
- `dplus` (Discovery+)
- `stress` (Stress-test)
- `tntsports` (TNT Sports)

## 🔌 API Endpoints

- `GET /api/theme` - Get current theme
- `GET /api/theme/{brand}` - Get specific brand theme
- `GET /api/list` - Get list items
- `POST /api/list` - Add item
- `PUT /api/list/{id}` - Update item
- `DELETE /api/list/{id}` - Delete item

## 📚 Resources

- Design tokens: `frontend/src/assets/`
- Components: `frontend/src/components/`
- Theme utilities: `frontend/src/theme/`
- Backend API: `backend/main.py`

---

**Ready to build!** The Slate Design System is fully integrated and waiting for your content. 🚀

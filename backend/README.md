# Dynamic My List - Backend

FastAPI backend with Slate Design System token integration.

## Setup

### 1. Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

Or use a virtual environment (recommended):

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Run the Server

```bash
python main.py
```

Or use uvicorn directly:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- API: http://localhost:8000
- Interactive Docs: http://localhost:8000/docs
- Alternative Docs: http://localhost:8000/redoc

## API Endpoints

### Theme Endpoints

- `GET /api/theme` - Get current theme configuration with design tokens
- `GET /api/theme/{brand}` - Get theme for specific brand (max, dplus, stress, tntsports)

### List Management

- `GET /api/list` - Get all items in My List
- `GET /api/list/{item_id}` - Get a specific item
- `POST /api/list` - Add a new item to My List
- `PUT /api/list/{item_id}` - Update an existing item
- `DELETE /api/list/{item_id}` - Delete an item

### Other

- `GET /` - Root endpoint with API info
- `GET /api/health` - Health check
- `GET /api/categories` - Get all available categories

## Design Token Integration

The backend includes a `DesignTokens` class that:
- Loads design tokens from JSON files
- Resolves token references (e.g., `{color.general.text.high}`)
- Provides theme configuration to frontend
- Exports CSS variables

### Example Usage

```python
from tokens import DesignTokens

# Initialize for Max brand
tokens = DesignTokens(brand='max')

# Get a specific token
primary_color = tokens.get_color_token('color.action.primary.fill.mid')

# Get full theme config
theme_config = tokens.get_theme_config()
```

## Project Structure

```
backend/
├── main.py              # FastAPI application
├── tokens.py            # Design token utilities
├── requirements.txt     # Python dependencies
├── design_tokens/       # Design token JSON files
│   ├── color/
│   ├── space-size/
│   └── text.tokens.json
└── README.md
```

## Next Steps

- Add database integration (PostgreSQL, MongoDB)
- Add authentication/authorization
- Add user-specific lists
- Add content recommendation engine
- Add search and filtering
- Add rate limiting
- Add logging and monitoring


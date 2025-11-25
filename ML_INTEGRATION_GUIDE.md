# ML Integration Guide - FF1000 Recommendations

This guide explains how the FF1000 ML recommendation models are integrated into the DynamicMyList prototype.

## Architecture Overview

```
┌─────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│                 │      │                  │      │                  │
│   React         │─────>│   FastAPI        │─────>│   FF1000 Flask   │
│   Frontend      │      │   Backend        │      │   ML Service     │
│   :5173         │      │   :8000          │      │   :8080          │
│                 │      │                  │      │                  │
└─────────────────┘      └──────────────────┘      └──────────────────┘
      (Vite)               (Proxy/Wrapper)          (ML Models)
```

### Components:

1. **FF1000 ML Service** (Port 8080)
   - Flask-based service with sklearn pipelines
   - Three models:
     - **`similarity`** - Cosine similarity for "More Like This"
     - **`rfy`** (Recommended For You) - Bayesian recommender for "Something Else"
     - **`nfm`** (Not For Me) - Inverse recommendations (not used yet)
   - Data: 5,487 movies/shows with embeddings

2. **FastAPI Backend** (Port 8000)
   - Acts as a proxy/wrapper for FF1000
   - Adds fallback mechanisms
   - Enriches recommendations with metadata
   - Endpoints:
     - `GET /api/ml/status` - Check ML service availability
     - `POST /api/more-like-this` - Get similar recommendations
     - `POST /api/something-else` - Get different recommendations

3. **React Frontend** (Port 5173)
   - Uses `api.js` service layer to communicate with backend
   - Graceful fallback when ML service is unavailable
   - Maintains all existing UI/UX features

## Setup Instructions

### 1. Install Dependencies

#### Backend (FastAPI):
```bash
cd backend
pip install -r requirements.txt
```

#### FF1000 Service:
```bash
cd backend/FF1000
pip install -r requirements.txt
```

#### Frontend:
```bash
cd frontend
npm install
```

### 2. Start Services (In Order)

#### Step 1: Start FF1000 ML Service
```bash
cd backend/FF1000
python -c "from server.api import app; import os; os.environ['LOG_LEVEL'] = 'INFO'; app.run(host='0.0.0.0', port=8080)"
```

Or using Docker:
```bash
cd backend/FF1000
docker build -t ff1000 .
docker run -p 8080:8080 ff1000
```

Verify it's running:
```bash
curl http://localhost:8080/health
```

#### Step 2: Start FastAPI Backend
```bash
cd backend
python main.py
```

Or:
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Verify it's running:
```bash
curl http://localhost:8000/api/ml/status
```

#### Step 3: Start React Frontend
```bash
cd frontend
npm run dev
```

Access at: http://localhost:5173

## How It Works

### "More Like This" Flow

1. User clicks "More Like This" on a tile (e.g., "Oppenheimer")
2. Frontend calls `api.getMoreLikeThis("Oppenheimer", null, 2)`
3. Frontend API service makes POST request to `/api/more-like-this`
4. FastAPI backend calls FF1000's `/predict/similarity` endpoint
5. FF1000 uses cosine similarity on embeddings to find similar items
6. Response flows back through the chain
7. Frontend displays 2 new tiles with "elastic reveal" animation

### "Something Else" Flow

1. User clicks "Something Else" on a tile (e.g., "Barbie")
2. Frontend calls `api.getSomethingElse("Barbie", null)`
3. Frontend API service makes POST request to `/api/something-else`
4. FastAPI backend calls FF1000's `/predict/rfy` endpoint
5. FF1000 uses Bayesian recommendation to suggest different content
6. Backend picks a random item from top 20 recommendations (for variety)
7. Response flows back through the chain
8. Frontend replaces tile with "cross-dissolve" animation and teal-green gradient

### Fallback Mechanism

If FF1000 service is unavailable:
- `ml_service.py` detects this during initialization
- All API calls automatically fall back to mock recommendations
- User experience is maintained seamlessly
- No error messages shown to user

## API Examples

### Check ML Status
```bash
curl http://localhost:8000/api/ml/status
```

Response:
```json
{
  "is_available": true,
  "base_url": "http://localhost:8080",
  "cached_items": 42
}
```

### Get More Like This
```bash
curl -X POST http://localhost:8000/api/more-like-this \
  -H "Content-Type: application/json" \
  -d '{
    "seed_title": "Oppenheimer",
    "seed_item_id": null,
    "limit": 2
  }'
```

Response:
```json
[
  {
    "title": "Dunkirk",
    "item_id": "abc123",
    "score": 0.87,
    "year": 2017
  },
  {
    "title": "Interstellar",
    "item_id": "def456",
    "score": 0.82,
    "year": 2014
  }
]
```

### Get Something Else
```bash
curl -X POST http://localhost:8000/api/something-else \
  -H "Content-Type: application/json" \
  -d '{
    "current_title": "Barbie",
    "current_item_id": null
  }'
```

Response:
```json
{
  "title": "Everything Everywhere All at Once",
  "item_id": "ghi789",
  "score": 0.76,
  "year": 2022
}
```

## File Structure

```
DynamicMyList/
├── backend/
│   ├── main.py                 # FastAPI app with ML endpoints
│   ├── ml_service.py           # ML service wrapper
│   ├── requirements.txt        # Python dependencies (updated)
│   └── FF1000/                 # Cloned ML repository
│       ├── server/
│       │   └── api.py          # Flask endpoints
│       ├── machine_learning/
│       │   ├── load_models.py  # Model loading
│       │   ├── models/
│       │   │   ├── rfy.py
│       │   │   └── similarity.py
│       │   └── prefetched/
│       │       └── embeddings.csv.gz  # 5,487 items
│       └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.jsx             # Updated with async API calls
│   │   └── services/
│   │       └── api.js          # New API service layer
│   └── package.json
└── ML_INTEGRATION_GUIDE.md     # This file
```

## Testing the Integration

1. **Test with ML Service Running:**
   - Start all three services
   - Click "More Like This" on any tile
   - Should see real ML-powered recommendations
   - Check browser console for API calls

2. **Test Fallback Mode:**
   - Stop FF1000 service (Ctrl+C)
   - Restart FastAPI backend (it will detect FF1000 is down)
   - Click "More Like This" - should still work with fallback data
   - Check that `/api/ml/status` returns `is_available: false`

3. **Test Both Rails:**
   - Actions on Rail 1 should be independent of Rail 2
   - ML recommendations should work for both rails
   - Drag-and-drop should still work normally

## Troubleshooting

### FF1000 won't start
- **Issue**: Port 8080 already in use
- **Solution**: Kill the process using port 8080 or change the port

### Backend can't reach FF1000
- **Issue**: Connection refused to http://localhost:8080
- **Solution**: Ensure FF1000 is running first, check firewall settings

### Frontend shows fallback data
- **Issue**: ML service not being used
- **Solution**: Check `/api/ml/status` endpoint, verify FF1000 is running

### CORS errors
- **Issue**: Frontend can't access backend
- **Solution**: Verify CORS settings in `main.py` allow `http://localhost:5173`

## Future Enhancements

1. **Add Item IDs to Initial Data:**
   - Map existing titles to FF1000 item IDs
   - Better recommendations when item_id is known

2. **Use "Not For Me" Model:**
   - Add a "thumbs down" action
   - Remove similar content from recommendations

3. **Implement Catalog Search:**
   - Search FF1000's 5,487 items
   - Populate rails with actual catalog data

4. **Add Model Tuning:**
   - Adjust similarity thresholds
   - Configure RFY model parameters
   - Add diversity/exploration parameters

5. **Performance Optimization:**
   - Cache frequently requested recommendations
   - Pre-compute similarities for popular titles
   - Add request batching

## Credits

- **FF1000**: Warner Bros. Discovery ML team
- **Design System**: HBO Max Slate Design System
- **Integration**: Angela Wei

---

**Happy coding! 🚀**


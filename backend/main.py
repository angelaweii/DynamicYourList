"""
Dynamic My List - FastAPI Backend
Built with Slate Design System integration
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import uvicorn
import logging

from tokens import DesignTokens
from ml_service import RecommendationEngine

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Dynamic My List API",
    description="Backend API with Slate Design System integration",
    version="1.0.0"
)

# Configure CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite dev server
        "http://localhost:3000",  # Alternative React port
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize design tokens
tokens = DesignTokens(brand='max')

# Initialize ML recommendation engine
ml_engine = RecommendationEngine(ff1000_base_url="http://localhost:8080")

# Models
class ListItem(BaseModel):
    id: Optional[int] = None
    title: str
    description: Optional[str] = None
    category: str
    rating: Optional[str] = None
    thumbnail: Optional[str] = None
    created_at: Optional[datetime] = None

class ThemeConfig(BaseModel):
    brand: str
    primaryColor: str
    secondaryColor: str
    textColor: str

class MoreLikeThisRequest(BaseModel):
    seed_title: str
    seed_item_id: Optional[str] = None
    limit: int = 2

class SomethingElseRequest(BaseModel):
    current_title: str
    current_item_id: Optional[str] = None
    diversity_level: int = 1
    exclude_item_ids: Optional[List[str]] = []
    exclude_titles: Optional[List[str]] = []

class RecommendationResponse(BaseModel):
    title: str
    item_id: str
    score: float
    year: Optional[int] = None
    poster: Optional[str] = None

# In-memory storage (replace with database in production)
my_list: List[ListItem] = [
    {
        "id": 1,
        "title": "Sample Movie",
        "description": "A great movie to watch",
        "category": "Movies",
        "rating": "PG-13",
        "thumbnail": "/icons/default/play.svg",
        "created_at": datetime.now()
    },
    {
        "id": 2,
        "title": "Awesome Series",
        "description": "Binge-worthy series",
        "category": "Series",
        "rating": "TV-14",
        "thumbnail": "/icons/default/play.svg",
        "created_at": datetime.now()
    }
]

# Routes
@app.get("/")
def read_root():
    """Root endpoint"""
    return {
        "message": "Dynamic My List API",
        "version": "1.0.0",
        "design_system": "Slate Design System",
        "brand": tokens.brand
    }

@app.get("/api/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now()}

@app.get("/api/theme")
def get_theme():
    """Get current theme configuration with design tokens"""
    theme_config = tokens.get_theme_config()
    
    # Add some commonly used resolved values
    try:
        theme_config["primaryColor"] = tokens.get_color_token("color.action.primary.fill.mid")
        theme_config["secondaryColor"] = tokens.get_color_token("color.action.secondary.fill.mid")
        theme_config["textColor"] = tokens.get_color_token("color.general.text.high")
    except:
        pass
    
    return theme_config

@app.get("/api/theme/{brand}")
def get_theme_by_brand(brand: str):
    """Get theme configuration for a specific brand"""
    if brand not in ['max', 'dplus', 'stress', 'tntsports']:
        raise HTTPException(status_code=400, detail="Invalid brand")
    
    brand_tokens = DesignTokens(brand=brand)
    theme_config = brand_tokens.get_theme_config()
    
    try:
        theme_config["primaryColor"] = brand_tokens.get_color_token("color.action.primary.fill.mid")
        theme_config["secondaryColor"] = brand_tokens.get_color_token("color.action.secondary.fill.mid")
        theme_config["textColor"] = brand_tokens.get_color_token("color.general.text.high")
    except:
        pass
    
    return theme_config

@app.get("/api/list")
def get_my_list():
    """Get all items in My List"""
    return {
        "items": my_list,
        "count": len(my_list)
    }

@app.get("/api/list/{item_id}")
def get_list_item(item_id: int):
    """Get a specific item from My List"""
    item = next((item for item in my_list if item["id"] == item_id), None)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item

@app.post("/api/list")
def add_to_list(item: ListItem):
    """Add a new item to My List"""
    # Generate new ID
    new_id = max([i["id"] for i in my_list], default=0) + 1
    
    new_item = {
        "id": new_id,
        "title": item.title,
        "description": item.description,
        "category": item.category,
        "rating": item.rating,
        "thumbnail": item.thumbnail,
        "created_at": datetime.now()
    }
    
    my_list.append(new_item)
    return {"message": "Item added successfully", "item": new_item}

@app.put("/api/list/{item_id}")
def update_list_item(item_id: int, item: ListItem):
    """Update an existing item in My List"""
    existing_item = next((i for i in my_list if i["id"] == item_id), None)
    if not existing_item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    # Update fields
    existing_item["title"] = item.title
    existing_item["description"] = item.description
    existing_item["category"] = item.category
    existing_item["rating"] = item.rating
    existing_item["thumbnail"] = item.thumbnail
    
    return {"message": "Item updated successfully", "item": existing_item}

@app.delete("/api/list/{item_id}")
def delete_list_item(item_id: int):
    """Delete an item from My List"""
    global my_list
    item = next((i for i in my_list if i["id"] == item_id), None)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    my_list = [i for i in my_list if i["id"] != item_id]
    return {"message": "Item deleted successfully"}

@app.get("/api/categories")
def get_categories():
    """Get all available categories"""
    categories = list(set([item["category"] for item in my_list]))
    return {"categories": categories}

@app.get("/api/ml/status")
async def ml_status():
    """Check ML service status"""
    return ml_engine.get_catalog_info()

@app.post("/api/more-like-this", response_model=List[RecommendationResponse])
async def more_like_this(request: MoreLikeThisRequest):
    """
    Get recommendations similar to the seed title
    Used for the "More Like This" tile action
    """
    try:
        recommendations = ml_engine.get_more_like_this(
            seed_title=request.seed_title,
            seed_item_id=request.seed_item_id,
            limit=request.limit
        )
        
        return recommendations
        
    except Exception as e:
        logger.error(f"Error in more_like_this: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/something-else", response_model=RecommendationResponse)
async def something_else(request: SomethingElseRequest):
    """
    Get a different recommendation to replace the current title
    Used for the "Something Else" tile action
    
    Supports progressive diversity: higher diversity_level values
    result in more varied recommendations less related to the seed.
    """
    try:
        recommendation = ml_engine.get_something_else(
            current_title=request.current_title,
            current_item_id=request.current_item_id,
            diversity_level=request.diversity_level,
            exclude_item_ids=request.exclude_item_ids,
            exclude_titles=request.exclude_titles
        )
        
        if not recommendation:
            raise HTTPException(status_code=404, detail="No recommendations found")
        
        return recommendation
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in something_else: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Run the application
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)


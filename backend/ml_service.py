"""
ML Recommendation Service
Integrates with FF1000 recommendation models
"""
import logging
import requests
from typing import List, Dict, Optional
import random

logger = logging.getLogger(__name__)


class RecommendationEngine:
    """Wrapper for FF1000 recommendation models"""
    
    def __init__(self, ff1000_base_url: str = "http://localhost:8080"):
        self.base_url = ff1000_base_url
        self.is_available = self._check_health()
        
        # Cache for item ID to title mapping
        self.item_cache: Dict[str, str] = {}
        
        if self.is_available:
            logger.info("FF1000 recommendation service is available")
        else:
            logger.warning("FF1000 recommendation service is NOT available - using fallback")
    
    def _check_health(self) -> bool:
        """Check if FF1000 service is healthy"""
        try:
            response = requests.get(f"{self.base_url}/health", timeout=2)
            return response.status_code == 200
        except Exception as e:
            logger.error(f"FF1000 health check failed: {e}")
            return False
    
    def _call_predict(self, model_name: str, item_ids: List[str], limit: int = 10) -> Optional[List[Dict]]:
        """Call FF1000 predict endpoint"""
        try:
            response = requests.post(
                f"{self.base_url}/predict/{model_name}",
                json={"items": item_ids},
                timeout=5
            )
            
            if response.status_code == 200:
                data = response.json()
                predictions = data.get("predictions", [])
                
                if predictions:
                    # Get the first prediction result
                    result = predictions[0]
                    item_ids_result = result.get("item_ids", [])[:limit]
                    titles = result.get("titles", [])[:limit]
                    scores = result.get("scores", [])[:limit]
                    
                    # Build list of recommendations
                    recommendations = []
                    posters = result.get("posters", [])[:limit]
                    premiere_years = result.get("premiere_years", [])[:limit]
                    
                    for i, (item_id, title, score) in enumerate(zip(item_ids_result, titles, scores)):
                        rec = {
                            "item_id": item_id,
                            "title": title,
                            "score": float(score),
                            "rank": i + 1
                        }
                        # Add poster if available
                        if i < len(posters) and posters[i]:
                            rec["poster"] = posters[i]
                        # Add premiere year if available
                        if i < len(premiere_years) and premiere_years[i] is not None:
                            rec["year"] = int(premiere_years[i])
                        recommendations.append(rec)
                        # Cache the mapping
                        self.item_cache[item_id] = title
                    
                    return recommendations
            else:
                logger.error(f"FF1000 API error: {response.status_code} - {response.text}")
                return None
                
        except Exception as e:
            logger.error(f"Error calling FF1000: {e}")
            return None
    
    def get_more_like_this(self, seed_title: str, seed_item_id: Optional[str] = None, limit: int = 2) -> List[Dict]:
        """
        Get similar items using the similarity model
        
        Args:
            seed_title: The title to find similar items for
            seed_item_id: Optional item ID if known
            limit: Number of recommendations to return
            
        Returns:
            List of recommendation dicts with title, item_id, score
        """
        if not self.is_available:
            return self._fallback_more_like_this(seed_title, limit)
        
        # If we don't have the item ID, try to find it (in a real system, you'd have a lookup)
        if not seed_item_id:
            logger.warning(f"No item_id provided for '{seed_title}', using fallback")
            return self._fallback_more_like_this(seed_title, limit)
        
        # Request extra recommendations to account for filtering
        recommendations = self._call_predict("similarity", [seed_item_id], limit=(limit * 3) + 1)
        
        if recommendations:
            # Filter out the seed item itself and non-valid titles (ASL, trailers, collections, etc.)
            filtered = [
                r for r in recommendations 
                if r["item_id"] != seed_item_id and self._is_valid_title(r["title"])
            ][:limit]
            return filtered
        
        return self._fallback_more_like_this(seed_title, limit)
    
    @staticmethod
    def _is_asl_version(title: str) -> bool:
        """Check if a title is an ASL version"""
        import re
        return bool(re.search(r'\(with ASL\)|with ASL|\(ASL\)|ASL Edition', title, re.IGNORECASE))
    
    @staticmethod
    def _is_valid_title(title: str) -> bool:
        """
        Check if a title is a valid content title (not a collection, trailer, etc.)
        
        Returns False for:
        - ASL versions
        - Trailers, teasers, previews
        - Collection/rail titles (e.g., "What's On in October")
        - Behind-the-scenes content
        """
        import re
        
        # Filter out ASL versions
        if re.search(r'\(with ASL\)|with ASL|\(ASL\)|ASL Edition', title, re.IGNORECASE):
            return False
        
        # Filter out trailers and promotional content
        if re.search(r'trailer|teaser|preview|sneak peek', title, re.IGNORECASE):
            return False
        
        # Filter out collection/rail titles
        if re.search(r"what's on|coming soon|streaming this|years of|reframed:|craziest|the \d{4}s|new this|this month|this week", title, re.IGNORECASE):
            return False
        
        # Filter out behind-the-scenes and bonus content
        if re.search(r'behind the scenes|making of|featurette|bonus feature|deleted scene', title, re.IGNORECASE):
            return False
        
        return True
    
    def get_something_else(
        self, 
        current_title: str, 
        current_item_id: Optional[str] = None, 
        diversity_level: int = 1,
        exclude_item_ids: Optional[List[str]] = None,
        exclude_titles: Optional[List[str]] = None,
        limit: int = 1
    ) -> Optional[Dict]:
        """
        Get a different recommendation using the RFY model
        
        Supports progressive diversity: the higher the diversity_level, the wider
        the range of recommendations (less similarity filtering).
        
        Args:
            current_title: The current title to replace
            current_item_id: Optional item ID if known
            diversity_level: How diverse the recommendation should be (1-10+)
                            1-2: Filter top 20 similar items (conservative)
                            3-4: Filter top 15 similar items (good diversity)
                            5-6: Filter top 10 similar items (more variety)
                            7+: Filter top 5 similar items (maximum variety)
            exclude_item_ids: Item IDs to exclude from recommendations
            exclude_titles: Titles to exclude from recommendations
            limit: Number of recommendations to return (typically 1 for replacement)
            
        Returns:
            A single recommendation dict or None
        """
        if not self.is_available:
            return self._fallback_something_else(current_title)
        
        if exclude_item_ids is None:
            exclude_item_ids = []
        if exclude_titles is None:
            exclude_titles = []
        
        if not current_item_id:
            logger.warning(f"No item_id provided for '{current_title}', using fallback")
            return self._fallback_something_else(current_title)
        
        # "Something Else" should feel DIFFERENT from the start
        # Strategy: Filter top similar + pick from middle of RFY results
        # Sweet spot: Filter enough for variety, but not so much we run out
        similar_item_ids = set()
        
        # Always filter similarity - "Something Else" means DIFFERENT!
        # Level 1-2: Filter top 5 similar items (good starting point)
        # Level 3-4: Filter top 5 similar items (consistent diversity)
        # Level 5-6: Filter top 3 similar items (more variety)
        # Level 7+: Filter top 2 similar items (maximum variety)
        if diversity_level <= 2:
            similarity_limit = 5   # Good starting point
        elif diversity_level <= 4:
            similarity_limit = 5   # Consistent diversity
        elif diversity_level <= 6:
            similarity_limit = 3   # More variety
        else:
            similarity_limit = 2    # Maximum variety
        
        try:
            similarity_results = self._call_predict("similarity", [current_item_id], limit=similarity_limit)
            if similarity_results:
                similar_item_ids = {r["item_id"] for r in similarity_results}
                logger.info(f"Diversity level {diversity_level}: Filtering out top {len(similar_item_ids)} similar items")
        except Exception as e:
            logger.warning(f"Could not get similarity results for filtering: {e}")
        
        # Use RFY model to get diverse recommendations (request more for better variety)
        recommendations = self._call_predict("rfy", [current_item_id], limit=200)
        
        if recommendations:
            # Convert exclude lists to sets for faster lookup
            exclude_item_ids_set = set(exclude_item_ids)
            exclude_titles_lower = {t.lower() for t in exclude_titles}
            
            # Filter out:
            # 1. Non-valid titles (ASL, trailers, collections, etc.)
            # 2. Items that would appear in "More Like This" results (based on diversity)
            # 3. Items explicitly excluded by the frontend
            filtered = [
                r for r in recommendations 
                if (self._is_valid_title(r["title"]) and 
                    r["item_id"] not in similar_item_ids and
                    r["item_id"] not in exclude_item_ids_set and
                    r["title"].lower() not in exclude_titles_lower)
            ]
            
            logger.info(f"After filtering: {len(filtered)} recommendations from {len(recommendations)}")
            
            if not filtered:
                logger.warning("No sufficiently different recommendations found after filtering")
                return self._fallback_something_else(current_title)
            
            # Pick from MIDDLE of recommendations for "Something Else" to feel different
            # Skip the very top (too similar) but stay in quality range
            if diversity_level <= 2:
                # Level 1-2: Pick from positions 10-45 (skip top 10, get different content)
                start_idx = min(10, len(filtered) - 1)
                end_idx = min(45, len(filtered))
            elif diversity_level <= 4:
                # Level 3-4: Pick from positions 20-65 (more variety)
                start_idx = min(20, len(filtered) - 1)
                end_idx = min(65, len(filtered))
            else:
                # Level 5+: Pick from positions 30-90 (maximum variety)
                start_idx = min(30, len(filtered) - 1)
                end_idx = min(90, len(filtered))
            
            if end_idx > start_idx:
                choice = random.choice(filtered[start_idx:end_idx])
            elif len(filtered) > 0:
                # Fallback: pick from whatever we have
                choice = random.choice(filtered[:min(50, len(filtered))])
            else:
                choice = None
            
            logger.info(f"Selected '{choice['title']}' as 'Something Else' for '{current_title}'")
            return choice
        
        return self._fallback_something_else(current_title)
    
    def _fallback_more_like_this(self, seed_title: str, limit: int = 2) -> List[Dict]:
        """Fallback when ML service is unavailable"""
        # Mock similar titles (without poster URLs since these are fallback)
        fallback_titles = [
            "Barbie", "Oppenheimer", "The Matrix", "Inception", "Interstellar",
            "The Dark Knight", "Pulp Fiction", "Fight Club", "Forrest Gump",
            "The Shawshank Redemption", "The Godfather", "Goodfellas", "The Prestige"
        ]
        
        # Remove seed title
        available = [t for t in fallback_titles if t.lower() != seed_title.lower()]
        random.shuffle(available)
        
        return [
            {
                "title": title,
                "item_id": f"mock-{title.lower().replace(' ', '-')}",
                "score": random.random(),
                "year": random.choice([2021, 2022, 2023, 2024]),
                "poster": None  # Fallback data doesn't have posters
            }
            for title in available[:limit]
        ]
    
    def _fallback_something_else(self, current_title: str) -> Optional[Dict]:
        """Fallback when ML service is unavailable"""
        fallback_titles = [
            "The Social Network", "Arrival", "Blade Runner 2049", "Mad Max: Fury Road",
            "Parasite", "Get Out", "Whiplash", "Moonlight", "La La Land", "The Grand Budapest Hotel"
        ]
        
        # Remove current title
        available = [t for t in fallback_titles if t.lower() != current_title.lower()]
        
        if available:
            title = random.choice(available)
            return {
                "title": title,
                "item_id": f"mock-{title.lower().replace(' ', '-')}",
                "score": random.random(),
                "year": random.choice([2021, 2022, 2023, 2024]),
                "poster": None  # Fallback data doesn't have posters
            }
        
        return None
    
    def get_catalog_info(self) -> Dict:
        """Get information about the catalog"""
        return {
            "is_available": self.is_available,
            "base_url": self.base_url,
            "cached_items": len(self.item_cache)
        }


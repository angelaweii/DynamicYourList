"""
Catalog Service - Provides access to content metadata
"""
import logging
import requests
from typing import Optional, Dict, List

logger = logging.getLogger(__name__)


class CatalogService:
    """Service for accessing content catalog metadata"""
    
    def __init__(self, ff1000_base_url: str = "http://localhost:8080"):
        self.base_url = ff1000_base_url
        self.is_available = self._check_health()
        
        # Cache for item metadata
        self.metadata_cache: Dict[str, Dict] = {}
        
        if self.is_available:
            logger.info("FF1000 catalog service is available")
            self._load_catalog()
        else:
            logger.warning("FF1000 catalog service is NOT available")
    
    def _check_health(self) -> bool:
        """Check if FF1000 service is healthy"""
        try:
            response = requests.get(f"{self.base_url}/health", timeout=2)
            return response.status_code == 200
        except Exception as e:
            logger.error(f"FF1000 health check failed: {e}")
            return False
    
    def _load_catalog(self):
        """Load catalog metadata from FF1000"""
        try:
            # Try to get catalog data from FF1000
            # For now, we'll use the embeddings endpoint approach
            # In a production system, this might be a dedicated catalog endpoint
            logger.info("Catalog metadata will be loaded on-demand")
        except Exception as e:
            logger.error(f"Error loading catalog: {e}")
    
    def get_poster_by_item_id(self, item_id: str) -> Optional[str]:
        """
        Get poster URL for a specific item ID
        
        Args:
            item_id: The item ID to look up
            
        Returns:
            Poster URL string or None if not found
        """
        # Check cache first
        if item_id in self.metadata_cache:
            return self.metadata_cache[item_id].get('poster')
        
        # For now, we need to query the embeddings directly
        # In production, this would hit a proper catalog API
        return None
    
    def get_posters_by_item_ids(self, item_ids: List[str]) -> Dict[str, Optional[str]]:
        """
        Get poster URLs for multiple item IDs
        
        Args:
            item_ids: List of item IDs to look up
            
        Returns:
            Dictionary mapping item_id to poster URL (or None)
        """
        result = {}
        for item_id in item_ids:
            result[item_id] = self.get_poster_by_item_id(item_id)
        return result
    
    def get_metadata_by_item_id(self, item_id: str) -> Optional[Dict]:
        """
        Get full metadata for a specific item ID
        
        Args:
            item_id: The item ID to look up
            
        Returns:
            Dictionary with item metadata or None if not found
        """
        if item_id in self.metadata_cache:
            return self.metadata_cache[item_id]
        return None


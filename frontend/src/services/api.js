/**
 * API Service for backend communication
 * Handles ML recommendations and other API calls
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

/**
 * Check if ML service is available
 * @returns {Promise<Object>} ML service status
 */
export async function checkMLStatus() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/ml/status`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error checking ML status:', error);
    return { is_available: false, error: error.message };
  }
}

/**
 * Get "More Like This" recommendations
 * @param {string} seedTitle - The title to find similar items for
 * @param {string|null} seedItemId - Optional item ID if known
 * @param {number} limit - Number of recommendations to return (default: 2)
 * @returns {Promise<Array>} Array of recommendations
 */
export async function getMoreLikeThis(seedTitle, seedItemId = null, limit = 2) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/more-like-this`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        seed_title: seedTitle,
        seed_item_id: seedItemId,
        limit: limit,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const recommendations = await response.json();
    return recommendations;
  } catch (error) {
    console.error('Error getting "More Like This" recommendations:', error);
    // Return fallback recommendations
    return generateFallbackRecommendations(seedTitle, limit);
  }
}

/**
 * Get "Something Else" recommendation
 * @param {string} currentTitle - The current title to replace
 * @param {string|null} currentItemId - Optional item ID if known
 * @param {number} diversityLevel - How diverse the recommendation should be (1-10+)
 * @param {Array<string>} excludeItemIds - Item IDs to exclude from recommendations
 * @param {Array<string>} excludeTitles - Titles to exclude from recommendations
 * @returns {Promise<Object>} A single recommendation
 */
export async function getSomethingElse(
  currentTitle, 
  currentItemId = null, 
  diversityLevel = 1,
  excludeItemIds = [],
  excludeTitles = []
) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/something-else`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        current_title: currentTitle,
        current_item_id: currentItemId,
        diversity_level: diversityLevel,
        exclude_item_ids: excludeItemIds,
        exclude_titles: excludeTitles,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const recommendation = await response.json();
    return recommendation;
  } catch (error) {
    console.error('Error getting "Something Else" recommendation:', error);
    // Return fallback recommendation
    return generateFallbackRecommendations(currentTitle, 1)[0];
  }
}

/**
 * Generate fallback recommendations when ML service is unavailable
 * @param {string} seedTitle - The seed title
 * @param {number} limit - Number of recommendations
 * @returns {Array} Array of fallback recommendations
 */
function generateFallbackRecommendations(seedTitle, limit = 2) {
  const fallbackTitles = [
    { title: 'The Matrix', year: 1999 },
    { title: 'Inception', year: 2010 },
    { title: 'Interstellar', year: 2014 },
    { title: 'The Dark Knight', year: 2008 },
    { title: 'Pulp Fiction', year: 1994 },
    { title: 'Fight Club', year: 1999 },
    { title: 'Forrest Gump', year: 1994 },
    { title: 'The Shawshank Redemption', year: 1994 },
    { title: 'The Godfather', year: 1972 },
    { title: 'Goodfellas', year: 1990 },
    { title: 'The Prestige', year: 2006 },
    { title: 'Blade Runner 2049', year: 2017 },
    { title: 'Arrival', year: 2016 },
    { title: 'Parasite', year: 2019 },
    { title: 'Get Out', year: 2017 },
  ];

  // Filter out the seed title
  const available = fallbackTitles.filter(
    (item) => item.title.toLowerCase() !== seedTitle.toLowerCase()
  );

  // Shuffle and take the first 'limit' items
  const shuffled = available.sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, limit);

  return selected.map((item) => ({
    title: item.title,
    item_id: `fallback-${item.title.toLowerCase().replace(/\s+/g, '-')}`,
    score: Math.random(),
    year: item.year,
  }));
}

/**
 * Export all API functions as a single object
 */
const api = {
  checkMLStatus,
  getMoreLikeThis,
  getSomethingElse,
};

export default api;


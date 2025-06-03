/**
 * Web Worker for Heavy Data Processing
 * Handles analytics data processing, sorting, filtering off the main thread
 */

// Data processing functions
function processAnalyticsData(data, options = {}) {
  const {
    sortBy = 'name',
    filterBy = {},
    searchTerm = '',
    categories = []
  } = options;

  let processed = [...data];

  // Apply search filter
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    processed = processed.filter(item => 
      item.name?.toLowerCase().includes(term) ||
      item.description?.toLowerCase().includes(term) ||
      item.categories?.toLowerCase().includes(term)
    );
  }

  // Apply category filter
  if (categories.length > 0) {
    processed = processed.filter(item =>
      categories.some(cat => 
        item.categories?.toLowerCase().includes(cat.toLowerCase())
      )
    );
  }

  // Apply other filters
  Object.keys(filterBy).forEach(key => {
    if (filterBy[key] !== undefined && filterBy[key] !== null) {
      processed = processed.filter(item => item[key] === filterBy[key]);
    }
  });

  // Sort data
  processed.sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name?.localeCompare(b.name) || 0;
      case 'popularity':
        return (b.popularity || 0) - (a.popularity || 0);
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'newest':
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      default:
        return 0;
    }
  });

  return processed;
}

function calculateAnalytics(items) {
  if (!items || items.length === 0) return {};

  const totalItems = items.length;
  const categories = new Set();
  const ratingSum = items.reduce((sum, item) => {
    if (item.categories) {
      item.categories.split(',').forEach(cat => 
        categories.add(cat.trim().toLowerCase())
      );
    }
    return sum + (item.rating || 0);
  }, 0);

  return {
    totalItems,
    uniqueCategories: categories.size,
    averageRating: ratingSum / totalItems,
    categoryBreakdown: Array.from(categories).map(cat => ({
      name: cat,
      count: items.filter(item => 
        item.categories?.toLowerCase().includes(cat)
      ).length
    }))
  };
}

function optimizeSearchResults(results, limit = 50) {
  // Limit results for performance
  const limited = results.slice(0, limit);
  
  // Pre-process display data
  return limited.map(item => ({
    ...item,
    displayName: item.name || 'Untitled',
    displayDescription: item.description?.substring(0, 150) + '...' || '',
    searchScore: calculateSearchScore(item),
  }));
}

function calculateSearchScore(item) {
  // Simple scoring algorithm
  let score = 0;
  if (item.rating) score += item.rating * 10;
  if (item.popularity) score += item.popularity;
  if (item.featured) score += 50;
  return score;
}

// Message handler
self.onmessage = function(e) {
  const { type, data, options, requestId } = e.data;

  try {
    let result;

    switch (type) {
      case 'PROCESS_DATA':
        result = processAnalyticsData(data, options);
        break;
      
      case 'CALCULATE_ANALYTICS':
        result = calculateAnalytics(data);
        break;
      
      case 'OPTIMIZE_SEARCH':
        result = optimizeSearchResults(data, options?.limit);
        break;
      
      case 'HEAVY_COMPUTATION':
        // Simulate heavy computation
        result = data.map(item => ({
          ...item,
          processed: true,
          timestamp: Date.now()
        }));
        break;
      
      default:
        throw new Error(`Unknown task type: ${type}`);
    }

    // Send result back to main thread
    self.postMessage({
      type: 'SUCCESS',
      requestId,
      result
    });

  } catch (error) {
    // Send error back to main thread
    self.postMessage({
      type: 'ERROR',
      requestId,
      error: error.message
    });
  }
}; 
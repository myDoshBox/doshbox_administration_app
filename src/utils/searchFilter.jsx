// utils/searchFilter.js (no external packages)

/**
 * Generic React-based search filter for any dataset
 * @param {Array} items - The array of data objects
 * @param {string} query - Search query string
 * @param {Array<string>} fields - Keys to match in each object
 * @param {Object} options - Optional transform logic per field
 * @returns {Array} - Filtered array
 */
export function filterItems(items, query, fields = [], options = {}) {
  if (!query || !Array.isArray(items)) return items;

  const lowerQuery = query.toLowerCase().trim();

  return items.filter(item => {
    return fields.some(field => {
      let value = '';

      // Use custom transformation if provided
      if (typeof options[field] === 'function') {
        value = options[field](item);
      } else {
        // Support nested fields like 'user.name'
        const keys = field.split('.');
        value = keys.reduce((acc, key) => acc?.[key], item);
      }

      return String(value || '').toLowerCase().includes(lowerQuery);
    });
  });
}


// USAGE EXAMPLE for Mediators (in GetAllMediators.jsx):

/*
const filteredMediators = useMemo(() => {
  return filterItems(sortedMediators, searchQuery, [
    'first_name',
    'middle_name',
    'last_name',
    'mediator_email',
    'mediator_phone_number',
    'createdAt',
  ], {
    // Join names for full-name support
    fullName: (item) => `${item.first_name || ''} ${item.middle_name || ''} ${item.last_name || ''}`,
    createdAt: (item) => {
      const date = new Date(item.createdAt);
      return isNaN(date.getTime()) ? '' : `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2,'0')}-${date.getDate().toString().padStart(2,'0')} ${date.getHours().toString().padStart(2,'0')}:${date.getMinutes().toString().padStart(2,'0')}`;
    }
  });
}, [sortedMediators, searchQuery]);
*/

// utils/searchFilter.js


import dayjs from 'dayjs';

/**
 * Generic search filter for any dataset
 * @param {Array} items - The data list
 * @param {string} query - The search text
 * @param {Array<string>} fields - The fields to search
 * @param {Object} options - Custom transformation rules per field
 * @returns {Array} Filtered list
 */
export function filterItems(items, query, fields = [], options = {}) {
  const lowerQuery = query.toLowerCase();

  return items.filter(item => {
    const searchableValues = fields.map(field => {
      if (options[field]) {
        return options[field](item)?.toLowerCase?.() || '';
      }

      // Auto handle date objects
      const value = item[field];
      if (field.toLowerCase().includes('date') || field.toLowerCase().includes('time')) {
        return dayjs(value).isValid() ? dayjs(value).format('YYYY-MM-DD HH:mm').toLowerCase() : '';
      }

      return String(value || '').toLowerCase();
    });

    return searchableValues.some(val => val.includes(lowerQuery));
  });
}








// export function filterItems(items, query, fields) {
//     if (!query) return items;
  
//     const lowerQuery = query.toLowerCase();
  
//     return items.filter((item) =>
//       fields.some((field) => {
//         const value = item[field];
//         return value && value.toString().toLowerCase().includes(lowerQuery);
//       })
//     );
//   }
  
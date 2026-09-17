/**
 * Format number with commas
 * @param {number} num - The number to format
 * @returns {string} Formatted number with commas
 */
export const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  /**
   * Format currency
   * @param {number} amount - The amount to format
   * @param {string} currency - The currency code (default: USD)
   * @returns {string} Formatted currency
   */
  export const formatCurrency = (amount, currency = "USD") => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  };
  
  /**
   * Format date
   * @param {Date|string} date - The date to format
   * @param {string} format - The format to use (default: 'MMMM dd, yyyy')
   * @returns {string} Formatted date
   */
  export const formatDate = (date, format = 'MMM dd, yyyy') => {
    const d = new Date(date);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const year = d.getFullYear();
    const month = months[d.getMonth()];
    const day = d.getDate().toString().padStart(2, '0');
    
    return format
      .replace('yyyy', year)
      .replace('MMM', month)
      .replace('dd', day);
  };
  
  /**
   * Truncate text with ellipsis
   * @param {string} text - The text to truncate
   * @param {number} length - The maximum length before truncation
   * @returns {string} Truncated text
   */
  export const truncateText = (text, length = 100) => {
    if (!text) return '';
    return text.length > length ? `${text.substring(0, length)}...` : text;
  };
  
  /**
   * Generate random color for charts
   * @returns {string} Random HEX color
   */
  export const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  
  /**
   * Calculate percentage change
   * @param {number} current - Current value
   * @param {number} previous - Previous value
   * @returns {number} Percentage change
   */
  export const calculatePercentageChange = (current, previous) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };
  
  /**
   * Debounce function
   * @param {Function} func - The function to debounce
   * @param {number} wait - Wait time in milliseconds
   * @returns {Function} Debounced function
   */
  export const debounce = (func, wait = 300) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };
  
  /**
   * Get status color based on status string
   * @param {string} status - The status
   * @returns {string} Color code
   */
  export const getStatusColor = (status) => {
    const statusMap = {
      pending: '#FFA000',
      processing: '#3B82F6',
      shipped: '#10B981',
      delivered: '#2E7D32',
      cancelled: '#EF4444',
      returned: '#6B7280',
      completed: '#2E7D32',
      active: '#10B981',
      inactive: '#6B7280',
    };
    
    return statusMap[status.toLowerCase()] || '#6B7280';
  };
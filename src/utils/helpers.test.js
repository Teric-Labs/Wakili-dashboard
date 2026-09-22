import {
  formatNumber,
  formatCurrency,
  formatDate,
  truncateText,
  getRandomColor,
  calculatePercentageChange,
  debounce,
  getStatusColor,
} from './helpers';

describe('formatNumber', () => {
  it('adds thousands separators', () => {
    expect(formatNumber(1234567)).toBe('1,234,567');
  });

  it('leaves small numbers unchanged', () => {
    expect(formatNumber(42)).toBe('42');
  });
});

describe('formatCurrency', () => {
  it('formats USD by default', () => {
    const expected = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(1000);
    expect(formatCurrency(1000)).toBe(expected);
  });

  it('formats a different currency when given one', () => {
    const expected = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' }).format(50);
    expect(formatCurrency(50, 'EUR')).toBe(expected);
  });
});

describe('formatDate', () => {
  it('formats a Date using the default MMM dd, yyyy pattern', () => {
    expect(formatDate(new Date(2024, 0, 15))).toBe('Jan 15, 2024');
  });

  it('respects a custom format string', () => {
    expect(formatDate(new Date(2024, 5, 3), 'yyyy-MMM-dd')).toBe('2024-Jun-03');
  });
});

describe('truncateText', () => {
  it('returns an empty string for falsy input', () => {
    expect(truncateText(null)).toBe('');
    expect(truncateText(undefined)).toBe('');
    expect(truncateText('')).toBe('');
  });

  it('returns text unchanged when under the limit', () => {
    expect(truncateText('short text', 100)).toBe('short text');
  });

  it('truncates with an ellipsis when over the limit', () => {
    expect(truncateText('abcdefghij', 5)).toBe('abcde...');
  });
});

describe('getRandomColor', () => {
  it('returns a valid 6-digit hex color', () => {
    expect(getRandomColor()).toMatch(/^#[0-9A-F]{6}$/);
  });
});

describe('calculatePercentageChange', () => {
  it('computes percentage increase', () => {
    expect(calculatePercentageChange(150, 100)).toBe(50);
  });

  it('computes percentage decrease', () => {
    expect(calculatePercentageChange(50, 100)).toBe(-50);
  });

  it('returns 0 when previous is 0 (avoids divide-by-zero)', () => {
    expect(calculatePercentageChange(100, 0)).toBe(0);
  });
});

describe('debounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('only invokes the function once after rapid calls settle', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 200);

    debounced();
    debounced();
    debounced();

    expect(fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(200);

    expect(fn).toHaveBeenCalledTimes(1);
  });
});

describe('getStatusColor', () => {
  it('maps known statuses to their color', () => {
    expect(getStatusColor('pending')).toBe('#FFA000');
    expect(getStatusColor('completed')).toBe('#2E7D32');
  });

  it('is case-insensitive', () => {
    expect(getStatusColor('PENDING')).toBe('#FFA000');
  });

  it('falls back to a default color for unknown statuses', () => {
    expect(getStatusColor('unknown-status')).toBe('#6B7280');
  });
});

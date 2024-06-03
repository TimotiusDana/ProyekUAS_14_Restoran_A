import { Revenue } from './definitions';

// Function to format currency
export const formatCurrency = (amount: number) => {
  return (amount / 10).toLocaleString('en-US', {
    style: 'currency',
    currency: 'IDR',
  });
};

// Function to format date to a specified locale
export const formatDate = (dateString: string | Date, locale = 'en-ID') => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date value: ${dateString}`);
  }

  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

// Function to format date to local format
export const formatDateToLocal = (dateString: string | Date) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(); // Customize the date format as needed
};

// Function to generate y-axis labels for a chart
export const generateYAxis = (revenue: Revenue[]) => {
  const yAxisLabels = [];
  const highestRecord = Math.max(...revenue.map((month) => month.revenue));
  const topLabel = Math.ceil(highestRecord / 1000) * 1000;

  for (let i = topLabel; i >= 0; i -= 1000) {
    yAxisLabels.push(`$${i / 1000}K`);
  }

  return { yAxisLabels, topLabel };
};

// Function to generate pagination
export const generatePagination = (currentPage: number, totalPages: number) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};

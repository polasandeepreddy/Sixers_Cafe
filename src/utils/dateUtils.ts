// Format date to YYYY-MM-DD
export const format = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };
  
  // Add days to a date
  export const addDays = (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };
  
  // Format date to display format
  export const formatDisplayDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
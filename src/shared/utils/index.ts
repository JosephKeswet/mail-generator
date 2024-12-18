export function formatDate(isoDateString) {
  const date = new Date(isoDateString);

  // Format using Intl.DateTimeFormat
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long', // 'Monday'
    year: 'numeric', // '2024'
    month: 'long', // 'December'
    day: 'numeric', // '18'
    hour: 'numeric', // '6 PM'
    minute: 'numeric', // '56'
    second: 'numeric', // '12'
    hour12: true, // 12-hour format (AM/PM)
  }).format(date);
}

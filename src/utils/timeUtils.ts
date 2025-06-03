export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  const remainingMinutes = minutes % 60;

  if (days > 0) {
    return `${days}天${remainingHours}小时`;
  }
  if (hours > 0) {
    return `${hours}小时${remainingMinutes}分钟`;
  }
  return `${minutes}分钟`;
}; 
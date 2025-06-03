export const getRandomMessage = (messages: string[]): string => {
  if (!messages || messages.length === 0) return '';
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
}; 
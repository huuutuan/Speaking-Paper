export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const parseTime = (time: string): number => {
  const [mins, secs] = time.split(':').map(Number);
  return mins * 60 + secs;
};
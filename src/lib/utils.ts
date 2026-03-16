export function classNames(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(date: Date) {
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatTime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}시간 ${minutes}분`;
  }
  if (minutes > 0) {
    return `${minutes}분`;
  }
  return `${secs}초`;
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

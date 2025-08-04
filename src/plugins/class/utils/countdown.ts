export function getTimeFrame(mode: string, length: number): number {
  const timeRanges: Record<string, [number, number]> = {
    easy: [8, 12],
    medium: [5, 9],
    hard: [3, 6],
  };

  const [min, max] = timeRanges[mode] ?? [6, 10];

  const secondsPerItem = Math.floor(Math.random() * (max - min + 1)) + min;
  return secondsPerItem * length;
}

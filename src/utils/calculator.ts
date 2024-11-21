import { roundToNearestMinutes } from 'date-fns';

export interface Prescription {
  name: string;
  timesPerDay: number;
}

export const prescriptions: Prescription[] = [
  { name: 'Maxidex', timesPerDay: 2 },
  { name: 'Flarex', timesPerDay: 8 },
  { name: 'Ciloxan', timesPerDay: 4 },
  { name: 'Artificial Tears', timesPerDay: 4 },
];

export function prescriptionsToTimeline(
  startOfDay: string,
  endOfDay: string,
  prescriptions: Prescription[]
) {
  const startOfDayTime = new Date(startOfDay).getTime();
  const endOfDayTime = new Date(endOfDay).getTime();
  const timeline = [];
  for (const prescription of prescriptions) {
    for (let i = 0; i < prescription.timesPerDay; i++) {
      const time = new Date(
        startOfDayTime + ((endOfDayTime - startOfDayTime) / (prescription.timesPerDay - 1)) * i
      );
      timeline.push({ time: roundToNearestMinutes(time, { nearestTo: 15 }), prescription });
    }
  }
  timeline.sort((a, b) => a.time.getTime() - b.time.getTime());
  return withDatesAsStrings(withGaps(timeline, 10));
}

export function withGaps<T extends { time: Date }>(timeline: T[], gapMinutes: number): T[] {
  const gapMilliseconds = gapMinutes * 60 * 1000;
  const updatedTimeline: T[] = [];
  let previousTime = 0;
  for (let i = 0; i < timeline.length; i++) {
    const nextTime = new Date(Math.max(timeline[i].time.getTime(), previousTime + gapMilliseconds));
    updatedTimeline.push({ ...timeline[i], time: nextTime });
    previousTime = nextTime.getTime();
  }
  return updatedTimeline;
}

export function withDatesAsStrings<T extends { time: Date }>(
  timeline: T[]
): ({ time: string } & Omit<T, 'time'>)[] {
  return timeline.map((item) => ({ ...item, time: item.time.toISOString() }));
}

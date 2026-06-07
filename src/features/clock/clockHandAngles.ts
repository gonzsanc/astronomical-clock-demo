export interface ClockHandAngles {
  hour: number;
  minute: number;
}

export function clockHandAngles(date: Date): ClockHandAngles {
  const minutes = date.getMinutes();
  const hours = date.getHours() % 12;

  return {
    hour: hours * 30 + minutes * 0.5,
    minute: minutes * 6
  };
}

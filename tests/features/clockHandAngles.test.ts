import { describe, expect, test } from 'vitest';
import { clockHandAngles } from '../../src/features/clock/clockHandAngles';

describe('clockHandAngles', () => {
  test('places both hands at twelve at midnight', () => {
    expect(clockHandAngles(new Date('2026-06-07T00:00:00')).hour).toBe(0);
    expect(clockHandAngles(new Date('2026-06-07T00:00:00')).minute).toBe(0);
  });

  test('uses minutes to advance the hour hand', () => {
    expect(clockHandAngles(new Date('2026-06-07T03:30:00')).hour).toBe(105);
    expect(clockHandAngles(new Date('2026-06-07T03:30:00')).minute).toBe(180);
  });

  test('ignores seconds so hands update by minute', () => {
    expect(clockHandAngles(new Date('2026-06-07T13:27:30')).hour).toBe(43.5);
    expect(clockHandAngles(new Date('2026-06-07T13:27:30')).minute).toBe(162);
    expect(clockHandAngles(new Date('2026-06-07T13:27:59'))).toEqual(
      clockHandAngles(new Date('2026-06-07T13:27:00'))
    );
  });
});

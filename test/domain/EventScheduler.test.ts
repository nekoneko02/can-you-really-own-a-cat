import { EventScheduler } from '@/domain/EventScheduler';

describe('EventScheduler', () => {
  describe('schedule generation', () => {
    it('should always include day 1', () => {
      const scheduler = new EventScheduler();

      expect(scheduler.hasEventOnDay(1)).toBe(true);
      expect(scheduler.getEventIdForDay(1)).toBe('night_crying_day1');
    });

    it('should select exactly 2 days from days 2-7', () => {
      const scheduler = new EventScheduler();

      // 2-7日目のうち、2日だけイベントがある
      let eventCount = 0;
      for (let day = 2; day <= 7; day++) {
        if (scheduler.hasEventOnDay(day)) {
          eventCount++;
        }
      }

      expect(eventCount).toBe(2);
    });

    it('should have exactly 3 events in total', () => {
      const scheduler = new EventScheduler();

      const schedule = scheduler.getSchedule();
      expect(schedule.size).toBe(3);
    });

    it('should assign unique event IDs', () => {
      const scheduler = new EventScheduler();

      const schedule = scheduler.getSchedule();
      const eventIds = Array.from(schedule.values());

      // すべてのイベントIDがユニーク
      const uniqueIds = new Set(eventIds);
      expect(uniqueIds.size).toBe(eventIds.length);
    });
  });

  describe('randomness', () => {
    it('should generate different schedules on multiple runs', () => {
      const schedules: string[] = [];

      for (let i = 0; i < 10; i++) {
        const scheduler = new EventScheduler();
        const schedule = scheduler.getSchedule();

        // スケジュールを文字列化（ソート済み）
        const scheduleStr = Array.from(schedule.entries())
          .sort((a, b) => a[0] - b[0])
          .map(([day, eventId]) => `${day}:${eventId}`)
          .join(',');

        schedules.push(scheduleStr);
      }

      // 少なくとも2つ以上の異なるパターンが生成されること
      const uniqueSchedules = new Set(schedules);
      expect(uniqueSchedules.size).toBeGreaterThan(1);
    });
  });

  describe('hasEventOnDay', () => {
    it('should return true for scheduled days', () => {
      const scheduler = new EventScheduler();

      expect(scheduler.hasEventOnDay(1)).toBe(true);
    });

    it('should return false for non-scheduled days', () => {
      const scheduler = new EventScheduler();

      // 8日目はスケジュールにない
      expect(scheduler.hasEventOnDay(8)).toBe(false);
    });
  });

  describe('getEventIdForDay', () => {
    it('should return event ID for scheduled days', () => {
      const scheduler = new EventScheduler();

      const eventId = scheduler.getEventIdForDay(1);
      expect(eventId).toBe('night_crying_day1');
    });

    it('should return null for non-scheduled days', () => {
      const scheduler = new EventScheduler();

      const eventId = scheduler.getEventIdForDay(8);
      expect(eventId).toBeNull();
    });
  });
});
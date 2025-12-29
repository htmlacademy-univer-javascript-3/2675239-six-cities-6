import { describe, it, expect } from 'vitest';
import { roundRating, ratingToPercent, formatHousingType } from './rating';

describe('rating utils', () => {
  describe('roundRating', () => {
    it('should round 3.1 to 3', () => {
      expect(roundRating(3.1)).toBe(3);
    });

    it('should round 4.5 to 5', () => {
      expect(roundRating(4.5)).toBe(5);
    });

    it('should round 4.4 to 4', () => {
      expect(roundRating(4.4)).toBe(4);
    });

    it('should round 0 to 0', () => {
      expect(roundRating(0)).toBe(0);
    });

    it('should round 5 to 5', () => {
      expect(roundRating(5)).toBe(5);
    });
  });

  describe('ratingToPercent', () => {
    it('should convert 3 to 60%', () => {
      expect(ratingToPercent(3)).toBe(60);
    });

    it('should convert 5 to 100%', () => {
      expect(ratingToPercent(5)).toBe(100);
    });

    it('should convert 0 to 0%', () => {
      expect(ratingToPercent(0)).toBe(0);
    });

    it('should round 4.5 to 100%', () => {
      expect(ratingToPercent(4.5)).toBe(100);
    });
  });

  describe('formatHousingType', () => {
    it('should format apartment to Apartment', () => {
      expect(formatHousingType('apartment')).toBe('Apartment');
    });

    it('should format room to Room', () => {
      expect(formatHousingType('room')).toBe('Room');
    });

    it('should format house to House', () => {
      expect(formatHousingType('house')).toBe('House');
    });

    it('should format hotel to Hotel', () => {
      expect(formatHousingType('hotel')).toBe('Hotel');
    });

    it('should handle uppercase input', () => {
      expect(formatHousingType('APARTMENT')).toBe('Apartment');
    });

    it('should handle unknown types', () => {
      expect(formatHousingType('unknown')).toBe('Unknown');
    });
  });
});


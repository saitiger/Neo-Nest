/**
 * Tests for corrected age calculation utilities
 */

import {
  calculateCorrectedAge,
  shouldUseCorrectedAge,
  getGestationalAgeAtBirth,
  formatAgeForDisplay,
} from '../src/utils/correctedAge';

describe('Corrected Age Calculations', () => {
  // Test dates
  const birthDate = new Date('2024-01-15'); // Born January 15, 2024
  const dueDate = new Date('2024-03-01'); // Due March 1, 2024 (6.5 weeks early)
  const currentDate = new Date('2024-06-01'); // Current date June 1, 2024

  describe('calculateCorrectedAge', () => {
    it('should calculate corrected age correctly for preterm baby', () => {
      const result = calculateCorrectedAge(birthDate, dueDate, currentDate);
      
      // Baby is about 19.5 weeks old chronologically
      expect(result.chronologicalAgeInWeeks).toBeCloseTo(19, 0);
      
      // Corrected age should be about 13 weeks (19.5 - 6.5)
      expect(result.correctedAgeInWeeks).toBeCloseTo(13, 0);
      
      // Adjustment should be about 6.5 weeks
      expect(result.adjustmentWeeks).toBeCloseTo(6, 0);
      
      // Should have a display text (could be weeks or months)
      expect(result.displayText).toBeTruthy();
    });

    it('should handle edge case where corrected age would be negative', () => {
      const veryEarlyCurrentDate = new Date('2024-02-01'); // Very early current date
      const result = calculateCorrectedAge(birthDate, dueDate, veryEarlyCurrentDate);
      
      // Corrected age should never be negative
      expect(result.correctedAgeInWeeks).toBeGreaterThanOrEqual(0);
    });

    it('should format display text correctly for different ages', () => {
      // Test weeks display (under 12 weeks)
      const earlyDate = new Date('2024-03-15');
      const earlyResult = calculateCorrectedAge(birthDate, dueDate, earlyDate);
      expect(earlyResult.displayText).toMatch(/^\d+ weeks$/);

      // Test months display (over 12 weeks)
      const laterDate = new Date('2024-08-01');
      const laterResult = calculateCorrectedAge(birthDate, dueDate, laterDate);
      expect(laterResult.displayText).toMatch(/^\d+ months/);
    });
  });

  describe('shouldUseCorrectedAge', () => {
    it('should return true for babies under 24 months corrected age', () => {
      const result = shouldUseCorrectedAge(birthDate, dueDate, currentDate);
      expect(result).toBe(true);
    });

    it('should return false for babies over 24 months corrected age', () => {
      const futureDate = new Date('2026-06-01'); // 2+ years later
      const result = shouldUseCorrectedAge(birthDate, dueDate, futureDate);
      expect(result).toBe(false);
    });
  });

  describe('getGestationalAgeAtBirth', () => {
    it('should calculate gestational age at birth correctly', () => {
      const gestationalAge = getGestationalAgeAtBirth(birthDate, dueDate);
      
      // Baby was born about 6.5 weeks early, so gestational age should be ~33.5 weeks
      expect(gestationalAge).toBeCloseTo(33, 1);
    });

    it('should handle full-term babies', () => {
      const fullTermBirth = new Date('2024-03-01'); // Born on due date
      const gestationalAge = getGestationalAgeAtBirth(fullTermBirth, dueDate);
      
      expect(gestationalAge).toBe(40); // Full term
    });
  });

  describe('formatAgeForDisplay', () => {
    it('should format age display with both corrected and chronological ages', () => {
      const ageResult = calculateCorrectedAge(birthDate, dueDate, currentDate);
      const formatted = formatAgeForDisplay(ageResult);
      
      expect(formatted).toContain('Corrected:');
      expect(formatted).toContain('Actual:');
      expect(formatted).toContain('weeks');
    });
  });
});
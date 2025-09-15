/**
 * Calculate corrected age for preterm babies
 * @param birthDate - Actual birth date
 * @param dueDate - Original due date
 * @returns Corrected age in weeks
 */
export function calculateCorrectedAge(birthDate: Date, dueDate: Date): number {
  const now = new Date();
  const chronologicalAgeMs = now.getTime() - birthDate.getTime();
  const prematureWeeksMs = dueDate.getTime() - birthDate.getTime();
  
  // If born at or after 37 weeks (due date), use chronological age
  if (prematureWeeksMs <= 0) {
    return Math.floor(chronologicalAgeMs / (1000 * 60 * 60 * 24 * 7));
  }
  
  const correctedAgeMs = chronologicalAgeMs - prematureWeeksMs;
  return Math.max(0, Math.floor(correctedAgeMs / (1000 * 60 * 60 * 24 * 7)));
}

/**
 * Format corrected age for display
 * @param ageInWeeks - Age in weeks
 * @returns Formatted string (e.g., "12 weeks", "3 months 2 weeks")
 */
export function formatCorrectedAge(ageInWeeks: number): string {
  if (ageInWeeks < 4) {
    return `${ageInWeeks} week${ageInWeeks !== 1 ? 's' : ''}`;
  }
  
  const months = Math.floor(ageInWeeks / 4.33); // Average weeks per month
  const remainingWeeks = Math.floor(ageInWeeks % 4.33);
  
  if (remainingWeeks === 0) {
    return `${months} month${months !== 1 ? 's' : ''}`;
  }
  
  return `${months} month${months !== 1 ? 's' : ''} ${remainingWeeks} week${remainingWeeks !== 1 ? 's' : ''}`;
}

/**
 * Get weeks premature
 * @param birthDate - Actual birth date
 * @param dueDate - Original due date
 * @returns Number of weeks premature (0 if born on time or late)
 */
export function getWeeksPremature(birthDate: Date, dueDate: Date): number {
  const prematureMs = dueDate.getTime() - birthDate.getTime();
  return Math.max(0, Math.floor(prematureMs / (1000 * 60 * 60 * 24 * 7)));
}
/**
 * Corrected Age Calculation Utilities
 * For preterm babies, corrected age accounts for early birth
 */

export interface BabyProfile {
  birthDate: Date;
  dueDate: Date;
  name?: string;
}

export interface CorrectedAgeResult {
  correctedAgeInWeeks: number;
  correctedAgeInMonths: number;
  chronologicalAgeInWeeks: number;
  chronologicalAgeInMonths: number;
  adjustmentWeeks: number;
  displayText: string;
}

/**
 * Calculate corrected age for a preterm baby
 * @param birthDate - Actual birth date
 * @param dueDate - Original due date
 * @param currentDate - Current date (defaults to today)
 * @returns CorrectedAgeResult with detailed age information
 */
export const calculateCorrectedAge = (
  birthDate: Date,
  dueDate: Date,
  currentDate: Date = new Date()
): CorrectedAgeResult => {
  // Calculate chronological age (actual age since birth)
  const chronologicalAgeMs = currentDate.getTime() - birthDate.getTime();
  const chronologicalAgeInWeeks = Math.floor(chronologicalAgeMs / (7 * 24 * 60 * 60 * 1000));
  const chronologicalAgeInMonths = Math.floor(chronologicalAgeInWeeks / 4.33); // Average weeks per month

  // Calculate adjustment (how early the baby was born)
  const adjustmentMs = dueDate.getTime() - birthDate.getTime();
  const adjustmentWeeks = Math.floor(adjustmentMs / (7 * 24 * 60 * 60 * 1000));

  // Calculate corrected age (chronological age minus adjustment)
  const correctedAgeInWeeks = Math.max(0, chronologicalAgeInWeeks - adjustmentWeeks);
  const correctedAgeInMonths = Math.floor(correctedAgeInWeeks / 4.33);

  // Generate display text
  let displayText = '';
  if (correctedAgeInWeeks < 12) { // Show weeks for first 3 months
    displayText = `${correctedAgeInWeeks} weeks`;
  } else if (correctedAgeInMonths < 24) {
    const remainingWeeks = correctedAgeInWeeks - (correctedAgeInMonths * 4.33);
    if (remainingWeeks >= 2) {
      displayText = `${correctedAgeInMonths} months, ${Math.floor(remainingWeeks)} weeks`;
    } else {
      displayText = `${correctedAgeInMonths} months`;
    }
  } else {
    const years = Math.floor(correctedAgeInMonths / 12);
    const months = correctedAgeInMonths % 12;
    displayText = months > 0 ? `${years} years, ${months} months` : `${years} years`;
  }

  return {
    correctedAgeInWeeks,
    correctedAgeInMonths,
    chronologicalAgeInWeeks,
    chronologicalAgeInMonths,
    adjustmentWeeks,
    displayText,
  };
};

/**
 * Determine if a baby should use corrected age (typically until 2 years)
 * @param birthDate - Actual birth date
 * @param dueDate - Original due date
 * @param currentDate - Current date (defaults to today)
 * @returns boolean indicating if corrected age should be used
 */
export const shouldUseCorrectedAge = (
  birthDate: Date,
  dueDate: Date,
  currentDate: Date = new Date()
): boolean => {
  const correctedAge = calculateCorrectedAge(birthDate, dueDate, currentDate);
  return correctedAge.correctedAgeInMonths < 24; // Use corrected age until 2 years
};

/**
 * Get gestational age at birth
 * @param birthDate - Actual birth date
 * @param dueDate - Original due date
 * @returns gestational age in weeks
 */
export const getGestationalAgeAtBirth = (birthDate: Date, dueDate: Date): number => {
  const fullTermWeeks = 40;
  const adjustmentMs = dueDate.getTime() - birthDate.getTime();
  const adjustmentWeeks = adjustmentMs / (7 * 24 * 60 * 60 * 1000);
  return Math.round(fullTermWeeks - adjustmentWeeks);
};

/**
 * Format age for display in milestone tracking
 * @param ageResult - Result from calculateCorrectedAge
 * @returns formatted string for UI display
 */
export const formatAgeForDisplay = (ageResult: CorrectedAgeResult): string => {
  return `Corrected: ${ageResult.displayText} (Actual: ${Math.floor(ageResult.chronologicalAgeInWeeks)} weeks)`;
};
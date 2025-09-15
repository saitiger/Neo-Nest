import React from 'react';
import { render } from '@testing-library/react-native';
import CorrectedAgeDisplay from '../../src/components/CorrectedAgeDisplay';

describe('CorrectedAgeDisplay Component', () => {
  it('should display corrected age correctly for preterm baby', () => {
    const birthDate = new Date('2024-08-15'); // Born 6 weeks early
    const dueDate = new Date('2024-10-01');
    
    const { getByText } = render(
      <CorrectedAgeDisplay birthDate={birthDate} dueDate={dueDate} />
    );
    
    // Should show corrected age calculation
    expect(getByText(/Corrected Age:/)).toBeTruthy();
  });

  it('should display chronological age for full-term baby', () => {
    const birthDate = new Date('2024-10-01'); // Born on due date
    const dueDate = new Date('2024-10-01');
    
    const { getByText } = render(
      <CorrectedAgeDisplay birthDate={birthDate} dueDate={dueDate} />
    );
    
    // Should show chronological age for full-term
    expect(getByText(/Age:/)).toBeTruthy();
  });

  it('should handle edge case of baby born after due date', () => {
    const birthDate = new Date('2024-10-15'); // Born 2 weeks late
    const dueDate = new Date('2024-10-01');
    
    const { getByText } = render(
      <CorrectedAgeDisplay birthDate={birthDate} dueDate={dueDate} />
    );
    
    // Should show chronological age (no correction needed)
    expect(getByText(/Age:/)).toBeTruthy();
  });

  it('should format age display correctly', () => {
    const birthDate = new Date('2024-06-01'); // Several months old
    const dueDate = new Date('2024-08-01');
    
    const { getByText } = render(
      <CorrectedAgeDisplay birthDate={birthDate} dueDate={dueDate} showFormat="detailed" />
    );
    
    // Should show detailed format with weeks and days
    expect(getByText(/weeks/)).toBeTruthy();
  });

  it('should show compact format when requested', () => {
    const birthDate = new Date('2024-08-01');
    const dueDate = new Date('2024-09-15');
    
    const { getByTestId } = render(
      <CorrectedAgeDisplay 
        birthDate={birthDate} 
        dueDate={dueDate} 
        showFormat="compact"
        testID="corrected-age-compact"
      />
    );
    
    expect(getByTestId('corrected-age-compact')).toBeTruthy();
  });

  it('should handle invalid dates gracefully', () => {
    const birthDate = new Date('invalid-date');
    const dueDate = new Date('2024-10-01');
    
    const { getByText } = render(
      <CorrectedAgeDisplay birthDate={birthDate} dueDate={dueDate} />
    );
    
    // Should show error state or fallback
    expect(getByText(/Unable to calculate/)).toBeTruthy();
  });
});
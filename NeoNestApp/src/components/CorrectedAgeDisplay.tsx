import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useBabyProfile} from '../contexts/BabyProfileContext';
import {calculateCorrectedAge, shouldUseCorrectedAge} from '../utils/correctedAge';

interface CorrectedAgeDisplayProps {
  compact?: boolean;
  showTooltip?: boolean;
  onTooltipPress?: () => void;
}

const CorrectedAgeDisplay: React.FC<CorrectedAgeDisplayProps> = ({
  compact = false,
  showTooltip = false,
  onTooltipPress,
}) => {
  const {primaryProfile} = useBabyProfile();

  if (!primaryProfile) {
    return null;
  }

  const birthDate = new Date(primaryProfile.birthDate);
  const dueDate = new Date(primaryProfile.dueDate);
  const correctedAge = calculateCorrectedAge(birthDate, dueDate);
  const useCorrected = shouldUseCorrectedAge(birthDate, dueDate);

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <Text style={styles.compactText}>
          {useCorrected ? correctedAge.displayText : `${Math.floor(correctedAge.chronologicalAgeInWeeks)} weeks`}
        </Text>
        {showTooltip && (
          <TouchableOpacity onPress={onTooltipPress} style={styles.tooltipButton}>
            <Icon name="info-outline" size={12} color="#7f8c8d" />
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.ageInfo}>
        <Text style={styles.label}>
          {useCorrected ? 'Corrected Age' : 'Age'}
        </Text>
        <Text style={styles.ageText}>
          {useCorrected ? correctedAge.displayText : `${Math.floor(correctedAge.chronologicalAgeInWeeks)} weeks`}
        </Text>
        {useCorrected && (
          <Text style={styles.actualAge}>
            Actual: {Math.floor(correctedAge.chronologicalAgeInWeeks)} weeks
          </Text>
        )}
      </View>
      {showTooltip && (
        <TouchableOpacity onPress={onTooltipPress} style={styles.tooltipButton}>
          <Icon name="help-outline" size={16} color="#7f8c8d" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ageInfo: {
    flex: 1,
  },
  label: {
    fontSize: 10,
    color: '#7f8c8d',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  ageText: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '600',
    marginTop: 2,
  },
  actualAge: {
    fontSize: 10,
    color: '#95a5a6',
    marginTop: 1,
  },
  compactText: {
    fontSize: 10,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  tooltipButton: {
    marginLeft: 8,
    padding: 4,
  },
});

export default CorrectedAgeDisplay;
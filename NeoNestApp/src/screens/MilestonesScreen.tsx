import React from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';

const MilestonesScreen = () => {
  const milestones = [
    {
      id: 1,
      title: 'Social Smile',
      correctedAge: '6-8 weeks',
      description: 'Baby smiles in response to your voice or face',
      status: 'achieved',
    },
    {
      id: 2,
      title: 'Head Control',
      correctedAge: '3-4 months',
      description: 'Holds head steady when supported in sitting position',
      status: 'in-progress',
    },
    {
      id: 3,
      title: 'Rolling Over',
      correctedAge: '4-6 months',
      description: 'Rolls from tummy to back and back to tummy',
      status: 'upcoming',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'achieved':
        return '#4caf50';
      case 'in-progress':
        return '#ff9800';
      case 'upcoming':
        return '#9e9e9e';
      default:
        return '#9e9e9e';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Milestones</Text>
        <Text style={styles.subtitle}>Corrected age tracking</Text>
      </View>
      
      <View style={styles.content}>
        {milestones.map((milestone) => (
          <TouchableOpacity key={milestone.id} style={styles.milestoneCard}>
            <View style={styles.milestoneHeader}>
              <Text style={styles.milestoneTitle}>{milestone.title}</Text>
              <View 
                style={[
                  styles.statusBadge, 
                  {backgroundColor: getStatusColor(milestone.status)}
                ]}
              >
                <Text style={styles.statusText}>
                  {milestone.status.replace('-', ' ')}
                </Text>
              </View>
            </View>
            <Text style={styles.correctedAge}>Corrected age: {milestone.correctedAge}</Text>
            <Text style={styles.description}>{milestone.description}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    backgroundColor: '#4a90e2',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  content: {
    padding: 16,
  },
  milestoneCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  milestoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  milestoneTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  correctedAge: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default MilestonesScreen;
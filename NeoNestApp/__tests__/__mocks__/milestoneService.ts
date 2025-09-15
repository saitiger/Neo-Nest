export const MilestoneService = {
  logMilestone: jest.fn().mockResolvedValue({
    id: 'test-milestone-1',
    milestoneId: 'social-smile',
    babyId: 'test-baby-1',
    achievedDate: new Date(),
    notes: 'Test milestone note',
  }),
  getMilestoneProgress: jest.fn().mockResolvedValue({
    achieved: [],
    pending: [],
    delayed: [],
  }),
  generateMilestoneReport: jest.fn().mockResolvedValue({
    babyId: 'test-baby-1',
    achievedMilestones: [],
    pendingMilestones: [],
    delayedMilestones: [],
  }),
  updateMilestone: jest.fn().mockResolvedValue(true),
};
export const BabyProfileService = {
  createBabyProfile: jest.fn().mockResolvedValue({
    id: 'test-baby-1',
    name: 'Test Baby',
    birthDate: new Date('2024-08-15'),
    dueDate: new Date('2024-10-01'),
    correctedAge: 8,
    gender: 'male',
  }),
  getBabyProfiles: jest.fn().mockResolvedValue([]),
  updateBabyProfile: jest.fn().mockResolvedValue({
    id: 'test-baby-1',
    name: 'Updated Baby',
    birthDate: new Date('2024-08-15'),
    dueDate: new Date('2024-10-01'),
    correctedAge: 8,
  }),
  deleteBabyProfile: jest.fn().mockResolvedValue(true),
};
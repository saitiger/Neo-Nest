import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  logMilestone,
  getMilestoneLogs,
  getMilestoneLogsForBaby,
  getMilestoneProgress,
  generateMilestoneSummary,
} from '../src/utils/milestoneLogging';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe('Milestone Logging', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAsyncStorage.getItem.mockResolvedValue(null);
    mockAsyncStorage.setItem.mockResolvedValue();
  });

  test('should be defined', () => {
    expect(logMilestone).toBeDefined();
    expect(getMilestoneLogs).toBeDefined();
    expect(getMilestoneLogsForBaby).toBeDefined();
    expect(getMilestoneProgress).toBeDefined();
    expect(generateMilestoneSummary).toBeDefined();
  });

  test('should create and save a new milestone log', async () => {
    const milestoneId = 'social-smile';
    const babyProfileId = 'baby-123';
    const achievedDate = new Date('2024-01-15');
    const notes = 'First real smile!';

    const result = await logMilestone(milestoneId, babyProfileId, achievedDate, notes);

    expect(result).toMatchObject({
      milestoneId,
      babyProfileId,
      achievedDate: achievedDate.toISOString(),
      notes,
    });
    expect(result.id).toBeDefined();
    expect(result.createdAt).toBeDefined();
    expect(result.updatedAt).toBeDefined();
    expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
      'milestone_logs',
      expect.stringContaining(milestoneId)
    );
  });

  test('should return empty array when no logs exist', async () => {
    mockAsyncStorage.getItem.mockResolvedValue(null);

    const result = await getMilestoneLogs();

    expect(result).toEqual([]);
  });

  test('should filter logs by baby profile ID', async () => {
    const mockLogs = [
      {
        id: 'log-1',
        milestoneId: 'social-smile',
        babyProfileId: 'baby-123',
        achievedDate: '2024-01-15T00:00:00.000Z',
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T10:00:00.000Z',
      },
      {
        id: 'log-2',
        milestoneId: 'head-control',
        babyProfileId: 'baby-456',
        achievedDate: '2024-01-20T00:00:00.000Z',
        createdAt: '2024-01-20T10:00:00.000Z',
        updatedAt: '2024-01-20T10:00:00.000Z',
      },
    ];
    mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockLogs));

    const result = await getMilestoneLogsForBaby('baby-123');

    expect(result).toHaveLength(1);
    expect(result[0].babyProfileId).toBe('baby-123');
  });

  test('should convert logs to progress format', async () => {
    const mockLogs = [
      {
        id: 'log-1',
        milestoneId: 'social-smile',
        babyProfileId: 'baby-123',
        achievedDate: '2024-01-15T00:00:00.000Z',
        notes: 'First smile',
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T10:00:00.000Z',
      },
    ];
    mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockLogs));

    const result = await getMilestoneProgress('baby-123');

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      milestoneId: 'social-smile',
      status: 'achieved',
      achievedDate: '2024-01-15T00:00:00.000Z',
      notes: 'First smile',
    });
  });

  test('should generate formatted summary', async () => {
    const mockLogs = [
      {
        id: 'log-1',
        milestoneId: 'social-smile',
        babyProfileId: 'baby-123',
        achievedDate: '2024-01-15T00:00:00.000Z',
        notes: 'First smile',
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T10:00:00.000Z',
      },
    ];
    mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockLogs));

    const result = await generateMilestoneSummary('baby-123');

    expect(result).toContain('Milestone Summary');
    expect(result).toContain('social-smile');
    expect(result).toContain('First smile');
    expect(result).toContain('Achieved Milestones (1)');
  });
});
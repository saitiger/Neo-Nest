export const AuthService = {
  register: jest.fn().mockResolvedValue({
    success: true,
    user: { id: 'test-user-1', email: 'test@example.com', parentName: 'Test User' }
  }),
  login: jest.fn().mockResolvedValue({
    success: true,
    user: { id: 'test-user-1', email: 'test@example.com', parentName: 'Test User' }
  }),
  logout: jest.fn().mockResolvedValue({ success: true }),
  getCurrentUser: jest.fn().mockResolvedValue({
    id: 'test-user-1',
    email: 'test@example.com',
    parentName: 'Test User'
  }),
  resetPassword: jest.fn().mockResolvedValue({ success: true }),
};
import {validateEmail, validatePassword, getPasswordStrength} from '../src/utils/auth';

describe('Auth Utilities', () => {
  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(validateEmail('user+tag@example.org')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(validateEmail('')).toBe(false);
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test.example.com')).toBe(false);
      expect(validateEmail('test@example')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should validate strong passwords', () => {
      expect(validatePassword('Password123')).toBe(true);
      expect(validatePassword('MySecure1Pass')).toBe(true);
      expect(validatePassword('Test123!')).toBe(true);
    });

    it('should reject weak passwords', () => {
      expect(validatePassword('')).toBe(false);
      expect(validatePassword('password')).toBe(false); // no uppercase or number
      expect(validatePassword('PASSWORD')).toBe(false); // no lowercase or number
      expect(validatePassword('12345678')).toBe(false); // no letters
      expect(validatePassword('Pass1')).toBe(false); // too short
      expect(validatePassword('password123')).toBe(false); // no uppercase
      expect(validatePassword('PASSWORD123')).toBe(false); // no lowercase
      expect(validatePassword('PasswordABC')).toBe(false); // no number
    });
  });

  describe('getPasswordStrength', () => {
    it('should return weak for short passwords', () => {
      expect(getPasswordStrength('')).toBe('weak');
      expect(getPasswordStrength('123')).toBe('weak');
      expect(getPasswordStrength('pass')).toBe('weak');
    });

    it('should return medium for moderate passwords', () => {
      expect(getPasswordStrength('password')).toBe('medium');
      expect(getPasswordStrength('12345678')).toBe('medium');
      expect(getPasswordStrength('Password')).toBe('medium');
    });

    it('should return strong for secure passwords', () => {
      expect(getPasswordStrength('Password123')).toBe('strong');
      expect(getPasswordStrength('MySecure1Pass')).toBe('strong');
      expect(getPasswordStrength('Test123!')).toBe('strong');
    });
  });
});
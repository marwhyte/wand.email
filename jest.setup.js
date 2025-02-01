// Mock next-auth
jest.mock('next-auth', () => ({
  auth: () => Promise.resolve({ user: { id: '123' } })
}))

// Mock next-auth providers
jest.mock('next-auth/providers/credentials', () => ({}))
jest.mock('next-auth/providers/google', () => ({}))

// Mock the entire auth file
jest.mock('@/auth', () => ({
  auth: () => Promise.resolve({ user: { id: '123' } })
}))

// Mock database
jest.mock('@/lib/database/db', () => ({
  db: {
    selectFrom: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    execute: jest.fn().mockResolvedValue([]),
  }
})) 
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  // 単体テストと統合テストで異なる環境を使用
  projects: [
    // 単体テスト（Domain層、Application層、Presentation層、Infrastructure層）
    {
      displayName: 'unit',
      testEnvironment: 'jest-environment-jsdom',
      setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
      },
      testMatch: [
        '<rootDir>/test/domain/**/*.test.[jt]s?(x)',
        '<rootDir>/test/application/**/*.test.[jt]s?(x)',
        '<rootDir>/test/presentation/**/*.test.[jt]s?(x)',
        '<rootDir>/test/infrastructure/**/*.test.[jt]s?(x)',
        '<rootDir>/test/phaser/**/*.test.[jt]s?(x)',
        '<rootDir>/test/data/**/*.test.[jt]s?(x)',
      ],
      collectCoverageFrom: [
        'src/domain/**/*.{js,jsx,ts,tsx}',
        'src/application/**/*.{js,jsx,ts,tsx}',
        'src/presentation/**/*.{js,jsx,ts,tsx}',
        'src/infrastructure/**/*.{js,jsx,ts,tsx}',
        'src/phaser/**/*.{js,jsx,ts,tsx}',
        '!src/**/*.d.ts',
      ],
      // Next.jsのSWCトランスフォーマーを明示的に使用
      transform: {
        '^.+\\.(t|j)sx?$': ['next/dist/build/swc/jest-transformer', {}],
      },
    },
    // 統合テスト（API Route）
    {
      displayName: 'integration',
      testEnvironment: '@edge-runtime/jest-environment',
      setupFilesAfterEnv: ['<rootDir>/test/integration/setup.js'],
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
      },
      testMatch: ['<rootDir>/test/integration/**/*.test.[jt]s?(x)'],
      collectCoverageFrom: [
        'src/app/api/**/*.{js,jsx,ts,tsx}',
        'src/infrastructure/**/*.{js,jsx,ts,tsx}',
        '!src/**/*.d.ts',
      ],
      // Next.jsのSWCトランスフォーマーを明示的に使用
      transform: {
        '^.+\\.(t|j)sx?$': ['next/dist/build/swc/jest-transformer', {}],
        '^.+\\.mjs$': ['next/dist/build/swc/jest-transformer', {}],
      },
      // ESMモジュールも変換対象に含める
      transformIgnorePatterns: [
        'node_modules/(?!(uncrypto|iron-session)/)',
      ],
    },
  ],

  // 全体のカバレッジ設定
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/__tests__/**',
    '!src/**/*.test.{js,jsx,ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
}

// createJestConfig を使うことで、Next.jsのトランスフォーマーが自動設定される
module.exports = createJestConfig(customJestConfig)

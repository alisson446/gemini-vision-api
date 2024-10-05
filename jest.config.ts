export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // Diretório onde os testes estão localizados (padrão é "test" ou "__tests__")
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
  // Se você deseja que o Jest limpe automaticamente os mocks entre os testes
  clearMocks: true
}

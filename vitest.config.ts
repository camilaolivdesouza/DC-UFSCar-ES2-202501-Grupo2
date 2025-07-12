import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/**/test.ts"],
    // Speed up tests, but also it's a workaround for the browser issue:
    // https://github.com/vitest-dev/vitest/issues/5382
    isolate: false,
    browser: {
      // Enable it via --browser
      // enabled: true,
      name: "chromium",
      provider: "playwright",
      headless: true,
    },
    // --- ADICIONE ESTA SEÇÃO ---
    coverage: {
      provider: "v8", // ou "c8"
      exclude: ['examples/**/*'],
      reporter: ['text', 'html'], // Isso vai gerar o relatório no terminal e a pasta HTML
      // Se você quiser que a pasta seja gerada em um local específico, pode usar:
      // dir: './coverage-report', // Por exemplo, para gerar em 'coverage-report' ao invés de 'coverage'
    },
    // --- FIM DA SEÇÃO ADICIONADA ---
  },
});
import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/admin.json';

setup('Autenticar como Administrador e salvar sessão', async ({ request, page }) => {
  // Tenta autenticar na API do Traccar via URL encoded ou JSON
  const response = await request.post('/api/session', {
    form: {
      email: 'mariarayanna.santos@gmail.com',      
      password: 'teste123',  
    },
  });

  if (!response.ok()) {
    console.error(`[ERRO API LOGIN] Status: ${response.status()} - ${await response.text()}`);
  }

  expect(response.ok()).toBeTruthy();

  // Salva a sessão no ficheiro JSON
  await page.context().storageState({ path: authFile });
});
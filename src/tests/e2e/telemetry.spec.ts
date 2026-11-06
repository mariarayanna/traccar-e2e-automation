import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { TraccarApiClient } from '../../api/TraccarApiClient';

test.describe('Rastreamento de Veículos e Telemetria em Tempo Real', () => {
  test('Deve visualizar um novo veículo no mapa após envio de coordenadas GPS', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    // 1. Abre a tela de login
    await loginPage.navigate();

    // 2. Prepara a escuta do evento de autenticação do backend
    const responsePromise = page.waitForResponse(
      (res) => res.url().includes('/api/session') && res.status() === 200,
      { timeout: 15000 }
    );

    // 3. Digita as credenciais reais e submete o formulário
    await loginPage.login('mariarayanna.santos@gmail.com', 'teste123');

    // 4. Aguarda a validação do backend e o redirecionamento
    await responsePromise;
    await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 15000 });

    // 5. Instancia o cliente de API com a sessão ativa
    const apiClient = new TraccarApiClient(page.request);

    const uniqueDeviceId = `CAMIAO-${Date.now().toString().slice(-4)}`;
    const deviceName = `Camião de Carga ${uniqueDeviceId}`;

    // 6. Cria o veículo e envia as coordenadas GPS (Recife)
    await apiClient.createDevice(deviceName, uniqueDeviceId);
    await apiClient.sendTelemetry(uniqueDeviceId, -8.0476, -34.8770);

    // 7. Recarrega a tela para atualizar o mapa
    await page.reload();

    // 8. Valida a exibição no mapa
    const deviceItem = page.getByText(deviceName);
    await expect(deviceItem).toBeVisible({ timeout: 15000 });
  });
});
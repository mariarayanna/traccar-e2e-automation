import { APIRequestContext, expect } from '@playwright/test';

export class TraccarApiClient {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async login(email: string, pass: string) {
    const params = new URLSearchParams();
    params.append('email', email);
    params.append('password', pass);

    const response = await this.request.post('/api/session', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: params.toString(),
    });

    if (!response.ok()) {
      const errorText = await response.text();
      console.error(`❌ [ERRO API LOGIN]: ${response.status()} - ${errorText}`);
    }

    expect(response.status()).toBe(200);
  }

  async createDevice(name: string, uniqueId: string) {
    const response = await this.request.post('/api/devices', {
      data: {
        name: name,
        uniqueId: uniqueId,
      },
    });

    if (!response.ok()) {
      console.error(`❌ [ERRO CRIAÇÃO DISPOSITIVO]: ${response.status()} - ${await response.text()}`);
    }

    expect(response.status()).toBe(200);
    return await response.json();
  }

  // Envia a posição GPS via protocolo OsmAnd (Porta 5055 / Endpoint /?id=...)
  async sendTelemetry(uniqueId: string, lat: number, lon: number) {
    // 1. Tenta a porta dedicada de telemetria OsmAnd (5055)
    let response = await this.request.get('http://localhost:5055/', {
      params: {
        id: uniqueId,
        lat: lat.toString(),
        lon: lon.toString(),
        timestamp: Math.floor(Date.now() / 1000).toString(),
      },
    }).catch(() => null);

    // 2. Fallback para o endpoint da porta principal caso a 5055 não esteja mapeada
    if (!response || !response.ok()) {
      response = await this.request.get('/api/osmand', {
        params: {
          id: uniqueId,
          lat: lat.toString(),
          lon: lon.toString(),
        },
      });
    }

    if (!response.ok()) {
      console.error(`❌ [ERRO TELEMETRIA]: Status ${response.status()} - ${await response.text()}`);
    }

    expect(response.ok()).toBeTruthy();
  }
}
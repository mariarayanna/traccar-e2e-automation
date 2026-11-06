# 🚚 Traccar E2E & API Automation Framework

Framework de automação de testes End-to-End (E2E) e de integração de API para a plataforma de rastreamento veicular **Traccar**. O projeto implementa cenários complexos simulando o ciclo completo de operações logísticas: autenticação resiliente, provisionamento de dispositivos via API REST e ingestão de telemetria GPS em tempo real.

---

## 🛠️ Tecnologias Utilizadas

- **Linguagem:** TypeScript
- **Framework de Testes:** [Playwright](https://playwright.dev/)
- **Design Pattern:** Page Object Model (POM)
- **Infraestrutura de Testes:** Docker (Container Traccar Server)
- **Protocolos de Comunicação:** HTTP/REST (JSON e x-www-form-urlencoded) e OsmAnd Telemetry (Porta 5055)

---

## 🏗️ Arquitetura do Projeto

```text
Traccar_Automation/
├── .github/workflows/      # Pipelines de CI/CD (GitHub Actions)
├── src/
│   ├── api/                # Clientes de API REST e simulador de telemetria IoT
│   │   └── TraccarApiClient.ts
│   ├── pages/              # Mapeamento de elementos e ações da UI (Page Object Model)
│   │   └── LoginPage.ts
│   └── tests/
│       ├── e2e/            # Fluxos de testes End-to-End integrados
│       │   └── telemetry.spec.ts
│       └── setup/          # Configurações de autenticação e estado de sessão
│           └── auth.setup.ts
├── .gitignore              # Arquivos e diretórios ignorados pelo Git
├── package.json            # Dependências do projeto e scripts de execução
└── playwright.config.ts    # Configurações globais do Playwright Framework
```
---

# ⚡ Principais Funcionalidades Automatizadas

Autenticação Resiliente via UI: Preenchimento sequencial de credenciais sincronizado com o estado interno da aplicação web (React / Material-UI).

Provisionamento Dinâmico de Veículos via API: Criação instantânea de dispositivos de carga via POST /api/devices.

Simulação de Telemetria GPS (Protocolo OsmAnd): Disparo de coordenadas geográficas reais para o ouvinte IoT (porta 5055) para atualização do mapa.

Validação Visual de Rastreamento: Confirmação da plotagem do veículo e alteração do status de localização na interface.

# 🛠️ Desafios Técnicos & Troubleshooting

Durante a construção desta automação, foram superados desafios específicos da arquitetura do Traccar e da integração com o Playwright:

- **1. Autenticação Resiliente em Formulários React / Material-UI**

Desafio: O uso do método .fill() tradicional não disparava os eventos nativos de atualização do estado do React (change/input), retendo a automação na tela de /login.

Solução: Implementado o fluxo de digitação sequencial (pressSequentially) combinado com a escuta assíncrona da resposta do backend (waitForResponse('/api/session')) antes de validar a navegação.

- **2. Integração Híbrida com a API REST (Jersey/Jakarta Framework)**

Desafio: Requisições diretas de login via API geravam inconsistências de Media Type (HTTP 415 e 400) devido às exigências estritas de formulário do servidor em Java.

Solução: Adotada uma abordagem híbrida onde a autenticação inicial estabelece os cookies de sessão no contexto do navegador (page.request), permitindo que as chamadas subsequentes de criação de dispositivos (POST /api/devices) ocorram com alta performance.

- **3. Comunicação Multi-Porta com Protocolos IoT (OsmAnd)**

Desafio: A API Web do Traccar opera na porta 8082, porém a ingestão de coordenadas GPS via protocolo OsmAnd exige comunicação direta com a porta de receptores IoT (5055).

Solução: O TraccarApiClient foi estruturado para enviar coordenadas simuladas diretamente na porta 5055 (http://localhost:5055/?id=...), garantindo a atualização instantânea da posição do veículo no mapa.

# 🚀 Como Executar o Projeto
- **- Pré-requisitos:**

Node.js (v18 ou superior)
Instância do Traccar rodando via Docker (localhost:8082)

- **1. Clonar o repositório**

    git clone [https://github.com/mariarayanna/traccar-e2e-automation.git](https://github.com/mariarayanna/traccar-e2e-automation.git)
    cd traccar-e2e-automation

- **2. Instalar as dependências**

    npm install
    npx playwright install --with-deps

- **3. Executar os testes em modo headless:**
    npx playwright test

 - **4. Execução em modo interativo/visível (Headed):**
    npx playwright test --headed

- **5. Visualizar o relatório de testes:**
    npx playwright show-report
# 🏛️ 01 — Visão de Produto & Arquitetura de Software

> **Objetivo:** Definir os pilares conceituais do CaniveteFinanceiro e as regras de arquitetura estática multi-páginas (MPA) para orientar futuras decisões de engenharia.

---

## 1. 🎯 Visão e Princípios de Produto

O **CaniveteFinanceiro** é uma suíte pública de ferramentas de planejamento patrimonial, simulação de investimentos e cálculo de obrigações tributárias.

### Princípios Inegociáveis:
1. **100% Gratuito e Livre de Anúncios:** Nenhuma experiência de usuário deve ser degradada por banners, popups invasivos de publicidade ou cookies rastreadores.
2. **Privacidade Absoluta (Zero-Knowledge):** Todos os cálculos financeiros são processados estritamente no navegador do cliente (client-side). Nenhum dado digitado (salário, patrimônio, dependentes) é enviado a servidores externos.
3. **Leveza e Desempenho Extremo:** Aplicação estática pura, carregamento instantâneo, sem frameworks pesados (React/Angular/Vue desnecessários para este escopo), empacotada com Vite.
4. **Didatismo Financeiro:** Cada calculadora deve ter seções explicativas que educam o usuário sobre a fórmula matemática, contexto econômico e dicas práticas.

---

## 2. 🧱 Arquitetura Tecnológica

A aplicação adota o modelo **MPA (Multi-Page Application)** estático gerenciado pelo **Vite**:

```
                               ┌─────────────────────────────────┐
                               │           Vite Bundler          │
                               │  (Entradas MPA relativas base)  │
                               └────────────────┬────────────────┘
                                                │
         ┌──────────────────────────────┬───────┴──────────────────────┬──────────────────────────────┐
         ▼                              ▼                              ▼                              ▼
  /index.html               /juros-compostos/             /reserva-emergencia/           /imposto-de-renda/
  (Portal Principal)        (Simulador Juros)             (Simulador Reserva)            (Cálculo IRRF)
         │                              │                              │                              │
         ▼                              ▼                              ▼                              ▼
  src/portalMain.ts         src/main.ts                   src/reservaMain.ts             src/impostoRendaMain.ts
         │                              │                              │                              │
         └──────────────────────────────┴───────┬──────────────────────┴──────────────────────────────┘
                                                │
                          ┌─────────────────────┴─────────────────────┐
                          ▼                                           ▼
                 Serviços & Lógica Pura                     UI, Estilos & Utils
            - jurosCalculator.ts                      - tokens.css / components.css
            - reservaCalculator.ts                    - navbar.ts (menu, tema, modal)
            - impostoRendaCalculator.ts               - formatters.ts / masks.ts
```

### Stack Principal:
- **Linguagem:** TypeScript (Strict mode ativado no `tsconfig.json`).
- **Build Tool:** Vite (`vite.config.ts` com rollup multi-input e `base: './'` para portabilidade).
- **Estilização:** CSS3 puro moderno com Design Tokens (CSS Custom Properties).
- **Gráficos:** Chart.js (Donut, Bar empilhado).
- **Animações:** GSAP 3 (odômetro de números, stagger nos cards e revelação suave).
- **Sem Backend:** Totalmente hospedável em GitHub Pages, Netlify, Vercel ou qualquer CDN estático.

---

## 3. 📁 Convenção da Estrutura de Pastas

Ao criar ou modificar arquivos no projeto, respeite esta taxonomia:

```text
calculadora_juros_compostos/
├── ai-sdd/                     # Toda a documentação e specs para IAs e devs
├── public/                     # Favicons, ícones e assets estáticos não processados
├── index.html                  # Portal / Hub Central de calculadoras
│
├── <nome-da-feature>/          # Diretório raiz de cada calculadora
│   └── index.html              # Markup semântico da página da calculadora
│
├── src/
│   ├── types/                  # Interfaces e tipos do TypeScript por domínio
│   │   ├── finance.ts          # Tipos de juros compostos
│   │   ├── reserva.ts          # Tipos de reserva de emergência
│   │   └── impostoRenda.ts     # Tipos de imposto de renda
│   │
│   ├── services/               # LÓGICA PURA — Regras matemáticas sem DOM
│   │   ├── calculator.ts       # Motor de juros compostos
│   │   ├── reservaCalculator.ts# Motor de reserva
│   │   └── impostoRendaCalculator.ts # Motor de INSS e IRRF
│   │
│   ├── utils/                  # Utilitários globais reutilizáveis
│   │   ├── navbar.ts           # Orquestrador da navbar, mobile menu e modal apoie
│   │   ├── formatters.ts       # Formatador de BRL, percentuais e períodos
│   │   └── masks.ts            # Máscaras de digitação em tempo real (R$, %, número)
│   │
│   ├── styles/                 # Folhas de estilo modulares
│   │   ├── tokens.css          # Cores, fontes, raios, sombras e dark mode
│   │   ├── base.css            # Reset, tipografia global e layout básico
│   │   ├── components.css      # Botões, inputs, cards, tabelas, modais
│   │   └── responsive.css      # Media queries mobile (1024px, 768px, 480px)
│   │
│   ├── charts/                 # Gerenciadores de ciclo de vida do Chart.js
│   │   ├── chartManager.ts     # Gráficos da calculadora de juros
│   │   └── reservaChartManager.ts # Gráficos da reserva de emergência
│   │
│   ├── animations/             # Animações de contadores e transições GSAP
│   │   └── animManager.ts
│   │
│   ├── portalMain.ts           # Script de inicialização do portal principal
│   ├── main.ts                 # Controlador da calculadora de juros compostos
│   ├── reservaMain.ts          # Controlador da calculadora de reserva
│   └── impostoRendaMain.ts     # Controlador da calculadora de IRRF
│
├── vite.config.ts              # Mapeamento das entradas HTML para o build
└── package.json
```

---

## 4. ⚙️ Regras do `vite.config.ts`

Ao adicionar qualquer nova página HTML, ela **deve obrigatoriamente** ser declarada em `vite.config.ts`:

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: './', // Mantém caminhos relativos para funcionar em qualquer subdiretório
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        juros: resolve(__dirname, 'juros-compostos/index.html'),
        reserva: resolve(__dirname, 'reserva-emergencia/index.html'),
        ir: resolve(__dirname, 'imposto-de-renda/index.html'),
        // NOVA CALCULADORA AQUI:
        // novaFeature: resolve(__dirname, 'nova-feature/index.html'),
      },
    },
  },
});
```

---

## 5. 🌐 Integração com Aplicações Externas ("Saldo")

O CaniveteFinanceiro compartilha diretrizes estéticas e de marca com a aplicação financeira irmã **"Saldo"**:
- O rodapé de todas as páginas contém a menção e link:  
  `Conheça o Saldo ©` (com ícone da moeda verde).
- O design tokens do CSS reproduzem perfeitamente os contrastes, raio de curvatura e botões da aplicação externa para que a transição entre ambas pareça parte do mesmo ecossistema integrado.

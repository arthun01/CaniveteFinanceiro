# 💰 CaniveteFinanceiro — Suíte de Simuladores & Calculadoras Financeiras Online

> Uma suíte moderna, estática e de alta performance de ferramentas financeiras para planejamento de patrimônio, investimentos e segurança financeira.

Construído com **HTML5**, **CSS3 Moderno** e **TypeScript** estruturado com **Vite** em arquitetura multi-página (MPA), adotando a estética **Dark Glassmorphism** com animações fluidas via **GSAP** e gráficos interativos com **Chart.js**.

---

## 🧭 Ferramentas Disponíveis no Portal

O portal inicial (`index.html`) oferece acesso direto a duas ferramentas essenciais:

### 1. 📈 [Calculadora de Juros Compostos](./juros-compostos/)
- **Projeção Exponencial:** Simulação de juros sobre juros com valor inicial e aportes mensais recorrentes.
- **Flexibilidade:** Taxas de juros anuais (% a.a.) ou mensais (% a.m.) e prazos em anos ou meses.
- **Resultados Tridimensionais:**
  - **KPIs Animados:** Total Investido, Total em Juros e Valor Final Acumulado com odômetro GSAP.
  - **Gráfico de Rosca (Donut):** Proporção entre o capital do próprio bolso vs. rendimento gerado pelos juros.
  - **Gráfico de Barras Empilhadas:** Evolução temporal da curva de crescimento do patrimônio.
  - **Tabela de Amortização:** Alternância dinâmica entre **Mês a Mês** e **Ano a Ano**.
- **Guia Didático:** Explicação da fórmula matemática $M = C \times (1 + i)^t$ e dicas financeiras.

---

### 2. 🛡️ [Calculadora de Reserva de Emergência](./reserva-emergencia/)
- **Cálculo por Estabilidade Profissional:**
  - 🏛️ **Servidor Público:** Recomendação de 3 meses de despesas fixas.
  - 🏢 **Trabalhador CLT:** Recomendação de 6 meses de despesas fixas.
  - 💼 **Autônomo / MEI / PJ:** Recomendação de 12 meses de despesas fixas.
- **Planejamento de Metas & Prazos:**
  - **Meta da Reserva Ideal (R$):** Valor total necessário para cobrir os custos fixos essenciais.
  - **Tempo Estimado:** Em quantos meses/anos você atingirá a meta com seu aporte atual.
  - **Taxa de Poupança:** Percentual do salário líquido direcionado à reserva.
- **Visualizações Dinâmicas:**
  - **Gráfico de Rosca:** Distribuição do salário mensal (Custo Fixo vs Aporte da Reserva vs Margem Livre).
  - **Gráfico de Barras:** Evolução do saldo acumulado até ultrapassar a meta de proteção.
  - **Tabela de Acúmulo:** Acompanhamento do progresso mês a mês com indicador de meta atingida.
- **Guia Didático:** Explicação dos critérios de estabilidade e recomendações de onde alocar a reserva com liquidez diária (Tesouro Selic e CDB 100% CDI).

---

## 🎨 Design System & Skills Aplicadas

- **Skill `glass-dark-ui`:**
  - Superfícies com efeito de vidro fosco (`backdrop-filter: blur(20px)`).
  - Bordas com contorno iluminado sutil através de máscara gradiente (`mask-composite: exclude`).
  - Paleta Slate/Navy dark com contraste certificado (WCAG AA).
- **Skill `gsap-frameworks`:**
  - Animação de contagem numérica contínua tipo odômetro nos cards de resultado.
  - Transições suaves e revelação em cascata (*stagger*).
- **100% Responsivo (Mobile-First):**
  - Adaptação completa de grids, gráficos e tabelas para smartphones, tablets e desktops.

---

## 🛠️ Tecnologias Utilizadas

- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Build Tool:** [Vite](https://vitejs.dev/) (Multi-Page App com caminhos relativos)
- **Estilização:** CSS3 puro com Custom Properties, Flexbox e CSS Grid
- **Animações:** [GSAP 3](https://greensock.com/gsap/)
- **Gráficos:** [Chart.js](https://www.chartjs.org/)

---

## 🚀 Como Rodar Localmente

### Pré-requisitos
Ter o [Node.js](https://nodejs.org/) instalado (versão 18 ou superior).

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/arthun01/calculadora_juros_compostos.git
   cd calculadora_juros_compostos
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   Acesse no navegador:
   👉 **`http://localhost:5173/`**

4. **Gerar build de produção:**
   ```bash
   npm run build
   ```
   Os arquivos finais otimizados de todas as páginas serão gerados na pasta `dist/`.

5. **Visualizar o build localmente:**
   ```bash
   npm run preview
   ```

---

## 🌐 Deploy no GitHub Pages

O projeto está configurado com `base: './'` no [`vite.config.ts`](./vite.config.ts), permitindo que todas as páginas e assets funcionem perfeitamente no GitHub Pages sem erros de rota.

### Deploy Automático via GitHub Actions (Recomendado)
O repositório já conta com o arquivo de workflow pronto em [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml).

1. No seu repositório no GitHub, acesse **Settings > Pages**.
2. Em **Build and deployment > Source**, escolha **GitHub Actions**.
3. Faça o commit e envie para a branch `main`:
   ```bash
   git add .
   git commit -m "feat: adicionar calculadora de reserva de emergência e portal multi-página"
   git push origin main
   ```
4. O GitHub Actions fará o build e a publicação automaticamente. O portal estará online em:
   `https://arthun01.github.io/calculadora_juros_compostos/`

---

## 📁 Estrutura do Projeto

```text
├── .github/workflows/deploy.yml    # CI/CD para GitHub Pages
├── index.html                      # Portal inicial com cards de ferramentas
├── juros-compostos/
│   └── index.html                  # Calculadora de Juros Compostos
├── reserva-emergencia/
│   └── index.html                  # Calculadora de Reserva de Emergência
├── src/
│   ├── animations/
│   │   ├── animManager.ts          # Odômetro GSAP para Juros Compostos
│   │   └── reservaAnimManager.ts   # Odômetro GSAP para Reserva de Emergência
│   ├── charts/
│   │   ├── chartManager.ts         # Gráficos Chart.js de Juros Compostos
│   │   └── reservaChartManager.ts  # Gráficos Chart.js de Reserva de Emergência
│   ├── services/
│   │   ├── calculator.ts           # Motor de cálculo de juros compostos
│   │   └── reservaCalculator.ts    # Motor de cálculo da reserva de emergência
│   ├── styles/
│   │   ├── base.css                # Reset e estilos globais
│   │   ├── components.css          # Cards, botões, formulários e portal
│   │   ├── glass.css               # Regras da skill glass-dark-ui
│   │   ├── responsive.css          # Media queries mobile-first
│   │   └── tokens.css              # Variáveis e cores de design
│   ├── types/
│   │   ├── finance.ts              # Tipos para juros compostos
│   │   └── reserva.ts              # Tipos para reserva de emergência
│   ├── utils/
│   │   ├── formatters.ts           # Formatadores monetários e percentuais
│   │   └── masks.ts                # Máscaras de entrada em tempo real
│   ├── main.ts                     # Controller de Juros Compostos
│   ├── portalMain.ts               # Controller do Portal
│   └── reservaMain.ts              # Controller de Reserva de Emergência
├── vite.config.ts                  # Configuração Vite Multi-Página
└── README.md                       # Documentação completa
```

---

## 👨‍💻 Autor

Desenvolvido por **Arthur**  
- GitHub: [@arthun01](https://github.com/arthun01)

---

## 📄 Licença

Este projeto está sob a licença [MIT](https://opensource.org/licenses/MIT).

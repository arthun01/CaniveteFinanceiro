# 💰 CaniveteFinanceiro — Suíte de Simuladores & Calculadoras Financeiras Online

> Uma suíte moderna, estática e de alta performance de ferramentas financeiras para planejamento de patrimônio, investimentos e segurança financeira.

Construído com **HTML5**, **CSS3 Moderno** e **TypeScript** estruturado com **Vite** em arquitetura multi-página (MPA), adotando a estética **Dark Glassmorphism** com animações fluidas via **GSAP** e gráficos interativos com **Chart.js**.

---

## 🧭 Ferramentas Disponíveis no Portal

O portal inicial (`index.html`) oferece acesso direto a três ferramentas essenciais:

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
  - 🏛️ **Servidor Público:** 3 meses de despesas fixas.
  - 🏢 **Trabalhador CLT:** 6 meses de despesas fixas.
  - 💼 **Autônomo / MEI / PJ:** 12 meses de despesas fixas.
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

### 3. 🧾 [Calculadora de Imposto de Renda](./imposto-de-renda/)
- **Cálculo de Retenção na Fonte (IRRF):**
  - Apuração exata do imposto devido com base na Tabela Progressiva Mensal oficial.
  - Dedução legal fixa de R$ 189,59 por dependente/mês.
  - Deduções completas de pensão alimentícia, despesas médicas e gastos com ensino.
- **Relatório em Três Tabelas Auditáveis:**
  - 1. **Entrada e Valores:** Salário bruto e rendimentos tributáveis.
  - 2. **Deduções e Valores:** Detalhamento de cada dedução aplicada.
  - 3. **Base de Cálculo, Alíquota e Imposto:** Parcela a deduzir, alíquota nominal, imposto retido e alíquota efetiva real.
- **Sem Gráficos:** Focado 100% em números, clareza contábil e tabelas diretas.
- **Guia Didático:** Tabela progressiva de referência com todas as faixas e alíquotas oficiais.

---

### 4. 🏢 [Simulador de Fundos Imobiliários (FIIs)](./fundos-imobiliarios/)
- **Efeito Bola de Neve:** Simulação de 2 anos (24 meses) reinvestindo 100% dos proventos recebidos na compra de novas cotas.
- **Número Mágico (Magic Number):** Identificação de quantas cotas são necessárias para que o dividendo compre 1 cota nova todo mês sozinho.
- **Visualizações Dinâmicas:**
  - **Gráfico de Rosca:** Proporção entre cotas compradas com dinheiro do bolso vs. cotas ganhas de graça com os proventos.
  - **Tabela Mês a Mês:** Acompanhamento de 24 meses com colunas de cotas acumuladas, patrimônio em R$, rendimento, cotas compradas e aporte.
- **Guia Didático:** Explicação da isenção de IR para pessoas físicas e mecânica de reinvestimento.

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
   git clone https://github.com/arthun01/CaniveteFinanceiro
   cd CaniveteFinanceiro
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

O projeto está configurado com `base: './'` no [`vite.config.ts`](./vite.config.ts), permitindo que todas as páginas e assets funcionem perfeitamente no GitHub Pages sem depender de runners do GitHub Actions.

### Como Publicar com 1 Comando (`npm run deploy`)

O projeto utiliza a biblioteca [`gh-pages`](https://www.npmjs.com/package/gh-pages) para compilar e subir os arquivos da pasta `dist/` diretamente para a branch de publicação `gh-pages`:

1. **Execute o comando de deploy:**
   ```bash
   npm run deploy
   ```
   *(Este comando roda automaticamente o `npm run build` e publica a pasta `dist/` na branch `gh-pages` do seu repositório).*

2. **Configure o GitHub Pages (apenas na 1ª vez):**
   - Acesse: **[Settings > Pages](https://github.com/arthun01/CaniveteFinanceiro/settings/pages)**
   - Em **Build and deployment > Source**, selecione: **`Deploy from a branch`**
   - Em **Branch**, selecione: **`gh-pages`** / pasta **`/(root)`**
   - Clique em **Save**.

3. **Pronto!** Em poucos instantes seu site estará disponível no ar em:  
   👉 **`https://arthurrv.me/CaniveteFinanceiro/`**

4. **SEO & Rastreamento nos Buscadores:**
   - **Sitemap XML:** `https://arthurrv.me/CaniveteFinanceiro/sitemap.xml`
   - **Robots.txt:** `https://arthurrv.me/CaniveteFinanceiro/robots.txt`
   - **Open Graph Banner:** `https://arthurrv.me/CaniveteFinanceiro/og-image.png` (1200x630)
   - Metadados canônicos, Open Graph, Twitter Cards e Schema.org (JSON-LD) prontos para indexação no Google Search Console e Bing Webmaster Tools.

---

## 🤖 AI-SDD — System Design Documents para IAs & Devs

O projeto conta com uma pasta dedicada de especificações e design system para Agentes de IA e desenvolvedores em [`ai-sdd/`](./ai-sdd/):
- **[`ai-sdd/01-visao-e-arquitetura.md`](./ai-sdd/01-visao-e-arquitetura.md):** Princípios de privacidade, arquitetura MPA e convenções.
- **[`ai-sdd/02-design-system-e-ui.md`](./ai-sdd/02-design-system-e-ui.md):** Tokens de cor, tipografia Manrope + DM Sans, dark mode e componentes.
- **[`ai-sdd/03-guia-criacao-novas-features.md`](./ai-sdd/03-guia-criacao-novas-features.md):** Checklist de 10 passos para criar uma nova calculadora em minutos.
- **[`ai-sdd/04-padroes-de-codigo.md`](./ai-sdd/04-padroes-de-codigo.md):** Tipagem TypeScript estrita, ciclo de vida do Chart.js e funções puras.
- **[`ai-sdd/roadmap-backlog.md`](./ai-sdd/roadmap-backlog.md):** Backlog estruturado para próximas calculadoras (SAC vs Price, CLT vs PJ, etc.).
- **[`ai-sdd/sources/`](./ai-sdd/sources/):** Histórico e ideias originais preservadas.

---

## 📁 Estrutura do Projeto

```text
├── ai-sdd/                         # AI-SDD: Especificações, Design System e Roadmap
├── index.html                      # Portal inicial com cards de ferramentas
├── juros-compostos/
│   └── index.html                  # Calculadora de Juros Compostos
├── reserva-emergencia/
│   └── index.html                  # Calculadora de Reserva de Emergência
├── imposto-de-renda/
│   └── index.html                  # Calculadora de Imposto de Renda (IRRF)
├── fundos-imobiliarios/
│   └── index.html                  # Simulador de Fundos Imobiliários (FIIs)
├── src/
│   ├── animations/                 # Animações de odômetro GSAP
│   ├── charts/                     # Gerenciadores de gráficos Chart.js
│   ├── services/                   # Motores de cálculo financeiro puros
│   ├── styles/                     # Tokens, componentes e responsividade
│   ├── types/                      # Tipagens TypeScript por domínio
│   ├── utils/                      # Formatação, máscaras e navbar global
│   ├── main.ts                     # Controller de Juros Compostos
│   ├── portalMain.ts               # Controller do Portal
│   ├── reservaMain.ts              # Controller de Reserva de Emergência
│   └── impostoRendaMain.ts         # Controller de Imposto de Renda
├── vite.config.ts                  # Configuração Vite Multi-Página
└── README.md                       # Documentação principal
```

---

## 👨‍💻 Autor

Desenvolvido por **Arthur**  
- GitHub: [@arthun01](https://github.com/arthun01)

---

## 📄 Licença

Este projeto está sob a licença [MIT](https://opensource.org/licenses/MIT).

# 📈 Calculadora de Juros Compostos Online

> Um simulador financeiro moderno, estático e de alta performance para projeção de investimentos e patrimônio com juros compostos e aportes periódicos.

Construído com **HTML5**, **CSS3 Moderno** e **TypeScript** estruturado com **Vite**, adotando a estética **Dark Glassmorphism** com animações fluidas via **GSAP** e gráficos interativos com **Chart.js**.

---

## ✨ Funcionalidades

- **Simulação Completa de Investimentos:**
  - Definição de valor inicial e aporte mensal regular.
  - Alternância de taxas de juros (**anual % a.a.** ou **mensal % a.m.**).
  - Flexibilidade de período (**anos** ou **meses**).
- **Resultados Tridimensionais:**
  1. **Métricas em Destaque (Cards KPI):** Total Investido, Total em Juros e Valor Final Acumulado com contador numérico animado (efeito odômetro).
  2. **Gráficos Interativos (Chart.js):**
     - **Gráfico de Rosca (Donut):** Proporção visual entre o capital investido do bolso vs. rendimento em juros.
     - **Gráfico de Barras Empilhadas:** Evolução temporal da curva de patrimônio mês a mês ou ano a ano.
  3. **Tabela de Amortização & Evolução:**
     - Toggle para alternar dinamicamente entre visualização **Mês a Mês** e **Ano a Ano**.
     - Colunas com detalhamento de: *Período*, *Juros do Período*, *Total Investido*, *Total Juros* e *Acumulado*.
- **Design System Dark Glassmorphism:**
  - Painéis foscos com desfoque profundo (`backdrop-filter: blur(20px)`).
  - Bordas com contorno iluminado via máscara gradiente (`mask-composite: exclude`).
  - Totalmente responsivo (**Mobile-First**): otimizado para celulares, tablets e monitores ultrawide.
- **Seção Didática Integrada:**
  - Explicação acessível da fórmula matemática $M = C \times (1 + i)^t$ e o efeito dos aportes recorrentes.

---

## 🛠️ Tecnologias Utilizadas

- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Dev Server:** [Vite](https://vitejs.dev/)
- **Estilização:** CSS3 puro com Custom Properties, Flexbox e CSS Grid
- **Animações:** [GSAP 3](https://greensock.com/gsap/)
- **Gráficos:** [Chart.js](https://www.chartjs.org/)

---

## 🚀 Como Rodar Localmente

### Pré-requisitos
Certifique-se de ter o [Node.js](https://nodejs.org/) instalado (versão 18 ou superior).

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
   O terminal exibirá o endereço local, geralmente:
   👉 **`http://localhost:5173/`**

4. **Gerar build de produção:**
   ```bash
   npm run build
   ```
   Os arquivos finais otimizados serão gerados na pasta `dist/`.

5. **Visualizar o build localmente:**
   ```bash
   npm run preview
   ```

---

## 🌐 Como Fazer o Deploy no GitHub Pages

O projeto já está configurado com `base: './'` no [`vite.config.ts`](./vite.config.ts), o que garante que os scripts e folhas de estilo carreguem perfeitamente independentemente do subdiretório do repositório no GitHub Pages.

Você pode realizar o deploy através de dois métodos:

---

### Opção 1: Deploy Automático via GitHub Actions (Recomendado)

O repositório já inclui o arquivo de workflow pronto em [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml).

1. No seu repositório no GitHub, vá em **Settings** (Configurações).
2. No menu lateral esquerdo, clique em **Pages**.
3. Na seção **Build and deployment**:
   - Em **Source**, selecione **GitHub Actions**.
4. Faça um commit e envie para a branch principal:
   ```bash
   git add .
   git commit -m "feat: configuração inicial da calculadora de juros compostos"
   git push origin main
   ```
5. Pronto! O GitHub Actions irá automaticamente compilar o TypeScript, gerar os arquivos otimizados e publicar o site. O link ficará disponível em:
   `https://arthun01.github.io/calculadora_juros_compostos/`

---

### Opção 2: Deploy com o pacote `gh-pages`

Caso prefira publicar através de um comando no terminal:

1. **Instale o pacote `gh-pages` como dependência de desenvolvimento:**
   ```bash
   npm install -D gh-pages
   ```

2. **Adicione os scripts no seu `package.json`:**
   ```json
   "scripts": {
     "dev": "vite",
     "build": "tsc && vite build",
     "preview": "vite preview",
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

3. **Execute o comando de deploy:**
   ```bash
   npm run deploy
   ```

4. No GitHub, acesse **Settings > Pages** e certifique-se de que a **Source** está apontando para a branch `gh-pages` e pasta `/ (root)`.

---

## 📁 Estrutura de Arquivos

```text
├── .github/
│   └── workflows/
│       └── deploy.yml      # Pipeline CI/CD automático para o GitHub Pages
├── public/                 # Assets públicos estáticos
├── src/
│   ├── animations/
│   │   └── animManager.ts  # Gerenciador de odômetro e animações GSAP
│   ├── charts/
│   │   └── chartManager.ts # Configuração dos gráficos Donut e Barras Chart.js
│   ├── services/
│   │   └── calculator.ts   # Motor matemático financeiro
│   ├── styles/
│   │   ├── base.css        # Reset, tipografia e background com iluminação radial
│   │   ├── components.css  # Estilização de formulários, botões, KPIs e tabela
│   │   ├── glass.css       # Regras da skill glass-dark-ui (.glass-panel, .border-gradient)
│   │   ├── responsive.css  # Adaptações mobile-first
│   │   └── tokens.css      # Cores, espaçamentos e variáveis de design
│   ├── types/
│   │   └── finance.ts      # Interfaces TypeScript de tipos financeiros
│   ├── utils/
│   │   ├── formatters.ts   # Formatação em Real (BRL) e porcentagens
│   │   └── masks.ts        # Máscaras monetárias de input em tempo real
│   └── main.ts             # Inicialização e fluxo de eventos
├── index.html              # Estrutura HTML5 da página
├── package.json            # Dependências e scripts npm
├── tsconfig.json           # Configurações do TypeScript
├── vite.config.ts          # Configuração do Vite com base relativa para deploy
└── README.md               # Documentação do projeto
```

---

## 👨‍💻 Autor

Desenvolvido por **Arthur**  
- GitHub: [@arthun01](https://github.com/arthun01)

---

## 📄 Licença

Este projeto está sob a licença [MIT](https://opensource.org/licenses/MIT). Sinta-se livre para usar e contribuir!

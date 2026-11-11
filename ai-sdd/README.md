# 🤖 AI-SDD — System Design Documents & Guia de Engenharia para IAs

> **Bem-vindo ao AI-SDD (AI Spec-Driven Development) do CaniveteFinanceiro.**  
> Esta pasta foi projetada especificamente para ser consumida e mantida por **Agentes de IA** (Antigravity, Claude, Cursor, Copilot, Gemini) e desenvolvedores humanos. Ela guarda toda a visão de produto, padrões visuais, especificações matemáticas e guias de implementação para acelerar a criação de novas funcionalidades sem perda de contexto ou drift de design.

---

## 🎯 Por Que Esta Pasta Existe?

1. **Velocidade Extrema:** Uma IA munida destes documentos consegue criar uma nova calculadora completa (HTML, TS, CSS, testes, gráficos e responsividade) em minutos, sem precisar adivinhar padrões.
2. **Consistência Visual Absoluta:** O projeto segue uma identidade visual estrita herdada da aplicação externa parceira ("Saldo"), com paleta verde floresta/lima, tipografia Manrope + DM Sans e suporte a Light/Dark Mode.
3. **Memória e Intenção:** Preserva a lógica matemática, regras legais (ex.: tabelas de IRRF e INSS da Receita Federal) e a filosofia de produto por trás de cada decisão.

---

## 📂 Mapa de Documentos do AI-SDD

| Documento | Descrição | Quando Consultar |
| :--- | :--- | :--- |
| **[`01-visao-e-arquitetura.md`](./01-visao-e-arquitetura.md)** | Arquitetura MPA com Vite, TypeScript puro, princípios de privacidade e convenções de pastas. | Ao planejar a estrutura de arquivos e roteamento de novas páginas. |
| **[`02-design-system-e-ui.md`](./02-design-system-e-ui.md)** | Design Tokens (cores, fontes, bordas), Dark Mode, componentes de formulário, cards, tabelas e modais. | Ao construir ou estilizar qualquer elemento de interface. |
| **[`03-guia-criacao-novas-features.md`](./03-guia-criacao-novas-features.md)** | **Checklist passo a passo** para implementar uma nova calculadora do zero até o deploy. | **Sempre que for criar uma nova funcionalidade.** |
| **[`04-padroes-de-codigo.md`](./04-padroes-de-codigo.md)** | Padrões de código TypeScript: motores matemáticos puros, máscaras monetárias, ciclo de vida do Chart.js e acessibilidade. | Ao programar serviços, controladores e manipulação de DOM. |
| **[`roadmap-backlog.md`](./roadmap-backlog.md)** | Ideias e especificações prévias de calculadoras futuras (SAC x Price, CLT x PJ, CDB x LCI/LCA, FIRE). | Ao escolher a próxima funcionalidade a ser implementada. |

---

## 🗃️ Especificações de Funcionalidades Implementadas (`features/`)

Documentações completas das ferramentas atualmente em produção:

- **[`features/01-juros-compostos.md`](./features/01-juros-compostos.md):** Projeção patrimonial, fórmula exponencial, gráficos Donut + Barras Empilhadas e tabela mês a mês / ano a ano.
- **[`features/02-reserva-emergencia.md`](./features/02-reserva-emergencia.md):** Cobertura por estabilidade profissional (CLT, Servidor, MEI), tempo de acúmulo e gráficos de distribuição.
- **[`features/03-imposto-de-renda.md`](./features/03-imposto-de-renda.md):** Retenção na fonte (IRRF), deduções legais, tabelas progressivas do INSS e IRPF, e auditoria em 3 tabelas contábeis.
- **[`features/04-portal-e-navegacao.md`](./features/04-portal-e-navegacao.md):** Hub inicial (`index.html`), navbar unificada, modal "Apoie o Projeto" com Chave Pix e persistência do tema.
- **[`features/05-fundos-imobiliarios.md`](./features/05-fundos-imobiliarios.md):** Efeito Bola de Neve com reinvestimento de proventos, Número Mágico (Magic Number), gráfico de cotas do bolso vs rendimento e tabela de 2 anos.

---

## 📦 Fontes Originais Preservadas (`sources/`)

Os arquivos de concepção originais criados pelo idealizador do projeto foram preservados em [`sources/`](./sources/):
- [`sources/ideia.md`](./sources/ideia.md): Concepção inicial da Calculadora de Juros Compostos.
- [`sources/ideia-2.md`](./sources/ideia-2.md): Concepção da Calculadora de Reserva de Emergência e portal multi-ferramentas.
- [`sources/ideia-3.md`](./sources/ideia-3.md): Concepção da Calculadora de Imposto de Renda e tabelas progressivas.
- [`sources/base-css-aplicacao-externa.md`](./sources/base-css-aplicacao-externa.md): Folha de estilos e tokens de design da aplicação externa de referência ("Saldo").
- [`sources/plano_de_criacao.md`](./sources/plano_de_criacao.md): Plano inicial de arquitetura técnica e animações.

---

## 🤖 Instrução para o Agente de IA ao Criar uma Nova Feature

Copie e use este roteiro mental ou prompt ao iniciar uma tarefa:

```markdown
Você está trabalhando no CaniveteFinanceiro.
Antes de escrever código, leia:
1. `ai-sdd/01-visao-e-arquitetura.md` (estrutura MPA)
2. `ai-sdd/02-design-system-e-ui.md` (tokens e classes CSS)
3. `ai-sdd/03-guia-criacao-novas-features.md` (checklist de execução)

Requisitos obrigatórios:
- Separar o motor matemático em `src/services/<nome>Calculator.ts` (funções puras, 100% testáveis).
- Seguir a paleta oficial (DM Sans + Manrope, --green, --lime, --ink, --muted).
- Suportar Light Mode e Dark Mode via CSS variables.
- Atualizar `vite.config.ts`, navbar de todas as páginas e o portal (`index.html`).
- Rodar `npm run build` e garantir compilação com zero erros.
```

# 🔍 Feature Spec — SEO Técnico, Metadados & Indexação nos Buscadores

> **Origem:** Baseado em [`sources/ideia-indexacao-google-search.md`](../sources/ideia-indexacao-google-search.md).  
> **Domínio Canônico:** `https://arthurrv.me/CaniveteFinanceiro/`  
> **Arquivos:** `public/robots.txt`, `public/sitemap.xml`, `public/site.webmanifest`, `public/og-image.png`, `public/og-image.svg`, `public/google993760524e52a627.html`, e as 6 páginas HTML do projeto.

---

## 1. 🎯 Objetivo da Funcionalidade
Garantir rastreamento, indexação e posicionamento orgânico de excelência nos mecanismos de busca (Google, Bing e outros), permitindo que qualquer usuário encontre o **CaniveteFinanceiro** e suas calculadoras gratuitas ao pesquisar por juros compostos, reserva de emergência, imposto de renda retido na fonte, dividendos de fundos imobiliários e financiamentos com prestações fixas (Tabela Price).

---

## 2. 🗺️ Arquitetura de URLs Canônicas e Rotas

Todas as páginas possuem URLs canônicas absolutas com protocolo HTTPS e barra final (*trailing slash*):

| Página / Ferramenta | Rota Canônica |
| :--- | :--- |
| **Portal Inicial** | `https://arthurrv.me/CaniveteFinanceiro/` |
| **Calculadora de Juros Compostos** | `https://arthurrv.me/CaniveteFinanceiro/juros-compostos/` |
| **Calculadora de Reserva de Emergência** | `https://arthurrv.me/CaniveteFinanceiro/reserva-emergencia/` |
| **Calculadora de Imposto de Renda (IRRF)** | `https://arthurrv.me/CaniveteFinanceiro/imposto-de-renda/` |
| **Simulador de Fundos Imobiliários (FIIs)** | `https://arthurrv.me/CaniveteFinanceiro/fundos-imobiliarios/` |
| **Simulador de Financiamento (Tabela Price)** | `https://arthurrv.me/CaniveteFinanceiro/financiamento/` |

---

## 3. 🤖 Arquivos Essenciais de Rastreamento

### 3.1 `robots.txt` (`public/robots.txt` -> `dist/robots.txt`)
- Permite rastreamento irrestrito de todas as páginas públicas para todos os robôs (`User-agent: *`, `Allow: /`).
- Não bloqueia CSS, JavaScript ou imagens (necessários para a renderização do Googlebot).
- Aponta diretamente para o sitemap oficial.

### 3.2 `sitemap.xml` (`public/sitemap.xml` -> `dist/sitemap.xml`)
- Formato padrão XML com namespace `http://www.sitemaps.org/schemas/sitemap/0.9`.
- Contempla as 6 páginas públicas sem duplicações, com `changefreq` e prioridades ponderadas (1.0 no portal, 0.9 nas calculadoras).

### 3.3 `site.webmanifest` (`public/site.webmanifest` -> `dist/site.webmanifest`)
- Configuração PWA com tema `#183f35`, ícones vetoriais SVG e PNG/ICO de alta resolução, modo standalone e idioma `pt-BR`.

---

## 4. 🏷️ Metadados On-Page por Página

Cada página possui:
1. **Título (`<title>`) Único:** estruturado como `Nome da Ferramenta | CaniveteFinanceiro`, priorizando termos de busca populares em português.
2. **Meta Description:** resumo conciso, focado no benefício do usuário, sem repetições artificiais (*keyword stuffing*).
3. **Open Graph Tags (`og:*`):** `og:type`, `og:site_name`, `og:title`, `og:description`, `og:url`, `og:image`, `og:locale`.
4. **Twitter Cards (`twitter:*`):** `twitter:card="summary_large_image"` apontando para a imagem oficial de 1200x630.
5. **Banner Social Oficial (`og-image.png`):** 1200 x 630 px com a identidade visual da aplicação (gradiente verde floresta, tipografia destacada e badges das 5 ferramentas).

---

## 5. 🧱 Dados Estruturados Schema.org (JSON-LD)

Implementados no `<head>` de cada arquivo:

### No Portal Inicial (`index.html`):
- `WebSite`: identificação do site, nome e idioma.
- `Organization`: entidade responsável pelo projeto, logo e link.

### Em cada Calculadora / Ferramenta:
- `WebApplication`:
  - `applicationCategory: "FinanceApplication"`
  - `operatingSystem: "All"`
  - `browserRequirements: "Requires JavaScript"`
  - `offers: { @type: "Offer", price: "0", priceCurrency: "BRL" }`
- `BreadcrumbList`:
  - Nível 1: Início (`https://arthurrv.me/CaniveteFinanceiro/`)
  - Nível 2: Nome da ferramenta específica.

---

## 6. 🛠️ Passo a Passo para Ativação no Google Search Console e Bing

### 6.1 Google Search Console
1. Acesse: **[Google Search Console](https://search.google.com/search-console)**.
2. Em **Selecionar tipo de propriedade**, escolha **Prefixo do URL** e insira:  
   `https://arthurrv.me/CaniveteFinanceiro/`
3. **Verificação de Propriedade:**
   - O arquivo de verificação baixado (`google993760524e52a627.html`) já foi incluído na pasta `public/` e será publicado na raiz do site.
   - A meta tag `<meta name="google-site-verification" content="google993760524e52a627" />` também foi adicionada ao `<head>` do `index.html`.
4. Após publicar (`npm run deploy`), clique em **Verificar**.
5. No menu lateral, acesse **Sitemaps**, digite `sitemap.xml` no campo de envio e clique em **Enviar**.
6. Em **Inspeção de URL**, teste a URL inicial e clique em **Solicitar Indexação**.

### 6.2 Bing Webmaster Tools
1. Acesse: **[Bing Webmaster Tools](https://www.bing.com/webmasters)**.
2. É possível sincronizar automaticamente todas as configurações diretamente com sua conta do Google Search Console com apenas 1 clique.
3. Ou insira a URL do sitemap: `https://arthurrv.me/CaniveteFinanceiro/sitemap.xml`.

# Tarefa: Implementação completa de SEO técnico e indexação no Google

Atue como um engenheiro de software sênior especializado em SEO técnico, otimização para mecanismos de busca (Google/Bing), desenvolvimento web e performance.

Tenho um site estático desenvolvido com HTML, CSS, TypeScript e Vite. Quero prepará-lo para ser indexado corretamente pelo Google e maximizar suas chances de aparecer nos resultados de pesquisa.

Sua tarefa é ANALISAR O PROJETO EXISTENTE, identificar problemas e implementar todas as melhorias necessárias diretamente nos arquivos.

**IMPORTANTE:** Não quero apenas recomendações ou um relatório. Quero que você execute as alterações no código, respeitando a arquitetura, tecnologias e identidade visual já existentes.

## 1. Análise inicial do projeto

Antes de modificar qualquer coisa:

- Analise a estrutura completa do projeto.
- Identifique as páginas existentes e suas respectivas rotas.
- Identifique o domínio oficial do site.
- Verifique como o Vite está configurado.
- Identifique se existem páginas com conteúdo duplicado.
- Verifique se o site utiliza JavaScript para renderizar conteúdo importante.
- Identifique possíveis problemas que impeçam o Googlebot de rastrear ou indexar as páginas.

Não faça alterações desnecessárias na estrutura ou no funcionamento do site.

## 2. SEO On-Page

Implemente as melhores práticas de SEO em todas as páginas relevantes.

Para cada página:

- Defina um título HTML (`title`) único, descritivo e otimizado.
- Defina uma meta description exclusiva.
- Configure corretamente a tag canonical.
- Configure o idioma do documento (`lang="pt-BR"`).
- Organize corretamente os títulos H1, H2 e H3.
- Garanta que cada página tenha apenas um H1 principal.
- Utilize URLs amigáveis, quando aplicável.
- Adicione textos alternativos (`alt`) descritivos às imagens.
- Garanta que links internos tenham textos descritivos.
- Identifique e corrija links quebrados.
- Utilize metadados Open Graph para compartilhamento em redes sociais.
- Adicione metadados Twitter Cards.

Não utilize palavras-chave artificialmente ou faça keyword stuffing. Priorize conteúdo natural e útil.

## 3. Arquivos essenciais para indexação

Crie ou configure corretamente:

### robots.txt

- Permita o rastreamento das páginas públicas.
- Bloqueie apenas áreas que realmente não devem ser rastreadas.
- Informe a localização absoluta do sitemap.
- Não bloqueie arquivos CSS, JavaScript ou imagens necessários à renderização.

### sitemap.xml

- Gere um sitemap XML válido.
- Inclua todas as páginas públicas e indexáveis.
- Utilize URLs absolutas com HTTPS.
- Exclua páginas duplicadas, redirecionadas, privadas ou com `noindex`.
- Utilize datas de modificação verdadeiras quando disponíveis.
- Garanta que o sitemap seja atualizado quando novas páginas forem adicionadas.

Se o projeto possuir múltiplas páginas, todas as páginas relevantes devem estar contempladas.

## 4. Dados estruturados (Schema.org)

Implemente dados estruturados JSON-LD apropriados para o tipo de site.

Analise o conteúdo e escolha os schemas adequados, como:

- Organization;
- WebSite;
- WebPage;
- LocalBusiness, caso seja um negócio local;
- Product, caso existam produtos;
- BreadcrumbList, caso existam breadcrumbs;
- Article, caso existam artigos.

Utilize somente informações reais presentes no projeto.

Não invente avaliações, preços, endereços, telefones, horários ou outras informações.

Evite adicionar schemas desnecessários ou incompatíveis com o conteúdo.

## 5. SEO técnico e performance

Analise e otimize:

- Core Web Vitals;
- Largest Contentful Paint (LCP);
- Interaction to Next Paint (INP);
- Cumulative Layout Shift (CLS);
- Carregamento de imagens;
- Lazy loading de imagens não críticas;
- Preload de recursos realmente críticos;
- Fontes e carregamento de fontes;
- Minificação de CSS e JavaScript;
- Compressão de arquivos;
- Cache de recursos estáticos;
- Uso de imagens em WebP ou AVIF quando apropriado.

Não implemente otimizações que prejudiquem a experiência do usuário.

Verifique também se o site pode ser renderizado e interpretado corretamente pelo Googlebot.

Se houver conteúdo importante que só aparece após uma interação do usuário, avalie como torná-lo acessível ao rastreador.

## 6. Configuração específica para Vite

Como o projeto utiliza Vite:

- Verifique o `vite.config.ts`.
- Configure corretamente a opção `base`, se necessário.
- Garanta que os arquivos `robots.txt` e `sitemap.xml` sejam disponibilizados na raiz do domínio após o build.
- Verifique os caminhos de imagens, CSS, JavaScript e demais recursos.
- Garanta que o build de produção funcione corretamente.
- Não introduza dependências desnecessárias.
- Se necessário, implemente geração automática de sitemap durante o build.

Se o site possuir várias rotas e depender de roteamento no frontend, verifique também a configuração de fallback do servidor de hospedagem.

## 7. Google Search Console

Prepare o projeto para utilização do Google Search Console.

- Identifique a melhor forma de verificar a propriedade do domínio.
- Prefira a verificação por DNS quando for possível acessar a configuração DNS.
- Caso não seja possível, prepare uma alternativa por arquivo HTML ou meta tag.
- Não invente tokens de verificação.
- Não tente utilizar credenciais inexistentes.
- Oriente sobre onde inserir o código ou arquivo de verificação.
- Garanta que o sitemap esteja pronto para ser enviado ao Search Console.

Explique como:

1. Acessar https://search.google.com/search-console
2. Adicionar o domínio.
3. Verificar a propriedade.
4. Enviar o sitemap.xml.
5. Solicitar indexação das páginas principais.
6. Acompanhar erros de rastreamento e indexação.

Não afirme que o site foi indexado sem confirmação no Search Console.

## 8. Bing e outros mecanismos de busca

Prepare também o site para o Bing Webmaster Tools.

Considere:
- Verificação de propriedade.
- Envio do sitemap.
- Configuração de metadados apropriados.
- Compatibilidade com mecanismos de busca tradicionais.

## 9. Segurança e confiabilidade

Verifique:

- HTTPS.
- Redirecionamento de HTTP para HTTPS, quando suportado pela hospedagem.
- Redirecionamento entre www e não-www, conforme o domínio canônico escolhido.
- Ausência de conteúdo misto (HTTP dentro de páginas HTTPS).
- Ausência de páginas acidentalmente configuradas com `noindex`.
- Ausência de bloqueios indevidos no robots.txt.

Não altere configurações de DNS ou hospedagem sem minha autorização.

## 10. Validação final

Depois de implementar tudo:

- Execute o build de produção (`npm run build`).
- Corrija eventuais erros.
- Verifique se o sitemap.xml foi gerado corretamente.
- Verifique se o robots.txt está acessível na raiz do build.
- Confira os metadados de todas as páginas.
- Verifique canonical e URLs absolutas.
- Confira os dados estruturados.
- Verifique se os recursos estão sendo carregados corretamente.
- Identifique eventuais problemas que ainda dependam da hospedagem.

Utilize, quando possível:

- Google Rich Results Test: https://search.google.com/test/rich-results
- Google PageSpeed Insights: https://pagespeed.web.dev/
- Schema Markup Validator: https://validator.schema.org/
- Google Search Console: https://search.google.com/search-console

## 11. Relatório de conclusão

Ao terminar, apresente um relatório contendo:

1. Problemas encontrados inicialmente.
2. Arquivos criados.
3. Arquivos modificados.
4. Melhorias de SEO implementadas.
5. Configurações que ainda dependem de mim.
6. Instruções para publicar as alterações.
7. Passo a passo para cadastrar o site no Google Search Console.
8. Eventuais limitações que ainda possam prejudicar a indexação.

### REGRAS IMPORTANTES

- Não recrie o site.
- Não altere sua identidade visual.
- Não remova funcionalidades.
- Não invente informações comerciais.
- Não crie conteúdo artificial apenas para tentar melhorar o posicionamento.
- Não considere a simples existência do sitemap como garantia de indexação.
- Priorize SEO técnico correto, conteúdo acessível e boas práticas oficiais do Google.
- Faça alterações reais no projeto, não apenas sugestões.

**OBJETIVO FINAL:** Entregar um site estático Vite tecnicamente preparado para rastreamento, indexação e posicionamento orgânico no Google, com todas as configurações necessárias implementadas e validadas.
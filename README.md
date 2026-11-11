# Th Apps — Portfólio de Matheus Santos

Site profissional da **Th Apps**, marca pessoal de **Matheus Santos**, desenvolvedor web. O projeto reúne portfólio, apresentação de serviços, processo de trabalho e um formulário real de solicitação de orçamento.

> **Identidade:** preto profundo, dourado quente e tipografia editorial. Os arquivos de marca utilizados estão em `public/brand/` e foram extraídos da identidade visual fornecida.

---

## Stack

| Camada | Tecnologia |
| --- | --- |
| Interface | Vue 3 + TypeScript |
| Build | Vite + vite-ssg (pré-renderização) |
| Estilo | Tailwind CSS v4 + design system próprio |
| Rotas | Vue Router 4 |
| Animação | GSAP + ScrollTrigger |
| Ícones | simple-icons + SVGs próprios |
| Fontes | Inter Variable, Manrope Variable e Instrument Serif (self-hosted) |
| Formulário | Node + Express 5 + Zod |
| E-mail | Resend |
| Anti-spam | Honeypot, tempo mínimo, rate limit por IP e Cloudflare Turnstile |
| Deploy sugerido | Vercel (front) + Render (back) |

Requisitos: **Node.js 20+** (o projeto foi validado com Node 24).

---

## Começando

```bash
# 1. Instale as dependências do site
npm install

# 2. Crie o arquivo de variáveis do site
copy .env.example .env      # Windows
# cp .env.example .env      # macOS/Linux

# 3. Rode o site
npm run dev
```

O site fica disponível em `http://localhost:5173`.

### Scripts do site

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Ambiente de desenvolvimento |
| `npm run build` | Typecheck + build SSG + geração de SEO |
| `npm run preview` | Pré-visualiza o build de produção |
| `npm run typecheck` | Verificação de tipos do front-end |
| `npm run seo` | Regenera `sitemap.xml`, `robots.txt` e `404.html` |
| `npm run images` | Regenera favicons e imagem Open Graph |
| `npm run server:install` | Instala as dependências do backend |
| `npm run server:dev` | Roda o backend em modo desenvolvimento |
| `npm run server:start` | Roda o backend compilado |

---

## Variáveis de ambiente do site

Arquivo: `.env` (veja `.env.example`).

| Variável | Descrição |
| --- | --- |
| `VITE_SITE_URL` | URL pública do site. Usada em canonical, Open Graph, sitemap e robots. **Sem barra final.** |
| `VITE_CONTACT_ENDPOINT` | URL completa do endpoint do formulário. Ex.: `https://api.seudominio.com/api/contact`. |
| `VITE_TURNSTILE_SITE_KEY` | Chave pública do Cloudflare Turnstile. Vazio = widget desativado. |

> `VITE_*` é incorporado ao build. Depois de alterar esses valores, rode `npm run build` novamente.

---

## Formulário de orçamento (backend)

O backend fica em `server/` e expõe:

- `POST /api/contact` — recebe a solicitação
- `GET /health` — health check para o deploy

### Rodando localmente

```bash
npm run server:install
copy server\.env.example server\.env
npm run server:dev
```

Em desenvolvimento, **sem provedor de e-mail configurado**, cada solicitação é gravada em `server/outbox/` como JSON. Isso permite testar o fluxo completo sem credenciais. A pasta é ignorada pelo Git.

O front-end aponta por padrão para `http://localhost:8787/api/contact`.

### Configuração do backend

Arquivo: `server/.env` (veja `server/.env.example`).

| Variável | Obrigatória | Descrição |
| --- | --- | --- |
| `PORT` | não | Porta do serviço. Padrão: `8787`. Em produção, o Render define automaticamente. |
| `NODE_ENV` | sim (produção) | Use `production` no deploy. |
| `CORS_ORIGIN` | sim (produção) | Origens autorizadas, separadas por vírgula. Ex.: `https://thapps.com.br,https://www.thapps.com.br`. |
| `RESEND_API_KEY` | para e-mail | Chave da API do Resend. |
| `CONTACT_TO_EMAIL` | para e-mail | Destinatário das solicitações. |
| `CONTACT_FROM_EMAIL` | para e-mail | Remetente verificado no Resend. Ex.: `Th Apps <contato@seudominio.com>`. |
| `TURNSTILE_SECRET_KEY` | recomendada | Chave secreta do Turnstile. Ao configurar, o backend exige o token do widget. |
| `CONTACT_WEBHOOK_URL` | opcional | Webhook para CRM, planilha, Discord etc. Recebe um JSON com `event` e `submission`. |
| `RATE_LIMIT_WINDOW_MS` | não | Janela do rate limit. Padrão: 15 minutos. |
| `RATE_LIMIT_MAX` | não | Máximo de envios por IP na janela. Padrão: `6`. |
| `TRUST_PROXY` | não | Proxies confiáveis à frente do serviço. Padrão em produção: `1`. Com Cloudflare: `2`. |

Se **nenhum** provedor estiver configurado em produção, o endpoint responde `502` com uma mensagem amigável — o formulário mostra o erro e, se o WhatsApp estiver configurado, oferece o envio com os dados preenchidos.

### Cloudflare Turnstile

1. Crie um widget em [dash.cloudflare.com → Turnstile](https://dash.cloudflare.com/?to=/:account/turnstile).
2. Copie a **site key** para `VITE_TURNSTILE_SITE_KEY` no `.env` do site.
3. Copie a **secret key** para `TURNSTILE_SECRET_KEY` no `server/.env`.
4. Gere o build novamente.

Para testar sem chaves reais, use as [chaves de teste oficiais](https://developers.cloudflare.com/turnstile/troubleshooting/testing/). O backend valida o token em `siteverify` antes de aceitar a solicitação.

### Proteções implementadas

- Validação de todos os campos no navegador **e** no servidor (Zod).
- Honeypot invisível (`website`).
- Tempo mínimo de preenchimento (2,5 s).
- Rate limit por IP (6 envios / 15 min por padrão).
- Verificação Turnstile quando configurada.
- Limite de 32 KB no corpo da requisição.
- CORS com lista explícita de origens em produção.
- Helmet, `x-powered-by` desativado e mensagens de erro sem detalhes internos.
- Consentimento LGPD obrigatório e link para a Política de Privacidade.

---

## Onde editar o conteúdo

| Arquivo | Conteúdo |
| --- | --- |
| `src/data/brand.ts` | Nome, tagline, descrição, URL e foto do "Sobre". |
| `src/data/links.ts` | WhatsApp, e-mail, Instagram, LinkedIn, GitHub, navegação e endpoint. |
| `src/data/services.ts` | Serviços oferecidos. |
| `src/data/technologies.ts` | Tecnologias e categorias. |
| `src/data/projects.ts` | Projetos, links, textos, tecnologias e galeria. |
| `src/data/about.ts` | Textos da seção "Sobre mim". |
| `src/data/differentials.ts` | Diferenciais. |
| `src/data/process.ts` | Etapas do processo. |

### Regra dos contatos vazios

`src/data/links.ts` começa com os canais diretos **vazios** porque nenhum número, e-mail ou perfil foi inventado. Campos vazios não são renderizados: o botão flutuante vira "Solicitar orçamento", os links sociais somem e o formulário continua funcionando.

Para ativar os canais, preencha:

```ts
export const contact = {
  whatsappNumber: '5511999999999',        // somente dígitos, com DDI + DDD
  whatsappDisplay: '+55 (11) 99999-9999', // como aparece na interface
  email: 'contato@seudominio.com',
  instagram: 'https://instagram.com/seu-perfil',
  github: 'https://github.com/matheussantos-web',
  linkedin: 'https://linkedin.com/in/seu-perfil',
} as const
```

Ao preencher o WhatsApp, o site ativa automaticamente:

- botão flutuante de WhatsApp;
- CTAs de WhatsApp no hero, projeto, contato e CTA final;
- fallback do formulário com os dados da tentativa já preenchidos.

### Projetos e imagens

- `image: ''` mantém o **placeholder elegante** gerado em código. Nenhum mockup falso é usado.
- Para usar uma imagem real, coloque o arquivo em `public/` e informe o caminho em `image` (ex.: `/projetos/festou.jpg`).
- `gallery: []` oculta a seção de galeria. Preencha com `{ src, alt, caption? }` para exibi-la.
- Adicionar um projeto em `src/data/projects.ts` cria automaticamente:
  - a rota `/projetos/:slug`;
  - a pré-renderização SSG (via `includedRoutes` no `vite.config.ts`);
  - a entrada no `sitemap.xml`.

> Não adicione métricas, clientes, depoimentos ou funcionalidades sem comprovação. O conteúdo atual reflete apenas informações públicas dos repositórios e sites.

---

## Identidade visual

Os arquivos em `public/brand/` foram extraídos dos PNGs fornecidos (fundo escuro removido com Sharp):

- `thapps-logo.png` — logo horizontal (rodapé e Open Graph);
- `thapps-symbol-gold.png` — símbolo dourado (header, favicons);
- `thapps-symbol-white.png` — símbolo branco;
- `thapps-monogram.png` — monograma.

Favicons e `og-image.png` são gerados por `npm run images`. Para trocar a identidade, substitua os arquivos em `public/brand/` e rode o script.

O dourado do design system é `#D6A64A`, com variações suaves para textos e bordas.

---

## SEO e pré-renderização

- `vite-ssg` gera HTML estático para `/`, projetos e política de privacidade.
- Metadados por página com `@unhead/vue`: título, descrição, canonical, Open Graph, Twitter Card e `lang="pt-BR"`.
- JSON-LD de `Person`, `WebSite` e `CreativeWork` nos projetos.
- `sitemap.xml`, `robots.txt` e `404.html` são gerados no build por `scripts/generate-seo.ts`.
- Imagem Open Graph 1200×630, favicons e manifest em `public/`.
- Rotas inexistentes são pré-renderizadas com `noindex` e tratadas pelo catch-all do Vue Router.

---

## Deploy

### 1. Front-end na Vercel

- **Framework preset:** Vite
- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Node.js:** 20+
- Variáveis de ambiente:
  - `VITE_SITE_URL=https://seudominio.com`
  - `VITE_CONTACT_ENDPOINT=https://seu-backend.onrender.com/api/contact`
  - `VITE_TURNSTILE_SITE_KEY=...` (se ativado)

O `vercel.json` já configura `cleanUrls`, cabeçalhos de segurança e cache para assets, ícones e imagem Open Graph.

### 2. Backend no Render

- **Tipo:** Web Service
- **Root Directory:** `server`
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`
- **Health Check Path:** `/health`
- Variáveis: as mesmas de `server/.env.example`, com `NODE_ENV=production` e `CORS_ORIGIN` apontando para o domínio do site.

Depois de publicar o backend, copie a URL pública para `VITE_CONTACT_ENDPOINT` na Vercel e refaça o deploy do front.

### Checklist pós-deploy

- [ ] Abrir `/`, `/projetos/festou`, `/projetos/broken-crown` e `/politica-de-privacidade`.
- [ ] Testar o formulário com dados válidos e inválidos.
- [ ] Confirmar recebimento do e-mail (ou do webhook).
- [ ] Testar o Turnstile com a chave de produção.
- [ ] Conferir `sitemap.xml`, `robots.txt` e `og-image.png` no domínio final.
- [ ] Validar o site em 360 px, 768 px, 1280 px e 1920 px.
- [ ] Navegar por teclado e conferir o menu mobile.
- [ ] Rodar Lighthouse (desktop e mobile).

---

## Acessibilidade e movimento

- Skip link, landmarks, foco visível e navegação por teclado.
- Menu mobile com foco gerenciado e fechamento por `Esc`.
- Formulário com `label`, `aria-invalid`, `aria-describedby`, mensagens de erro e estados ao vivo.
- Contraste alto no tema escuro.
- `prefers-reduced-motion` desativa animações e scroll suave.
- Imagens decorativas com `alt=""`; imagens de conteúdo recebem texto alternativo.

---

## Privacidade e LGPD

A página `/politica-de-privacidade` descreve coleta, finalidade, base legal, compartilhamento, cookies, segurança, retenção e direitos do titular. O formulário exige consentimento explícito antes do envio.

Ajuste o texto se os provedores mudarem (Resend, Cloudflare, hospedagem) ou se novas ferramentas de análise forem adicionadas.

---

## Estrutura

```
.
├── public/                 # favicons, OG, manifest e marca
├── scripts/                # geração de SEO, imagens e importação da marca
├── server/                 # backend Express do formulário
│   ├── src/index.ts
│   └── .env.example
├── src/
│   ├── components/
│   │   ├── layout/         # header, footer, progresso, contato flutuante
│   │   ├── sections/       # seções da home
│   │   └── ui/             # componentes reutilizáveis
│   ├── data/               # conteúdo editável
│   ├── lib/                # contato, SEO, motion, formulário
│   ├── views/              # home, projeto, privacidade, 404
│   ├── App.vue
│   ├── main.ts
│   ├── router.ts
│   └── style.css
├── index.html
├── vite.config.ts
└── vercel.json
```

---

## Limitações desta versão

- Nenhum canal direto (WhatsApp, e-mail, Instagram, LinkedIn) foi inventado; preencha `src/data/links.ts` para exibi-los.
- Nenhuma imagem real de projeto foi fornecida; os placeholders permanecem até que `image`/`gallery` sejam preenchidos.
- O domínio de produção ainda é um exemplo (`https://thapps.example`); configure `VITE_SITE_URL`.
- A entrega de e-mail depende de credenciais do Resend e de um domínio verificado.
- Não há métricas, depoimentos ou resultados fictícios no site.

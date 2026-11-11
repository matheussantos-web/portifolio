<script setup lang="ts">
import { contact } from '@/data/links'
import { hasEmail, hasWhatsApp } from '@/lib/contact'
import { usePageSeo } from '@/lib/seo'
import AppIcon from '@/components/ui/AppIcon.vue'

const lastUpdated = '11 de novembro de 2026'

const sections = [
  { id: 'quem-somos', label: 'Quem somos' },
  { id: 'dados-coletados', label: 'Dados coletados' },
  { id: 'finalidade', label: 'Finalidade e base legal' },
  { id: 'compartilhamento', label: 'Compartilhamento' },
  { id: 'cookies', label: 'Cookies e tecnologias' },
  { id: 'seguranca', label: 'Segurança' },
  { id: 'retencao', label: 'Retenção' },
  { id: 'direitos', label: 'Seus direitos' },
  { id: 'alteracoes', label: 'Alterações' },
  { id: 'contato-privacidade', label: 'Contato' },
] as const

usePageSeo({
  title: 'Política de Privacidade | Th Apps',
  description:
    'Saiba como a Th Apps, marca pessoal de Matheus Santos, coleta, utiliza e protege os dados enviados pelo formulário de orçamento.',
  path: '/politica-de-privacidade',
})
</script>

<template>
  <main id="conteudo" tabindex="-1" class="relative pt-[calc(var(--header-height)+2.5rem)] pb-20">
    <div class="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
      <div class="absolute inset-0 grid-lines opacity-35" />
      <div class="ambient-orb right-[-10rem] top-[-6rem] h-[24rem] w-[24rem] bg-gold/[0.05]" />
    </div>

    <div class="shell">
      <nav class="flex flex-wrap items-center gap-2 text-[0.72rem] text-muted/70" aria-label="Navegação estrutural">
        <RouterLink to="/" class="transition hover:text-gold">Início</RouterLink>
        <AppIcon name="chevron-right" :size="12" />
        <span class="text-paper/80">Política de Privacidade</span>
      </nav>

      <div class="mt-8 max-w-3xl">
        <p class="eyebrow">Privacidade e proteção de dados</p>
        <h1 class="section-title mt-4">Política de Privacidade</h1>
        <p class="mt-4 text-[0.92rem] leading-relaxed text-muted">
          Esta política explica como os dados enviados pelo site da Th Apps são tratados. Ela se
          aplica às informações fornecidas voluntariamente no formulário de orçamento e aos dados
          técnicos necessários para manter o site seguro.
        </p>
        <p class="mt-3 text-[0.72rem] uppercase tracking-[0.16em] text-muted/60">
          Última atualização: {{ lastUpdated }}
        </p>
      </div>

      <div class="mt-12 grid gap-10 lg:grid-cols-[16rem_1fr] lg:gap-14">
        <aside class="lg:sticky lg:top-28 lg:self-start">
          <nav class="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5" aria-label="Índice da política">
            <p class="text-[0.64rem] font-semibold uppercase tracking-[0.2em] text-muted/70">
              Nesta página
            </p>
            <ul class="mt-3 space-y-1.5">
              <li v-for="item in sections" :key="item.id">
                <a
                  :href="`#${item.id}`"
                  class="block rounded-md px-2 py-1.5 text-[0.76rem] text-muted transition hover:bg-gold/[0.06] hover:text-gold"
                >
                  {{ item.label }}
                </a>
              </li>
            </ul>
          </nav>

          <div class="mt-4 rounded-xl border border-gold/[0.14] bg-gold/[0.03] p-5">
            <p class="text-[0.76rem] font-medium text-paper">Dúvidas sobre seus dados?</p>
            <p class="mt-1.5 text-[0.72rem] leading-relaxed text-muted">
              Use o formulário de contato do site para solicitar informações ou exercer seus
              direitos.
            </p>
            <RouterLink
              to="/#contato"
              class="mt-3 inline-flex items-center gap-1.5 text-[0.72rem] font-medium text-gold-soft transition hover:text-gold"
            >
              Ir para o contato
              <AppIcon name="arrow-up-right" :size="12" />
            </RouterLink>
          </div>
        </aside>

        <article class="prose-thapps max-w-2xl">
          <section id="quem-somos">
            <h2>1. Quem somos</h2>
            <p>
              A Th Apps é a marca pessoal de <strong>Matheus Santos</strong>, desenvolvedor web. O
              site funciona como portfólio profissional e canal de solicitação de orçamento. O
              responsável pelo tratamento dos dados é o próprio desenvolvedor.
            </p>
          </section>

          <section id="dados-coletados">
            <h2>2. Quais dados são coletados</h2>
            <p>
              Ao enviar o formulário de orçamento, podem ser coletados os seguintes dados:
            </p>
            <ul>
              <li>Nome completo e, opcionalmente, empresa ou negócio;</li>
              <li>Número de WhatsApp e endereço de e-mail;</li>
              <li>Tipo de projeto, descrição da ideia e funcionalidades desejadas;</li>
              <li>Prazo pretendido e faixa de investimento, quando informados;</li>
              <li>Registro do consentimento para o atendimento da solicitação.</li>
            </ul>
            <p>
              Também podem ser tratados dados técnicos necessários para segurança e prevenção de
              abuso, como endereço IP, data e hora da solicitação, além do token de verificação
              gerado pelo Cloudflare Turnstile, quando essa proteção estiver ativa.
            </p>
            <p>
              O site não solicita dados sensíveis, informações financeiras, documentos ou senhas.
            </p>
          </section>

          <section id="finalidade">
            <h2>3. Finalidade e base legal</h2>
            <p>
              Os dados são utilizados exclusivamente para:
            </p>
            <ul>
              <li>Analisar a solicitação de orçamento e entender o contexto do projeto;</li>
              <li>Entrar em contato pelos canais informados;</li>
              <li>Elaborar uma proposta e, se houver contratação, dar andamento à relação;</li>
              <li>Proteger o site contra spam, abuso e tentativas de fraude.</li>
            </ul>
            <p>
              O tratamento para atendimento da solicitação se apoia no consentimento do titular e
              nos procedimentos preliminares a uma eventual contratação, nos termos da Lei Geral de
              Proteção de Dados (Lei nº 13.709/2018). As medidas de segurança podem se apoiar no
              legítimo interesse de proteger o site e seus usuários.
            </p>
            <p>
              Os dados não são utilizados para envio de newsletters ou publicidade sem uma
              autorização específica.
            </p>
          </section>

          <section id="compartilhamento">
            <h2>4. Compartilhamento</h2>
            <p>
              Os dados podem ser processados por provedores de infraestrutura necessários para o
              funcionamento do site, como serviços de hospedagem, envio de e-mail transacional e
              proteção contra spam. Esses provedores atuam apenas para viabilizar o serviço e devem
              tratar as informações de acordo com suas próprias políticas de privacidade.
            </p>
            <p>
              A Th Apps não vende, aluga ou comercializa dados pessoais. Informações também podem
              ser divulgadas quando houver obrigação legal, ordem judicial ou necessidade de
              proteger direitos.
            </p>
          </section>

          <section id="cookies">
            <h2>5. Cookies e tecnologias</h2>
            <p>
              Esta versão do site não utiliza cookies de publicidade ou ferramentas de análise de
              comportamento por padrão. O Cloudflare Turnstile, quando ativado, pode utilizar
              cookies ou tecnologias semelhantes estritamente necessárias para distinguir pessoas de
              robôs e proteger o formulário.
            </p>
            <p>
              Você pode bloquear ou remover cookies nas configurações do seu navegador. Isso pode
              afetar o funcionamento da verificação de segurança do formulário.
            </p>
          </section>

          <section id="seguranca">
            <h2>6. Segurança</h2>
            <p>
              O site adota medidas técnicas para reduzir riscos, como transmissão por HTTPS,
              validação dos dados no navegador e no servidor, limites de requisições por endereço IP,
              campo anti-spam e verificação de segurança no envio do formulário.
            </p>
            <p>
              Nenhum sistema é completamente imune a incidentes. Caso ocorra um incidente relevante,
              serão adotadas as providências cabíveis e as comunicações exigidas pela legislação
              aplicável.
            </p>
          </section>

          <section id="retencao">
            <h2>7. Retenção</h2>
            <p>
              As informações são mantidas pelo tempo necessário para analisar e atender a
              solicitação, dar continuidade a uma eventual relação profissional e cumprir obrigações
              legais ou regulatórias. Quando não houver mais finalidade legítima para o tratamento,
              os dados poderão ser eliminados ou anonimizados.
            </p>
          </section>

          <section id="direitos">
            <h2>8. Seus direitos</h2>
            <p>
              Nos termos da LGPD, o titular pode solicitar, conforme aplicável:
            </p>
            <ul>
              <li>Confirmação da existência de tratamento;</li>
              <li>Acesso aos dados;</li>
              <li>Correção de dados incompletos, inexatos ou desatualizados;</li>
              <li>Anonimização, bloqueio ou eliminação de dados desnecessários ou excessivos;</li>
              <li>Portabilidade, observados os segredos comerciais e industriais;</li>
              <li>Informação sobre compartilhamentos;</li>
              <li>Revogação do consentimento, quando essa for a base legal utilizada.</li>
            </ul>
            <p>
              Para exercer esses direitos, utilize o formulário de contato do site ou os canais
              diretos disponíveis no rodapé. A solicitação será analisada e respondida dentro dos
              prazos aplicáveis.
            </p>
          </section>

          <section id="alteracoes">
            <h2>9. Alterações nesta política</h2>
            <p>
              Esta política pode ser atualizada para refletir mudanças no site, nos serviços
              utilizados ou na legislação. A data de última atualização será revisada sempre que
              houver alteração relevante. Recomenda-se consultar esta página periodicamente.
            </p>
          </section>

          <section id="contato-privacidade">
            <h2>10. Contato</h2>
            <p>
              Para dúvidas, solicitações relacionadas aos seus dados ou exercício de direitos,
              utilize os canais abaixo ou o formulário de contato do site.
            </p>
            <ul>
              <li v-if="hasEmail">
                E-mail:
                <a :href="`mailto:${contact.email}`">{{ contact.email }}</a>
              </li>
              <li v-if="hasWhatsApp">WhatsApp: utilize o botão de contato do site.</li>
              <li>
                Formulário:
                <RouterLink to="/#contato">solicitar orçamento ou entrar em contato</RouterLink>
              </li>
            </ul>
          </section>

          <div class="mt-10 rounded-xl border border-white/[0.07] bg-white/[0.02] p-5">
            <p class="text-[0.74rem] leading-relaxed text-muted/75">
              Este documento descreve as práticas desta versão do site. Ele não substitui orientação
              jurídica específica e pode ser ajustado conforme a evolução dos serviços oferecidos.
            </p>
          </div>
        </article>
      </div>
    </div>
  </main>
</template>

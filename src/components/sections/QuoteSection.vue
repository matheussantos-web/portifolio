<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'
import { brand } from '@/data/brand'
import { contact, contactEndpoint, turnstileSiteKey } from '@/data/links'
import {
  budgetOptions,
  buildWhatsAppLink,
  fallbackWhatsAppMessage,
  formatPhoneBR,
  hasDirectChannels,
  hasEmail,
  hasLinkedIn,
  hasWhatsApp,
  isValidEmail,
  isValidPhoneBR,
  projectTypeOptions,
  timelineOptions,
} from '@/lib/contact'
import { consumeQuoteIntent, quoteIntent } from '@/lib/quote-intent'
import AppIcon from '@/components/ui/AppIcon.vue'
import SocialIcon from '@/components/ui/SocialIcon.vue'
import TurnstileWidget from '@/components/ui/TurnstileWidget.vue'

type Status = 'idle' | 'submitting' | 'success' | 'error'

interface FormState {
  name: string
  company: string
  phone: string
  email: string
  projectType: string
  description: string
  features: string
  timeline: string
  budget: string
  consent: boolean
  website: string
}

const form = reactive<FormState>({
  name: '',
  company: '',
  phone: '',
  email: '',
  projectType: '',
  description: '',
  features: '',
  timeline: '',
  budget: '',
  consent: false,
  website: '',
})

const errors = reactive<Record<string, string>>({})
const status = ref<Status>('idle')
const statusMessage = ref('')
const turnstileToken = ref('')
const turnstileError = ref(false)
const turnstileRef = ref<InstanceType<typeof TurnstileWidget> | null>(null)
const startedAt = ref(Date.now())
const lastAttempt = ref<FormState | null>(null)

const endpointConfigured = Boolean(contactEndpoint)
const requiresTurnstile = Boolean(turnstileSiteKey)

const fieldIds: Record<string, string> = {
  name: 'quote-name',
  phone: 'quote-phone',
  email: 'quote-email',
  projectType: 'quote-project-type',
  description: 'quote-description',
  consent: 'quote-consent',
  turnstile: 'quote-turnstile',
}

const descriptionCount = computed(() => form.description.length)
const featuresCount = computed(() => form.features.length)

const fallbackLink = computed(() => {
  if (!hasWhatsApp) return null
  const data = lastAttempt.value
  if (!data) return buildWhatsAppLink('contact')
  return buildWhatsAppLink('contact', {
    message: fallbackWhatsAppMessage({
      name: data.name || 'Não informado',
      email: data.email || 'Não informado',
      phone: data.phone || 'Não informado',
      projectType: data.projectType || 'outro',
      description: data.description || 'Não informada',
    }),
  })
})

function clearError(field: string) {
  if (errors[field]) delete errors[field]
  if (status.value === 'error') {
    status.value = 'idle'
    statusMessage.value = ''
  }
}

function onPhoneInput(event: Event) {
  const target = event.target as HTMLInputElement
  form.phone = formatPhoneBR(target.value)
  target.value = form.phone
  clearError('phone')
}

function validate(): boolean {
  Object.keys(errors).forEach((key) => delete errors[key])

  const name = form.name.trim()
  if (name.length < 3) errors.name = 'Informe seu nome completo.'
  else if (name.length > 120) errors.name = 'Use no máximo 120 caracteres.'

  if (!isValidPhoneBR(form.phone)) {
    errors.phone = 'Informe um WhatsApp válido com DDD.'
  }

  if (!isValidEmail(form.email)) {
    errors.email = 'Informe um e-mail válido.'
  }

  if (!projectTypeOptions.some((option) => option.value === form.projectType)) {
    errors.projectType = 'Selecione o tipo de projeto.'
  }

  const description = form.description.trim()
  if (description.length < 20) {
    errors.description = 'Descreva sua ideia com pelo menos 20 caracteres.'
  } else if (description.length > 4000) {
    errors.description = 'Use no máximo 4.000 caracteres.'
  }

  if (form.features.length > 2000) {
    errors.features = 'Use no máximo 2.000 caracteres.'
  }

  if (!form.consent) {
    errors.consent = 'É necessário autorizar o uso dos dados para continuar.'
  }

  if (requiresTurnstile && !turnstileToken.value) {
    errors.turnstile = turnstileError.value
      ? 'Não foi possível carregar a verificação de segurança. Recarregue a página.'
      : 'Confirme a verificação de segurança.'
  }

  const firstError = Object.keys(errors)[0]
  if (firstError) {
    const id = fieldIds[firstError]
    if (id) {
      void nextTick(() => {
        const element = document.getElementById(id)
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        element?.focus({ preventScroll: true })
      })
    }
    return false
  }

  return true
}

function resetForm() {
  form.name = ''
  form.company = ''
  form.phone = ''
  form.email = ''
  form.projectType = ''
  form.description = ''
  form.features = ''
  form.timeline = ''
  form.budget = ''
  form.consent = false
  form.website = ''
  Object.keys(errors).forEach((key) => delete errors[key])
  turnstileToken.value = ''
  turnstileError.value = false
  turnstileRef.value?.reset()
  startedAt.value = Date.now()
}

function startAnother() {
  resetForm()
  lastAttempt.value = null
  status.value = 'idle'
  statusMessage.value = ''
  void nextTick(() => document.getElementById('quote-name')?.focus())
}

async function submit() {
  if (status.value === 'submitting') return

  if (!validate()) return

  // Honeypot: resposta neutra, sem enviar nada.
  if (form.website.trim()) {
    status.value = 'success'
    return
  }

  if (!endpointConfigured) {
    status.value = 'error'
    statusMessage.value =
      'O envio de solicitações ainda não está configurado neste ambiente. Se preferir, fale diretamente pelos canais de contato.'
    return
  }

  lastAttempt.value = { ...form }
  status.value = 'submitting'
  statusMessage.value = ''

  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), 20000)

  try {
    const response = await fetch(contactEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        name: form.name.trim(),
        company: form.company.trim(),
        phone: form.phone,
        email: form.email.trim(),
        projectType: form.projectType,
        description: form.description.trim(),
        features: form.features.trim(),
        timeline: form.timeline,
        budget: form.budget,
        consent: form.consent,
        turnstileToken: turnstileToken.value,
        startedAt: startedAt.value,
        website: form.website,
      }),
      signal: controller.signal,
    })

    const data = (await response.json().catch(() => ({}))) as { message?: string }

    if (!response.ok) {
      throw new Error(data.message || 'request-failed')
    }

    status.value = 'success'
    statusMessage.value = ''
    resetForm()
  } catch (error) {
    status.value = 'error'
    if (error instanceof DOMException && error.name === 'AbortError') {
      statusMessage.value =
        'O envio demorou mais que o esperado. Verifique sua conexão e tente novamente.'
    } else {
      statusMessage.value =
        'Não foi possível enviar sua solicitação agora. Tente novamente em instantes ou fale diretamente pelos canais de contato.'
    }
    turnstileRef.value?.reset()
    turnstileToken.value = ''
  } finally {
    window.clearTimeout(timeout)
  }
}

function applyIntent(value: string | null) {
  if (!value) return
  if (projectTypeOptions.some((option) => option.value === value)) {
    form.projectType = value
    clearError('projectType')
  }
}

watch(quoteIntent, (value) => applyIntent(value))

onMounted(() => {
  applyIntent(consumeQuoteIntent())
  startedAt.value = Date.now()
})
</script>

<template>
  <section id="contato" class="section relative" aria-labelledby="quote-title">
    <span id="orcamento" class="pointer-events-none absolute top-0" aria-hidden="true" />

    <div class="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
      <div class="ambient-orb left-1/2 top-0 h-[30rem] w-[42rem] -translate-x-1/2 bg-gold/[0.06]" />
      <div class="absolute inset-x-0 top-0 gold-rule" />
    </div>

    <div class="shell grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
      <div class="lg:sticky lg:top-28 lg:self-start">
        <p v-reveal class="eyebrow">Solicitação de orçamento</p>
        <h2 id="quote-title" v-reveal class="section-title mt-4">
          Vamos tirar sua ideia <span class="serif-accent">do papel?</span>
        </h2>
        <p v-reveal class="mt-5 max-w-md text-[0.94rem] leading-relaxed text-muted">
          Conte um pouco sobre o que você precisa. Vou analisar sua solicitação e entrar em contato
          para conversarmos sobre a melhor solução.
        </p>

        <ol v-reveal class="mt-8 space-y-4">
          <li v-for="(item, index) in [
            'Você envia as informações do projeto.',
            'Eu analiso o contexto e os objetivos.',
            'Conversamos sobre escopo, prazo e proposta.',
          ]" :key="item" class="flex items-start gap-3">
            <span class="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border border-gold/25 bg-gold/[0.06] font-mono text-[0.6rem] text-gold">
              {{ index + 1 }}
            </span>
            <span class="text-[0.84rem] leading-relaxed text-muted">{{ item }}</span>
          </li>
        </ol>

        <div v-if="hasDirectChannels" v-reveal class="mt-8 space-y-3 border-t border-white/[0.07] pt-6">
          <p class="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-muted/70">
            Prefere falar diretamente?
          </p>

          <a
            v-if="hasWhatsApp"
            :href="buildWhatsAppLink('contact') || '#'"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3 text-sm text-paper transition hover:border-gold/30 hover:bg-gold/[0.04]"
          >
            <span class="grid size-8 place-items-center rounded-lg bg-[#25D366]/10 text-[#25D366]">
              <AppIcon name="chat" :size="16" />
            </span>
            <span class="min-w-0">
              <span class="block text-[0.8rem] font-medium">WhatsApp</span>
              <span class="block text-[0.68rem] text-muted">{{ contact.whatsappDisplay || 'Conversar sobre o projeto' }}</span>
            </span>
            <AppIcon name="arrow-up-right" :size="15" class="ml-auto text-muted" />
          </a>

          <a
            v-if="hasEmail"
            :href="`mailto:${contact.email}`"
            class="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3 text-sm text-paper transition hover:border-gold/30 hover:bg-gold/[0.04]"
          >
            <span class="grid size-8 place-items-center rounded-lg bg-gold/10 text-gold">
              <AppIcon name="mail" :size="16" />
            </span>
            <span class="min-w-0">
              <span class="block text-[0.8rem] font-medium">E-mail</span>
              <span class="block truncate text-[0.68rem] text-muted">{{ contact.email }}</span>
            </span>
            <AppIcon name="arrow-up-right" :size="15" class="ml-auto text-muted" />
          </a>

          <a
            v-if="hasLinkedIn"
            :href="contact.linkedin"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3 text-sm text-paper transition hover:border-gold/30 hover:bg-gold/[0.04]"
          >
            <span class="grid size-8 place-items-center rounded-lg bg-gold/10 text-gold">
              <SocialIcon name="linkedin" :size="16" />
            </span>
            <span class="min-w-0">
              <span class="block text-[0.8rem] font-medium">LinkedIn</span>
              <span class="block text-[0.68rem] text-muted">Perfil profissional</span>
            </span>
            <AppIcon name="arrow-up-right" :size="15" class="ml-auto text-muted" />
          </a>
        </div>
      </div>

      <div v-reveal class="card relative overflow-hidden p-5 sm:p-7">
        <div class="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-gold/[0.09] blur-[70px]" aria-hidden="true" />

        <div v-if="status === 'success'" class="relative py-8 text-center" role="status" aria-live="polite">
          <span class="mx-auto grid size-16 place-items-center rounded-full border border-success/30 bg-success/10 text-success">
            <AppIcon name="check" :size="28" />
          </span>
          <h3 class="mt-6 font-display text-2xl font-semibold tracking-[-0.02em] text-paper">
            Solicitação enviada
          </h3>
          <p class="mx-auto mt-3 max-w-sm text-[0.9rem] leading-relaxed text-muted">
            Recebi suas informações. Vou analisar a solicitação e entrar em contato pelos dados
            informados para conversarmos sobre o projeto.
          </p>
          <div class="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <button type="button" class="btn btn-secondary !min-h-[2.7rem] !text-[0.8rem]" @click="startAnother">
              Enviar outra solicitação
            </button>
            <a
              v-if="hasWhatsApp"
              :href="buildWhatsAppLink('contact') || '#'"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-primary !min-h-[2.7rem] !text-[0.8rem]"
            >
              Falar no WhatsApp
              <AppIcon name="arrow-up-right" :size="15" />
            </a>
          </div>
        </div>

        <form v-else class="relative space-y-5" novalidate @submit.prevent="submit">
          <div class="flex items-center justify-between gap-3">
            <div>
              <h3 class="font-display text-lg font-semibold tracking-[-0.015em] text-paper">
                Dados da solicitação
              </h3>
              <p class="mt-1 text-[0.7rem] text-muted">Campos com * são obrigatórios.</p>
            </div>
            <span class="hidden items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1 text-[0.58rem] uppercase tracking-[0.16em] text-muted sm:inline-flex">
              <AppIcon name="lock" :size="11" />
              Envio protegido
            </span>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label class="field-label" for="quote-name">Nome completo *</label>
              <input
                id="quote-name"
                v-model="form.name"
                class="input-base"
                type="text"
                name="name"
                autocomplete="name"
                placeholder="Como você se chama?"
                maxlength="120"
                required
                :aria-invalid="Boolean(errors.name)"
                :aria-describedby="errors.name ? 'quote-name-error' : undefined"
                @input="clearError('name')"
              />
              <p v-if="errors.name" id="quote-name-error" class="error-text" role="alert">
                {{ errors.name }}
              </p>
            </div>

            <div>
              <label class="field-label" for="quote-company">
                Empresa ou negócio <span class="field-optional">(opcional)</span>
              </label>
              <input
                id="quote-company"
                v-model="form.company"
                class="input-base"
                type="text"
                name="company"
                autocomplete="organization"
                placeholder="Nome da empresa, se houver"
                maxlength="120"
              />
            </div>

            <div>
              <label class="field-label" for="quote-phone">WhatsApp *</label>
              <input
                id="quote-phone"
                :value="form.phone"
                class="input-base"
                type="tel"
                name="phone"
                inputmode="tel"
                autocomplete="tel-national"
                placeholder="(11) 99999-9999"
                maxlength="15"
                required
                :aria-invalid="Boolean(errors.phone)"
                :aria-describedby="errors.phone ? 'quote-phone-error' : undefined"
                @input="onPhoneInput"
              />
              <p v-if="errors.phone" id="quote-phone-error" class="error-text" role="alert">
                {{ errors.phone }}
              </p>
            </div>

            <div>
              <label class="field-label" for="quote-email">E-mail *</label>
              <input
                id="quote-email"
                v-model="form.email"
                class="input-base"
                type="email"
                name="email"
                inputmode="email"
                autocomplete="email"
                placeholder="voce@email.com"
                maxlength="160"
                required
                :aria-invalid="Boolean(errors.email)"
                :aria-describedby="errors.email ? 'quote-email-error' : undefined"
                @input="clearError('email')"
              />
              <p v-if="errors.email" id="quote-email-error" class="error-text" role="alert">
                {{ errors.email }}
              </p>
            </div>

            <div>
              <label class="field-label" for="quote-project-type">Tipo de projeto *</label>
              <select
                id="quote-project-type"
                v-model="form.projectType"
                class="input-base"
                name="projectType"
                required
                :aria-invalid="Boolean(errors.projectType)"
                :aria-describedby="errors.projectType ? 'quote-project-type-error' : undefined"
                @change="clearError('projectType')"
              >
                <option value="" disabled>Selecione uma opção</option>
                <option v-for="option in projectTypeOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
              <p v-if="errors.projectType" id="quote-project-type-error" class="error-text" role="alert">
                {{ errors.projectType }}
              </p>
            </div>

            <div>
              <label class="field-label" for="quote-timeline">Prazo pretendido</label>
              <select
                id="quote-timeline"
                v-model="form.timeline"
                class="input-base"
                name="timeline"
              >
                <option v-for="option in timelineOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </div>
          </div>

          <div>
            <div class="flex items-end justify-between gap-3">
              <label class="field-label" for="quote-description">Descrição da ideia *</label>
              <span class="mb-1 text-[0.62rem] tabular-nums text-muted/60">
                {{ descriptionCount }}/4000
              </span>
            </div>
            <textarea
              id="quote-description"
              v-model="form.description"
              class="input-base"
              name="description"
              rows="4"
              maxlength="4000"
              placeholder="Conte sobre o projeto, o público e o que você precisa resolver..."
              required
              :aria-invalid="Boolean(errors.description)"
              :aria-describedby="errors.description ? 'quote-description-error' : undefined"
              @input="clearError('description')"
            />
            <p v-if="errors.description" id="quote-description-error" class="error-text" role="alert">
              {{ errors.description }}
            </p>
          </div>

          <div>
            <div class="flex items-end justify-between gap-3">
              <label class="field-label" for="quote-features">
                Funcionalidades desejadas <span class="field-optional">(opcional)</span>
              </label>
              <span class="mb-1 text-[0.62rem] tabular-nums text-muted/60">
                {{ featuresCount }}/2000
              </span>
            </div>
            <textarea
              id="quote-features"
              v-model="form.features"
              class="input-base !min-h-[5.5rem]"
              name="features"
              rows="3"
              maxlength="2000"
              placeholder="Ex.: cadastro de usuários, painel administrativo, pagamentos..."
              :aria-invalid="Boolean(errors.features)"
              :aria-describedby="errors.features ? 'quote-features-error' : undefined"
              @input="clearError('features')"
            />
            <p v-if="errors.features" id="quote-features-error" class="error-text" role="alert">
              {{ errors.features }}
            </p>
          </div>

          <div>
            <label class="field-label" for="quote-budget">
              Faixa de investimento <span class="field-optional">(opcional)</span>
            </label>
            <select id="quote-budget" v-model="form.budget" class="input-base" name="budget">
              <option value="">Selecione uma opção</option>
              <option v-for="option in budgetOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
            <p class="mt-2 text-[0.66rem] leading-relaxed text-muted/65">
              Os valores são apenas referências para facilitar o entendimento inicial. Não
              representam preços ou propostas comerciais.
            </p>
          </div>

          <div class="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
            <div class="flex items-start gap-3">
              <input
                id="quote-consent"
                v-model="form.consent"
                class="mt-0.5 size-4 shrink-0 accent-[#D6A64A]"
                type="checkbox"
                name="consent"
                required
                :aria-invalid="Boolean(errors.consent)"
                :aria-describedby="errors.consent ? 'quote-consent-error' : undefined"
                @change="clearError('consent')"
              />
              <label for="quote-consent" class="text-[0.76rem] leading-relaxed text-muted">
                Autorizo o uso dos dados informados para análise e atendimento desta solicitação.
              </label>
            </div>
            <p v-if="errors.consent" id="quote-consent-error" class="error-text" role="alert">
              {{ errors.consent }}
            </p>
            <RouterLink
              to="/politica-de-privacidade"
              class="mt-2 inline-flex items-center gap-1 text-[0.7rem] text-gold-soft underline decoration-gold/30 underline-offset-2 transition hover:text-gold"
            >
              Ler a Política de Privacidade
              <AppIcon name="arrow-up-right" :size="11" />
            </RouterLink>
          </div>

          <div v-if="requiresTurnstile" id="quote-turnstile">
            <TurnstileWidget
              ref="turnstileRef"
              :site-key="turnstileSiteKey"
              @verified="turnstileToken = $event; clearError('turnstile')"
              @expired="turnstileToken = ''"
              @error="turnstileError = true; turnstileToken = ''"
            />
            <p v-if="errors.turnstile" class="error-text" role="alert">{{ errors.turnstile }}</p>
          </div>

          <div
            v-if="status === 'error'"
            class="rounded-xl border border-danger/25 bg-danger/[0.06] p-4"
            role="alert"
            aria-live="assertive"
          >
            <div class="flex items-start gap-3">
              <span class="mt-0.5 text-danger">
                <AppIcon name="alert" :size="18" />
              </span>
              <div class="min-w-0 flex-1">
                <p class="text-[0.8rem] leading-relaxed text-paper/90">{{ statusMessage }}</p>
                <div class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                  <a
                    v-if="fallbackLink"
                    :href="fallbackLink"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-1.5 text-[0.74rem] font-medium text-gold-soft underline decoration-gold/30 underline-offset-2 transition hover:text-gold"
                  >
                    <AppIcon name="chat" :size="13" />
                    Continuar pelo WhatsApp
                  </a>
                  <a
                    v-else-if="hasEmail"
                    :href="`mailto:${contact.email}`"
                    class="inline-flex items-center gap-1.5 text-[0.74rem] font-medium text-gold-soft underline decoration-gold/30 underline-offset-2 transition hover:text-gold"
                  >
                    <AppIcon name="mail" :size="13" />
                    Enviar por e-mail
                  </a>
                  <span v-else class="text-[0.7rem] text-muted/70">
                    Seus dados permanecem preenchidos no formulário.
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            class="btn btn-primary w-full !min-h-[3.15rem]"
            :disabled="status === 'submitting'"
          >
            <template v-if="status === 'submitting'">
              <span class="spinner" aria-hidden="true" />
              Enviando solicitação...
            </template>
            <template v-else>
              {{ status === 'error' ? 'Tentar novamente' : 'Enviar solicitação' }}
              <AppIcon name="send" :size="16" />
            </template>
          </button>

          <p class="text-center text-[0.64rem] leading-relaxed text-muted/60">
            Seus dados são utilizados apenas para o atendimento desta solicitação. Nada é
            compartilhado com terceiros para fins de marketing.
          </p>

          <div class="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
            <label for="quote-website">Não preencha este campo</label>
            <input
              id="quote-website"
              v-model="form.website"
              type="text"
              name="website"
              tabindex="-1"
              autocomplete="off"
            />
          </div>
        </form>
      </div>
    </div>

    <p class="shell mt-8 text-center text-[0.66rem] text-muted/80">
      {{ brand.name }} · {{ brand.founder }} — atendimento direto com o desenvolvedor.
    </p>
  </section>
</template>

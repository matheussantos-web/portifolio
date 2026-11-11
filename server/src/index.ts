import 'dotenv/config'

import { randomUUID } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import cors from 'cors'
import express, { type NextFunction, type Request, type Response } from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import { Resend } from 'resend'
import { z } from 'zod'

/* -------------------------------------------------------------------------- */
/*  Configuração                                                              */
/* -------------------------------------------------------------------------- */

const serverRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outboxDir = path.join(serverRoot, 'outbox')

function readString(name: string): string {
  return (process.env[name] ?? '').trim()
}

function readPositiveNumber(name: string, fallback: number): number {
  const value = Number(process.env[name])
  return Number.isFinite(value) && value > 0 ? value : fallback
}

const nodeEnv = readString('NODE_ENV') || 'development'
const isProduction = nodeEnv === 'production'

const port = readPositiveNumber('PORT', 8787)
const corsOrigins = readString('CORS_ORIGIN')
  .split(',')
  .map((origin) => origin.trim().replace(/\/$/, ''))
  .filter(Boolean)

const resendApiKey = readString('RESEND_API_KEY')
const contactToEmail = readString('CONTACT_TO_EMAIL')
const contactFromEmail = readString('CONTACT_FROM_EMAIL')
const turnstileSecretKey = readString('TURNSTILE_SECRET_KEY')
const webhookUrl = readString('CONTACT_WEBHOOK_URL')

const rateLimitWindowMs = readPositiveNumber('RATE_LIMIT_WINDOW_MS', 15 * 60 * 1000)
const rateLimitMax = readPositiveNumber('RATE_LIMIT_MAX', 6)

const trustProxy = (() => {
  const raw = readString('TRUST_PROXY')
  if (!raw) return isProduction ? 1 : false
  if (raw === 'false') return false
  const hops = Number(raw)
  return Number.isFinite(hops) && hops >= 0 ? hops : 1
})()

const resend =
  resendApiKey && contactToEmail && contactFromEmail ? new Resend(resendApiKey) : null

/** Tempo mínimo de preenchimento aceitável. Bots costumam enviar quase instantaneamente. */
const MIN_FILL_TIME_MS = 2500

const projectTypeLabels: Record<string, string> = {
  'site-institucional': 'Site institucional',
  'landing-page': 'Landing page',
  'sistema-web': 'Sistema web',
  marketplace: 'Marketplace',
  'loja-virtual': 'Loja virtual',
  'aplicacao-personalizada': 'Aplicação personalizada',
  'modernizacao-site': 'Modernização de site',
  outro: 'Outro',
}

const budgetLabels: Record<string, string> = {
  '': 'Não informado',
  'nao-definido': 'Ainda não defini',
  'ate-1000': 'Até R$ 1.000',
  '1000-3000': 'R$ 1.000 a R$ 3.000',
  '3000-5000': 'R$ 3.000 a R$ 5.000',
  '5000-10000': 'R$ 5.000 a R$ 10.000',
  'acima-10000': 'Acima de R$ 10.000',
}

const timelineLabels: Record<string, string> = {
  '': 'Não informado',
  'o-quanto-antes': 'O quanto antes',
  'ate-1-mes': 'Em até 1 mês',
  '1-a-3-meses': 'De 1 a 3 meses',
  '3-a-6-meses': 'De 3 a 6 meses',
  'ainda-nao-defini': 'Ainda não defini',
}

/* -------------------------------------------------------------------------- */
/*  Validação                                                                 */
/* -------------------------------------------------------------------------- */

const PROJECT_TYPES = [
  'site-institucional',
  'landing-page',
  'sistema-web',
  'marketplace',
  'loja-virtual',
  'aplicacao-personalizada',
  'modernizacao-site',
  'outro',
] as const

const BUDGET_VALUES = [
  '',
  'nao-definido',
  'ate-1000',
  '1000-3000',
  '3000-5000',
  '5000-10000',
  'acima-10000',
] as const

const TIMELINE_VALUES = [
  '',
  'o-quanto-antes',
  'ate-1-mes',
  '1-a-3-meses',
  '3-a-6-meses',
  'ainda-nao-defini',
] as const

function phoneDigits(value: string): string {
  return value.replace(/\D/g, '').slice(0, 11)
}

function isValidPhoneBR(value: string): boolean {
  const digits = phoneDigits(value)
  if (digits.length !== 10 && digits.length !== 11) return false
  const ddd = Number(digits.slice(0, 2))
  if (ddd < 11 || ddd > 99) return false
  if (digits.length === 11 && digits[2] !== '9') return false
  return true
}

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'Informe seu nome completo.')
    .max(120, 'O nome deve ter no máximo 120 caracteres.'),
  company: z
    .string()
    .trim()
    .max(120, 'O nome da empresa deve ter no máximo 120 caracteres.')
    .default(''),
  phone: z
    .string()
    .trim()
    .min(1, 'Informe um WhatsApp válido com DDD.')
    .refine(isValidPhoneBR, 'Informe um WhatsApp válido com DDD.'),
  email: z
    .email('Informe um e-mail válido.')
    .max(160, 'O e-mail deve ter no máximo 160 caracteres.'),
  projectType: z.enum(PROJECT_TYPES, { error: 'Selecione o tipo de projeto.' }),
  description: z
    .string()
    .trim()
    .min(20, 'Descreva sua ideia com pelo menos 20 caracteres.')
    .max(4000, 'A descrição deve ter no máximo 4.000 caracteres.'),
  features: z
    .string()
    .trim()
    .max(2000, 'As funcionalidades devem ter no máximo 2.000 caracteres.')
    .default(''),
  timeline: z.enum(TIMELINE_VALUES, { error: 'Prazo pretendido inválido.' }).default(''),
  budget: z.enum(BUDGET_VALUES, { error: 'Faixa de investimento inválida.' }).default(''),
  consent: z
    .boolean()
    .refine((value) => value === true, 'É necessário autorizar o uso dos dados para continuar.'),
  turnstileToken: z.string().max(4096).default(''),
  startedAt: z.coerce.number().finite().optional(),
  website: z.string().max(200).default(''),
})

type ContactPayload = z.infer<typeof contactSchema>

/* -------------------------------------------------------------------------- */
/*  Utilidades                                                                */
/* -------------------------------------------------------------------------- */

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function nl2br(value: string): string {
  return escapeHtml(value).replace(/\r?\n/g, '<br />')
}

function isAllowedOrigin(origin: string | undefined): boolean {
  if (!origin) return true

  const normalized = origin.replace(/\/$/, '')
  if (corsOrigins.includes(normalized)) return true

  // Em desenvolvimento, qualquer porta local é aceita.
  if (!isProduction) {
    try {
      const url = new URL(normalized)
      const isHttp = url.protocol === 'http:' || url.protocol === 'https:'
      const isLocal = ['localhost', '127.0.0.1', '::1', '[::1]'].includes(url.hostname)
      if (isHttp && isLocal) return true
    } catch {
      return false
    }
  }

  return false
}

function getClientIp(req: Request): string {
  return req.ip ?? req.socket.remoteAddress ?? ''
}

interface TurnstileResponse {
  success: boolean
  'error-codes'?: string[]
  challenge_ts?: string
  hostname?: string
}

async function verifyTurnstile(token: string, ip: string): Promise<TurnstileResponse> {
  const body = new URLSearchParams({
    secret: turnstileSecretKey,
    response: token,
  })
  if (ip) body.set('remoteip', ip)

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
    signal: AbortSignal.timeout(10_000),
  })

  if (!response.ok) {
    throw new Error(`turnstile-http-${response.status}`)
  }

  return (await response.json()) as TurnstileResponse
}

/* -------------------------------------------------------------------------- */
/*  Entrega                                                                   */
/* -------------------------------------------------------------------------- */

interface SubmissionMeta {
  id: string
  receivedAt: string
  ip: string
  userAgent: string
}

interface DeliveryOutcome {
  channel: 'email' | 'webhook'
  ok: boolean
  detail?: string
}

function buildEmailContent(payload: ContactPayload, meta: SubmissionMeta) {
  const projectType = projectTypeLabels[payload.projectType] ?? payload.projectType
  const budget = budgetLabels[payload.budget] ?? payload.budget
  const timeline = timelineLabels[payload.timeline] ?? payload.timeline

  const rows: Array<{ label: string; value: string; html?: boolean }> = [
    { label: 'Nome', value: payload.name },
    ...(payload.company ? [{ label: 'Empresa', value: payload.company }] : []),
    { label: 'WhatsApp', value: payload.phone },
    { label: 'E-mail', value: payload.email },
    { label: 'Tipo de projeto', value: projectType },
    { label: 'Prazo pretendido', value: timeline },
    { label: 'Faixa de investimento', value: budget },
    { label: 'Descrição', value: nl2br(payload.description), html: true },
    ...(payload.features
      ? [{ label: 'Funcionalidades desejadas', value: nl2br(payload.features), html: true }]
      : []),
  ]

  const tableRows = rows
    .map(
      (row) => `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #ece7dd;vertical-align:top;width:170px;color:#7a7468;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;">${escapeHtml(row.label)}</td>
          <td style="padding:12px 0;border-bottom:1px solid #ece7dd;vertical-align:top;color:#1b1a17;font-size:14px;line-height:1.6;">${row.html ? row.value : escapeHtml(row.value)}</td>
        </tr>`,
    )
    .join('')

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
  <body style="margin:0;padding:0;background:#f5f2ec;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f2ec;padding:28px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;background:#ffffff;border:1px solid #e6e0d4;border-radius:16px;overflow:hidden;">
            <tr>
              <td style="background:#0d0e10;padding:26px 30px;">
                <p style="margin:0;color:#d6a64a;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;">Th Apps</p>
                <h1 style="margin:10px 0 0;color:#f4f4f4;font-size:22px;line-height:1.3;">Nova solicitação de orçamento</h1>
                <p style="margin:8px 0 0;color:#a5a5aa;font-size:13px;">${escapeHtml(meta.receivedAt)}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:26px 30px 8px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${tableRows}</table>
                <p style="margin:22px 0 0;color:#7a7468;font-size:11px;line-height:1.6;">
                  Solicitação ${escapeHtml(meta.id)}. Responda este e-mail para falar diretamente com o interessado.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 30px 26px;">
                <p style="margin:0;color:#a5a5aa;font-size:11px;">Enviado automaticamente pelo formulário de contato do site da Th Apps.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`

  const text = [
    'NOVA SOLICITAÇÃO DE ORÇAMENTO — TH APPS',
    `Recebida em: ${meta.receivedAt}`,
    '',
    `Nome: ${payload.name}`,
    ...(payload.company ? [`Empresa: ${payload.company}`] : []),
    `WhatsApp: ${payload.phone}`,
    `E-mail: ${payload.email}`,
    `Tipo de projeto: ${projectType}`,
    `Prazo pretendido: ${timeline}`,
    `Faixa de investimento: ${budget}`,
    '',
    'Descrição:',
    payload.description,
    ...(payload.features ? ['', 'Funcionalidades desejadas:', payload.features] : []),
    '',
    `Solicitação: ${meta.id}`,
  ].join('\n')

  return {
    subject: `Nova solicitação de orçamento — ${payload.name}`,
    html,
    text,
  }
}

async function sendEmail(payload: ContactPayload, meta: SubmissionMeta): Promise<void> {
  if (!resend) throw new Error('resend-not-configured')

  const content = buildEmailContent(payload, meta)
  const { error } = await resend.emails.send({
    from: contactFromEmail,
    to: [contactToEmail],
    replyTo: payload.email,
    subject: content.subject,
    html: content.html,
    text: content.text,
  })

  if (error) {
    throw new Error(error.message || 'resend-error')
  }
}

async function sendWebhook(payload: ContactPayload, meta: SubmissionMeta): Promise<void> {
  if (!webhookUrl) throw new Error('webhook-not-configured')

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      event: 'quote.requested',
      submission: {
        id: meta.id,
        receivedAt: meta.receivedAt,
        name: payload.name,
        company: payload.company,
        phone: payload.phone,
        email: payload.email,
        projectType: payload.projectType,
        projectTypeLabel: projectTypeLabels[payload.projectType] ?? payload.projectType,
        description: payload.description,
        features: payload.features,
        timeline: payload.timeline,
        timelineLabel: timelineLabels[payload.timeline] ?? payload.timeline,
        budget: payload.budget,
        budgetLabel: budgetLabels[payload.budget] ?? payload.budget,
        consent: payload.consent,
      },
      meta: {
        ip: meta.ip,
        userAgent: meta.userAgent,
      },
    }),
    signal: AbortSignal.timeout(8_000),
  })

  if (!response.ok) {
    throw new Error(`webhook-http-${response.status}`)
  }
}

async function writeOutbox(
  payload: ContactPayload,
  meta: SubmissionMeta,
  outcomes: DeliveryOutcome[],
): Promise<void> {
  await mkdir(outboxDir, { recursive: true })

  const fileName = `${meta.receivedAt.replace(/[:.]/g, '-')}-${meta.id}.json`
  const record = {
    id: meta.id,
    receivedAt: meta.receivedAt,
    meta: { ip: meta.ip, userAgent: meta.userAgent },
    payload: {
      ...payload,
      // Não persistir o token de uso único.
      turnstileToken: payload.turnstileToken ? '[redacted]' : '',
    },
    deliveries: outcomes,
  }

  await writeFile(path.join(outboxDir, fileName), JSON.stringify(record, null, 2), 'utf8')
}

/* -------------------------------------------------------------------------- */
/*  Aplicação                                                                 */
/* -------------------------------------------------------------------------- */

const app = express()

app.disable('x-powered-by')
app.set('trust proxy', trustProxy)

app.use(helmet())

app.use(
  cors({
    origin(origin, callback) {
      callback(null, isAllowedOrigin(origin))
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept'],
    maxAge: 86_400,
  }),
)

app.use((req: Request, res: Response, next: NextFunction) => {
  if (!isAllowedOrigin(req.headers.origin)) {
    res.status(403).json({ ok: false, message: 'Origem não autorizada.' })
    return
  }
  next()
})

app.use(express.json({ limit: '32kb' }))

const startedAt = Date.now()

app.get(['/health', '/api/health'], (_req: Request, res: Response) => {
  res.json({
    ok: true,
    service: 'thapps-contact',
    uptimeSeconds: Math.round((Date.now() - startedAt) / 1000),
    emailConfigured: Boolean(resend),
    turnstileEnabled: Boolean(turnstileSecretKey),
    webhookConfigured: Boolean(webhookUrl),
  })
})

const contactLimiter = rateLimit({
  windowMs: rateLimitWindowMs,
  limit: rateLimitMax,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    ok: false,
    message:
      'Muitas solicitações enviadas em pouco tempo. Aguarde alguns minutos e tente novamente.',
  },
})

app.post('/api/contact', contactLimiter, async (req: Request, res: Response) => {
  const body = (req.body ?? {}) as Record<string, unknown>

  // Honeypot: campo oculto preenchido = bot. Resposta neutra para não revelar a proteção.
  if (typeof body.website === 'string' && body.website.trim()) {
    res.status(200).json({ ok: true, message: 'Solicitação recebida.' })
    return
  }

  // Tempo de preenchimento suspeito (envio instantâneo ou startedAt no futuro).
  const rawStartedAt = Number(body.startedAt)
  if (Number.isFinite(rawStartedAt) && rawStartedAt > 0) {
    const elapsed = Date.now() - rawStartedAt
    if ((elapsed >= 0 && elapsed < MIN_FILL_TIME_MS) || elapsed < -60_000) {
      res.status(200).json({ ok: true, message: 'Solicitação recebida.' })
      return
    }
  }

  const ip = getClientIp(req)

  if (turnstileSecretKey) {
    const token = typeof body.turnstileToken === 'string' ? body.turnstileToken.trim() : ''

    if (!token) {
      res.status(400).json({
        ok: false,
        message: 'Confirme a verificação de segurança e tente novamente.',
      })
      return
    }

    try {
      const verification = await verifyTurnstile(token, ip)

      if (!verification.success) {
        console.warn('[contact] Turnstile recusou a verificação:', verification['error-codes'])
        res.status(400).json({
          ok: false,
          message: 'Não foi possível confirmar a verificação de segurança. Tente novamente.',
        })
        return
      }
    } catch (error) {
      console.error('[contact] Falha ao verificar Turnstile:', error)
      res.status(503).json({
        ok: false,
        message:
          'A verificação de segurança está indisponível no momento. Tente novamente em instantes.',
      })
      return
    }
  }

  const parsed = contactSchema.safeParse(body)

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0]
    res.status(400).json({
      ok: false,
      message: firstIssue?.message ?? 'Dados inválidos. Revise os campos e tente novamente.',
      field: firstIssue?.path?.[0],
    })
    return
  }

  const payload = parsed.data
  const meta: SubmissionMeta = {
    id: randomUUID(),
    receivedAt: new Date().toISOString(),
    ip,
    userAgent: req.get('user-agent') ?? '',
  }

  const outcomes: DeliveryOutcome[] = []

  if (resend) {
    try {
      await sendEmail(payload, meta)
      outcomes.push({ channel: 'email', ok: true })
    } catch (error) {
      const detail = error instanceof Error ? error.message : 'unknown-error'
      outcomes.push({ channel: 'email', ok: false, detail })
      console.error('[contact] Falha no envio de e-mail:', detail)
    }
  }

  if (webhookUrl) {
    try {
      await sendWebhook(payload, meta)
      outcomes.push({ channel: 'webhook', ok: true })
    } catch (error) {
      const detail = error instanceof Error ? error.message : 'unknown-error'
      outcomes.push({ channel: 'webhook', ok: false, detail })
      console.error('[contact] Falha no webhook:', detail)
    }
  }

  const delivered = outcomes.some((outcome) => outcome.ok)

  if (!delivered) {
    if (!isProduction) {
      // Em desenvolvimento sem provedor configurado, a solicitação fica no outbox local.
      try {
        await writeOutbox(payload, meta, outcomes)
        console.info(
          `[contact] Solicitação ${meta.id} gravada em server/outbox (nenhum provedor configurado).`,
        )
        res.status(200).json({
          ok: true,
          id: meta.id,
          message: 'Solicitação recebida (modo de desenvolvimento, gravada no outbox).',
        })
        return
      } catch (error) {
        console.error('[contact] Falha ao gravar o outbox:', error)
      }
    }

    res.status(502).json({
      ok: false,
      message:
        'Não foi possível concluir o envio agora. Tente novamente em instantes ou fale diretamente pelos canais de contato.',
    })
    return
  }

  if (!isProduction) {
    try {
      await writeOutbox(payload, meta, outcomes)
    } catch (error) {
      console.error('[contact] Falha ao gravar o outbox:', error)
    }
  }

  console.info(
    `[contact] Solicitação ${meta.id} recebida (${outcomes
      .map((outcome) => `${outcome.channel}:${outcome.ok ? 'ok' : 'falhou'}`)
      .join(', ')}).`,
  )

  res.status(200).json({ ok: true, id: meta.id, message: 'Solicitação recebida.' })
})

app.use((_req: Request, res: Response) => {
  res.status(404).json({ ok: false, message: 'Rota não encontrada.' })
})

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof SyntaxError && 'body' in error) {
    res.status(400).json({ ok: false, message: 'Corpo da requisição inválido.' })
    return
  }

  console.error('[contact] Erro inesperado:', error)
  res.status(500).json({
    ok: false,
    message: 'Erro interno ao processar a solicitação. Tente novamente em instantes.',
  })
})

const server = app.listen(port, () => {
  console.info(`[contact] Servidor ouvindo em http://localhost:${port} (${nodeEnv}).`)
  console.info(
    `[contact] E-mail: ${resend ? 'configurado' : 'não configurado'} · Turnstile: ${
      turnstileSecretKey ? 'ativo' : 'desativado'
    } · Webhook: ${webhookUrl ? 'configurado' : 'não configurado'}`,
  )
  if (!isProduction && !resend) {
    console.info('[contact] Sem provedor de e-mail: as solicitações serão gravadas em server/outbox.')
  }
})

function shutdown(signal: string) {
  console.info(`[contact] Recebido ${signal}. Encerrando servidor...`)
  server.close((error) => {
    if (error) {
      console.error('[contact] Erro ao encerrar:', error)
      process.exitCode = 1
    }
    process.exit()
  })
}

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))

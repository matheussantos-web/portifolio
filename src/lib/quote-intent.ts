import { ref } from 'vue'

/**
 * Intenção de orçamento compartilhada entre serviços/projetos e o formulário.
 * Evita acoplar os cards ao formulário e permite pré-selecionar o tipo de projeto.
 */
export const quoteIntent = ref<string | null>(null)

export function setQuoteIntent(projectType?: string) {
  quoteIntent.value = projectType || null
}

export function consumeQuoteIntent(): string | null {
  const value = quoteIntent.value
  quoteIntent.value = null
  return value
}

import { nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { scrollToId } from './motion'
import { setQuoteIntent } from './quote-intent'

export function useQuoteRequest() {
  const router = useRouter()
  const route = useRoute()

  async function requestQuote(projectType?: string) {
    setQuoteIntent(projectType)

    if (route.path === '/') {
      await nextTick()
      scrollToId('orcamento')
      return
    }

    await router.push({ path: '/', hash: '#orcamento' })
  }

  return { requestQuote }
}

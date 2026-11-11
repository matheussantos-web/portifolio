<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { activeSection } from '@/lib/active-section'
import { buildWhatsAppLink, hasEmail, hasWhatsApp } from '@/lib/contact'
import { contact, navigation, socialChannels } from '@/data/links'
import AppIcon from '@/components/ui/AppIcon.vue'
import AppLogo from '@/components/ui/AppLogo.vue'
import SocialIcon from '@/components/ui/SocialIcon.vue'

const route = useRoute()
const scrolled = ref(false)
const menuOpen = ref(false)
const menuRef = ref<HTMLElement | null>(null)
const openButtonRef = ref<HTMLButtonElement | null>(null)
const closeButtonRef = ref<HTMLButtonElement | null>(null)
let lastFocused: HTMLElement | null = null

const isHome = computed(() => route.path === '/')
const quoteLink = computed(() => (isHome.value ? '#orcamento' : '/#orcamento'))
const configuredSocials = socialChannels.filter((channel) => channel.href)
const whatsappLink = computed(() => buildWhatsAppLink('default'))

function onScroll() {
  scrolled.value = window.scrollY > 14
}

function navLink(item: (typeof navigation)[number]) {
  return isHome.value ? item.href : `/${item.href}`
}

function getFocusable(): HTMLElement[] {
  if (!menuRef.value) return []
  return Array.from(
    menuRef.value.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((element) => element.offsetParent !== null)
}

function onKeydown(event: KeyboardEvent) {
  if (!menuOpen.value) return
  if (event.key === 'Escape') {
    event.preventDefault()
    closeMenu()
    return
  }
  if (event.key !== 'Tab') return

  const focusable = getFocusable()
  if (!focusable.length) return
  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

function openMenu() {
  lastFocused = document.activeElement as HTMLElement
  menuOpen.value = true
  document.body.classList.add('menu-open')
  document.addEventListener('keydown', onKeydown)
  nextTick(() => closeButtonRef.value?.focus())
}

function closeMenu() {
  if (!menuOpen.value) return
  menuOpen.value = false
  document.body.classList.remove('menu-open')
  document.removeEventListener('keydown', onKeydown)
  lastFocused?.focus()
}

function onResize() {
  if (window.innerWidth >= 1024 && menuOpen.value) closeMenu()
}

watch(
  () => route.fullPath,
  () => closeMenu(),
)

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onResize, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onResize)
  document.removeEventListener('keydown', onKeydown)
  document.body.classList.remove('menu-open')
})
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300"
    :class="
      scrolled
        ? 'border-white/[0.07] bg-ink/80 shadow-[0_18px_50px_-32px_rgba(0,0,0,0.9)] backdrop-blur-xl'
        : 'border-transparent bg-transparent'
    "
  >
    <div class="shell flex h-[var(--header-height)] items-center justify-between gap-4">
      <RouterLink to="/" class="shrink-0 rounded-lg" aria-label="Th Apps Matheus Santos — ir para o início">
        <AppLogo />
      </RouterLink>

      <nav class="hidden items-center gap-0.5 lg:flex" aria-label="Navegação principal">
        <RouterLink
          v-for="item in navigation"
          :key="item.href"
          :to="navLink(item)"
          class="nav-link"
          :class="{ 'is-active': isHome && activeSection === item.section }"
          :aria-current="isHome && activeSection === item.section ? 'true' : undefined"
        >
          {{ item.label }}
        </RouterLink>
      </nav>

      <div class="flex items-center gap-2.5">
        <RouterLink
          :to="quoteLink"
          class="btn btn-primary hidden !min-h-[2.65rem] !px-4 !text-[0.78rem] sm:inline-flex"
        >
          Solicitar orçamento
          <AppIcon name="arrow-up-right" :size="14" />
        </RouterLink>

        <button
          ref="openButtonRef"
          type="button"
          class="grid size-10 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-paper transition hover:border-gold/40 hover:bg-gold/[0.06] hover:text-gold lg:hidden"
          aria-label="Abrir menu de navegação"
          :aria-expanded="menuOpen"
          aria-controls="mobile-menu"
          @click="openMenu"
        >
          <AppIcon name="menu" :size="20" />
        </button>
      </div>
    </div>
  </header>

  <Teleport to="body">
    <Transition name="menu">
      <div
        v-if="menuOpen"
        id="mobile-menu"
        ref="menuRef"
        class="fixed inset-0 z-[90] lg:hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
      >
        <div class="absolute inset-0 bg-ink/95 backdrop-blur-2xl" @click="closeMenu" />

        <div class="menu-panel relative flex h-full flex-col overflow-y-auto">
          <div class="shell flex h-[var(--header-height)] shrink-0 items-center justify-between">
            <RouterLink to="/" class="rounded-lg" aria-label="Th Apps Matheus Santos — ir para o início" @click="closeMenu">
              <AppLogo />
            </RouterLink>
            <button
              ref="closeButtonRef"
              type="button"
              class="grid size-10 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-paper transition hover:border-gold/40 hover:text-gold"
              aria-label="Fechar menu"
              @click="closeMenu"
            >
              <AppIcon name="close" :size="20" />
            </button>
          </div>

          <nav class="shell flex-1 pt-10" aria-label="Navegação mobile">
            <ul class="divide-y divide-white/[0.06] border-y border-white/[0.06]">
              <li
                v-for="(item, index) in navigation"
                :key="item.href"
                class="menu-item"
                :style="{ transitionDelay: `${90 + index * 45}ms` }"
              >
                <RouterLink
                  :to="navLink(item)"
                  class="group flex items-center gap-4 py-5"
                  :class="{ 'text-gold': isHome && activeSection === item.section }"
                  @click="closeMenu"
                >
                  <span class="w-7 text-[0.62rem] font-medium tracking-[0.16em] text-gold/70">
                    0{{ index + 1 }}
                  </span>
                  <span class="flex-1 font-display text-[1.65rem] font-medium tracking-[-0.02em]">
                    {{ item.label }}
                  </span>
                  <AppIcon
                    name="arrow-up-right"
                    :size="18"
                    class="text-muted transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-gold"
                  />
                </RouterLink>
              </li>
            </ul>
          </nav>

          <div class="shell mt-8 shrink-0 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
            <RouterLink :to="quoteLink" class="btn btn-primary w-full" @click="closeMenu">
              Solicitar orçamento
              <AppIcon name="arrow-up-right" :size="16" />
            </RouterLink>

            <div class="mt-5 flex flex-wrap items-center gap-3">
              <a
                v-if="whatsappLink"
                :href="whatsappLink"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 rounded-full border border-white/10 px-3.5 py-2 text-xs text-muted transition hover:border-gold/35 hover:text-paper"
              >
                <SocialIcon name="whatsapp" :size="15" />
                WhatsApp
              </a>
              <a
                v-for="channel in configuredSocials"
                :key="channel.id"
                :href="channel.href"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 rounded-full border border-white/10 px-3.5 py-2 text-xs text-muted transition hover:border-gold/35 hover:text-paper"
              >
                <SocialIcon :name="channel.id" :size="15" />
                {{ channel.label }}
              </a>
              <a
                v-if="hasEmail"
                :href="`mailto:${contact.email}`"
                class="inline-flex items-center gap-2 rounded-full border border-white/10 px-3.5 py-2 text-xs text-muted transition hover:border-gold/35 hover:text-paper"
              >
                <AppIcon name="mail" :size="15" />
                E-mail
              </a>
            </div>

            <p class="mt-6 text-[0.65rem] uppercase tracking-[0.22em] text-muted/60">
              Matheus Santos · Th Apps
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.nav-link {
  position: relative;
  border-radius: 0.55rem;
  padding: 0.55rem 0.72rem;
  color: var(--color-muted);
  font-size: 0.79rem;
  font-weight: 500;
  letter-spacing: 0.005em;
  transition: color 0.25s ease;
}

.nav-link:hover,
.nav-link.is-active {
  color: var(--color-paper);
}

.nav-link::after {
  content: "";
  position: absolute;
  right: 0.72rem;
  bottom: 0.12rem;
  left: 0.72rem;
  height: 1px;
  background: linear-gradient(90deg, rgba(214, 166, 74, 0.2), var(--color-gold), rgba(214, 166, 74, 0.2));
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.nav-link:hover::after,
.nav-link.is-active::after {
  transform: scaleX(1);
}

.menu-enter-active,
.menu-leave-active {
  transition: opacity 0.3s ease;
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
}

.menu-panel {
  transform: translateY(0);
  transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}

.menu-enter-from .menu-panel,
.menu-leave-to .menu-panel {
  transform: translateY(-12px);
}

.menu-item {
  opacity: 0;
  transform: translateY(14px);
  transition:
    opacity 0.5s ease,
    transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

.menu-enter-active .menu-item {
  opacity: 1;
  transform: translateY(0);
}
</style>

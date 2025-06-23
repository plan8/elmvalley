export default defineNuxtConfig({
  modules: [
    "@nuxthub/core",
    "@nuxt/eslint",
    "@nuxt/ui",
    "@vueuse/nuxt",
    "nuxthub-ratelimit"
  ],
  devtools: { enabled: true },
  compatibilityDate: "2024-07-30",
  nitro: {
    experimental: {
      openAPI: true
    }
  },
  hub: {
    bindings: {
      observability: {
        logs: true
      }
    },
    ai: true,
    blob: true,
    cache: true,
    database: true,
    kv: true
  },
  css: ['~/assets/css/main.css'],
  eslint: {
    config: {
      stylistic: {
        // quotes: "single",
      }
    }
  },
  nuxtHubRateLimit: {
    routes: {
      "/api/*": {
        maxRequests: 20,
        intervalSeconds: 60,
      }
    }
  }
});

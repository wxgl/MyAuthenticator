// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: [
    "@nuxt/ui",
    "@nuxt/eslint",
    "@vueuse/nuxt",
    "@nuxthub/core",
    "nuxt-auth-utils",
    "@vite-pwa/nuxt",
  ],
  css: ["~/assets/css/main.css"],
  icon: {
    serverBundle: "remote",
    localApiEndpoint: "/_nuxt_icon/:collection",
  },
  runtimeConfig: {
    AUTH_USERNAME: "",
    AUTH_PASSWORD: "",
    DB_ENCRYPTION_PASSWORD: "",
  },
  future: {
    compatibilityVersion: 4,
  },
  hub: {
    database: true,
    kv: true,
  },
  auth: {
    webAuthn: true,
  },
  pwa: {
    includeAssets: ["favicon.ico", "favicon-16x16.png"],
    manifest: {
      name: "MyAuthenticator",
      short_name: "MyAuthenticator",
      theme_color: "#0f172b",
      icons: [
        {
          src: "pwa-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "pwa-310x310.png",
          sizes: "310x310",
          type: "image/png",
        },
        {
          src: "pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
        {
          src: "pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable",
        },
      ],
    },
    workbox: {
      globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
    },
    injectManifest: {
      globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
    },
    client: {
      installPrompt: true,
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      navigateFallback: "/",
      navigateFallbackAllowlist: [/^\/$/],
      type: "module",
    },
  },
  compatibilityDate: "2025-03-15",
});

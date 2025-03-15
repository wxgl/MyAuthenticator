// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: [
    "@nuxt/ui",
    "@nuxt/eslint",
    "@vueuse/nuxt",
    "@nuxthub/core",
    "nuxt-auth-utils",
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
  compatibilityDate: "2025-03-15",
});

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: ["@nuxt/ui", "@nuxt/eslint", "@vueuse/nuxt", "@nuxthub/core"],
  css: ["~/assets/css/main.css"],
  icon: {
    serverBundle: "remote",
    localApiEndpoint: "/_nuxt_icon/:collection",
  },
  future: {
    compatibilityVersion: 4,
  },
  hub: {
    database: true,
    kv: true,
  },
  compatibilityDate: "2024-11-27",
});

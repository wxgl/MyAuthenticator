// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: ["@nuxt/ui", "@nuxt/eslint", "@vueuse/nuxt"],
  css: ["~/assets/css/main.css"],
  icon: {
    serverBundle: "remote",
  },
  future: {
    compatibilityVersion: 4,
  },

  compatibilityDate: "2024-11-27",
});

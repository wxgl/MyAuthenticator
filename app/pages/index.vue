<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});

const { data: accounts } = await useLazyFetch("/api/accounts", {
  key: "accounts",
  server: false,
});
</script>

<template>
  <div
    class="h-full scroll-smooth w-full grid place-items-center gap-y-10 gap-x-4 mt-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 pb-20 sm:pb-10"
  >
    <Tile v-for="account in accounts" :account="account" :key="account.id" />
  </div>
  <BottomBar />
</template>

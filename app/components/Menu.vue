<script setup lang="ts">
const { clear } = useUserSession();

const logout = async () => {
  await clear();
  reloadNuxtApp({ path: "/", force: true });
};

const openThemePicker = ref(false);
const openPasskeys = ref(false);
</script>

<template>
  <UModal title="Menu" :close="false">
    <template #body>
      <UModal
        v-model:open="openThemePicker"
        title="Theme"
        :ui="{ close: 'top-2 start-6 end-auto' }"
        close-icon="i-lucide-arrow-left"
      >
        <UButton
          leading-icon="i-solar-palette-round-bold"
          trailing-icon="i-mingcute-right-line"
          color="primary"
          variant="ghost"
          block
          class="p-3 px-6 gap-x-5"
          @click="openThemePicker = true"
          >Theme & Style</UButton
        >
        <template #body>
          <ThemePicker />
        </template>
      </UModal>
      <USeparator />
      <UModal
        v-model:open="openPasskeys"
        title="Passkeys"
        :ui="{ close: 'top-2 start-6 end-auto' }"
        close-icon="i-lucide-arrow-left"
      >
        <UButton
          leading-icon="i-carbon-fingerprint-recognition"
          trailing-icon="i-mingcute-right-line"
          color="primary"
          variant="ghost"
          block
          class="p-3 px-6 gap-x-5"
          @click="openPasskeys = true"
          >Passkeys</UButton
        >
        <template #body>
          <Passkeys />
        </template>
      </UModal>
      <USeparator />
      <UButton
        leading-icon="i-tabler:restore"
        trailing-icon="i-mingcute-right-line"
        variant="ghost"
        color="primary"
        block
        class="p-3 px-6 gap-x-5"
      >
        Backup & Restore
      </UButton>
      <USeparator />
      <UButton
        leading-icon="i-solar-logout-outline"
        color="primary"
        variant="ghost"
        block
        class="p-3 px-6 gap-x-3 mt-3"
        @click="logout"
        >Logout</UButton
      >
    </template>
  </UModal>
</template>

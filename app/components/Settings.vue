<script setup lang="ts">
const { clear } = useUserSession();

const logout = async () => {
  await clear();
  reloadNuxtApp({ path: "/", force: true });
};
</script>

<template>
  <UModal title="Settings" :close="false">
    <template #body>
      <UButton
        leading-icon="i-solar-palette-round-bold"
        trailing-icon="i-mingcute-right-line"
        color="primary"
        variant="ghost"
        block
        class="p-3 px-6 gap-x-5"
        >Theme & Style</UButton
      >
      <USeparator />
      <UButton
        leading-icon="i-carbon-fingerprint-recognition"
        trailing-icon="i-mingcute-right-line"
        color="primary"
        variant="ghost"
        block
        class="p-3 px-6 gap-x-5"
        >Passkeys</UButton
      >
      <USeparator />
      <div class="flex-center py-2">
        <UButton
          icon="i-ph-file-arrow-up"
          variant="ghost"
          color="primary"
          block
          class="gap-x-2"
        >
          Backup
        </UButton>
        <USeparator orientation="vertical" class="h-5" />
        <UButton
          icon="i-ph-file-arrow-down"
          variant="ghost"
          color="primary"
          block
          class="gap-x-2"
        >
          Restore
        </UButton>
      </div>
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

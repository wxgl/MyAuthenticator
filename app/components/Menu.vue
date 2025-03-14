<script setup lang="ts">
import ThemePicker from "./ThemePicker.vue";
import Passkeys from "./Passkeys.vue";
import BackupAndRestore from "./BackupAndRestore.vue";

const { clear } = useUserSession();

const overlay = useOverlay();

const themePickerModal = overlay.create(ThemePicker);
const passkeysModal = overlay.create(Passkeys);
const backupAndRestoreModal = overlay.create(BackupAndRestore);

const logout = async () => {
  await clear();
  reloadNuxtApp({ path: "/", force: true });
};
</script>

<template>
  <UModal title="Menu" :close="false">
    <template #body>
      <UButton
        leading-icon="i-solar-palette-round-bold"
        trailing-icon="i-mingcute-right-line"
        color="primary"
        variant="ghost"
        block
        class="p-3 px-6 gap-x-5"
        @click="themePickerModal.open()"
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
        @click="passkeysModal.open()"
        >Passkeys</UButton
      >
      <USeparator />
      <UButton
        leading-icon="i-tabler:restore"
        trailing-icon="i-mingcute-right-line"
        variant="ghost"
        color="primary"
        block
        class="p-3 px-6 gap-x-5"
        @click="backupAndRestoreModal.open()"
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

<script setup lang="ts">
import Form from "./Form.vue";

const modal = useModal();

const openForm = async () => {
  await modal.close();
  setTimeout(() => modal.open(Form), 300);
};
</script>

<template>
  <UModal :ui="{ content: 'p-2' }">
    <template #content>
      <UButton
        icon="i-heroicons-qr-code-solid"
        color="primary"
        variant="ghost"
        block
        class="gap-x-3 p-3 px-6"
        >Scan QR Code</UButton
      >
      <hr class="my-2 border-t border-primary-200 dark:border-primary-900" />
      <UButton
        color="primary"
        class="gap-x-3 p-3 px-6"
        variant="ghost"
        icon="i-heroicons-key-solid"
        @click="openForm"
        block
        >Enter Setup Key</UButton
      >
    </template>
  </UModal>
</template>

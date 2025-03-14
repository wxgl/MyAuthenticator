<script setup lang="ts">
import QrcodeVue from "qrcode.vue";
import type { RenderAs, Level } from "qrcode.vue";

const props = defineProps<{
  uri: string;
}>();

const level = ref<Level>("Q");
const renderAs = ref<RenderAs>("svg");
</script>

<template>
  <UModal title="Share" :close="false">
    <template #body>
      <div class="flex-center flex-col pb-4">
        <div
          class="p-2 bg-white rounded-[calc(var(--ui-radius)*2)] border-2 dark:border-none border-neutral-500 w-max mb-5"
        >
          <QrcodeVue
            :value="uri"
            :level="level"
            :size="200"
            background="white"
            :render-as="renderAs"
          />
        </div>
        <span
          class="text-neutral-600 dark:text-neutral-300 leading-normal text-center font-medium text-xs max-w-xs"
        >
          Scan the above QR code with any authenticator app like Google
          Authenticator to copy this account
        </span>
      </div>
    </template>
  </UModal>
</template>

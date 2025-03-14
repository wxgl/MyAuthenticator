<script setup lang="ts">
import Add from "./Add.vue";
import Menu from "./Menu.vue";

const overlay = useOverlay();

const addModal = overlay.create(Add);
const menuModal = overlay.create(Menu);

const showSearchBar = useState("searchBar");
</script>

<template>
  <div
    class="fixed bottom-0 z-10 flex items-center px-2 inset-x-0 h-12 bg-white ring-1 ring-neutral-200 dark:ring-neutral-800 dark:bg-neutral-900 w-full max-w-sm xl:max-w-md mx-auto rounded-t-[calc(var(--ui-radius)*5)]"
  >
    <UButton
      icon="i-lucide-menu"
      size="xl"
      color="neutral"
      class="hover:bg-transparent"
      variant="ghost"
      @click="menuModal.open()"
    />
    <UButton
      class="relative mx-auto bottom-6 rounded-full h-12 w-12 active:translate-y-0.5 flex-center"
      color="primary"
      variant="solid"
      @click="addModal.open()"
    >
      <UIcon name="i-heroicons-plus-16-solid" class="h-full w-full" />
    </UButton>
    <UButton
      icon="i-heroicons-magnifying-glass-16-solid"
      size="xl"
      color="neutral"
      class="hover:bg-transparent"
      variant="ghost"
      @click="showSearchBar = !showSearchBar"
    />
  </div>
</template>

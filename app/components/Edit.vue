<script setup lang="ts">
const props = defineProps<{
}
</script>

<template>
  <UModal title="Edit" :close="false" :dismissible="false">
    <template #body>
    //   <UForm
    //     :schema="accountEditSchema"
    //     :state="state"
    //     @submit="addAccount"
    //     @error="onError"
    //   >
    //     <UFormField size="xl" label="Issuer" name="issuer" required>
    //       <UInputMenu
    //         ignore-filter
    //         :items="icons || []"
    //         :icon="state.icon"
    //         placeholder="Google"
    //         v-model:search-term="searchIssuer"
    //         size="xl"
    //         v-model="selectedIssuer"
    //         @update:model-value="updateIssuerAndIcon"
    //         required
    //       />
    //     </UFormField>
    //     <UFormField size="xl" label="Label" name="label" required>
    //       <UInput size="xl" v-model="state.label" required />
    //     </UFormField>
    //     <UFormField size="xl" label="Type" name="type" required>
    //       <USelect size="xl" v-model="state.type" :items="otpTypes" />
    //     </UFormField>
    //     <UFormField size="xl" label="Key" name="secret" required>
    //       <UInput size="xl" v-model="state.secret" required />
    //     </UFormField>
    //     <div class="flex w-full justify-end space-x-4 mt-4 px-3">
    //       <UButton
    //         @click="modal.close()"
    //         label="Cancel"
    //         color="neutral"
    //         variant="ghost"
    //         size="lg"
    //       />
    //       <UButton type="submit" :disabled="loading" variant="soft" size="md"
    //         >Submit</UButton
    //       >
    //     </div>
    //   </UForm>
    </template>
 </UModal>
</template>

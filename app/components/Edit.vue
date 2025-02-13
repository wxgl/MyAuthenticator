<script setup lang="ts">
import type { FormErrorEvent, FormSubmitEvent } from "#ui/types";
import { toast } from "@steveyuowo/vue-hot-toast";

const props = defineProps<{ account: AccountEdit; accountId: number }>();

const state = reactive<AccountEdit>({ ...props.account });

const modal = useModal();

const searchIcon = ref("");

const searchIconDebounced = refDebounced(searchIcon, 500);

const icons = ref<Icon[]>([]);

const loading = ref(false);

const closeModal = async () => {
  modal.reset();
  await modal.close();
};

async function updateAccount(event: FormSubmitEvent<AccountEdit>) {
  loading.value = true;
  const toastid = toast.loading("loading...");
  await $fetch("/api/accounts", {
    method: "PATCH",
    query: { id: props.accountId },
    body: event.data,
  })
    .then(async (res) => {
      toast.update(toastid, {
        message: res.message,
        type: "success",
      });
      await refreshNuxtData("accounts");
      closeModal();
      loading.value = false;
    })
    .catch((err: Error) => {
      toast.update(toastid, {
        message: err.message,
        type: "error",
      });
      loading.value = false;
      console.error(err);
    });
}

async function onError(event: FormErrorEvent) {
  console.log(event.errors[0]);
  toast.error(event.errors[0]?.message!);
}

watch(searchIconDebounced, async (query) => {
  icons.value = await getIcons(query);
});
</script>

<template>
  <UModal title="Edit" :close="false" :dismissible="false">
    <template #body>
      <UForm
        :schema="accountEditSchema"
        :state="state"
        @submit="updateAccount"
        @error="onError"
      >
        <UFormField size="xl" label="Icon" name="icon" required>
          <UInputMenu
            ignore-filter
            :items="icons || []"
            :icon="state.icon"
            placeholder="Google"
            v-model:search-term="searchIcon"
            size="xl"
            value-key="icon"
            v-model="state.icon"
            required
          />
        </UFormField>
        <UFormField size="xl" label="Issuer" name="issuer" required>
          <UInput size="xl" v-model="state.issuer" required />
        </UFormField>
        <UFormField size="xl" label="Label" name="label" required>
          <UInput size="xl" v-model="state.label" required />
        </UFormField>
        <div class="flex w-full justify-end space-x-4 mt-4 px-3">
          <UButton
            @click="closeModal"
            label="Cancel"
            color="neutral"
            variant="ghost"
            size="lg"
          />
          <UButton type="submit" :disabled="loading" variant="soft" size="md"
            >Submit</UButton
          >
        </div>
      </UForm>
    </template>
  </UModal>
</template>

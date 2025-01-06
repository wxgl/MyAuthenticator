<script setup lang="ts">
import type { FormErrorEvent } from "#ui/types";

const modal = useModal();

const state = reactive({
  type: "TOTP",
  issuer: "",
  secret: undefined,
  algorithm: "SHA1",
  label: undefined,
  icon: "i-simple-icons-google",
  icontype: "normal",
  digits: 6,
  period: 30,
  counter: 0,
});

async function onError(event: FormErrorEvent) {
  console.log(event.errors[0]);
  // toast.error(event.errors[0].message);
}

const searchIssuer = ref("");
const searchIssuerDebounced = refDebounced(searchIssuer, 300);
const selectedIssuer = ref<{ label: string; icon: string }>();

const showAdvanced = ref(false);

const { data: icons, status } = await useLazyFetch(
  "https://api.iconify.design/search",
  {
    query: {
      query: searchIssuerDebounced,
      limit: 999,
      prefixes:
        "logos,simple-icons,devicon,vscode-icons,token-branded,mdi,ri,line-icons,articons,teeny-icons,meteor-icons,mingcute",
    },
    transform: (data: { icons: string[] }) => {
      if (!data.icons.length)
        return [
          {
            label: searchIssuerDebounced.value,
            icon: "i-marketeq-user",
          },
        ];
      return data.icons.map((icon) => ({
        label: icon.split(":")[1]?.split("-")[0],
        icon: `i-${icon.replace(":", "-")}`,
      }));
    },
  }
);

const updateIssuerAndIcon = () => {
  if (!selectedIssuer.value) return;
  state.icon = selectedIssuer.value.icon;
  state.issuer = selectedIssuer.value.label;
};
</script>

<template>
  <UModal title="Setup Using Key" :close="false" :dismissible="false" class="">
    <template #body>
      <UForm :schema="accountSchema" :state="state" @error="onError">
        <UFormField size="xl" label="Issuer" name="issuer" required>
          <UInputMenu
            ignore-filter
            :items="icons || []"
            :icon="state.icon"
            placeholder="Google"
            v-model:search-term="searchIssuer"
            size="xl"
            v-model="selectedIssuer"
            @update:model-value="updateIssuerAndIcon"
          />
        </UFormField>
        <UFormField size="xl" label="Label" name="label" required>
          <UInput size="xl" v-model="state.label" />
        </UFormField>
        <UFormField size="xl" label="Type" name="type" required>
          <USelect size="xl" v-model="state.type" :items="otpTypes" />
        </UFormField>
        <UFormField size="xl" label="Key" name="secret" required>
          <UInput size="xl" v-model="state.secret" />
        </UFormField>
        <div v-show="!showAdvanced" class="flex-center w-full">
          <UButton
            class="uppercase mx-auto font-bold font-mono text-primary-600"
            variant="ghost"
            size="sm"
            @click="showAdvanced = true"
            >show advanced</UButton
          >
        </div>
        <UFormField
          v-show="showAdvanced"
          size="xl"
          label="Algorithm"
          name="algorithm"
          required
        >
          <USelect size="xl" v-model="state.algorithm" :items="algorithms" />
        </UFormField>
        <div v-show="showAdvanced" class="flex-center space-x-3 w-full">
          <UFormField label="Digits" size="xl" required>
            <UInput
              name="digits"
              v-model="state.digits"
              type="number"
              icon="i-material-symbols-123"
              required
              min="6"
              max="8"
            />
          </UFormField>
          <UFormField
            v-if="state.type === 'TOTP'"
            label="Period"
            size="xl"
            required
          >
            <UInput
              name="period"
              v-model="state.period"
              type="number"
              icon="i-material-symbols-timer-outline-rounded"
              required
              min="5"
              max="60"
            />
          </UFormField>
          <UFormField v-else label="Counter" size="xl" required>
            <UInput
              name="counter"
              v-model="state.counter"
              type="number"
              icon="i-material-symbols-timer-outline-rounded"
              required
              min="0"
              max="3000"
            />
          </UFormField>
        </div>
        <div class="flex w-full justify-end space-x-4 mt-4 px-3">
          <UButton
            @click="modal.close()"
            label="Cancel"
            color="neutral"
            variant="ghost"
            size="lg"
          />
          <UButton variant="soft" size="md">Submit</UButton>
        </div>
      </UForm>
    </template>
  </UModal>
</template>

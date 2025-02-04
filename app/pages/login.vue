<script setup lang="ts">
import type { FormErrorEvent, FormSubmitEvent } from "#ui/types";
import { toast } from "@steveyuowo/vue-hot-toast";

const { fetch: refreshSesion, loggedIn } = useUserSession();

const state = reactive({
  username: "",
  password: "",
});

const isLoading = ref(false);

const onSubmit = async (event: FormSubmitEvent<Login>) => {
  isLoading.value = true;
  const toastid = toast.loading("loading...");
  await $fetch("/api/auth/login", {
    method: "POST",
    body: event.data,
  })
    .then(async (res) => {
      await refreshSesion();
      navigateTo("/");
      toast.update(toastid, {
        message: res.message,
        type: "success",
      });
      isLoading.value = false;
    })
    .catch((err: Error) => {
      toast.update(toastid, {
        message: err.message,
        type: "error",
      });
      isLoading.value = false;
      console.error(err);
    });
};

async function onError(event: FormErrorEvent) {
  console.log(event.errors[0]);
  toast.error(event.errors[0]?.message!);
}
</script>

<template>
  <div class="flex-center h-dvh overflow-hidden">
    <UCard>
      <UForm
        :schema="loginSchema"
        :state="state"
        class="flex flex-col items-center"
        @submit="onSubmit"
        @error="onError"
      >
        <span className="text-lg xs:text-xl font-semibold uppercase mb-4 mt-2"
          >Login</span
        >
        <UFormField
          label="Username"
          size="lg"
          :ui="{
            root: 'mb-4',
          }"
        >
          <UInput
            v-model="state.username"
            placeholder="John"
            icon="i-heroicons-user-circle"
            name="username"
            size="lg"
            required
          />
        </UFormField>
        <UFormField label="Password" size="lg">
          <UInput
            v-model="state.password"
            placeholder="password"
            icon="i-heroicons-key"
            name="password"
            type="password"
            size="lg"
            required
          />
        </UFormField>
        <div class="flex flex-center mt-2 p-2 relative">
          <UButton :disabled="isLoading" type="submit" variant="soft" size="lg"
            >submit</UButton
          >
        </div>
      </UForm>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { toast } from "@steveyuowo/vue-hot-toast";
import {
  encryptWithPassword,
  getAccountsUriList,
  readFileContent,
} from "~~/shared/utils";

const chosen = ref(0);

const password = ref("");

const file = ref<HTMLInputElement | null>(null);

const loading = ref(false);

const handleChosen = (val: number) => {
  if (chosen.value > 0 && val == chosen.value) chosen.value = 0;
  else chosen.value = val;
  password.value = "";
  file.value = null;
};

const downloadEncryptedBackupFile = async () => {
  const toastId = toast.loading("Downloading...");
  loading.value = true;
  const accounts = useNuxtData<Accounts>("accounts");
  if (!accounts.data.value?.length) {
    toast.update(toastId, {
      message: "No accounts to backup",
      type: "error",
    });
    return;
  }
  const encryptedAccounts = await encryptWithPassword(
    JSON.stringify(accounts.data.value),
    password.value
  );
  try {
    const blob = new Blob([encryptedAccounts], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Backup-${new Date().toISOString()}.backup`;
    a.click();
    URL.revokeObjectURL(url);
    toast.update(toastId, {
      message: "Download successful",
      type: "success",
    });
  } catch (error) {
    toast.update(toastId, {
      message: "Download failed",
      type: "error",
    });
    console.error("Error downloading URI list file:", error);
  }
  loading.value = false;
};

const downloadUriListFile = async () => {
  const toastId = toast.loading("Downloading...");
  loading.value = true;
  const accounts = useNuxtData<Accounts>("accounts");
  if (!accounts.data.value?.length) {
    toast.update(toastId, {
      message: "No accounts to backup",
      type: "error",
    });
    return;
  }
  const accountsUriList = await getAccountsUriList(accounts.data.value);
  try {
    const blob = new Blob([accountsUriList.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Backup-${new Date().toISOString()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.update(toastId, {
      message: "Download successful",
      type: "success",
    });
  } catch (error) {
    toast.update(toastId, {
      message: "Download failed",
      type: "error",
    });
    console.error("Error downloading URI list file:", error);
  }
  loading.value = false;
};

const restoreFromEncryptedBackupFile = async () => {
  const toastId = toast.loading("Restoring...");
  loading.value = true;
  if (!file.value?.files?.[0]) {
    toast.update(toastId, {
      message: "No file selected",
      type: "error",
    });
    return;
  }
  const fileContent = await readFileContent(file.value.files[0]);
  console.log(fileContent);
};
</script>

<template>
  <div class="flex-col flex space-y-3">
    <UButton
      block
      icon="i-hugeicons-encrypt"
      :variant="chosen == 1 ? 'ghost' : 'soft'"
      :color="chosen == 1 ? 'primary' : 'neutral'"
      class="py-2 gap-x-3"
      label="Backup to Encrypted file"
      :class="
        chosen == 1
          ? 'border-b rounded-none border-dashed border-neutral-300 dark:border-neutral-600 uppercase'
          : ''
      "
      @click="handleChosen(1)"
    />
    <div v-show="chosen == 1" class="p-2">
      <p class="text-xs text-center leading-4.5">
        This will save all your authenticators, including icons, to an encrypted
        file protected by a password (recommended).
      </p>
      <form
        class="flex-center space-x-4 px-5 my-3"
        @submit.prevent="downloadEncryptedBackupFile"
      >
        <UInput
          color="primary"
          variant="outline"
          placeholder="Password"
          required
          minlength="8"
        />
        <UButton
          color="primary"
          variant="soft"
          icon="i-hugeicons-encrypt"
          size="sm"
          type="submit"
          >Encrypt</UButton
        >
      </form>
    </div>
    <UButton
      block
      icon="i-prime-list"
      :variant="chosen == 2 ? 'ghost' : 'soft'"
      :color="chosen == 2 ? 'primary' : 'neutral'"
      class="py-2 gap-x-3"
      label="Backup to URi list file"
      :class="
        chosen == 2
          ? 'border-b rounded-none border-dashed border-neutral-300 dark:border-neutral-600 uppercase'
          : ''
      "
      @click="handleChosen(2)"
    />
    <div v-show="chosen == 2" class="p-2 flex-center flex-col space-y-3">
      <p class="text-xs text-center leading-4.5">
        This will save all your authenticators to an unencrypted plaintext URI
        list file. Note that icons won't be included.This method is not
        recommended as your keys might be exposed.
      </p>
      <UButton
        color="primary"
        variant="soft"
        icon="i-charm-download"
        size="sm"
        @click="downloadUriListFile"
        >Download</UButton
      >
    </div>
    <USeparator label="OR" />
    <UButton
      block
      icon="i-hugeicons-encrypt"
      :variant="chosen == 3 ? 'ghost' : 'soft'"
      :color="chosen == 3 ? 'primary' : 'neutral'"
      class="py-2 gap-x-3"
      label="Restore from Encrypted file"
      :class="
        chosen == 3
          ? 'border-b rounded-none border-dashed border-neutral-300 dark:border-neutral-600 uppercase'
          : ''
      "
      @click="handleChosen(3)"
    />
    <div v-show="chosen == 3" class="p-2">
      <p class="text-xs text-center leading-4.5">
        Select a file to restore your authenticators from an encrypted backup
        file.
      </p>
      <form
        class="flex flex-auto space-x-4 px-5 my-3"
        @submit.prevent="restoreFromEncryptedBackupFile"
      >
        <UInput
          color="primary"
          variant="outline"
          type="file"
          required
          class="w-full"
          @vue:updated="file = $event.target?.files?.[0]"
        />
        <UInput
          color="primary"
          variant="outline"
          placeholder="Password"
          required
          minlength="8"
          v-model="password"
        />
        <UButton
          color="primary"
          variant="soft"
          icon="i-hugeicons-encrypt"
          size="sm"
          type="submit"
          >Decrypt</UButton
        >
      </form>
    </div>
    <UButton
      block
      icon="i-prime-list"
      :variant="chosen == 4 ? 'ghost' : 'soft'"
      :color="chosen == 4 ? 'primary' : 'neutral'"
      class="py-2 gap-x-3"
      label="Restore from URi list file"
      :class="
        chosen == 4
          ? 'border-b rounded-none border-dashed border-neutral-300 dark:border-neutral-600 uppercase'
          : ''
      "
      @click="handleChosen(4)"
    />
    <div v-show="chosen == 4" class="p-2">
      <p class="text-xs text-center leading-4.5">
        Choose a file to restore your authenticators from an unencrypted
        plaintext URI list file.
      </p>
      <div class="flex-center space-x-4 px-5 my-3">
        <UInput
          color="primary"
          variant="outline"
          placeholder="Password"
          type="file"
          required
        />
        <UButton
          color="primary"
          variant="soft"
          icon="i-tabler-restore"
          size="sm"
          >Restore</UButton
        >
      </div>
    </div>
  </div>
</template>

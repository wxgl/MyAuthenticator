<script setup lang="tsx">
import { QrcodeStream, QrcodeCapture } from "vue-qrcode-reader";
import type { DetectedBarcode } from "barcode-detector/pure";
import { toast } from "@steveyuowo/vue-hot-toast";

const state = reactive({
  errorMsg: "",
  error: false,
  loading: true,
});

const extractAccountsFromQrCodeData = async (data: string) => {
  if (data.startsWith("otpauth://")) return await extractAccountsFromUri(data);
  else if (data.startsWith("otpauth-migration://offline")) {
    // TODO: Implement this
    return;
  } else return;
};

const onDetect = async (response: DetectedBarcode[]) => {
  console.log(response);
  response.forEach(async (res) => {
    const toastId = toast.loading("Loading...");
    const accounts: Accounts =
      (await extractAccountsFromQrCodeData(res.rawValue)) ?? [];
    if (!accounts.length) {
      toast.update(toastId, { message: "Invalid Qrcode", type: "error" });
      return;
    }
    await $fetch("/api/accounts", {
      method: "POST",
      body: accounts,
    })
      .then(async (res) => {
        toast.update(toastId, {
          message: res.message,
          type: "success",
        });
        await refreshNuxtData("accounts");
        await closeModal();
      })
      .catch((err: Error) => {
        toast.update(toastId, {
          message: err.message,
          type: "error",
        });
        console.error(err);
      });
  });
};

const onReady = (capabilities: MediaTrackCapabilities) => {
  state.loading = false;
  console.log(capabilities);
};

const onError = (error: Error) => {
  state.error = true;
  if (error.name === "NotAllowedError")
    state.errorMsg = "Camera Permission Denied";
  else if (error.name === "NotFoundError") state.errorMsg = "Camera Not Found";
  else if (error.name === "NotSupportedError") state.errorMsg = "Not Supported";
  else if (error.name === "NotReadableError")
    state.errorMsg = "Camera Not Readable";
  else if (error.name === "OverconstrainedError")
    state.errorMsg = "Over Constrained";
  else if (error.name === "StreamApiNotSupportedError")
    state.errorMsg = "Browser Not Supported";
  else state.errorMsg = error.name;
  toast.error(state.errorMsg);
};
</script>

<template>
  <UModal title="Scan QR Code" :close="false">
    <template #body>
      <QrcodeStream
        class="h-full w-full overflow-hidden rounded-lg border-2 border-gray-700"
        v-if="!state.error"
        @camera-on="onReady"
        @detect="onDetect"
        @error="onError"
      >
        <div v-show="state.loading" class="h-full w-full flex-center">
          Loading Camera ....
        </div>
      </QrcodeStream>
      <div
        v-else
        class="min-h-32 flex-center flex-col space-y-2 font-semibold text-red-600"
      >
        <UIcon name="i-heroicons-camera-solid" />
        <span>{{ state.errorMsg }}</span>
      </div>
      <div class="w-full relative flex-center mt-4 mb-7">
        <div class="relative border-t border-gray-700 w-full"></div>
        <div class="absolute bg-gray-900 text-sm px-3 p-1 font-mono">OR</div>
      </div>
      <div class="flex-center relative">
        <UButton size="sm" variant="soft" icon="i-heroicons-photo-16-solid">
          <label for="fileinput" class="cursor-pointer">Upload Image</label>
          <QrcodeCapture class="w-0" id="fileinput" @detect="onDetect" />
        </UButton>
      </div>
    </template>
  </UModal>
</template>

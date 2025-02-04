<script setup lang="ts">
import * as OTPAuth from "otpauth";

const props = defineProps<{
  account: Account;
}>();

const OTP =
  props.account.type === "TOTP"
    ? new OTPAuth.TOTP(props.account)
    : new OTPAuth.HOTP(props.account);

const token = ref("0");

const intervel = ref<NodeJS.Timeout>();

const deleteConfirmation = ref(false);

const options = ref(null);

const showOptions = ref(false);

const close = () => {
  showOptions.value = false;
  deleteConfirmation.value = false;
};

onClickOutside(options, close);

const optionsToggleHandler = () => {
  if (!showOptions.value) showOptions.value = true;
  else close();
};

const copyToken = () => {
  navigator.clipboard.writeText(token.value);
};

const updateToken = () => {
  token.value = OTP.generate();
  if (intervel.value) clearInterval(intervel.value);
  intervel.value = setInterval(() => {
    updateToken();
  }, props.account.period * 1000);
};

onMounted(() => {
  updateToken();
});
</script>

<template>
  <UCard :ui="{ body: '!p-0' }">
    <div class="flex items-center w-full h-full min-h-[6.375rem] p-2 relative">
      <div class="logo flex-none h-full w-[4.5rem] flex-center">
        <div
          class="h-[4.5rem] w-full rounded-full overflow-hidden z-[2] relative"
        >
          <svg
            viewBox="0 0 100 100"
            class="stroke-primary-500 rounded-full -rotate-90"
          >
            <circle
              :style="{ animationDuration: `${account.period}s` }"
              class="prog-bar fill-gray-100 dark:fill-black"
              cx="50"
              cy="50"
              r="45"
            />
          </svg>
          <div
            class="h-full fill-black dark:fill-white w-full inset-0 absolute flex-center"
          >
            <UIcon
              :name="account.icon"
              class="text-gray-800 dark:text-gray-200 size-8"
            />
          </div>
        </div>
      </div>
      <div class="flex flex-col h-full ml-5 overflow-hidden">
        <div class="flex flex-col">
          <span class="text-sm uppercase">{{ account.issuer }}</span>
          <span class="text-xs text-slate-400 mt-0.5">{{ account.label }}</span>
        </div>
        <div class="h-full flex items-center mt-2 pb-1">
          <UTooltip text="Click to copy" class="cursor-pointer">
            <span
              @click="copyToken"
              class="text-3xl text-gray-800 dark:text-gray-100 font-medium tracking-wide"
              >{{ token }}</span
            >
          </UTooltip>
        </div>
      </div>
      <div class="h-full flex items-center ml-auto">
        <UIcon
          class="cursor-pointer h-6 w-6 text-gray-400 duration-300"
          :class="showOptions && `rotate-180`"
          name="i-heroicons-chevron-right-16-solid"
          @click="optionsToggleHandler"
        />
      </div>
      <div
        class="h-full absolute inset-y-0 right-0 flex justify-end z-10 transition-all duration-500"
        :class="
          showOptions &&
          `bg-black/10 dark:bg-black/40 backdrop-blur-sm inset-x-0`
        "
      >
        <Transition name="slide">
          <div
            ref="options"
            v-show="showOptions"
            class="w-60 h-full bg-white dark:bg-gray-900 overflow-hidden rounded-md pl-5 pr-4"
          >
            <Transition name="slide2">
              <div
                v-if="!deleteConfirmation"
                class="flex-center w-full h-full space-x-4 text-xs"
              >
                <div class="flex-center flex-col space-y-2 p-2">
                  <UButton
                    icon="i-heroicons-pencil-solid"
                    variant="soft"
                    size="md"
                  />
                  <span>Edit</span>
                </div>
                <div class="flex-center flex-col space-y-2 p-2">
                  <UButton
                    icon="i-heroicons-qr-code-solid"
                    variant="soft"
                    size="md"
                  />
                  <span>Share</span>
                </div>
                <div class="flex-center flex-col space-y-2 p-2">
                  <UButton
                    icon="i-heroicons-trash-20-solid"
                    variant="soft"
                    size="md"
                    color="error"
                    @click="deleteConfirmation = true"
                  />
                  <span>Delete</span>
                </div>
              </div>
              <div
                v-else="deleteConfirmation"
                class="h-full w-full flex-center space-x-4 text-sm font-semibold"
              >
                <span>Are you sure ?</span>
                <UButton
                  icon="i-entypo-cross"
                  variant="soft"
                  size="md"
                  @click="deleteConfirmation = false"
                />
                <UButton
                  icon="i-heroicons-trash-20-solid"
                  variant="soft"
                  size="md"
                  color="error"
                />
              </div>
            </Transition>
          </div>
        </Transition>
      </div>
    </div>
  </UCard>
</template>

<style scoped>
.prog-bar {
  stroke-width: 5px;
  stroke-linecap: round;
  stroke-dashoffset: 280px;
  stroke-dasharray: 280px;
  animation: progress 0s linear 0s infinite;
}

@keyframes progress {
  0% {
    stroke-dashoffset: 280px;
  }
  100% {
    stroke-dashoffset: 0px;
  }
}

.slide-enter-active,
.slide2-enter-active,
.slide-leave-active,
.slide2-leave-active {
  transition: transform 500ms ease-in-out 0s;
}

.slide-enter-from,
.slide2-enter-from,
.slide-leave-to {
  transform: translateX(320px);
}
.slide2-leave-to {
  transform: translateX(-320px);
}
.slide-enter-to,
.slide2-enter-to,
.slide-leave-from {
  transform: translateX(0px);
}
.slide2-leave-from {
  transform: translateX(-0px);
}
</style>

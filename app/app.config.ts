export default defineAppConfig({
  // https://ui3.nuxt.dev/getting-started/theme#design-system
  ui: {
    colors: {
      primary: "green",
      neutral: "slate",
    },
    button: {
      slots: {
        base: "cursor-pointer",
      },
    },
    select: {
      slots: {
        base: "w-full",
      },
    },
    inputMenu: {
      slots: {
        root: "w-full",
      },
      variants: {
        size: {
          xl: {
            leadingIcon: "size-4",
            itemLeadingIcon: "size-4",
          },
        },
      },
    },
    input: {
      slots: {
        root: "w-full",
      },
    },
    formField: {
      slots: {
        root: "mb-3 w-full",
        error: "!hidden",
      },
      variants: {
        size: {
          xl: {
            root: "text-sm",
          },
        },
      },
    },
    modal: {
      slots: {
        overlay: "bg-gray-200/75 dark:bg-gray-950/75 backdrop-blur-sm",
        content: "divide-y-0",
        title: "text-center uppercase",
        header: "pt-3 pb-0",
      },
      variants: {
        fullscreen: {
          false: {
            content:
              "max-w-sm sm:max-w-md w-[90vw] h-auto rounded-[calc(var(--ui-radius)*2)] shadow-lg ring",
          },
        },
      },
    },
  },
});

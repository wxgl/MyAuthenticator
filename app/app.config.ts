export default defineAppConfig({
  // https://ui3.nuxt.dev/getting-started/theme#design-system
  ui: {
    colors: {
      primary: "green",
      neutral: "slate",
    },
    separator: {
      slots: {
        label: "text-xs font-mono",
      },
    },
    card: {
      slots: {
        root: "w-full max-w-xs overflow-hidden",
        body: "!py-3 px-3 md:px-5 xl:px-8",
      },
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
            base: "py-[9px]",
          },
        },
      },
    },
    input: {
      slots: {
        root: "w-full",
      },
      variants: {
        size: {
          xl: {
            base: "py-[9px]",
          },
          lg: {
            base: "py-[9px]",
          },
        },
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
    skeleton: {
      base: "bg-white dark:bg-neutral-900",
    },
    modal: {
      slots: {
        overlay: "bg-neutral-200/75 dark:bg-neutral-950/75 backdrop-blur-sm",
        content: "divide-y-0 px-2",
        title: "uppercase",
        header: "pt-3 pb-0 justify-center min-h-auto",
      },
      variants: {
        transition: {
          true: {
            content:
              "data-[state=open]:animate-[slide-in-from-bottom_250ms_ease-in-out] data-[state=closed]:animate-[slide-out-to-bottom_250ms_ease-in-out] data-[state=open]:sm:animate-[scale-in_200ms_ease-out] data-[state=closed]:sm:animate-[scale-out_200ms_ease-in]",
          },
        },
        fullscreen: {
          false: {
            content:
              "max-w-sm w-full sm:max-w-md h-max bottom-0 inset-x-0 top-auto mx-auto translate-x-0 translate-y-0 rounded-t-[calc(var(--ui-radius)*4)] sm:rounded-[calc(var(--ui-radius)*2)] shadow-lg ring sm:top-[50%] sm:left-[50%] sm:bottom-auto sm:right-auto sm:translate-x-[-50%] sm:translate-y-[-50%]",
          },
        },
      },
    },
  },
  theme: {
    radius: 0.25,
    blackAsPrimary: false,
  },
});

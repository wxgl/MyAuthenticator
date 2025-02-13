export const getIcons = async (query: string) => {
  return await $fetch<{ icons: string[] }>(
    "https://api.iconify.design/search",
    {
      query: {
        query: query,
        limit: 999,
        prefixes:
          "logos,simple-icons,devicon,token-branded,mdi,ri,line-icons,articons,teeny-icons,mingcute",
      },
    }
  ).then((res) => {
    if (!res.icons.length)
      return [
        {
          label: query,
          icon: "i-solar-user-bold",
        },
      ];
    else
      return res.icons.map((icon) => ({
        label: icon.split(":")[1]?.split("-")[0]!,
        icon: `i-${icon.replace(":", "-")}`,
      }));
  });
};

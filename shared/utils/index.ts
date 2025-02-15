import * as OTPAuth from "otpauth";

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
          icon: defaultIcon,
        },
      ];
    else
      return res.icons.map((icon) => ({
        label: icon.split(":")[1]?.split("-")[0]!,
        icon: `i-${icon.replace(":", "-")}`,
      }));
  });
};

export const matchIcon = async (query: string) => {
  const icon = query.toLowerCase().trim();
  return await $fetch<string>("/_nuxt_icon/:collection/simple-icons.json", {
    query: {
      icons: icon,
    },
    async onResponse({ response }) {
      if (response.status === 200) response._data = `i-simple-icons-${icon}`;
      else response._data = defaultIcon;
    },
  });
};

export const closeModal = async () => {
  const modal = useModal();
  await modal.close();
  setTimeout(() => modal.reset(), 300);
};

export const extractAccountsFromUri = async (uri: string) => {
  let account: OTPAuth.HOTP | OTPAuth.TOTP;
  try {
    account = OTPAuth.URI.parse(uri);
  } catch {
    return;
  }
  const accounts: Accounts = [];
  const url = new URL(uri);
  const period = url.searchParams.get("period") ?? "30";
  const counter = url.searchParams.get("counter") ?? "0";
  accounts.push({
    type: uri.includes("totp") ? otpSchema.Values.TOTP : otpSchema.Values.HOTP,
    issuer: account.issuer,
    label: account.label,
    icon: await matchIcon(account.issuer),
    secret: account.secret.base32,
    algorithm: algorithmSchema.parse(account.algorithm),
    digits: account.digits,
    period: parseInt(period),
    counter: parseInt(counter),
  });
  return accounts;
};

import * as OTPAuth from "otpauth";
import { subtle, getRandomValues } from "uncrypto";
import { Payload, type Payload_OtpParameters } from "./proto/google";

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

export const extractAccountsFromUriList = async (uriList: string[]) => {
  const accounts: Accounts = [];
  for (const uri of uriList) {
    let account: OTPAuth.HOTP | OTPAuth.TOTP;
    try {
      account = OTPAuth.URI.parse(uri);
    } catch {
      return;
    }
    const url = new URL(uri);
    const period = url.searchParams.get("period") ?? "30";
    const counter = url.searchParams.get("counter") ?? "0";
    accounts.push({
      type: uri.includes("totp")
        ? otpSchema.Values.TOTP
        : otpSchema.Values.HOTP,
      issuer: account.issuer,
      label: account.label,
      icon: await matchIcon(account.issuer),
      secret: account.secret.base32,
      algorithm: algorithmSchema.parse(account.algorithm),
      digits: account.digits,
      period: parseInt(period),
      counter: parseInt(counter),
    });
  }
  return accounts;
};

export const extractAccountsFromGoogleUri = async (uri: string) => {
  const url = new URL(uri);
  const data = url.searchParams.get("data");
  if (!data) return;
  let otpParameters: Payload_OtpParameters[] = [];
  try {
    const payload = Payload.decode(
      Uint8Array.from(atob(data), (c) => c.charCodeAt(0))
    );

    otpParameters = payload.otpParameters;
  } catch {
    return;
  }
  if (!otpParameters.length) return;
  const accounts: Account[] = [];
  for (const otp of otpParameters) {
    const type =
      otp.type > 0
        ? otp.type === 1
          ? otpSchema.Values.HOTP
          : otpSchema.Values.TOTP
        : undefined;
    const algorithm = otp.algorithm
      ? {
          [-1]: undefined,
          0: undefined,
          1: algorithmSchema.Values.SHA1,
          2: algorithmSchema.Values.SHA256,
          3: algorithmSchema.Values.SHA512,
          4: undefined,
        }[otp.algorithm]
      : undefined;
    const digits = otp.digits > 0 ? (otp.digits === 1 ? 6 : 8) : undefined;
    if (!type || !algorithm || !digits || !otp.secret || !otp.name) continue;
    accounts.push({
      type: type,
      issuer: otp.issuer,
      label: otp.name,
      icon: await matchIcon(otp.issuer),
      secret: new OTPAuth.Secret({
        buffer: otp.secret.buffer.slice(
          otp.secret.byteOffset,
          otp.secret.byteOffset + otp.secret.byteLength
        ),
      }).base32,
      algorithm: algorithm,
      digits: digits,
      period: 30,
      counter: otp.counter ?? 0,
    });
  }
  return accounts;
};

export const getAccountsUriList = async (accounts: Accounts) => {
  const uriList: string[] = [];
  for (const account of accounts) {
    const OTP =
      account.type === "TOTP"
        ? new OTPAuth.TOTP(account)
        : new OTPAuth.HOTP(account);
    uriList.push(OTP.toString());
  }
  return uriList;
};

const generateKey = async (salt: Uint8Array, password: string) => {
  const encoder = new TextEncoder();
  const keyMaterial = await subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  const key = await subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
  return key;
};

export const encryptWithPassword = async (data: string, password: string) => {
  const encoder = new TextEncoder();
  const salt = getRandomValues(new Uint8Array(16));
  const iv = getRandomValues(new Uint8Array(12));
  const key = await generateKey(salt, password);
  const encryptedData = await subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    encoder.encode(data)
  );
  const combinedBuffer = new Uint8Array(
    salt.length + iv.length + encryptedData.byteLength
  );
  combinedBuffer.set(salt, 0);
  combinedBuffer.set(iv, salt.length);
  combinedBuffer.set(new Uint8Array(encryptedData), salt.length + iv.length);
  const combinedBase64 = btoa(String.fromCharCode(...combinedBuffer));
  return combinedBase64;
};

export const decryptWithPassword = async (data: string, password: string) => {
  const combinedBuffer = Uint8Array.from(atob(data), (c) => c.charCodeAt(0));
  const salt = combinedBuffer.slice(0, 16);
  const iv = combinedBuffer.slice(16, 28);
  const encryptedData = combinedBuffer.slice(28);
  const key = await generateKey(salt, password);
  const decryptedData = await subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    encryptedData
  );
  const decoder = new TextDecoder();
  return decoder.decode(decryptedData);
};

export const readFileContent = (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        resolve(event.target.result as string);
      } else {
        reject(new Error("File reading failed"));
      }
    };
    reader.onerror = () => {
      reject(new Error("File reading failed"));
    };
    reader.readAsText(file);
  });
};

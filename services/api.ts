import { useGlobalStore } from "@/hooks/useGlobalStore";
import ky from "ky";
import { Torrent } from "./types";

const getHeaders = (additionalHeaders = {}) => {
  return {
    Referer: `${getPrefixUrl()}/`,
    ...additionalHeaders,
  };
};

const getPrefixUrl = () => {
  const baseUrl = useGlobalStore.getState().baseUrl;
  const port = useGlobalStore.getState().port;

  if (port) {
    return `${baseUrl}:${port}`;
  }
  return baseUrl;
};

export const client = ky.create({
  prefixUrl: getPrefixUrl(),
  headers: getHeaders(),
  credentials: "include",
});

/**
 * Returns boolean indicating if login was successful
 */
export async function login(username: string, password: string) {
  try {
    const prefixUrl = getPrefixUrl();
    const body = new URLSearchParams({ username, password }).toString();

    const res = await ky.post(`${prefixUrl}/api/v2/auth/login`, {
      headers: getHeaders({
        "Content-Type": "application/x-www-form-urlencoded",
      }),
      body,
      credentials: "include",
    });

    const setCookie = res.headers.get("set-cookie");
    const sidCookie = setCookie?.match(/SID=([^;]+)/)?.[1] ?? null;

    if (sidCookie) {
      const cookie = `SID=${sidCookie}`;
      useGlobalStore.setState({ cookie });
    }

    if (!res.ok) {
      throw new Error(`Login failed: ${res.status}`);
    }

    return true;
  } catch (error) {
    console.error("Login error:", error);
    return false;
  }
}

export async function logout() {
  const prefixUrl = getPrefixUrl();
  useGlobalStore.setState({ cookie: "" });

  const res = await ky.post(`${prefixUrl}/api/v2/auth/logout`, {
    headers: getHeaders(),
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`Login failed: ${res.status}`);
  }
}

export async function getTorrentsList(filter = "all") {
  const res = await ky<Torrent[]>(
    `${getPrefixUrl()}/api/v2/torrents/info?filter=${encodeURIComponent(filter)}`,
    {
      headers: getHeaders(),
    },
  );

  console.log("getTorrentsList", res);

  if (!res.ok) {
    throw new Error(`torrents/info failed: ${res.status}`);
  }

  const torrents = await res.json();

  return torrents;
}

export async function addTorrentFile(
  file: { uri: string; name: string; type?: string },
  opts?: { savepath?: string },
) {
  const form = new FormData();

  form.append("torrents", {
    uri: file.uri,
    name: file.name,
    type: file.type || "application/x-bittorrent",
  } as any);

  if (opts?.savepath) {
    form.append("savepath", opts.savepath);
  }
  const res = await ky.post(`${getPrefixUrl()}/api/v2/torrents/add`, {
    body: form,
    credentials: "include",
    headers: getHeaders(),
  });

  if (!res.ok) {
    throw new Error(`add file failed: ${res.status}`);
  }
}

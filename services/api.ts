import { useGlobalStore } from "@/hooks/useGlobalStore";
import ky from "ky";
import { Torrent } from "./types";

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
});

/**
 * Returns boolean indicating if login was successful
 */
export async function login(username: string, password: string) {
  try {
    const prefixUrl = getPrefixUrl();

    const res = await ky.post(`${prefixUrl}/api/v2/auth/login`, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      json: { username, password },
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`Login failed: ${res.status}`);
    }

    return true;
  } catch (error) {
    console.error("Login error:", error);
    return false;
  }
}

export async function getTorrentsList(filter = "all") {
  const res = await ky<Torrent[]>(
    `${getPrefixUrl()}/api/v2/torrents/info?filter=${encodeURIComponent(filter)}`,
    {
      credentials: "include",
    },
  );

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
    json: form,
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`add file failed: ${res.status}`);
  }
}

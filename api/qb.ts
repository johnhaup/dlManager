// src/api/qb.ts
const enc = (data: Record<string, string>) =>
  Object.entries(data)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");

export class QBClient {
  constructor(private baseUrl: string) {}

  private url(p: string) {
    return `${this.baseUrl.replace(/\/$/, "")}${p}`;
  }

  /**
   * Returns boolean indicating if login was successful
   */
  async login(username: string, password: string) {
    try {
      const res = await fetch(this.url("/api/v2/auth/login"), {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Referer: `${this.baseUrl}/`,
          Origin: this.baseUrl,
        },
        body: enc({ username, password }),
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

  async getTorrentsList(filter = "all") {
    const res = await fetch(
      this.url(`/api/v2/torrents/info?filter=${encodeURIComponent(filter)}`),
      {
        credentials: "include",
      },
    );

    if (!res.ok) {
      throw new Error(`torrents/info failed: ${res.status}`);
    }

    return (await res.json()) as {
      hash: string;
      name: string;
      state: string; // e.g., downloading, stalledDL, pausedDL
      progress: number; // 0..1
      dlspeed: number; // bytes/sec
      upspeed: number; // bytes/sec
      eta: number; // seconds
      size: number;
    }[];
  }

  async addMagnet(
    urlOrMagnet: string,
    opts?: { savepath?: string; category?: string },
  ) {
    const form = new FormData();
    form.append("urls", urlOrMagnet);
    if (opts?.savepath) form.append("savepath", opts.savepath);
    if (opts?.category) form.append("category", opts.category);
    const res = await fetch(this.url("/api/v2/torrents/add"), {
      method: "POST",
      body: form,
      credentials: "include",
    });
    if (!res.ok) throw new Error(`add magnet failed: ${res.status}`);
  }

  async addTorrentFile(
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
    const res = await fetch(this.url("/api/v2/torrents/add"), {
      method: "POST",
      body: form,
      credentials: "include",
    });
    if (!res.ok) throw new Error(`add file failed: ${res.status}`);
  }

  // Optional: incremental sync to reduce payload
  async syncMainData(rid: number) {
    const res = await fetch(this.url(`/api/v2/sync/maindata?rid=${rid}`), {
      credentials: "include",
    });
    if (!res.ok) throw new Error(`sync failed: ${res.status}`);
    return res.json() as Promise<{
      rid: number;
      torrents?: Record<string, any>;
      torrents_removed?: string[];
      full_update?: boolean;
    }>;
  }
}

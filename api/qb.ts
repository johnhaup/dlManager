export class QBClient {
  constructor(private baseUrl: string) {}

  private url(p: string) {
    return `${this.baseUrl.replace(/\/$/, "")}${p}`;
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
}

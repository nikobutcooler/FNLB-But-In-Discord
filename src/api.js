import { randomUUID } from "node:crypto";
const BASE = (process.env.FNLB_API_BASE || "https://api.fortnitelobbybots.com/v1").replace(/\/$/, "");
export class FnlbApiError extends Error {
  constructor(message, meta = {}) { super(message); Object.assign(this, meta); this.name = "FnlbApiError"; }
}
export class FnlbApi {
  constructor(key = process.env.FNLB_API_KEY) { if (!key) throw new Error("FNLB_API_KEY is missing."); this.key = key; }
  async request(path, { method = "GET", body, idempotent = false } = {}) {
    const headers = { Authorization: `Bearer ${this.key}`, Accept: "application/json", "Content-Type": "application/json" };
    if (idempotent && method !== "GET") headers["Idempotency-Key"] = randomUUID();
    let response;
    try { response = await fetch(BASE + path, { method, headers, body: body === undefined ? undefined : JSON.stringify(body), signal: AbortSignal.timeout(20000) }); }
    catch (e) { throw new FnlbApiError("Could not reach FNLB API: " + e.message); }
    const requestId = response.headers.get("X-Request-Id"), retryAfter = response.headers.get("Retry-After");
    const raw = await response.text(); let data = {}; try { data = raw ? JSON.parse(raw) : {}; } catch { data = { message: raw }; }
    if (!response.ok) {
      const err = data.error || data;
      throw new FnlbApiError(err.message || `HTTP ${response.status}`, { status: response.status, code: err.code || err.type, requestId: data.request_id || requestId, retryAfter, requiredScope: err.required_scope });
    }
    return { data, requestId, headers: response.headers };
  }
  async listBots() { const {data} = await this.request("/bots"); return Array.isArray(data) ? data : data.data || []; }
  async getBot(id) { const {data} = await this.request(`/bots/${encodeURIComponent(id)}`); return data.data || data; }
  async getParty(id) { const {data} = await this.request(`/bots/${encodeURIComponent(id)}/party`); return data.data || data; }
  async getFriends(id) { const {data} = await this.request(`/bots/${encodeURIComponent(id)}/friends`); return Array.isArray(data) ? data : data.data || []; }
  async power(id, action) { if (!["start","stop","restart"].includes(action)) throw Error("Invalid action"); return this.request(`/bots/${encodeURIComponent(id)}/${action}`, {method:"POST",idempotent:true}); }
  async cosmetic(id, field, value) { return this.request(`/bots/${encodeURIComponent(id)}/cosmetics`, {method:"PATCH",body:{[field]:value},idempotent:true}); }
  async partyAction(id, action, payload = {}) { return this.request(`/bots/${encodeURIComponent(id)}/party/${action}`, {method:"POST",body:payload,idempotent:true}); }
  async friendAction(id, action, payload = {}) { return this.request(`/bots/${encodeURIComponent(id)}/friends/${action}`, {method:action==="remove"?"DELETE":"POST",body:payload,idempotent:true}); }
}

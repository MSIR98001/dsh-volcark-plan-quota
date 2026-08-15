// DeepSeek Harness host-side plugin for Volcano Ark plan quota.
import { fetchArkcliSnapshot } from "./arkcli.js";

const name = "volcark-plan-quota";
const inject = ["webServer"];
const ROUTE_PATH = "/api/volcark/balance";

async function fetchSnapshot() {
  const snapshot = await fetchArkcliSnapshot();
  if (!snapshot) return null;
  return {
    configured: true,
    fetchedAt: new Date().toISOString(),
    ...snapshot,
  };
}

function apply(ctx) {
  ctx.effect(() => ctx.webServer.register({
    kind: "exact",
    path: ROUTE_PATH,
    handler: async (req, res) => {
      if (req.method !== "GET") {
        res.writeHead(405, { "content-type": "application/json" });
        res.end(JSON.stringify({ error: "method not allowed" }));
        return;
      }
      try {
        const payload = (await fetchSnapshot()) ?? {
          configured: false,
          fetchedAt: new Date().toISOString(),
          source: "arkcli",
          plan: null,
          hint: "Run: npx arkcli auth login --no-browser",
        };
        res.writeHead(200, {
          "content-type": "application/json",
          "cache-control": "no-store",
        });
        res.end(JSON.stringify(payload));
      } catch (error) {
        res.writeHead(500, {
          "content-type": "application/json",
          "cache-control": "no-store",
        });
        res.end(JSON.stringify({ error: String(error) }));
      }
    },
  }), "volcark-plan-quota route");
}

export { apply, fetchSnapshot, inject, name, ROUTE_PATH };

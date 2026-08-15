window.__ModuleLoader__.load({
	id: "dsh-volcark-plan-quota",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react_jsx_runtime = require("react/jsx-runtime");
		let react = require("react");
		//#region css
		const css = ".VolcArk_root{box-sizing:border-box;width:100%;color:var(--dsw-alias-label-secondary);border-top:1px solid var(--dsw-alias-border-l1);gap:4px;padding:6px 10px;font-size:12px;line-height:18px;display:flex;flex-direction:column}.VolcArk_head{min-width:0;align-items:center;gap:6px;display:flex}.VolcArk_compact{min-height:32px;flex-direction:column;justify-content:center;gap:2px;padding:4px 2px;text-align:center;border-top:1px solid var(--dsw-alias-border-l1);color:var(--dsw-alias-label-tertiary);font-size:10px;line-height:14px;display:flex}.VolcArk_label{color:var(--dsw-alias-label-tertiary);flex:none}.VolcArk_title{color:var(--dsw-alias-label-primary);font-weight:600;flex:none}.VolcArk_row{min-width:0;align-items:center;gap:6px;display:flex;padding:1px 4px;margin:0 -4px;border-radius:5px}.VolcArk_pname{width:52px;flex:none;color:var(--dsw-alias-label-tertiary);font-size:11px}.VolcArk_pct{width:34px;flex:none;text-align:right;color:var(--dsw-alias-label-primary);font-family:var(--ds-font-family-code);font-weight:600}.VolcArk_value{min-width:0;color:var(--dsw-alias-label-secondary);font-family:var(--ds-font-family-code);white-space:nowrap;text-overflow:ellipsis;overflow:hidden;flex:none}.VolcArk_unset{color:var(--dsw-alias-state-warn-primary)}.VolcArk_err{color:var(--dsw-alias-state-error-primary)}.VolcArk_bar{flex:1;height:7px;border-radius:4px;background:var(--dsw-alias-interactive-bg-hover);box-shadow:inset 0 0 0 1px var(--dsw-alias-border-l2);overflow:hidden}.VolcArk_barFill{display:block;height:100%;border-radius:4px;width:0;transition:width .5s ease}.VolcArk_lv-ok .VolcArk_barFill{background:var(--dsw-alias-state-success-primary)}.VolcArk_lv-warn .VolcArk_barFill{background:var(--dsw-alias-state-warn-primary)}.VolcArk_lv-alert .VolcArk_barFill{background:var(--dsw-alias-state-warn-primary);background:color-mix(in srgb,var(--dsw-alias-state-warn-primary) 42%,var(--dsw-alias-state-error-primary))}.VolcArk_lv-danger .VolcArk_barFill{background:var(--dsw-alias-state-error-primary)}.VolcArk_compact .VolcArk_bar{width:100%;flex:none;height:6px}.VolcArk_sub{min-width:0;color:var(--dsw-alias-label-tertiary);font-size:11px;white-space:nowrap;text-overflow:ellipsis;overflow:hidden}.VolcArk_barFill.VolcArk_barFill.VolcArk_fill-ok{background-color:#22c55e}.VolcArk_barFill.VolcArk_fill-warn{background-color:#f59e0b}.VolcArk_barFill.VolcArk_fill-alert{background-color:#f97316}.VolcArk_barFill.VolcArk_fill-danger{background-color:#ef4444}";
		const tagId = "dsh-volcark-plan-quota/VolcArkBalance.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-volcark-plan-quota";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		//#endregion
		//#region locale
		const zh = {
			"label": "方舟余量",
			"unset": "未配置",
			"unset.hint": "SSO 未登录或未配置凭据",
			"error": "查询失败",
			"loading": "加载中…",
			"title.live": "已更新 {time}",
			"period.5h": "5小时",
			"period.weekly": "本周",
			"period.monthly": "本月",
			"period.session": "会话",
			"used.total": "已用 {used} / {total}",
			"remaining": "剩余 {n}",
			"reset": "重置 {time}",
			"no.plan": "暂无额度"
		};
		const en = {
			"label": "Ark Quota",
			"unset": "Not configured",
			"unset.hint": "SSO not logged in or no credentials",
			"error": "Fetch failed",
			"loading": "Loading…",
			"title.live": "Updated {time}",
			"period.5h": "5h",
			"period.weekly": "weekly",
			"period.monthly": "monthly",
			"period.session": "session",
			"used.total": "{used} / {total} used",
			"remaining": "{n} left",
			"reset": "reset {time}",
			"no.plan": "No plan"
		};
		//#endregion
		//#region component
		/**
		 * Format a decimal string/number compactly: 1234 -> "1.2K".
		 * @param value - numeric value.
		 * @returns compact string.
		 */
		function formatCompact(value) {
			const num = Number(value);
			if (!Number.isFinite(num)) return String(value ?? "-");
			const abs = Math.abs(num);
			if (abs >= 1e9) return (num / 1e9).toFixed(2).replace(/\.?0+$/, "") + "B";
			if (abs >= 1e6) return (num / 1e6).toFixed(2).replace(/\.?0+$/, "") + "M";
			if (abs >= 1e3) return (num / 1e3).toFixed(1).replace(/\.?0+$/, "") + "K";
			return String(Math.round(num));
		}
		/**
		 * Poll the balance endpoint once.
		 * @returns the parsed JSON payload.
		 */
		async function fetchBalance() {
			const res = await fetch("/api/volcark/balance", { headers: { accept: "application/json" } });
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			return res.json();
		}
		/**
		 * Map a period label to a translated short name.
		 * @param label - raw period label (5h/weekly/monthly/session).
		 * @param t - translator.
		 * @returns translated label.
		 */
		function periodName(label, t) {
			const key = "period." + String(label);
			const mapped = t(key);
			return mapped === key ? String(label) : mapped;
		}
		/**
		 * Build the per-period quota rows for one plan product (agent-plan).
		 * Each period becomes a row: name | percent | progress bar | used/total.
		 * @param item - plan item.
		 * @param t - translator.
		 * @returns array of React elements.
		 */
		function periodRows(item, t) {
			const out = [];
			if (!item || !Array.isArray(item.periods) || item.periods.length === 0) return out;
			for (const p of item.periods) {
				const pct = Number(p.percent ?? 0);
				const hasUsed = typeof p.used === "number" && typeof p.total === "number";
				const remaining = hasUsed ? p.total - p.used : null;
				const usedTotal = hasUsed ? t("used.total", { used: formatCompact(p.used), total: formatCompact(p.total) }) : "";
				const tooltipParts = [t("period." + p.label) || p.label];
				if (hasUsed) tooltipParts.push(t("used.total", { used: formatCompact(p.used), total: formatCompact(p.total) }), t("remaining", { n: formatCompact(remaining) }));
				if (p.reset_at) tooltipParts.push(t("reset", { time: p.reset_at }));
				const level = pct >= 90 ? "danger" : pct >= 70 ? "alert" : pct >= 50 ? "warn" : "ok";
				const rowCls = "VolcArk_row VolcArk_lv-" + level;
				out.push((0, react_jsx_runtime.jsxs)("span", { className: rowCls, title: tooltipParts.join(" · "), children: [
					(0, react_jsx_runtime.jsx)("span", { className: "VolcArk_pname", children: periodName(p.label, t) }),
					(0, react_jsx_runtime.jsx)("span", { className: "VolcArk_pct", children: `${Math.round(pct)}%` }),
					(0, react_jsx_runtime.jsx)("span", { className: "VolcArk_bar", children: (0, react_jsx_runtime.jsx)("span", { className: "VolcArk_barFill VolcArk_fill-" + level, style: { width: Math.min(100, pct) + "%" } }) }),
					hasUsed ? (0, react_jsx_runtime.jsx)("span", { className: "VolcArk_sub", children: usedTotal }) : null
				] }));
			}
			return out;
		}
		/**
		 * Build the full plan section for the wide sidebar.
		 * Agent Plan gets per-period detail; other products get a compact row.
		 * @param plan - plan payload from the snapshot.
		 * @param t - translator.
		 * @returns array of React elements.
		 */
		function planSection(plan, t) {
			const items = plan && !plan.error && Array.isArray(plan.items) ? plan.items : [];
			const subscribed = items.filter((i) => i.periods && i.periods.length > 0);
			if (subscribed.length === 0) {
				return [(0, react_jsx_runtime.jsx)("span", { className: "VolcArk_label", children: t("no.plan") })];
			}
			const out = [];
			for (const item of subscribed) {
				const isAgent = String(item.product).includes("agent");
				const tier = item.tier ? ` · ${item.tier}` : "";
				if (isAgent) {
					out.push((0, react_jsx_runtime.jsxs)("span", { className: "VolcArk_head", children: [
						(0, react_jsx_runtime.jsx)("span", { className: "VolcArk_title", children: "Agent Plan" }),
						(0, react_jsx_runtime.jsx)("span", { className: "VolcArk_label", children: tier })
					] }));
					out.push(...periodRows(item, t));
				} else {
					let max = null;
					for (const p of item.periods) {
						if (typeof p.percent === "number" && (!max || p.percent > max.percent)) max = p;
					}
					const pct = max ? Math.round(max.percent) : 0;
					const level = pct >= 90 ? "danger" : pct >= 70 ? "alert" : pct >= 50 ? "warn" : "ok";
					const tooltip = item.periods.map((p) => `${periodName(p.label, t)}: ${Math.round(p.percent ?? 0)}%${p.reset_at ? " · " + t("reset", { time: p.reset_at }) : ""}`).join("\n");
					out.push((0, react_jsx_runtime.jsxs)("span", { className: "VolcArk_row VolcArk_lv-" + level, title: tooltip, children: [
						(0, react_jsx_runtime.jsx)("span", { className: "VolcArk_pname", children: "Coding" }),
						(0, react_jsx_runtime.jsx)("span", { className: "VolcArk_pct", children: `${pct}%` }),
						(0, react_jsx_runtime.jsx)("span", { className: "VolcArk_bar", children: (0, react_jsx_runtime.jsx)("span", { className: "VolcArk_barFill VolcArk_fill-" + level, style: { width: Math.min(100, pct) + "%" } }) })
					] }));
				}
			}
			return out;
		}
		/**
		 * Sidebar footer entry showing the Volcano Ark plan quota (Agent/Coding
		 * plan subscription remaining), refreshed on an interval.
		 * @param props - `wide` (sidebar expanded) plus the locale translator.
		 * @returns the quota widget or null while never configured.
		 */
		function VolcArkBalance({ wide, t }) {
			const [snapshot, setSnapshot] = (0, react.useState)(null);
			const [state, setState] = (0, react.useState)("loading");
			(0, react.useEffect)(() => {
				let alive = true;
				let timer = null;
				const load = async () => {
					try {
						const data = await fetchBalance();
						if (!alive) return;
						setSnapshot(data);
						setState(data.configured ? "ok" : "unset");
					} catch (error) {
						if (!alive) return;
						setState("error");
						setSnapshot(null);
					}
				};
				load();
				timer = setInterval(load, 60000);
				return () => {
					alive = false;
					if (timer !== null) clearInterval(timer);
				};
			}, []);
			const label = t("label");
			if (state === "loading") {
				return wide
					? (0, react_jsx_runtime.jsxs)("div", { className: "VolcArk_root", title: label, children: [
						(0, react_jsx_runtime.jsx)("span", { className: "VolcArk_label", children: label }),
						(0, react_jsx_runtime.jsx)("span", { className: "VolcArk_value", children: t("loading") })
					] })
					: (0, react_jsx_runtime.jsx)("div", { className: "VolcArk_compact", title: label, children: "…" });
			}
			if (state === "unset" || snapshot === null) {
				const hint = state === "unset" ? t("unset.hint") : t("error");
				return wide
					? (0, react_jsx_runtime.jsxs)("div", { className: "VolcArk_root", title: hint, children: [
						(0, react_jsx_runtime.jsx)("span", { className: "VolcArk_label", children: label }),
						(0, react_jsx_runtime.jsx)("span", { className: "VolcArk_unset", children: state === "unset" ? t("unset") : t("error") })
					] })
					: (0, react_jsx_runtime.jsx)("div", { className: "VolcArk_compact", title: hint, children: state === "unset" ? "—" : "!" });
			}
			const title = snapshot.fetchedAt ? t("title.live", { time: snapshot.fetchedAt.slice(11, 19) }) : label;
			// arkcli source: plan quotas only (no free quota).
			if (snapshot.source === "arkcli") {
				const items = snapshot.plan && !snapshot.plan.error && Array.isArray(snapshot.plan.items) ? snapshot.plan.items : [];
				const subscribed = items.filter((i) => i.periods && i.periods.length > 0);
				const agent = subscribed.find((i) => String(i.product).includes("agent"));
				// Compact (collapsed sidebar): label + the agent plan's most
				// used period as a mini bar with color fill.
				if (!wide) {
					let max = null;
					const src = agent || subscribed[0];
					if (src) {
						for (const p of src.periods) {
							if (typeof p.percent === "number" && (!max || p.percent > max.percent)) max = p;
						}
					}
					const pct = max ? Math.round(max.percent) : 0;
					const level = pct >= 90 ? "danger" : pct >= 70 ? "alert" : pct >= 50 ? "warn" : "ok";
					return (0, react_jsx_runtime.jsxs)("div", { className: "VolcArk_compact", title, children: [
						(0, react_jsx_runtime.jsx)("span", { className: "VolcArk_valueStrong", children: `${pct}%` }),
						(0, react_jsx_runtime.jsx)("span", { className: "VolcArk_bar VolcArk_lv-" + level, children: (0, react_jsx_runtime.jsx)("span", { className: "VolcArk_barFill VolcArk_fill-" + level, style: { width: Math.min(100, pct) + "%" } }) })
					] });
				}
				const rows = planSection(snapshot.plan, t);
				return (0, react_jsx_runtime.jsx)("div", { className: "VolcArk_root", title, children: [
					(0, react_jsx_runtime.jsx)("span", { className: "VolcArk_head", children:
						(0, react_jsx_runtime.jsx)("span", { className: "VolcArk_label", children: label })
					}),
					rows
				] });
			}
			// billing source fallback (legacy): keep a single-line display.
			const balance = snapshot.balance;
			const balanceOk = balance && !balance.error;
			const available = balanceOk ? Number(balance.availableBalance ?? 0) : null;
			const display = balanceOk && available !== null ? `¥${available.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : t("unset");
			return wide
				? (0, react_jsx_runtime.jsxs)("div", { className: "VolcArk_root", title, children: [
					(0, react_jsx_runtime.jsx)("span", { className: "VolcArk_label", children: label }),
					(0, react_jsx_runtime.jsx)("span", { className: "VolcArk_value VolcArk_valueStrong", children: display })
				] })
				: (0, react_jsx_runtime.jsxs)("div", { className: "VolcArk_compact", title, children: [
					(0, react_jsx_runtime.jsx)("span", { children: label }),
					(0, react_jsx_runtime.jsx)("span", { className: "VolcArk_valueStrong", children: display })
				] });
		}
		//#endregion
		//#region apply
		const inject = ["slots", "locale"];
		/**
		 * Client plugin body: register dictionaries and the sidebar footer action.
		 * @param ctx - client root context.
		 */
		function apply(ctx) {
			ctx.effect(() => ctx.locale.register("volcark", {
				zh,
				en
			}), "ui-volcark: dictionaries");
			ctx.slots.inject("sidebar.footer.action", () => ctx.slots.register({
				name: "sidebar.footer.action",
				id: "volcark-balance",
				order: 40,
				locale: "volcark"
			}, VolcArkBalance));
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

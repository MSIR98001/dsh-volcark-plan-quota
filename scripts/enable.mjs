import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";

const dshHome = process.env.DSH_HOME || join(homedir(), ".dsh");
const patchFile = process.env.DSH_WEB_PATCH || join(dshHome, "profiles", "web", "cordis.patch.yml");
const begin = "# BEGIN dsh-volcark-plan-quota";
const end = "# END dsh-volcark-plan-quota";
const block = `${begin}\n- insert:\n    - id: volcark-plan-quota\n      name: 'dsh-volcark-plan-quota'\n      config: {}\n${end}\n`;

mkdirSync(dirname(patchFile), { recursive: true });
let content = existsSync(patchFile) ? readFileSync(patchFile, "utf8") : "";
if (content.includes(begin) || content.includes("name: 'dsh-volcark-plan-quota'") || content.includes('name: "dsh-volcark-plan-quota"')) {
  console.log(`Already enabled in ${patchFile}`);
  process.exit(0);
}
if (content.trim() === "[]") content = "";
if (content && !content.endsWith("\n")) content += "\n";
writeFileSync(patchFile, content + (content ? "\n" : "") + block);
console.log(`Enabled dsh-volcark-plan-quota in ${patchFile}`);
console.log("Restart the DeepSeek Harness web service, then refresh the page.");

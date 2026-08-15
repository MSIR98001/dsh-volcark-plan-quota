import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const dshHome = process.env.DSH_HOME || join(homedir(), ".dsh");
const patchFile = process.env.DSH_WEB_PATCH || join(dshHome, "profiles", "web", "cordis.patch.yml");
const begin = "# BEGIN dsh-volcark-plan-quota";
const end = "# END dsh-volcark-plan-quota";

if (!existsSync(patchFile)) {
  console.log(`Nothing to disable: ${patchFile} does not exist.`);
  process.exit(0);
}
let content = readFileSync(patchFile, "utf8");
const start = content.indexOf(begin);
const finish = content.indexOf(end, start);
if (start < 0 || finish < 0) {
  console.log(`Managed plugin block not found in ${patchFile}; no changes made.`);
  process.exit(0);
}
const before = content.slice(0, start).replace(/\n{3,}$/, "\n\n");
const after = content.slice(finish + end.length).replace(/^\n{2,}/, "\n");
content = (before + after).trimEnd() + "\n";
writeFileSync(patchFile, content || "[]\n");
console.log(`Disabled dsh-volcark-plan-quota in ${patchFile}`);
console.log("Restart the DeepSeek Harness web service, then refresh the page.");

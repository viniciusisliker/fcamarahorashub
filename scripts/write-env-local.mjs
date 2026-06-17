import { execSync } from "child_process";
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const raw = execSync(
  "npx supabase@2.106.0 projects api-keys --project-ref kjfwstmxldxbbuwmjtji -o json",
  { encoding: "utf8", cwd: root }
);
const jsonStart = raw.indexOf("[");
const keys = JSON.parse(raw.slice(jsonStart));
const anon = keys.find((k) => k.id === "anon")?.api_key;
const service = keys.find((k) => k.id === "service_role")?.api_key;

if (!anon || !service) {
  console.error("Chaves Supabase não encontradas. Faça login: npx supabase login");
  process.exit(1);
}

writeFileSync(
  join(root, ".env.local"),
  [
    "NEXT_PUBLIC_SUPABASE_URL=https://kjfwstmxldxbbuwmjtji.supabase.co",
    `NEXT_PUBLIC_SUPABASE_ANON_KEY=${anon}`,
    `SUPABASE_SERVICE_ROLE_KEY=${service}`,
    "NEXT_PUBLIC_DATA_SOURCE=supabase",
    "NEXT_PUBLIC_USE_MOCK_DATA=false",
    "NEXT_PUBLIC_SITE_URL=https://ftimesheethub.vercel.app",
    "",
  ].join("\n"),
  "utf8"
);

console.log(".env.local atualizado.");

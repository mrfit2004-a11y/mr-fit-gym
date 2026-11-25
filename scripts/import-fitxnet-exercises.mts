/**
 * Imports the Fitxnet exercise videos (public/exercises/fitxnet/*.mp4) as
 * SYSTEM exercises with a self-hosted videoUrl. Idempotent (externalId upsert).
 *
 * Run with:  npx tsx scripts/import-fitxnet-exercises.mts
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { execFileSync } from "node:child_process";

const env = readFileSync(resolve(process.cwd(), ".env.local"), "utf-8");
for (const line of env.split("\n")) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
  if (!m || m[1] in process.env) continue;
  process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
}


function resolveDirectUriFallback(srvUri: string): string | null {
  const m = srvUri.match(/^mongodb\+srv:\/\/([^@]+)@([^/?]+)\/?([^?]*)(\?.*)?$/);
  if (!m) return null;
  const [, userinfo, host, db, query] = m;
  try {
    const srvOut = execFileSync("nslookup", ["-type=SRV", `_mongodb._tcp.${host}`], { encoding: "utf-8" });
    const hosts = [...srvOut.matchAll(/svr hostname\s*=\s*(\S+)/g)].map((x) => `${x[1]}:27017`);
    if (hosts.length === 0) return null;
    const txtOut = execFileSync("nslookup", ["-type=TXT", host], { encoding: "utf-8" });
    const txtMatch = txtOut.match(/"([^"]+)"/);
    const txtOptions = txtMatch ? txtMatch[1] : "";
    const params = new URLSearchParams((query ?? "?").replace(/^\?/, ""));
    params.set("ssl", "true");
    if (!params.has("retryWrites")) params.set("retryWrites", "true");
    if (!params.has("w")) params.set("w", "majority");
    const merged = `${txtOptions}${txtOptions ? "&" : ""}${params.toString()}`;
    return `mongodb://${userinfo}@${hosts.join(",")}/${db}?${merged}`;
  } catch {
    return null;
  }
}

if (process.env.MONGODB_URI?.startsWith("mongodb+srv://")) { const d = resolveDirectUriFallback(process.env.MONGODB_URI); if (d) process.env.MONGODB_URI = d; }
type Row = [file: string, nameEn: string, category: string, muscles: string];
const rows = JSON.parse(readFileSync(resolve("scripts/data/fitxnet-exercises.json"), "utf-8")) as Row[];

const { connectToDatabase } = await import("@/lib/db");
const { Exercise } = await import("@/models/Exercise");
await connectToDatabase();

let created = 0, updated = 0;
for (const [file, nameEn, category, muscles] of rows) {
  const slug = nameEn.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const nameAr = file.split("/").pop()!.replace(/\.mp4$/, "");
  const res = await Exercise.updateOne(
    { importSource: "fitxnet", externalId: `fitxnet-${slug}` },
    {
      $set: {
        nameAr, nameEn, category,
        targetMuscles: muscles.split(","),
        videoUrl: `/exercises/fitxnet/${slug}.mp4`,
        isSystemExercise: true,
        createdByCoach: null,
        importSource: "fitxnet",
        externalId: `fitxnet-${slug}`,
      },
    },
    { upsert: true },
  );
  if (res.upsertedCount) created++; else if (res.modifiedCount) updated++;
}
console.log({ total: rows.length, created, updated });
process.exit(0);

// Self-hosts course thumbnails: downloads any remote thumbnail in src/data/courses.json
// to public/courses/<id>.jpg (the 750px version when Udemy has it) and points the JSON at it.
import { readFile, writeFile, mkdir } from "node:fs/promises";

const file = "src/data/courses.json";
const courses = JSON.parse(await readFile(file, "utf8"));
await mkdir("public/courses", { recursive: true });

for (const c of courses) {
  if (!c.thumbnail?.startsWith("http")) continue;
  const candidates = [c.thumbnail.replace("/480x270/", "/750x422/"), c.thumbnail];
  let saved = false;
  for (const url of candidates) {
    const res = await fetch(url);
    console.log(`${res.status} ${url}`);
    if (!res.ok || !res.headers.get("content-type")?.startsWith("image/")) continue;
    await writeFile(`public/courses/${c.id}.jpg`, Buffer.from(await res.arrayBuffer()));
    c.thumbnail = `/courses/${c.id}.jpg`;
    saved = true;
    break;
  }
  if (!saved) console.warn(`kept remote thumbnail for ${c.id}`);
}
await writeFile(file, JSON.stringify(courses, null, 2) + "\n");

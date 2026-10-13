// Pulls Aman's public Udemy catalogue (courses, thumbnails, a few real reviews)
// into src/data and public/courses. Run by .github/workflows/sync-courses.yml;
// the site never calls Udemy at runtime.
import { mkdir, writeFile, readdir, unlink } from "node:fs/promises";
import { existsSync } from "node:fs";

const INSTRUCTOR_ID = 21150568;
const API = "https://www.udemy.com/api-2.0";
const THUMB_DIR = "public/courses";
const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36",
  Accept: "application/json, text/plain, */*",
  Referer: "https://www.udemy.com/user/amandeep-singh-sawhney/",
};

async function getJson(url) {
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res.json();
}

const courseFields = [
  "id", "title", "url", "headline", "image_750x422", "num_subscribers",
  "avg_rating", "rating", "num_reviews", "content_info", "num_published_lectures",
  "instructional_level", "published_time", "last_update_date", "is_paid",
  "primary_category", "primary_subcategory", "locale",
].join(",");

async function fetchCourses() {
  const courses = [];
  let url = `${API}/users/${INSTRUCTOR_ID}/taught-profile-courses/?page_size=50&fields[course]=${courseFields}&fields[course_category]=title&fields[course_subcategory]=title&fields[locale]=english_title`;
  while (url) {
    const page = await getJson(url);
    courses.push(...page.results);
    url = page.next;
  }
  return courses;
}

async function fetchReviews(courseId) {
  const url = `${API}/courses/${courseId}/reviews/?page_size=40&ordering=-created&fields[course_review]=content,rating,created,user&fields[user]=display_name`;
  try {
    return (await getJson(url)).results ?? [];
  } catch (err) {
    console.warn(`reviews skipped for ${courseId}: ${err.message}`);
    return [];
  }
}

async function downloadThumb(course) {
  const src = course.image_750x422;
  if (!src) return null;
  const file = `${course.id}.jpg`;
  const res = await fetch(src, { headers: HEADERS });
  if (!res.ok) throw new Error(`thumbnail ${res.status} for ${course.id}`);
  await writeFile(`${THUMB_DIR}/${file}`, Buffer.from(await res.arrayBuffer()));
  return `/courses/${file}`;
}

const raw = await fetchCourses();
if (raw.length === 0) throw new Error("Udemy returned no courses; refusing to wipe the catalogue");
console.log(`fetched ${raw.length} courses`);

await mkdir(THUMB_DIR, { recursive: true });
await mkdir("src/data", { recursive: true });

const courses = [];
const reviews = [];
for (const c of raw) {
  courses.push({
    id: c.id,
    title: c.title,
    url: `https://www.udemy.com${c.url}`,
    headline: c.headline ?? "",
    thumbnail: await downloadThumb(c),
    students: c.num_subscribers ?? 0,
    rating: Math.round((c.avg_rating ?? c.rating ?? 0) * 10) / 10,
    reviews: c.num_reviews ?? 0,
    duration: c.content_info ?? "",
    lectures: c.num_published_lectures ?? 0,
    level: c.instructional_level ?? "",
    category: c.primary_category?.title ?? "",
    subcategory: c.primary_subcategory?.title ?? "",
    language: c.locale?.english_title ?? "",
    published: c.published_time ?? "",
    updated: c.last_update_date ?? "",
  });
  // Real, public student reviews only: 5 stars and long enough to say something.
  for (const r of await fetchReviews(c.id)) {
    const text = (r.content ?? "").trim();
    if (r.rating === 5 && text.length >= 120 && text.length <= 420) {
      reviews.push({ course: c.id, name: r.user?.display_name ?? "Udemy student", text, created: r.created });
    }
  }
}

// Drop thumbnails of courses that are no longer published.
const keep = new Set(courses.map((c) => `${c.id}.jpg`));
for (const f of existsSync(THUMB_DIR) ? await readdir(THUMB_DIR) : []) {
  if (f.endsWith(".jpg") && !keep.has(f)) await unlink(`${THUMB_DIR}/${f}`);
}

courses.sort((a, b) => b.students - a.students);
await writeFile("src/data/courses.json", JSON.stringify(courses, null, 2) + "\n");
await writeFile("src/data/reviews.json", JSON.stringify(reviews, null, 2) + "\n");
console.log(`wrote ${courses.length} courses, ${reviews.length} candidate reviews`);

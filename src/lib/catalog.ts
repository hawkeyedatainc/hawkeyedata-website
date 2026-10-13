import courseData from "@/data/courses.json";
import reviewData from "@/data/reviews.json";

export type Course = {
  id: number;
  title: string;
  url: string;
  headline: string;
  thumbnail: string | null;
  students: number;
  rating: number;
  reviews: number;
  duration: string;
  language: string;
  practiceTests?: boolean;
};

export type Review = { course: number; name: string; text: string };

export type Track = {
  slug: string;
  name: string;
  blurb: string;
  /** Lower-case fragments matched against the course title. First matching track wins. */
  match: string[];
};

// Order matters: a course lands in the first track whose keywords match its title.
export const TRACKS: Track[] = [
  {
    slug: "ai",
    name: "AI at work",
    blurb: "Microsoft Copilot for analysis, data engineering and email, plus the Azure AI Fundamentals exam.",
    match: [
      "copilot",
      "chatgpt",
      "claude",
      "gemini",
      "generative",
      "genai",
      "gen ai",
      " ai ",
      "ai-",
      "ai for",
      "prompt",
      "llm",
      " agents",
    ],
  },
  {
    slug: "cloud",
    name: "Cloud certifications",
    blurb: "Pass AWS, Microsoft Azure and Oracle Cloud exams with full courses and realistic practice tests.",
    match: ["aws", "azure", "az-", "dp-900", "google cloud", "gcp", "cloud practitioner", "cloud"],
  },
  {
    slug: "analytics",
    name: "Analytics & BI",
    blurb: "Turn data into decisions with Power BI and Tableau, from first dashboard to certified analyst.",
    match: ["power bi", "pl-300", "tableau", "excel", "analyst", "analytics", "visuali", "dashboard"],
  },
  {
    slug: "engineering",
    name: "Data engineering",
    blurb: "SQL and enterprise ETL with IBM DataStage: the pipelines every report depends on.",
    match: [
      "sql",
      "snowflake",
      "databricks",
      "fabric",
      "datastage",
      "etl",
      "informatica",
      "dbt",
      "spark",
      "warehouse",
      "lakehouse",
      "data engineer",
      "dp-",
    ],
  },
  {
    slug: "code",
    name: "Code & APIs",
    blurb: "APIs from scratch, and the programming foundations behind modern data work.",
    match: ["python", "api", "programming", "javascript"],
  },
];

const OTHER: Track = { slug: "more", name: "More courses", blurb: "Everything else in the catalogue.", match: [] };

export const courses = (courseData as Course[]).slice().sort((a, b) => b.students - a.students);
export const reviews = reviewData as Review[];

export function trackOf(course: Course): Track {
  const title = ` ${course.title.toLowerCase()} `;
  return TRACKS.find((t) => t.match.some((m) => title.includes(m))) ?? OTHER;
}

export const tracks = [...TRACKS, OTHER]
  .map((track) => ({ ...track, courses: courses.filter((c) => trackOf(c).slug === track.slug) }))
  .filter((t) => t.courses.length > 0);

/** Exam codes named in a title, e.g. PL-300, AZ-900, CLF-C02. */
export function examCodes(title: string): string[] {
  return [...new Set(title.toUpperCase().match(/\b(?:[A-Z]{2,3}-\d{3}|[A-Z]{3}-C\d{2})\b/g) ?? [])];
}

export const totals = {
  courses: courses.length,
  students: courses.reduce((n, c) => n + c.students, 0),
  reviews: courses.reduce((n, c) => n + c.reviews, 0),
};

// Profile-level figures as Udemy shows them (2026-10). The per-course sums above can lag behind.
export const PROFILE = {
  name: "Amandeep Sawhney",
  udemyUrl: "https://www.udemy.com/user/amandeep-singh-sawhney/",
  learners: 176_488,
  reviews: 24_423,
};

export const EMAIL = "learn@hawkeyedata.ca";

export const fmt = (n: number) => new Intl.NumberFormat("en-US").format(n);
export const compact = (n: number) =>
  new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 0 }).format(n);

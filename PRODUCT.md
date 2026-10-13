# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
- Working professionals and career switchers preparing for data, cloud and AI certifications (AWS, Azure, Oracle Cloud, Power BI, Tableau and similar) or learning a tool for their job. They usually arrive from Udemy, search or a shared link and want to see which course fits them and whether the instructor is credible.
- Companies looking for corporate training or data/AI consulting, who need to see breadth, credibility and a way to get in touch.

## Product Purpose
HawkEye Data Solutions is Amandeep (Aman) Sawhney's company. The site sells his Udemy courses, establishes HawkEye Data as a credible presence, and brings in consulting and corporate training work. Success means a visitor finds the right course and clicks through to Udemy, or gets in touch about training or consulting.

## Positioning
One practitioner-instructor (a data scientist and CEO who has cleared many certifications) with a large catalogue across data, cloud and AI, taught to more than 176,000 learners on Udemy. Students know him for "making complex topics simple to understand."

## Capabilities and Constraints
- A static site on GitHub Pages at hawkeyedata.ca (CNAME must be kept), built with Vite + React + TypeScript + Tailwind.
- Course data lives in src/data/courses.json. It was collected from public Udemy course pages, and scripts/sync-courses.mjs can refresh it from a normal computer. Udemy blocks automated jobs, so it can't run in CI. The browser never calls Udemy.
- Contact: learn@hawkeyedata.ca. There is no backend, so contact goes through email.

## Brand Commitments
- Name: HawkEye Data Solutions (short form "HawkEye Data").
- The logo is a gold circuit-board hawk with rounded monoline lettering on deep violet. Violet and gold are the brand colours.

## Evidence on Hand
- Udemy profile stats: about 176k learners and 24k reviews. Per-course students, ratings and review counts are in src/data/courses.json (collected 2026-10-13).
- Real student reviews: none collected yet. The old site's testimonials were invented and must not be reused. Use only reviews Aman supplies or that come from Udemy.
- Absent: named corporate clients, case studies and consulting outcomes. Do not invent them.

## Product Principles
1. Every claim is real: numbers come from Udemy and quotes from real reviews.
2. A visitor reaches the right course in seconds, grouped by goal rather than listed as one wall.
3. Courses, corporate training and consulting are three doors on one credible practice.
4. The catalogue is data, not markup: adding a course means editing one JSON file or re-running the sync script.

## Accessibility & Inclusion
WCAG 2.2 AA. Every animation respects prefers-reduced-motion.

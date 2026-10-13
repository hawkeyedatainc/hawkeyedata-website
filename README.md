# hawkeyedata.ca

The HawkEye Data Solutions website: Amandeep Sawhney's courses, corporate training and consulting.

Vite + React + TypeScript + Tailwind. Every route is pre-rendered to static HTML at build time and hydrated in the browser, so it's served as a static site from GitHub Pages.

## Develop

```sh
npm ci
npm run dev      # http://localhost:8080
npm run build    # type-check, build, pre-render every route into dist/
npm run preview  # serve dist/
```

## Deploy

Every push to `main` runs `.github/workflows/deploy.yml`. It lints, builds and publishes `dist/` to the `gh-pages` branch, which GitHub Pages serves at hawkeyedata.ca (`public/CNAME`). Pull requests run the same build without publishing.

## Courses

The catalogue is `src/data/courses.json`, and thumbnails are self-hosted in `public/courses/<id>.jpg`. The site never calls Udemy at runtime.

- **Add or edit a course by hand:** edit the JSON and set `thumbnail` to the course's Udemy image URL, then run `node scripts/fetch-thumbnails.mjs` to download it into `public/courses`.
- **Refresh everything from Udemy:** run `npx playwright install chromium && npm run sync:courses` on your own computer. It opens a browser window, because Udemy blocks headless browsers and cloud servers, including GitHub Actions.

Courses are grouped into tracks by keywords in their titles (`TRACKS` in `src/lib/catalog.ts`). A new track or keyword is a one-line change.

Student reviews go in `src/data/reviews.json` as `{ course, name, text }`, using real reviews only. The home page's review section stays hidden until there are at least three.

## Design

`PRODUCT.md` holds the product brief used with the Impeccable design skill. The hawk mark in `src/components/hawk-paths.ts` is traced from the original logo artwork, so it can animate and scale cleanly.

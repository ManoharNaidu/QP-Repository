# QP Repository — Frontend

React + Tailwind CSS frontend for uploading, searching and downloading question papers.

## Quick start

```bash
cd question-paper-frontend
npm install
npm start
```

Build for production:

```bash
npm run build
```

## Features & UI notes

- Upload page with `module` selector (Base / Bachelor / Master) and client validation for `courseCode` (2 letters + 5 digits).
- Download page supports filtering by `module`, `branch`, academic year, year, cycle and semester.
- Year dropdowns are shown in descending order; when `module` is `Base` the academic-year options are limited to 1st and 2nd.

## Developer notes

- The UI enforces course code format on submit; the backend also validates the same pattern. Normalize to uppercase before sending to the server when possible.
- Animations use `framer-motion` and small `gsap` helpers in `Layout.js`.

## API

The frontend communicates with the backend's API endpoints. By default the app assumes the API is reachable at the same origin; if your backend runs on another host, set a proxy or use environment variables to point at the API.

Key endpoints used by the frontend:

- `POST /api/upload` — multipart/form-data to upload files and metadata.
- `GET /api/download` — query params to search for papers.

## Dependencies & cleanup

- Core runtime dependencies: `react`, `react-dom`, `react-router-dom`, `axios`, `framer-motion`, `gsap`, `clsx`, `tailwind-merge`.
- Developer utilities (testing, linting) exist in `devDependencies` and may be trimmed depending on your CI requirements. Use `npx depcheck` to identify unused packages and review results before removing.

## Rebuild notes

- There's a `build/` folder with previous compiled assets. After changing styles or Tailwind config, run `npm run build` to regenerate production assets.

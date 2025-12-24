# Backend for Question Paper Upload and Download App

Express backend that streams uploaded PDF question papers to Cloudinary and stores metadata in MongoDB.

## Quick facts

- Language: Node.js (ES modules)
- Framework: Express
- Storage: Cloudinary (raw resource for PDFs)
- Database: MongoDB (Mongoose)

## Environment variables

Create a `.env` file in the backend folder with the following keys (examples):

- `MONGO_URI` — MongoDB connection string used by `config/mongodb.config.js`.
- `CLOUDINARY_CLOUD_NAME` — Cloudinary cloud name.
- `CLOUDINARY_API_KEY` — Cloudinary API key.
- `CLOUDINARY_API_SECRET` — Cloudinary API secret.
- `ARCJET_KEY` — Arcjet site key (used by `config/arcject.config.js`) — optional but recommended for protection.
- `PORT` — Server port (defaults to `5000`).

## Install & run

```bash
cd question-paper-backend
npm install
# development (requires nodemon)
npm run dev
# production
npm start
```

## Main files

- `server.js` — Express app and routes (`/api/upload`, `/api/download`, `/api/feedback`).
- `models/QuestionPaper.js` — Mongoose schema for question papers (includes `module` and `courseCode` validation).
- `models/Feedback.js` — Simple feedback model.
- `config/mongodb.config.js` — MongoDB connection (reads `MONGO_URI`).
- `config/arcject.config.js` — Arcjet configuration (reads `ARCJET_KEY`).

## API

### POST /api/upload

- Content-Type: `multipart/form-data`
- Required form fields:
  - `file` — PDF file to upload
  - `branch` — department/branch string
  - `module` — one of `Base`, `Bachelor`, `Master`
  - `academicYear` — e.g. `1st`, `2nd`, etc.
  - `year` — numeric or label for the academic year
  - `cycle` — exam cycle (e.g. `Midterm`, `Final`)
  - `semester` — semester label
  - `courseCode` — must match exactly 2 letters followed by 5 digits (example: `CS12345`)

Server behavior:

- Validates `module` against `['Base','Bachelor','Master']`.
- Validates `courseCode` with `/^[A-Z]{2}\d{5}$/` on the server (model uses case-insensitive match as well).
- Streams file buffer to Cloudinary with `resource_type: 'raw'` and a stable `public_id` composed of the provided fields; overwrites existing object with same id.
- Upserts the metadata in MongoDB (so re-uploads replace previous entry with same keys).

### GET /api/download

- Query parameters: `branch`, `module`, `academicYear`, `year`, `semester`, `cycle`, `courseCode` (all optional). Returns matching papers in JSON.

### POST /api/feedback

- Body: `{ content: string }` — stores simple feedback documents.

## Validation notes

- `module` is an enum: `Base`, `Bachelor`, `Master`.
- `courseCode` must be 2 letters + 5 digits (no spaces). The server validates uppercase; frontend should normalize user input to uppercase to ensure consistent behavior.

## Development tips

- Move `nodemon` to `devDependencies` if you prefer it not be included in production installs (currently listed under `dependencies`).
- Use `npx depcheck` to surface potentially unused packages; double-check results before removing.

## Troubleshooting

- If uploads fail, check Cloudinary credentials and network connectivity.
- If MongoDB connection fails, verify `MONGO_URI` and that your MongoDB instance is reachable.

If you want, I can help run the local verification steps and prepare a small checklist to test uploads/downloads end-to-end.

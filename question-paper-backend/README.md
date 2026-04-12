# Question Paper Backend

Express API for uploading question papers, searching them with backend pagination, and collecting feedback.

## Documentation

- Full system documentation: `../TECHNICAL_DOCUMENTATION.md`

## Structure

- `app.js` — Express app setup and middleware registration.
- `server.js` — environment bootstrap, MongoDB connection, and server startup.
- `routes/` — API route definitions.
- `controllers/` — request/response handling.
- `services/` — upload, search, and feedback business logic.
- `utils/` — Cloudinary upload helpers and question-paper normalization utilities.
- `models/` — Mongoose models.
- `middlewares/` — Arcjet protection, 404 handling, and error handling.
- `tests/` — lightweight backend tests.

## Scripts

```bash
npm run dev
npm start
npm test
```

## Environment variables

```bash
MONGO_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ARCJET_KEY=your_arcjet_key
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
```

## API

### `POST /api/upload`

Multipart upload endpoint for PDFs plus metadata:

- `file`
- `module`
- `branch`
- `academicYear`
- `year`
- `cycle`
- `semester`
- `courseCode`

Behavior:

- Validates module and course code.
- Normalizes branch aliases (`EEE` is treated as `EE`).
- Uploads the PDF to Cloudinary.
- Upserts metadata in MongoDB.

### `GET /api/download`

Supports these optional query params:

- `module`
- `branch`
- `academicYear`
- `year`
- `semester`
- `cycle`
- `courseCode`
- `page`
- `pageSize`

Returns:

- `papers`
- `pagination`
- `filters`

### `POST /api/feedback`

Accepts:

```json
{
  "content": "Feedback message",
  "name": "Optional name",
  "email": "Optional email",
  "category": "Optional category"
}
```

### `GET /api/predict/:courseCode`

Runs AI-based analysis against historical paper text for a course code and returns predicted topics/questions.

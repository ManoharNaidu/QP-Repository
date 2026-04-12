# QP Repository Technical Documentation

## 1. Purpose and Scope

This document describes the current architecture and runtime behavior of the QP Repository system:

- Backend: Node.js + Express + MongoDB + Cloudinary + Arcjet + Gemini API
- Frontend: React + React Router + Axios + Framer Motion + Tailwind utility classes

The goal is to support maintenance, onboarding, and safe feature extension.

## 2. System Architecture

### 2.1 High-Level Modules

- `question-paper-frontend`: User-facing web application for browsing, uploading, and prediction workflows.
- `question-paper-backend`: REST API handling file uploads, metadata persistence, search/download, feedback, and AI prediction.

### 2.2 Request Flow

1. Frontend issues HTTP requests to `/api/*` using Axios.
2. Backend Express app applies middleware in order:
   1. `cors`
   2. `express.json` and `express.urlencoded`
   3. `arcjetMiddleware` (request protection/rate limiting)
   4. Route handlers
   5. `notFoundMiddleware`
   6. `errorMiddleware`
3. Services perform validation, normalization, storage operations, and external integrations.
4. Backend returns JSON responses consumed by frontend pages.

### 2.3 Backend Folder Responsibilities

- `app.js`: Express app wiring and middleware order.
- `server.js`: environment bootstrap + MongoDB connect + `app.listen`.
- `routes/`: route-to-controller mapping.
- `controllers/`: HTTP request/response orchestration.
- `services/`: business logic and data access.
- `models/`: Mongoose schemas/models.
- `utils/`: normalization, pagination, and Cloudinary streaming helpers.
- `middlewares/`: security gate + 404 + centralized error response.

## 3. Backend API Reference

## 3.1 Common Behavior

### Base URL

- Development example: `http://localhost:5000`

### Common Headers

- `Content-Type: application/json` for JSON requests.
- `Content-Type: multipart/form-data` for file upload requests.
- `Accept: application/json` recommended.

### Common Error Shapes

- Standard middleware errors:

```json
{
  "success": false,
  "error": "Error message"
}
```

- Arcjet denials:

```json
{
  "error": "Rate limit exceeded | Bot detected | Access denied"
}
```

- Predict controller direct validation/data errors:

```json
{
  "message": "..."
}
```

## 3.2 Endpoint: Upload Question Paper

### `POST /api/upload`

Uploads one PDF and upserts metadata.

### Request Headers

- `Content-Type: multipart/form-data`

### Multipart Form Fields

- `file` (required): PDF binary file
- `module` (required): `Base | Bachelor | Master`
- `branch` (required): branch code (alias normalization supported, e.g. `EEE -> EE`)
- `academicYear` (required): e.g. `1st Year`
- `year` (required): e.g. `2025`
- `cycle` (required): e.g. `Jan-Jun`
- `semester` (required): e.g. `Mid` or `End`
- `courseCode` (required): pattern `^[A-Z]{2}\d{5}$` (example `CS12345`)

### Success Response `201`

```json
{
  "success": true,
  "message": "File uploaded successfully",
  "url": "https://...cloudinary...pdf",
  "paper": {
    "_id": "...",
    "branch": "CSE",
    "module": "Bachelor",
    "academicYear": "2nd Year",
    "year": "2025",
    "cycle": "Jan-Jun",
    "semester": "Mid",
    "courseCode": "CS12345",
    "fileUrl": "https://...",
    "extractedText": "...",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

### Error Responses

- `400`: missing file, invalid module, invalid course code
- `403`: access denied/bot (Arcjet)
- `429`: rate limit exceeded (Arcjet)
- `500`: Cloudinary/MongoDB/internal failures

## 3.3 Endpoint: Download/Search Question Papers

### `GET /api/download`

Returns paginated paper records filtered by optional query params.

### Query Parameters

- `module`
- `branch`
- `academicYear`
- `year`
- `semester`
- `cycle`
- `courseCode`
- `page` (default `1`)
- `pageSize` (default `10`)

### Success Response `200`

```json
{
  "success": true,
  "papers": [
    {
      "_id": "...",
      "branch": "EE",
      "module": "Bachelor",
      "academicYear": "3rd Year",
      "year": "2024",
      "cycle": "Jul-Dec",
      "semester": "End",
      "courseCode": "EE12345",
      "fileUrl": "https://...",
      "extractedText": "..."
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "totalItems": 24,
    "totalPages": 3
  },
  "filters": {
    "module": "Bachelor",
    "branch": "EE",
    "academicYear": "",
    "year": "",
    "semester": "",
    "cycle": "",
    "courseCode": ""
  }
}
```

### Error Responses

- `403`: access denied/bot (Arcjet)
- `429`: rate limit exceeded (Arcjet)
- `500`: database/internal failures

## 3.4 Endpoint: Submit Feedback

### `POST /api/feedback`

Stores user feedback metadata.

### Request Headers

- `Content-Type: application/json`

### Request Body

```json
{
  "content": "Feedback text",
  "name": "Optional name",
  "email": "Optional email",
  "category": "Optional category"
}
```

### Success Response `201`

```json
{
  "success": true,
  "message": "Feedback submitted successfully",
  "feedback": {
    "id": "...",
    "name": "Anonymous",
    "email": "",
    "category": "General",
    "createdAt": "2026-04-12T10:00:00.000Z",
    "createdAtIST": "2026-04-12T15:30:00.000+05:30"
  }
}
```

### Error Responses

- `400`: missing `content`
- `403`: access denied/bot (Arcjet)
- `429`: rate limit exceeded (Arcjet)
- `500`: database/internal failures

## 3.5 Endpoint: Predict Questions from Historical Papers

### `GET /api/predict/:courseCode`

Runs AI analysis against historical extracted text for a course code.

### Path Parameters

- `courseCode` (required): case-insensitive input; normalized to uppercase for DB query

### Success Response `200`

```json
{
  "courseCode": "CS12345",
  "analysisSummary": "...",
  "frequentTopics": [{ "topic": "...", "importance": "High", "reason": "..." }],
  "predictedQuestions": [
    { "question": "...", "probability": "Medium", "context": "..." }
  ],
  "tips": ["..."]
}
```

### Error Responses

- `400`: missing course code OR no extracted text available in matched papers
- `404`: no historical papers found for course
- `500`: invalid AI output format or internal errors

## 4. Backend Business Logic Breakdown

### 4.1 Upload Pipeline (`createQuestionPaper`)

1. Validate presence of uploaded file.
2. Attempt PDF text extraction using `pdf-parse`.
3. Normalize metadata (`module`, `branch`, `courseCode`, pagination-safe fields).
4. Validate module and strict course code pattern.
5. Create deterministic Cloudinary `publicId`.
6. Upload binary buffer with overwrite support.
7. Upsert MongoDB record using identity fields:
   - `branch`, `module`, `academicYear`, `year`, `cycle`, `semester`, `courseCode`
8. Return Cloudinary URL + stored document.

### 4.2 Search Pipeline (`getQuestionPapers`)

1. Normalize query params.
2. Parse pagination with floor constraints.
3. Build dynamic MongoDB query object.
4. Run `find` and `countDocuments` in parallel.
5. Return result list, normalized filters, and pagination metadata.

### 4.3 Feedback Pipeline (`createFeedback`)

1. Validate content.
2. Persist with defaults for missing optional values.
3. Return response DTO with both UTC and IST timestamps.

### 4.4 Prediction Pipeline (`predictQuestions`)

1. Validate `courseCode` path param.
2. Retrieve all matching papers with extracted text fields.
3. Build one combined analysis corpus.
4. Send structured prompt to Gemini model.
5. Parse AI response as JSON; on parse failure, return raw output for diagnostics.

## 5. Database Schema

## 5.1 Model: QuestionPaper (`QPaper`)

Fields:

- `branch: String` (required)
- `module: String` (required, enum `Base|Bachelor|Master`)
- `year: String` (required)
- `academicYear: String` (required)
- `cycle: String` (required)
- `semester: String` (required)
- `courseCode: String` (required, uppercase, regex `^[A-Z]{2}\d{5}$`)
- `fileUrl: String` (required)
- `extractedText: String` (optional)
- `createdAt`, `updatedAt` (timestamps)

Compound index:

- `(branch, module, academicYear, year, cycle, semester, courseCode)`

Relationship notes:

- No foreign-key style relationships are currently defined.
- Logical relation: prediction endpoint reads many `QuestionPaper` records by `courseCode`.

## 5.2 Model: Feedback

Fields:

- `name: String` (default `Anonymous`)
- `email: String` (default empty)
- `category: String` (default `General`)
- `content: String` (required)
- `createdAt: Date` (default now)

Collection:

- Explicitly stored in `feedback` collection.

## 6. Frontend Documentation

## 6.1 Component Hierarchy

- `App`
  - `Router`
    - `Layout`
      - `ThemeProvider`
      - `Navbar`
      - `Outlet` route pages
        - `LandingPage`
        - `UploadPage`
        - `DownloadPage`
        - `FeedBackPage`
        - `PredictPage`
      - `Footer` (used inside page components)

## 6.2 State Management

### Global/Cross-Cutting State

- `ThemeContext`:
  - `isDark` boolean persisted in `localStorage` key `qp-theme`.
  - `toggleTheme` mutator toggles root `dark`/`light` class.

### Local Page State

- `UploadPage`: form fields, upload progress, drag/drop state, flash message.
- `DownloadPage`: filter state, URL-sync (`useSearchParams`), papers list, pagination, loading.
- `FeedBackPage`: form values, submission state, flash message.
- `PredictPage`: `courseCode`, loading, prediction payload, error.

## 6.3 Component Prop Definitions

Current architecture is mostly route/page driven with internal state; most components in reviewed files accept no external props.

- `ThemeProvider({ children })`
  - `children` (ReactNode, required): wrapped subtree receiving theme context.
- `Layout()`
  - No props.
- `Navbar()`
  - No props.
- `LandingPage()`
  - No props.
- `UploadPage()`
  - No props.
- `DownloadPage()`
  - No props.
- `FeedBackPage()`
  - No props.
- `PredictPage()`
  - No props.

## 6.4 Frontend to Backend Interaction Flow

1. Shared Axios client in `src/lib/api.js` resolves base URL from `REACT_APP_API_URL`.
2. Upload page submits multipart form to `POST /api/upload`.
3. Download page sends filter/pagination query to `GET /api/download`.
4. Feedback page sends JSON payload to `POST /api/feedback`.
5. Predict page requests `GET /api/predict/:courseCode` and renders AI output.

## 7. Operational Notes

- Frontend currently uses shared `api` client for most calls, but `PredictPage` uses a direct `axios.get`; consider unifying through `api` client for consistency.
- Upload accepts only PDF at UI and service validation levels.
- Branch alias behavior supports historical records (`EEE` and `EE` queries normalize effectively).

## 8. Environment Variables

### Backend

- `PORT`
- `MONGO_URI`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `ARCJET_KEY`
- `GEMINI_API_KEY`

### Frontend

- `REACT_APP_API_URL` (optional)

## 9. Maintenance Checklist

- Add/adjust endpoint docs whenever route contracts change.
- Keep model field definitions in sync with schema docs.
- Keep UI flow and state docs updated when adding routes/pages.
- Preserve JSDoc coverage on new service/controller/helper functions.

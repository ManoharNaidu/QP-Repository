# QP-Repository

Question paper repository with a React frontend and an Express + MongoDB backend.

## Documentation

- Full technical documentation: `TECHNICAL_DOCUMENTATION.md`

## Projects

- `question-paper-frontend` — upload, search, pagination, and feedback UI.
- `question-paper-backend` — API for uploads, search, pagination, and feedback.

## Recent cleanup

- Refactored the backend into `routes`, `controllers`, `services`, `utils`, and `middlewares`.
- Centralized frontend API access through `REACT_APP_API_URL`.
- Normalized branch handling so legacy `EEE` records remain searchable under `EE`.
- Moved search pagination to the backend.
- Replaced stale tests/docs and removed unused frontend dependencies.

## Local setup

### Backend

```bash
cd question-paper-backend
npm install
npm run dev
```

Required backend environment variables:

```bash
MONGO_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ARCJET_KEY=your_arcjet_key
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
```

### Frontend

```bash
cd question-paper-frontend
npm install
npm start
```

Optional frontend environment variable:

```bash
REACT_APP_API_URL=http://localhost:5000
```

If `REACT_APP_API_URL` is omitted, the frontend uses relative `/api/...` requests.

## Verification

- Backend tests: `cd question-paper-backend && npm test`
- Frontend tests: `cd question-paper-frontend && npm test -- --watchAll=false`
- Frontend build: `cd question-paper-frontend && npm run build`

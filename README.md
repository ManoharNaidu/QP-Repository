# QP-Repository

Central workspace for the Question Paper repository (backend + frontend).

This repo contains two main projects:

- `question-paper-backend` — Express + MongoDB API that receives PDF uploads and stores them on Cloudinary; metadata is kept in MongoDB.
- `question-paper-frontend` — React single-page app (Tailwind CSS) used to upload and search/download question papers.

**Quick structure**

- [question-paper-backend](question-paper-backend/README.md): server, models, config and endpoints.
- [question-paper-frontend](question-paper-frontend/README.md): React app, pages, and styling.

**Highlights / recent changes**

- Added a `module` field (enum: `Base`, `Bachelor`, `Master`) across backend model, API and frontend UI.
- Enforced course code format: exactly 2 letters followed by 5 digits (e.g. `CS12345`) — validated on model, server and client.
- Uploads stream to Cloudinary (raw resource) and save metadata in MongoDB; uploads are upserted by a stable public id composed of key fields.
- Frontend: year dropdowns are displayed in descending order; `Base` module restricts academic-year choices to 1st and 2nd; file input layout and theme updates applied.

**Next steps / recommendations**

- Run local verification after setting environment variables (see backend README) and starting both servers.
- Optionally run `npx depcheck` in each project root to get suggestions for unused dependencies (manually verify before removing).

QP Repository is a web application for managing question papers. Users can upload and download question papers easily.

## Features

- Upload question papers
- Download question papers
- Responsive design
- Smooth animations

## Technologies Used

### Backend

- **Express.js**: Framework for building RESTful APIs.
- **MongoDB**: Metadata storage for uploaded question papers.
- **Cloudinary**: Storage for PDF files.
- **Multer**: Middleware for parsing multipart form data.

### Frontend

- **React.js**: Library for building user interfaces.
- **Tailwind CSS**: Utility-first CSS framework.

## Project Structure

### Backend

- `controllers/`
  - `uploadController.js`: Handles file upload logic.
  - `searchController.js`: Handles search and metadata retrieval.
- `models/`
  - `QuestionPaper.js`: MongoDB schema for metadata.
- `routes/`
  - `uploadRoutes.js`: Routes for upload operations.
  - `searchRoutes.js`: Routes for search operations.
- `middleware/`
  - `validateFile.js`: Middleware for validating file uploads.
  - `errorHandler.js`: Global error handler.
- `utils/`
  - `app.js`: Main application file.
- `config/`
  - `db.js`: MongoDB connection setup.

### Frontend

- `public/`
  - `index.html`: Main HTML file.
  - `manifest.json`: Web app manifest.
  - `robots.txt`: Robots exclusion protocol.
- `src/`
  - `App.css`: Main CSS file.
  - `App.js`: Main React component.
  - `App.test.js`: Test file for the main React component.
  - `components/`: Directory for React components.

## Setup Instructions

### Prerequisites

- Node.js
- npm or yarn
- MongoDB
- Cloudinary
- Streamifier
- Arcjet

### Backend Setup

1. Clone the repository:

   ```sh
   git clone https://github.com/ChinnaDevelopers/
   QP-Repository.git
   ```

   ```
   cd QP-Repository/question-paper-backend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env` file in the `question-paper-backend` directory and add the following environment variables:

   ```
   MONGODB_URI=your_mongodb_uri

   CLOUDINARY_CLOUD_NAME = your_cloud_name
   CLOUDINARY_API_KEY = your_cloudinary_api_key
   CLOUDINARY_API_SECRET = your_cloudinary_api_secret

   ARCJET_ENV= your_arcject_env
   ARCJET_KEY= your_arcject_key

   ```

4. Start the backend server:

   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```sh
   cd ../question-paper-frontend
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Create a `.env` file in the `question-paper-frontend` directory and add any necessary environment variables:

   ```sh
   REACT_APP_API_URL=your_backend_api_url
   ```

4. Start the frontend development server:

   ```sh
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000` to view the application.

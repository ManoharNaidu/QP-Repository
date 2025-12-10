# Backend for Question Paper Upload and Download App

This is the backend for a full-stack web application that enables users to upload and download question papers based on branch, academic year, semester, cycle, and course code. The backend is built using **Node.js** and **Express.js**, with MongoDB as the database. PDF files are stored and retrieved using **Cloudinary Platform** for scalable and reliable storage.

---

## Features

1. **File Upload**  
   Users can upload PDF files (question papers). Metadata such as branch, academic year, semester, cycle, and course code is stored in MongoDB, and the files are stored in Cloudinary Platform.

2. **Search and Download**  
   Users can search for question papers using filters like branch, academic year, semester, cycle, and course code. Matching results include metadata and a download link for the file.

3. **API Endpoints**

   - **POST** `/api/upload`  
     Upload a PDF question paper with associated metadata.
   - **GET** `/api/papers`  
     Search for question papers using query parameters.

4. **Cloudinary Platform**

   - Uploaded PDF files are stored in cloudinary.
   - Files can be retrieved directly via a public URL.

5. **Validation**  
   Ensures uploaded files meet format and size requirements.

6. **Error Handling**  
   Comprehensive error handling for input validation, database issues, and file storage/retrieval.

---

## Project Structure

backend/

- controllers/
  - uploadController.js // Handles file upload logic
  - searchController.js // Handles search and metadata retrieval
- models/
  - QuestionPaper.js // MongoDB schema for metadata
- routes/
  - uploadRoutes.js // Routes for upload operations
  - searchRoutes.js // Routes for search operations
- middleware/
  - validateFile.js // Middleware for validating file uploads
  - errorHandler.js // Global error handler
- utils/
  - app.js // Main application file
- config/

  - db.js // MongoDB connection setup

- package.json // Dependencies and scripts

---

## Technologies Used

### 1. **Backend Framework**

- **Express.js**: Framework for building RESTful APIs.

### 2. **Database**

- **MongoDB**: Metadata for uploaded question papers (branch, year, semester, cycle, course code) is stored in MongoDB.

### 3. **File Storage**

- **Cloudinary Platform**:
  - PDF files are uploaded to Cloudinary Platform.
  - Files can be downloaded securely via a public URL.

### 4. **Third-Party Integrations**

- **Multer**: Middleware for parsing multipart form data (file uploads).

---

## How It Works

### File Upload

1. **Endpoint**: `/api/upload`

   - Accepts a `POST` request with the following fields:
     - `branch`
     - `academicYear`
     - `year`
     - `cycle`
     - `semester`
     - `courseCode`
     - File (PDF format).
   - **Flow**:
     - The file is uploaded using **Multer**.
     - File is uploaded to Cloudinary Platform, and an object key is returned.
     - Metadata (including the file public url) is saved to MongoDB.

2. **Validation**:

   - Ensures the file is in `.pdf` format and below the size limit (e.g., 5 MB).
   - Validates that all required metadata fields are provided.

3. **Cloudinary Platform**:
   - Files are uploaded to Cloudinary Platform.
   - Public urls are stored in MongoDB for later retrieval.

---

### Search and Retrieve Files

1. **Search Metadata**

   - **Endpoint**: `/api/papers`
     - Accepts a `GET` request with optional query parameters:
       - `branch`
       - `academicYear`
       - `year`
       - `cycle`
       - `semester`
       - `courseCode`.
     - **Flow**:
       - MongoDB is queried based on the filters.
       - Returns metadata and an S3 pre-signed URL for each matching file.

2. **Cloudinary File Retrieval**
   - A public URL is generated for each file, allowing secure temporary access to the file without exposing publicly.

---

## Third-Party Services

### 1. **MongoDB Atlas**

- Cloud-hosted MongoDB database for storing metadata.
- Requires the following environment variable:
  - `MONGO_URI` (MongoDB connection string).

### 2. **Cloudinary Platform**

- Files are stored in Cloudinary Platform for scalability and reliability.
- Requires the following environment variables:
  - `CLOUDINARY_CLOUD_NAME`.
  - `CLOUDINARY_API_KEY`.
  - `CLOUDINARY_API_SECRET`.

### 3. **Multer**

- Middleware for handling multipart form data, specifically for file uploads.

---

# Backend for Question Paper Upload and Download App

This is the backend for a full-stack web application that enables users to upload and download question papers based on branch, academic year, semester, cycle, and course code. The backend is built using **Node.js** and **Express.js**, with MongoDB as the database. PDF files are stored and retrieved using **AWS S3** for scalable and reliable storage.

---

## Features

1. **File Upload**  
   Users can upload PDF files (question papers). Metadata such as branch, academic year, semester, cycle, and course code is stored in MongoDB, and the files are stored in AWS S3.

2. **Search and Download**  
   Users can search for question papers using filters like branch, academic year, semester, cycle, and course code. Matching results include metadata and a download link for the file.

3. **API Endpoints**

   - **POST** `/api/upload`  
     Upload a PDF question paper with associated metadata.
   - **GET** `/api/papers`  
     Search for question papers using query parameters.

4. **AWS S3 Integration**

   - Uploaded PDF files are stored in an S3 bucket.
   - Files can be retrieved directly via a secure S3 URL.

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
  - s3.js // AWS S3 integration utilities
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

- **AWS S3**:
  - PDF files are uploaded to an S3 bucket.
  - Files can be downloaded securely via a pre-signed URL.

### 4. **Third-Party Integrations**

- **Multer**: Middleware for parsing multipart form data (file uploads).
- **AWS SDK**: Library for interacting with AWS services, including S3.

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
     - File is uploaded to AWS S3, and the S3 object key is returned.
     - Metadata (including the S3 key) is saved to MongoDB.

2. **Validation**:

   - Ensures the file is in `.pdf` format and below the size limit (e.g., 5 MB).
   - Validates that all required metadata fields are provided.

3. **AWS S3 Integration**:
   - Files are uploaded to an S3 bucket.
   - S3 object keys are stored in MongoDB for later retrieval.

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

2. **AWS S3 File Retrieval**
   - A pre-signed URL is generated for each file in S3, allowing secure temporary access to the file without exposing the bucket publicly.

---

## Third-Party Services

### 1. **MongoDB Atlas**

- Cloud-hosted MongoDB database for storing metadata.
- Requires the following environment variable:
  - `MONGO_URI` (MongoDB connection string).

### 2. **AWS S3**

- Files are stored in an S3 bucket for scalability and reliability.
- Requires the following environment variables:
  - `AWS_ACCESS_KEY_ID`
  - `AWS_SECRET_ACCESS_KEY`
  - `AWS_BUCKET_NAME`
  - `AWS_REGION`.

### 3. **Multer**

- Middleware for handling multipart form data, specifically for file uploads.

---

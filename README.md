# QP Repository

## Overview

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
- **AWS S3**: Storage for PDF files.
- **Multer**: Middleware for parsing multipart form data.
- **AWS SDK**: Library for interacting with AWS services.

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
  - `s3.js`: AWS S3 integration utilities.
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
- AWS S3 bucket

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
   AWS_ACCESS_KEY_ID=your_aws_access_key_id
   AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
   AWS_BUCKET_NAME=your_s3_bucket_name
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

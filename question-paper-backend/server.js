import dotenv from "dotenv";

import app from "./app.js";
import connectMongoDB from "./config/mongodb.config.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

/**
 * Boots the backend by connecting to MongoDB and starting the HTTP server.
 * @returns {Promise<void>} Resolves when server startup succeeds.
 */
const startServer = async () => {
  try {
    await connectMongoDB();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

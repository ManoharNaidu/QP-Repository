/**
 * Handles unmatched routes and returns a standard 404 payload.
 * @param {import("express").Request} req Incoming request.
 * @param {import("express").Response} res Outgoing response.
 * @returns {void}
 */
const notFoundMiddleware = (req, res) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

export default notFoundMiddleware;

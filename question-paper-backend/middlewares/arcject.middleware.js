import aj from "../config/arcject.config.js";

/**
 * Applies Arcjet request protection and blocks denied traffic with appropriate HTTP codes.
 * @param {import("express").Request} req Incoming request.
 * @param {import("express").Response} res Outgoing response.
 * @param {import("express").NextFunction} next Express next callback.
 * @returns {Promise<void>} Resolves when request is forwarded or blocked.
 */
const arcjetMiddleware = async (req, res, next) => {
  try {
    const decision = await aj.protect(req, { requested: 1 });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res.status(429).json({ error: "Rate limit exceeded" });
      }
      if (decision.reason.isBot()) {
        return res.status(403).json({ error: "Bot detected" });
      }
      return res.status(403).json({ error: "Access denied" });
    }

    // If not denied, proceed to the next middleware/route
    next();
  } catch (error) {
    console.error("Error in arcjetMiddleware", error);
    next(error); // Pass the error to the error middleware
  }
};

export default arcjetMiddleware;

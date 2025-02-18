import aj from "../config/arcject.config.js";

const arcjetMiddleware = async (req, res, next) => {
  try {
    const decision = await aj.protect(req, { requested: 1 });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit())
        res.status(429).json({ error: "Rate limit exceeded" });
      if (decision.reason.isBot())
        res.status(403).json({ error: "Bot detected" });

      res.status(403).json({ error: "Access denied" });
    }

    next();
  } catch (error) {
    console.error("Error in arcjetMiddleware", error);
    next(error);
  }
};

export default arcjetMiddleware;

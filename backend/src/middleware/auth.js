/**
 * Admin authentication middleware.
 * Expects an "Authorization: Bearer <token>" header that matches
 * the ADMIN_TOKEN set in the .env file.
 */
function adminAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token || token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: "Unauthorized: invalid or missing admin token" });
  }

  next();
}

module.exports = { adminAuth };

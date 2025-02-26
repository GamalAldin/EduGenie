const jwt = require("jsonwebtoken");

module.exports = (roles) => {
  return (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res
          .status(401)
          .json({ message: "Access denied. No token provided." });
      }

      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decodedToken;

      // Check if the user has the required role
      if (!roles.includes(decodedToken.role)) {
        return res
          .status(403)
          .json({ message: "Access forbidden: Insufficient permissions." });
      }

      const date = new Date();

      const timeFormatter = new Intl.DateTimeFormat("en", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false, // Use 24-hour format
      });

      console.log(`Time: ${timeFormatter.format(date)}: User-> `, req.user);

      next();
    } catch (error) {
      res.status(403).json({ message: "Invalid or expired token." });
    }
  };
};

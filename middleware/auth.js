const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.header("X-auth-token");
  if (!token) return res.status(401).send("Access denied. No token provided");

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).send({
      message: "Invalid Token",
      data: error,
    });
  }
};

module.exports = auth;

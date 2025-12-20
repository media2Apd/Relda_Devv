const jwt = require("jsonwebtoken");

const authTokenOptional = (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      // Guest user
      req.userId = null;
      return next();
    }

    jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, decoded) => {
      if (err) {
        req.userId = null;
      } else {
        req.userId = decoded?._id;
      }
      next();
    });

  } catch (err) {
    req.userId = null;
    next();
  }
};

module.exports = authTokenOptional;

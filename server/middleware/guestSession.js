const { v4: uuidv4 } = require("uuid");

const guestSession = (req, res, next) => {
  if (!req.cookies.sessionId) {
    const sessionId = uuidv4();

    res.cookie("sessionId", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    req.sessionId = sessionId;
  } else {
    req.sessionId = req.cookies.sessionId;
  }

  next();
};

module.exports = guestSession;

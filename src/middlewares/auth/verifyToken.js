const jwt = require("jsonwebtoken");

const fs = require("fs");
const path = require("path");

const verifyToken = (req, res, next) => {
  const uploadDir = path.join(process.cwd(), 'src', 'uploads');
  console.log("uploadDir: ", uploadDir);

  if (!fs.existsSync(uploadDir)) {
    console.log("Creating uploads directory...");
    fs.mkdirSync(uploadDir, { recursive: true });
  } else {
    console.log("Uploads directory already exists.");
  }

  const { headers } = req;
  if (!headers.authorization)
    return res.status(401).send({ message: "Unauthorized" });

  const [type, token] = headers.authorization.split(" ");
  if (type !== "Bearer" || !token)
    return res.status(401).send({ message: "Unauthorized" });
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req["user"] = decoded;
  } catch (_) {
    return res.status(401).send({ message: "Unauthorized" });
  }
  return next();
};
module.exports = verifyToken;

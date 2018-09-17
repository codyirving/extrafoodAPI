exports.DATABASE_URL =
  process.env.DATABASE_URL || "mongodb://localhost:27017/extrafood-api";
exports.TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL ||
  "mongodb://localhost:27017/test-extrafood-api";
exports.PORT = process.env.PORT || 3001;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || "7d";
exports.ADMIN_TEST_PASS = process.env.ADMIN_TEST_PASS || "password";
exports.ADMIN_TEST_USER = process.env.ADMIN_TEST_USER || "admin";
exports.EMAIL_PW = process.env.EMAIL_PW;
exports.EMAIL_LOGIN = process.env.EMAIL_LOGIN;

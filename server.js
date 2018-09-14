var createError = require("http-errors");
var express = require("express");
require("dotenv").config();
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var jwt = require("express-jwt");
var indexRouter = require("./routes");
var usersRouter = require("./routes/users");
const mongoose = require("mongoose");
let { DATABASE_URL, PORT, JWT_SECRET } = require("./config");

let app = express();

let foodListingRouter = require("./routes/foodlisting");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
const jwks = require("jwks-rsa");
console.log("JWT SECRET: " + JWT_SECRET);
// var jwtCheck = jwt({
//   secret: JWT_SECRET,
//   audience: "extrafoodAPI.codyi.mobi",
//   issuer: "https://codyi.auth0.com/"
// });
var jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: "https://codyi.auth0.com/.well-known/jwks.json"
  }),
  audience: "extrafoodAPI.codyi.mobi",
  issuer: "https://codyi.auth0.com/",
  algorithms: ["RS256"]
});
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");
  next();
});

// enforce on all endpoints
app.use(jwtCheck);
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use(foodListingRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

let server;

function runServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(
      databaseUrl,
      { useNewUrlParser: true },
      err => {
        if (err) {
          console.log("error in runserver db connect");
          return reject(err);
        }
        server = app
          .listen(port, () => {
            console.log(`Your app is listening on port ${port}`);

            resolve();
          })
          .on("error", err => {
            console.log("runServer error: " + err);
            mongoose.disconnect();
            reject(err);
          });
      }
    );
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log("Closing server");
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  console.log("require.main === module");
  runServer(DATABASE_URL).catch(err => console.error(err));
}
module.exports = { app, closeServer, runServer };

import createError from 'http-errors';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import flash from "connect-flash";
import session from "express-session";
import pg from "pg";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import env from "dotenv";
import fileUpload from "express-fileupload";


// database
import db from "./db.js";

import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
import loginRouter from './routes/login.js';
import dashboardRouter from './routes/dashboard.js';
import reportFoundRouter from './routes/reportFound.js';
import reportLostRouter from './routes/reportLost.js';
import browseItemsRouter from './routes/browseItems.js';
import itemsDetailsRouter from './routes/itemDetails.js';
import deleteResolversRouter from './routes/deleteResolve.js';
import claimRouter from './routes/claim.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
env.config();
const port = process.env.PORT || 5000;


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret:'mycollegeprojectsecret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60,
  }
}));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session(undefined));
app.use(fileUpload(undefined));

// Middleware to check authentication
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.redirectTo = req.originalUrl;
  res.redirect('/login');
}

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/', loginRouter);
app.use('/', dashboardRouter);
app.use('/', reportFoundRouter);
app.use('/', reportLostRouter);
app.use('/', browseItemsRouter);
app.use('/', itemsDetailsRouter);
app.use('/', deleteResolversRouter);
app.use('/', claimRouter);


passport.use(new Strategy(async function verify(username, password, cb) {
  try {
    const result = await db.query("SELECT * FROM users WHERE username = $1",
        [username]
    );
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const storedHashedPassword = user.password;
      bcrypt.compare(password, storedHashedPassword, (err, result) => {
        if (err) {
          return cb(err);
        }
        if (result) {
          return cb(null, user);
        }
        else {
          return cb(null, false, { message: "Incorrect password. Please try again." });
        }
      });
    } else {
      return cb(null, false, { message: "No account found with this email." });
    }
  } catch (err) {
    return cb(err);
  }

}));

passport.serializeUser((user, cb) => { cb(null, user.id) });
passport.deserializeUser(async (id, cb) => {
  try {
    const result = await db.query("SELECT id, name, username FROM users WHERE id = $1", [id]);

    if (result.rows.length > 0) {
      const user = result.rows[0];
      return cb(null, user);
    } else {
      return cb(new Error("User not found"));
    }
  } catch (err) {
    return cb(err);
  }
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;

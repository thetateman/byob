"use strict";

const path = require("path");
const http = require("http");
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const helmet = require("helmet");

//const MongoStore = require('connect-mongo')(session);

require("dotenv").config();
const blogRoot = process.env.BLOGROOT;

//const connection = mongoose.createConnection(process.env.RESTREVIEWS_DB_URI);

const app = express();

// Security middleware
app.set("trust proxy", "loopback");

app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      connectSrc: ["'self'"], //TODO: Replace
    },
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*
const sessionStore = new MongoStore({
    mongooseConnection: connection,
    collection: 'sessions'
});

const sessionMiddleware = session({
    secret: 'some secret', //TODO: CHANGE THIS
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
});


app.use(sessionMiddleware);
*/

//app.use("/api", apiRouter);
app.get("/robots.txt", (req, res) => {
  res.sendFile(path.resolve(`${__dirname}/../robots.txt`));
});

/*
function authLogic(req, res, next) {
    //console.log(req.ip);
    //TODO: fix below
    if(req.session.isAuth || req.originalUrl.includes('login') || req.originalUrl === '/img/a_background.webm'|| req.originalUrl === '/img/a_background.mp4'){
         next();
    } else {
        req.session.username = 'Guest' + guestID;
        guestID++;
        req.session.isAuth = true;
        //res.status(401);
        //res.redirect('/login');
        next();
    }
}


app.use(authLogic);
*/

app.use(
  `/${blogRoot}`,
  express.static(path.resolve(`${__dirname}/../client`), {
    index: "index.html",
  })
);

//Routes for blog posts
app.use(`/${blogRoot}/:name`, (req, res) => {
  let name = req.params.name;
  res.sendFile(path.resolve(`${__dirname}/../client/${name}/${name}.html`));
});

app.use("/blog-post-list", (req, res) => {
  // Todo: get this list dynamically from post metadata
  let list = [
    {
      title: "How to Deploy a Full-stack Web App in 10 Minutes",
      url: `/${blogRoot}/full-stack-website-deployment-speedrun`,
    },
    { title: "Create or Die", url: `/${blogRoot}/create-or-die` },
  ];
  return res.json({ list: list });
});

/*

app.use('/login', (req, res) => {
    res.sendFile(path.resolve(`${__dirname}/../client/login.html`));
});
app.use('/lobby', (req, res) => {
    res.sendFile(path.resolve(`${__dirname}/../client/lobby.html`));
});
app.use('/about', (req, res) => {
    res.sendFile(path.resolve(`${__dirname}/../client/about.html`));
});
app.use('/game', (req, res) => {
    let requestedGameID = req.query.gameid;
    res.sendFile(path.resolve(`${__dirname}/../client/index.html`));
});
*/

const server = http.createServer(app);

server.on("error", (err) => {
  console.error(err);
});

server.listen(50343, () => {
  console.log("server started");
});

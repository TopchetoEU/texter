"use strict";
exports.__esModule = true;
var body_parser_1 = require("body-parser");
var express_1 = require("express");
var mongodb_1 = require("mongodb");
var errors_1 = require("./newApp/errors");
var db = new mongodb_1.MongoClient("mongodb://localhost:27017");
var passwordRegEx = /[0-9]|[a-z]|[A-Z]|[~`!@#\$%\^&\*\(\)-_=\+{\[\]};:"",<\.>\/\?]/g;
function sha256(message) {
    return require("sha256")(message);
}
function checkCredentials(credential, callback) {
    db.connect().then(function () {
        db
            .db("texter")
            .collection("users")
            .find({ ID: credentials.UserId })
            .toArray()
            .then(function (users) {
            if (users.length !== 1) {
                callback(errors_1["default"].Body.MoreOrLessThanOne.Users, false);
            }
            else if (typeof credentials.Password !== "string") {
                callback(errors_1["default"].Body.Credentials.InvalidFormat);
            }
            else if (credentials.Password.match(passwordRegEx).length !== credentials.Password.length) {
                callback(errors_1["default"].Body.Credentials.InvalidFormat);
            }
            else if (credentials.Password.length < 8 || credentials.Password.length > 64) {
                callback(errors_1["default"].Body.Credentials.InvalidFormat);
            }
            else if (users[0].Password !== sha256(credentials.Password)) {
                callback(errors_1["default"].Body.Credentials.Wrong, false);
            }
            else {
                callback(null, true);
            }
        });
    });
}
function runServer() {
    var articlesRouter = express_1.Router()
        .post("/get", function (req, res) {
        if (typeof req.body.Selector === "undefined") {
            res.status(400);
            res.send({
                Error: errors_1["default"].Body.Missing.Selector
            });
        }
        else if (typeof req.body.Selector !== "object") {
            res.status(400);
            res.send({
                Error: errors_1["default"].Body.InvalidType.Selector
            });
        }
        else {
            db.connect(function () {
                var a = db
                    .db("texter")
                    .collection("articles")
                    .find(req.body.Selector)
                    .project({ _id: 0 });
                if (req.body.DoPaging === true) {
                    if (typeof req.body.Paging.PageSize !== "number") {
                        res.status(400);
                        res.send({
                            Error: errors_1["default"].Body.InvalidType.PageSizeOrCount
                        });
                    }
                    if (typeof req.body.Paging.PageCount !== "number") {
                        res.status(400);
                        res.send({
                            Error: errors_1["default"].Body.InvalidType.PageSizeOrCount
                        });
                    }
                    else {
                        a = a.limit(req.body.Paging.PageSize);
                        a = a.skip(req.body.Paging.PageSize * req.body.Paging.PageCount);
                    }
                }
                a.toArray()
                    .then(function (result) {
                    res.send({
                        Error: {
                            Error: false
                        },
                        Found: result
                    });
                });
            });
        }
    })
        .post("/change", function (req, res) {
        if (typeof req.body.Selector === "undefined") {
            res.send({ Error: errors_1["default"].Body.Missing.Selector });
        }
        else {
            checkCredentials(req.body.Credentials, function (error, success) {
                if (success) {
                    if (req.body.Like === -1) {
                        db.connect().then(function () {
                            db
                                .db("texter")
                                .collection("articles")
                                .findOne(req.body.Selector)
                                .toArray()
                                .then(function (article) {
                                if (article.Dislikers.indexOf(req.body.Credentials.UserId) !== -1) {
                                    var a_1 = [];
                                    article.Dislikers.forEach(function (element) {
                                        if (element !== req.body.Credentials.UserId) {
                                            a_1.push(element);
                                        }
                                    });
                                    db
                                        .db("texter")
                                        .collection("articles")
                                        .update(req.body.Selector, { $set: { Dislikers: a_1 } });
                                }
                                else {
                                    db
                                        .db("texter")
                                        .collection("articles")
                                        .update(req.body.Selector, {
                                        $push: {
                                            Dislikers: req.body.Credentials.UserId
                                        }
                                    })
                                        .then(function (r) {
                                        res.send({
                                            Error: false,
                                            UpdatedElementCount: r.result
                                        });
                                    });
                                }
                            });
                        });
                    }
                    if (req.body.Like === 1) {
                        db.connect().then(function () {
                            db
                                .db("texter")
                                .collection("articles")
                                .findOne(req.body.Selector)
                                .toArray()
                                .then(function (article) {
                                if (article.Likers.indexOf(req.body.Credentials.UserId) !== -1) {
                                    var a_2 = [];
                                    article.Dislikers.forEach(function (element) {
                                        if (element !== req.body.Credentials.UserId) {
                                            a_2.push(element);
                                        }
                                    });
                                    db
                                        .db("texter")
                                        .collection("articles")
                                        .update(req.body.Selector, { $set: { Dislikers: a_2 } });
                                }
                                else {
                                    db
                                        .db("texter")
                                        .collection("articles")
                                        .update(req.body.Selector, {
                                        $push: {
                                            Dislikers: req.body.Credentials.UserId
                                        }
                                    })
                                        .then(function (r) {
                                        res.send({
                                            Error: false,
                                            UpdatedElementCount: r.result
                                        });
                                    });
                                }
                            });
                        });
                    }
                }
                else {
                    res.status(400);
                    res.send({ Error: error });
                }
            });
        }
    });
    var userRouter = express_1.Router()
        .post("/get", function (req, res) {
        if (typeof req.body.Selector === "undefined") {
            res.status(400);
            res.send({
                Error: errors_1["default"].Body.Missing.Selector
            });
        }
        else {
            db.connect(function () {
                var a = db
                    .db("texter")
                    .collection("users")
                    .find(req.body.Selector);
                if (req.body.DoPaging === true) {
                    if (typeof req.body.Paging.PageSize !== "number") {
                        res.status(400);
                        res.send({
                            Error: errors_1["default"].Body.InvalidType.PageSizeOrCount
                        });
                    }
                    if (typeof req.body.Paging.PageCount !== "number") {
                        res.status(400);
                        res.send({
                            Error: errors_1["default"].Body.InvalidType.PageSizeOrCount
                        });
                    }
                    else {
                        a = a.limit(req.body.Paging.PageSize);
                        a = a.skip(req.body.Paging.PageSize * req.body.Paging.PageCount);
                    }
                }
                a.toArray().then(function (result) {
                    res.send({
                        Error: {
                            Error: false
                        },
                        Found: result
                    });
                });
            });
        }
    });
    express_1["default"]()
        .use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    })
        .use(express_1["default"].static("static"))
        .use(body_parser_1.json({ type: "*/*" }))
        .use("/articles", articlesRouter)
        .use("/users", userRouter)
        .get("/", function (req, res) {
        res.redirect("/index.html");
    })
        .listen(4000, function () { console.log("Listening on :4000"); });
}
function makeHttpRequest(body, url, callback) {
    var a = new XMLHttpRequest();
    a.open("post", url.toString(), false);
    a.onreadystatechange = function () {
        console.log(a.status);
        callback({});
    };
    a.send(body.toString());
}
function test() {
    makeHttpRequest("", "https://www.google.com", function (r) { return null; });
}
module.exports = {
    RunServer: runServer,
    Test: test
};

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = require("body-parser");
const express_1 = __importDefault(require("express"));
const index_1 = require("./routers/index");
const othersRouter_1 = require("./routers/othersRouter");
function getServer(credentialsChecker, errors, db, config) {
    return express_1.default()
        .use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
        next();
    })
        .use(body_parser_1.json({ type: "*/*" }))
        .use((req, res, done) => {
        done();
    })
        .use("/articles", index_1.getArticlesRouter(db, errors, credentialsChecker, config.PasswordRegEx))
        .use("/users", index_1.getUsersRouter(db, errors, credentialsChecker, config.PasswordRegEx))
        .use("/others", othersRouter_1.GetOthersRouter(db, errors, credentialsChecker, config.PasswordRegEx))
        .use(express_1.default.static("static"))
        .get("/", (req, res) => {
        res.redirect("/index.html");
    });
}
exports.getServer = getServer;
//# sourceMappingURL=index.js.map
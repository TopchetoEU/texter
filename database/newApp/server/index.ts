import { json } from "body-parser";
import express from "express";
import { MongoClient } from "mongodb";
import sha256 from "sha256";
import { CredentialsChecker } from "./credentialsChecker";
import { getArticlesRouter, getUsersRouter } from "./routers/index";
import { GetOthersRouter } from "./routers/othersRouter";

export function getServer(
    credentialsChecker: CredentialsChecker,
    errors: any,
    db: MongoClient,
    config: any) {
        return express()
            .use((req, res, next) => {
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
                next();
            })
            .use(json({ type: "*/*" }))
            .use((req, res, done) => {
                done();
            })
            .use("/articles", getArticlesRouter(db, errors, credentialsChecker, config.PasswordRegEx))
            .use("/users", getUsersRouter(db, errors, credentialsChecker, config.PasswordRegEx))
            .use("/others", GetOthersRouter(db, errors, credentialsChecker, config.PasswordRegEx))
            .use(express.static("static"))
            .get("/", (req, res) => {
                res.redirect("/index.html");
            });
}

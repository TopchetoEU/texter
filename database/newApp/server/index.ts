import { json } from "body-parser";
import express from "express";
import { MongoClient } from "mongodb";
import { ConfigType } from "../config";
import { CredentialsChecker } from "./credentialsChecker";
import { getArticlesRouter, getUsersRouter } from "./routers/index";
import { GetOthersRouter } from "./routers/othersRouter";

export async function getServer(
    credentialsChecker: CredentialsChecker,
    errors: any,
    db: MongoClient,
    config: ConfigType) {
        await db.connect();
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

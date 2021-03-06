import { Router } from "express";
import { MongoClient } from "mongodb";
import sha256 from "sha256";
import { ErrorsType } from "../../errors";
import { CredentialsChecker } from "../credentialsChecker";

enum Changeable {
    Title,
    Content,
    UserId,
}

export function GetOthersRouter(db: MongoClient, e: ErrorsType, cc: CredentialsChecker, prg: RegExp): Router {
    return Router()
        // Possibility for external sources to check credentials
        .post("/checkCreds", async (req, res) => {
            res.send(await cc(req.body.Credentials, db, prg, e));
        });
}

import { MongoClient } from "mongodb";
import { Config } from "./config";
import { Errors } from "./errors";
import { getServer } from "./server";
import { DefaultCredentialsChecker } from "./server/credentialsChecker";

const db = new MongoClient("mongodb://localhost:27017");

(async () => {
    (await getServer(DefaultCredentialsChecker, Errors, db, Config))
        .listen(4000, () => {
            console.log("Listening to port :4000");
            console.log(__dirname);
        });
})();

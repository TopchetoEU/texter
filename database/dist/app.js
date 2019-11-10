"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const config_1 = require("./config");
const errors_1 = require("./errors");
const server_1 = require("./server");
const credentialsChecker_1 = require("./server/credentialsChecker");
const db = new mongodb_1.MongoClient("mongodb://localhost:27017");
server_1.getServer(credentialsChecker_1.DefaultCredentialsChecker, errors_1.Errors, db, config_1.Config)
    .listen(4000, () => {
    console.log("Listening to port :4000");
    console.log(__dirname);
});
//# sourceMappingURL=app.js.map
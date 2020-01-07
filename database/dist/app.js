"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const config_1 = require("./config");
const errors_1 = require("./errors");
const server_1 = require("./server");
const credentialsChecker_1 = require("./server/credentialsChecker");
const db = new mongodb_1.MongoClient("mongodb://localhost:27017");
(() => __awaiter(void 0, void 0, void 0, function* () {
    (yield server_1.getServer(credentialsChecker_1.DefaultCredentialsChecker, errors_1.Errors, db, config_1.Config))
        .listen(4000, () => {
        console.log("Listening to port :4000");
        console.log(__dirname);
    });
}))();
//# sourceMappingURL=app.js.map
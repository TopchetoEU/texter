"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sha256_1 = __importDefault(require("sha256"));
class Error {
}
exports.Error = Error;
// tslint:disable-next-line: max-classes-per-file
class Credentials {
}
exports.Credentials = Credentials;
exports.DefaultCredentialsChecker = (creds, db, passRegEx, errors, cb) => {
    if (typeof creds === "undefined") {
        cb(errors.Body.Missing.Credentials, false);
        return;
    }
    if (typeof creds.UserId !== "number") {
        cb(errors.Body.Missing.Credentials, false);
        return;
    }
    if (typeof creds.Password !== "string") {
        cb(errors.Body.Credentials.InvalidFormat, false);
        return;
    }
    db.connect().then(() => {
        db
            .db("texter")
            .collection("users")
            .find({ ID: creds.UserId })
            .toArray()
            .then((users) => {
            console.log(creds.Password.match(passRegEx).length);
            if (users.length !== 1) {
                cb(errors.Body.MoreOrLessThanOne.Users, false);
            }
            else if (typeof creds.Password !== "string") {
                cb(errors.Body.Credentials.InvalidFormat, false);
            }
            else if (creds.Password.match(passRegEx).length !== 1) {
                cb(errors.Body.Credentials.InvalidFormat, false);
            }
            else if (creds.Password.length < 8 || creds.Password.length > 64) {
                cb(errors.Body.Credentials.InvalidFormat, false);
            }
            else if (users[0].Password !== sha256_1.default(creds.Password)) {
                cb(errors.Body.Credentials.Wrong, false);
            }
            else {
                cb(null, true);
            }
        });
    });
};
//# sourceMappingURL=credentialsChecker.js.map
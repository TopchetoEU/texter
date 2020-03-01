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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sha256_1 = __importDefault(require("sha256"));
class Error {
    constructor(general, more) {
        this.ErrorDetails = {
            General: general,
            More: more,
        };
        this.Error = true;
    }
}
exports.Error = Error;
Error.noError = { Error: false };
// tslint:disable-next-line: max-classes-per-file
class Credentials {
}
exports.Credentials = Credentials;
exports.DefaultCredentialsChecker = (creds, db, passRegEx, errors) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof creds === "undefined") {
        return Promise.resolve({ error: errors.Body.Missing.Credentials, success: false });
    }
    if (typeof creds.UserId !== "number") {
        return Promise.resolve({ error: errors.Body.Missing.Credentials, success: false });
    }
    if (typeof creds.Password !== "string") {
        return Promise.resolve({ error: errors.Body.Credentials.InvalidFormat, success: false });
    }
    const users = yield db
        .db("texter")
        .collection("users")
        .find({ ID: creds.UserId })
        .toArray();
    if (users.length !== 1) {
        return Promise.resolve({ error: errors.Body.MoreOrLessThanOne.Users, success: false });
    }
    else if (typeof creds.Password !== "string") {
        return Promise.resolve({ error: errors.Body.Credentials.InvalidFormat, success: false });
    }
    else if (creds.Password.match(passRegEx) && creds.Password.match(passRegEx).length !== 1) {
        return Promise.resolve({ error: errors.Body.Credentials.InvalidFormat, success: false });
    }
    else if (creds.Password.length < 8 || creds.Password.length > 64) {
        return Promise.resolve({ error: errors.Body.Credentials.InvalidFormat, success: false });
    }
    else if (users[0].Password !== sha256_1.default(creds.Password)) {
        return Promise.resolve({ error: errors.Body.Credentials.Wrong, success: false });
    }
    else {
        return Promise.resolve({ error: null, success: true });
    }
});
//# sourceMappingURL=credentialsChecker.js.map
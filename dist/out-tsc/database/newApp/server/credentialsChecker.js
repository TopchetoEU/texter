import { __awaiter } from "tslib";
import sha256 from "sha256";
export class Error {
    constructor(general, more) {
        this.ErrorDetails = {
            General: general,
            More: more,
        };
        this.Error = true;
    }
}
Error.noError = { Error: false };
// tslint:disable-next-line: max-classes-per-file
export class Credentials {
}
export const DefaultCredentialsChecker = (creds, db, passRegEx, errors) => __awaiter(void 0, void 0, void 0, function* () {
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
    else if (users[0].Password !== sha256(creds.Password)) {
        return Promise.resolve({ error: errors.Body.Credentials.Wrong, success: false });
    }
    else {
        return Promise.resolve({ error: null, success: true });
    }
});
//# sourceMappingURL=credentialsChecker.js.map
import { MongoClient } from "mongodb";
import sha256 from "sha256";

export class Error {
    public Error: boolean;
    public ErrorDetails: {
        General: string,
        More: string,
    };
}

// tslint:disable-next-line: max-classes-per-file
export class Credentials {
    public UserId: number;
    public Password: string;
}

export type ErrorCallback = (error: Error, success: boolean) => void;
export type CredentialsChecker = (
    credentials: Credentials,
    db: MongoClient,
    passwordRegEx: RegExp,
    errors: any,
    callback: ErrorCallback) => void;

export const DefaultCredentialsChecker = (
    creds: Credentials, db: MongoClient,
    passRegEx: RegExp, errors: any,
    cb: ErrorCallback) => {
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
                } else if (typeof creds.Password !== "string") {
                    cb(errors.Body.Credentials.InvalidFormat, false);
                } else if (creds.Password.match(passRegEx).length !== 1) {
                    cb(errors.Body.Credentials.InvalidFormat, false);
                } else if (creds.Password.length < 8 || creds.Password.length > 64) {
                    cb(errors.Body.Credentials.InvalidFormat, false);
                } else if (users[0].Password !== sha256(creds.Password)) {
                    cb(errors.Body.Credentials.Wrong, false);
                } else {
                    cb(null, true);
                }
            });
        });
};

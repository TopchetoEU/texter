import { MongoClient } from "mongodb";
import sha256 from "sha256";

export class Error {
    public static readonly noError: Error = { Error: false };

    public Error: boolean;
    public ErrorDetails?: {
        General: string,
        More: string,
    };

    public constructor(general: string, more: string) {
        this.ErrorDetails = {
            General: general,
            More: more,
        };
        this.Error = true;
    }
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
    errors: any) => Promise<{ error: Error, success: boolean }>;

export const DefaultCredentialsChecker = async (
    creds: Credentials, db: MongoClient,
    passRegEx: RegExp, errors: any): Promise<{ error: Error, success: boolean }> => {
    if (typeof creds === "undefined") {
        return Promise.resolve({ error: errors.Body.Missing.Credentials, success: false });
    }
    if (typeof creds.UserId !== "number") {
        return Promise.resolve({ error: errors.Body.Missing.Credentials, success: false });
    }
    if (typeof creds.Password !== "string") {
        return Promise.resolve({ error: errors.Body.Credentials.InvalidFormat, success: false });
    }
    const users = await db
        .db("texter")
        .collection("users")
        .find({ ID: creds.UserId })
        .toArray();
    if (users.length !== 1) {
        return Promise.resolve({ error: errors.Body.MoreOrLessThanOne.Users, success: false });
    } else if (typeof creds.Password !== "string") {
        return Promise.resolve({ error: errors.Body.Credentials.InvalidFormat, success: false });
    } else if (creds.Password.match(passRegEx) && creds.Password.match(passRegEx).length !== 1) {
        return Promise.resolve({ error: errors.Body.Credentials.InvalidFormat, success: false });
    } else if (creds.Password.length < 8 || creds.Password.length > 64) {
        return Promise.resolve({ error: errors.Body.Credentials.InvalidFormat, success: false });
    } else if (users[0].Password !== sha256(creds.Password)) {
        return Promise.resolve({ error: errors.Body.Credentials.Wrong, success: false });
    } else {
        return Promise.resolve({ error: null, success: true });
    }
};

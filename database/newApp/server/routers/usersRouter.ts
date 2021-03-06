import { Router } from "express";
import { MongoClient } from "mongodb";
import sha256 from "sha256";
import { ErrorsType } from "../../errors";
import { CredentialsChecker } from "../credentialsChecker";

/**
 * All changeable properties in Articles
 */
enum Changeable {
    Password,
}

/**
 * Returns user router with get, change, create and remove paths
 * @param db The mongoDb client
 * @param errors A list of errors
 * @param checkCredentials Function, checking credentials
 * @param passRegEx Password regEx
 */
export function GetUsersRouter(
    db: MongoClient, errors: ErrorsType,
    checkCredentials: CredentialsChecker,
    passRegEx: RegExp): Router {
    return Router()
        .post("/get", async (req, res) => {
            // Types check
            if (typeof req.body.Selector === "undefined") {
                res.status(200);
                res.send({
                    Error: errors.Body.Missing.Selector,
                });
            } else {
                let cursor = db
                    .db("texter")
                    .collection("users")
                    .find(req.body.Selector);

                if (req.body.DoPaging === true) {
                    if (typeof req.body.Paging.PageSize !== "number") {
                        res.status(200);
                        res.send({
                            Error: errors.Body.InvalidType.PageSizeOrCount,
                        });
                    }
                    if (typeof req.body.Paging.PageCount !== "number") {
                        res.status(200);
                        res.send({
                            Error: errors.Body.InvalidType.PageSizeOrCount,
                        });
                    } else {
                        cursor = cursor.limit(req.body.Paging.PageSize);
                        cursor = cursor.skip(req.body.Paging.PageSize * req.body.Paging.PageCount);
                    }
                }

                const result = await cursor.toArray();
                res.send({
                    Error: {
                        Error: false,
                    },
                    Found: result,
                });
            }
        })
        .post("/change", async (req, res) => {
            const creds = await checkCredentials(req.body.Credentials, db, passRegEx, errors);
            if (creds.success) {
                if ((req.body.Follow === true) && typeof req.body.Selector === "object") {
                    const collection = db.db("texter").collection("users");

                    const unfollowSelector: any = Object.create(req.body.Selector);
                    unfollowSelector.Followers = { $in: [req.body.Credentials.UserId] };

                    const followSelector: any = Object.create(req.body.Selector);
                    followSelector.Followers = { $nin: [req.body.Credentials.UserId] };

                    const unfollowIds: number[] = (await collection.find(unfollowSelector).toArray()).map((v) => v.ID);
                    const followIds: number[] = (await collection.find(followSelector).toArray()).map((v) => v.ID);

                    // Unfollows all users marked so
                    collection.updateMany(unfollowSelector, {
                        $pull: {
                            Followers: req.body.Credentials.UserId,
                        },
                    });

                    // Follows all users marked so
                    collection.updateMany(followSelector, {
                        $push: {
                            Followers: req.body.Credentials.UserId,
                        },
                    });

                    // Adds all followed as marked so
                    collection.updateMany({ ID: req.body.Credentials.UserId }, {
                        $push: { Following: { $each: followIds } },
                    });

                    // Removes all unfollowed as marked so
                    collection.updateMany({ ID: req.body.Credentials.UserId }, {
                        $pull: { Following: { $in: unfollowIds } },
                    });

                    res.send({
                        Error: false,
                    });
                } else if (req.body.DoModify === true) {
                    if (typeof req.body.Modify === "object") {
                        const modifyList: any = {};

                        for (const modifyPropName in req.body.Modify) {
                            if (req.body.Modify.hasOwnProperty(modifyPropName)) {
                                const modifyValue = req.body.Modify[modifyPropName];
                                let modifiableValid = false;

                                for (const key in Changeable) {
                                    if (modifyPropName === key) {
                                        modifiableValid = true;
                                        break;
                                    }
                                }

                                if (modifiableValid) {
                                    if (modifyPropName === "Password") {
                                        modifyList[modifyPropName] = sha256(modifyValue);
                                    } else {
                                        modifyList[modifyPropName] = modifyValue;
                                    }
                                } else {
                                    res.status(200);
                                    res.send({
                                        Error: {
                                            Error: true,
                                            ErrorDetails: {
                                                General: "Modification property name not valid",
                                                More: "Make sure you're not providing somthing else from all changeable properties",
                                            },
                                        },
                                    });

                                    return;
                                }
                            }
                        }

                        if (modifyList !== {}) {
                            const r = await db
                                .db("texter")
                                .collection("users")
                                .updateMany({ ID: req.body.Credentials.UserId }, { $set: modifyList });
                            res.status(200);
                            res.send({
                                Error: {
                                    Error: false,
                                },
                                InsertCount: r.result,
                            });
                        }
                    } else {
                        res.status(200);
                        res.send({
                            Error: {
                                Error: true,
                                ErrorDetails: {
                                    General: "Modify list isn't object",
                                    More: "Make sure you're giving object, not other",
                                },
                            },
                        });
                    }
                } else {
                    res.status(413);
                    res.send({
                        Error: {
                            Error: true,
                            ErrorDetails: {
                                General: "I'm a teapot",
                                More: "The server refuses the attempt to brew coffee with a teapot.",
                            },
                        },
                    });
                }

            } else {
                res.status(200);
                res.send({ Error: creds.error });
            }
        })
        .post("/create", async (req, res) => {
            async function getNextFreeId(): Promise<number> {
                const ids = (await db
                    .db("texter")
                    .collection("users")
                    .find({})
                    .project({ ID: 1 })
                    .toArray())
                    .map((v) => v.ID);

                let id = 0;

                while (ids.indexOf(id) !== -1) {
                    id = Math.random() * Number.MAX_SAFE_INTEGER;
                }
                return Promise.resolve(id);
            }

            if (typeof req.body.New === "undefined") {
                res.status(200);
                res.send({ Error: errors.Body.MissingAny });
                return;
            } else if (
                typeof req.body.New.Username === "undefined" ||
                req.body.New.Username === "") {
                res.status(200);
                res.send({ Error: errors.Body.MissingAny });
                return;
            } else if (
                typeof req.body.New.Password === "undefined" ||
                req.body.New.Password === "") {
                res.status(200);
                res.send({ Error: errors.Body.MissingAny });
                return;
            } else if ((req.body.New.Password as string).match(passRegEx)?.length !== 1) {
                res.status(200);
                res.send({ Error: errors.Body.Credentials.InvalidFormat });
            } else {
                const newId = await getNextFreeId();

                const sameUsers = await db
                    .db("texter")
                    .collection("users")
                    .find({ Username: req.body.New.Username })
                    .toArray();
                if (sameUsers.length > 0) {
                    res.status(200);
                    res.send({ Error: errors.Body.UserExists });
                } else {
                    const user = {
                        Articles: new Array(),
                        Followers: [newId],
                        Following: [newId],
                        ID: newId,
                        Password: sha256(req.body.New.Password),
                        Username: req.body.New.Username,
                    };
                    await db
                        .db("texter")
                        .collection("users")
                        .insertOne(user);
                    res.status(200);
                    res.send({
                        Error: {
                            Error: false,
                        },
                        NewID: newId,
                    });
                }
            }
        });
}

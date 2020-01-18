import { Router } from "express";
import { MongoClient } from "mongodb";
import sha256 from "sha256";
import { ErrorsType } from "../../errors";
import { CredentialsChecker } from "../credentialsChecker";

enum Changeables {
    Password,
    Username,
    UserId,
}

enum DebugStates {
    Follow,
    Unfollow,
    None = null,
}

export function GetUsersRouter(
    db: MongoClient, errors: ErrorsType,
    checkCredentials: CredentialsChecker,
    passRegEx: RegExp): Router {
    return Router()
        .post("/get", async (req, res) => {
            if (typeof req.body.Selector === "undefined") {
                res.status(400);
                res.send({
                    Error: errors.Body.Missing.Selector,
                });
            } else {
                let a = db
                    .db("texter")
                    .collection("users")
                    .find(req.body.Selector);

                if (req.body.DoPaging === true) {
                    if (typeof req.body.Paging.PageSize !== "number") {
                        res.status(400);
                        res.send({
                            Error: errors.Body.InvalidType.PageSizeOrCount,
                        });
                    }
                    if (typeof req.body.Paging.PageCount !== "number") {
                        res.status(400);
                        res.send({
                            Error: errors.Body.InvalidType.PageSizeOrCount,
                        });
                    } else {
                        a = a.limit(req.body.Paging.PageSize);
                        a = a.skip(req.body.Paging.PageSize * req.body.Paging.PageCount);
                    }
                }

                const result = await a.toArray();
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
                    const coll = db.db("texter").collection("users");

                    const selectorA: any = Object.create(req.body.Selector);
                    selectorA.Followers = { $in: [req.body.Credentials.UserId] };

                    const selectorB: any = Object.create(req.body.Selector);
                    selectorB.Followers = { $nin: [req.body.Credentials.UserId] };

                    // Marks all users to unfollow
                    coll.update(selectorA, {
                        $set: {
                            Debug: DebugStates.Unfollow,
                        },
                    });

                    // Marks all users to follow
                    coll.update(selectorB, {
                        $set: {
                            Debug: DebugStates.Follow,
                        },
                    });

                    // Unfollows all users marked so
                    coll.update({ Debug: DebugStates.Unfollow }, {
                        $pull: {
                            Followers: req.body.Credentials.UserId,
                        },
                    });

                    // Follows all users maked so
                    coll.update({ Debug: DebugStates.Follow }, {
                        $push: {
                            Followers: req.body.Credentials.UserId,
                        },
                    });

                    const unfollow = await coll.find({ Debug: 1 }).toArray();
                    const follow = await coll.find({ Debug: 0 }).toArray();
                    const modF: any[] = [];
                    const modUf: any[] = [];

                    unfollow.forEach((element) => {
                        modUf.push(element.ID);
                    });

                    follow.forEach((element) => {
                        modF.push(element.ID);
                    });

                    await coll.updateOne({ ID: req.body.Credentials.UserId }, {
                        $push: { Following: { $each: modF } },
                    });
                    await coll.updateOne({ ID: req.body.Credentials.UserId }, {
                        $pull: { Following: { $in: modUf } },
                    });
                    await coll.updateOne({ ID: req.body.Credentials.UserId }, {
                        $set: { Debug: DebugStates.None },
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

                                for (const key in Changeables) {
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
                                    res.status(400);
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
                        res.status(400);
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
                res.status(400);
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
                res.status(400);
                res.send({ Error: errors.Body.MissingAny });
                return;
            } else if (
                typeof req.body.New.Username === "undefined" ||
                req.body.New.Username === "") {
                res.status(400);
                res.send({ Error: errors.Body.MissingAny });
                return;
            } else if (
                typeof req.body.New.Password === "undefined" ||
                req.body.New.Password === "") {
                res.status(400);
                res.send({ Error: errors.Body.MissingAny });
                return;
            } else if ((req.body.New.Password as string).match(passRegEx)?.length !== 1) {
                res.status(400);
                res.send({ Error: errors.Body.Credentials.InvalidFormat });
            } else {
                const newId = await getNextFreeId();

                const sameUsers = await db
                    .db("texter")
                    .collection("users")
                    .find({ Username: req.body.New.Username })
                    .toArray();
                if (sameUsers.length > 0) {
                    res.status(400);
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

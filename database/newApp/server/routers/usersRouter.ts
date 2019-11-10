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
        .post("/get", (req, res) => {
            if (typeof req.body.Selector === "undefined") {
                res.status(400);
                res.send({
                    Error: errors.Body.Missing.Selector,
                });
            } else {
                db.connect(() => {
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

                    a.toArray().then((result) => {
                        res.send({
                            Error: {
                                Error: false,
                            },
                            Found: result,
                        });
                    });
                });
            }
        })
        .post("/change", (req, res) => {
            checkCredentials(req.body.Credentials, db, passRegEx, errors, (error: any, success: any) => {
                if (success) {
                    if ((req.body.Follow === true) && typeof req.body.Selector === "object") {
                        const coll = db.db("texter").collection("users");

                        const selectorA: any = Object.create(req.body.Selector);
                        selectorA.Followers = { $in: [req.body.Credentials.UserId]};

                        const selectorB: any = Object.create(req.body.Selector);
                        selectorB.Followers = { $nin: [req.body.Credentials.UserId]};

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

                        coll.find({ Debug: 1 })
                            .toArray().then((unfollow) => {
                                    coll.find({ Debug: 0 })
                                        .toArray().then((follow) => {
                                            const modF: any[] = [];
                                            const modUf: any[] = [];

                                            unfollow.forEach((element) => {
                                                modUf.push(element.ID);
                                            });

                                            follow.forEach((element) => {
                                                modF.push(element.ID);
                                            });

                                            // unfollow = modUf;
                                            // follow = modF;

                                            coll.updateOne({ ID: req.body.Credentials.UserId }, {
                                                $push: { Following: { $each: modF } },
                                            }).then(() => {
                                                coll.updateOne({ ID: req.body.Credentials.UserId }, {
                                                    $pull: { Following: { $in: modUf }},
                                                }).then(() => {
                                                    coll.updateOne({ ID: req.body.Credentials.UserId }, {
                                                        $set: { Debug: DebugStates.None},
                                                    }).then(() => {
                                                        res.send({
                                                            Error: false,
                                                        });
                                                    });
                                                });
                                            });
                                        });
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
                                db
                                    .db("texter")
                                    .collection("users")
                                    .updateMany({ ID: req.body.Credentials.UserId }, { $set: modifyList })
                                    .then((r) => {
                                        res.status(200);
                                        res.send({
                                            Error: {
                                                Error: false,
                                            },
                                            InsertCount: r.result,
                                        });
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
                    res.send({ Error: error });
                }
            });
        })
        .post("/create", (req, res) => {
            function getNextFreeId(callback: (id: number) => void) {
                db.db("texter").collection("users").find({}).project({ ID: 1 }).toArray().then((usrs) => {
                    const ids: number[] = [];
                    let id = 0;

                    usrs.forEach((element) => {
                        ids.push(element.ID);
                    });

                    while (ids.indexOf(id) !== -1) {
                        id = Math.random() * Number.MAX_SAFE_INTEGER ;
                    }
                    callback(id);
                });
            }
            if (typeof req.body.New === "undefined") {
                res.status(400);
                res.send({ Error: errors.Body.MissingAny });
                console.log("a");
                return;
            } else if (typeof req.body.New.Username === "undefined") {
                res.status(400);
                res.send({ Error: errors.Body.MissingAny });
                console.log("b");
                return;
            } else if (typeof req.body.New.Password === "undefined") {
                res.status(400);
                res.send({ Error: errors.Body.MissingAny });
                console.log("c");
                return;
            } else {
                db.connect().then(() => {
                    getNextFreeId((newId: number) => {
                        db
                            .db("texter")
                            .collection("users")
                            .find({ Username: req.body.New.Username })
                            .toArray()
                            .then((r) => {
                                if (r.length > 0) {
                                    console.log(r);
                                    res.status(400);
                                    res.send({ Error: errors.Body.UserExists });
                                } else {
                                    const user = {
                                        Articles: new Array(),
                                        Followers: [ newId ],
                                        Following: [ newId ],
                                        ID: newId,
                                        Password: sha256(req.body.New.Password),
                                        Username: req.body.New.Username,
                                    };
                                    db
                                        .db("texter")
                                        .collection("users")
                                        .insertOne(user)
                                        .then(() => {
                                            res.status(200);
                                            res.send({
                                                Error: {
                                                    Error: false,
                                                },
                                                NewID: newId,
                                            });
                                        });
                                }
                            });
                    });
                });
            }
        });
}

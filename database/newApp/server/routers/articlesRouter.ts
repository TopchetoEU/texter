import { Router } from "express";
import { MongoClient } from "mongodb";
import sha256 from "sha256";
import { ErrorsType } from "../../errors";
import { CredentialsChecker } from "../credentialsChecker";

enum Changeables {
    Title,
    Content,
    UserId,
}

export function GetArticlesRouter(
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
            } else if (typeof req.body.Selector !== "object") {
                res.status(400);
                res.send({
                    Error: errors.Body.InvalidType.Selector,
                });
            } else {
                await db.connect();
                let a = db
                    .db("texter")
                    .collection("articles")
                    .find(req.body.Selector)
                    .project({ _id: 0 });
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
            if (typeof req.body.Selector === "undefined") {
                res.send({ Error: errors.Body.Missing.Selector });
            } else {
                const creds = await checkCredentials(req.body.Credentials, db, passRegEx, errors);
                if (creds.success) {
                    if (req.body.Like === -1 || req.body.Like === 1) {
                        await db.connect();
                        const article = await db
                            .db("texter")
                            .collection("articles")
                            .findOne(req.body.Selector);
                        let likeValue = 0;
                        if (article.Likers[req.body.Credentials.UserId] !== req.body.Like) {
                            likeValue = req.body.Like;
                        }
                        try {
                            const r = await db
                                .db("texter")
                                .collection("articles")
                                .update(req.body.Selector, {
                                    $set: {
                                        Likers: {
                                            [req.body.Credentials.UserId]: likeValue,
                                        },
                                    },
                                });
                            res.send({
                                Error: false,
                                UpdatedElementCount: r.result.ok === 1,
                            });
                        } catch (e) {
                            res.status(400);
                            res.send({
                                Error: {
                                    Error: true,
                                    ErrorDetails: {
                                        General: "Unknow error",
                                        More: "Contact the dumb admin wich made this unworking!",
                                    },
                                },
                            });
                        }
                    } else if (req.body.DoModify === true) {
                        if (typeof req.body.Modify === "object") {
                            const selector = req.body.Selector;
                            const modifyList: any = {};
                            selector.CreatorId = req.body.Credentials.UserId;
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
                                        modifyList[modifyPropName] = modifyValue;
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
                                    .collection("articles")
                                    .updateMany(selector, { $set: modifyList });
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
            }
        })
        .post("/create", async (req, res) => {
            const creds = await checkCredentials(req.body.Credentials, db, passRegEx, errors);
            console.log(req.body);
            if (typeof req.body.New === "undefined") {
                res.status(400);
                res.send({ Error: errors.Body.MissingAny });
                return;
            } else if (typeof req.body.New.Title === "undefined") {
                res.status(400);
                res.send({ Error: errors.Body.MissingAny });
                return;
            } else if (typeof req.body.New.Content === "undefined") {
                res.status(400);
                res.send({ Error: errors.Body.MissingAny });
                return;
            } else if (creds.success) {
                await db.connect();
                const newId = sha256(req.body.New.Title);
                const r = await db
                    .db("texter")
                    .collection("articles")
                    .find({ ID: newId })
                    .toArray();
                if (r.length > 0) {
                    res.status(400);
                    res.send({ Error: errors.Body.ArticleExists });
                } else {
                    const article = {
                        Content: req.body.New.Content,
                        CreatorId: req.body.Credentials.UserId,
                        ID: newId,
                        Likers: {
                            [req.body.Credentials.UserId]: 1,
                        },
                        OwnerId: req.body.Credentials.UserId,
                        Title: req.body.New.Title,
                    };
                    await db
                        .db("texter")
                        .collection("articles")
                        .insertOne(article);
                    db
                        .db("texter")
                        .collection("users")
                        .updateMany({ ID: req.body.Credentials.UserId }, {
                            $push: {
                                Articles: article.ID,
                            },
                        });
                    res.status(200);
                    res.send({
                        Error: {
                            Error: false,
                        },
                        NewID: newId,
                    });
                }
            } else {
                res.status(400);
                res.send({
                    Error: creds.error,
                });
            }
        })
        .post("/delete", async (req, res) => {
            const creds = await checkCredentials(req.body.Credentials, db, passRegEx, errors);
            if (creds.success) {
                const filter = req.body.Selector;
                filter.CreatorId = req.body.Credentials.UserId;
                const re = await db
                    .db("texter")
                    .collection("articles")
                    .find(filter)
                    .toArray();
                const articleIds: number[] = [];
                re.forEach((el) => {
                    articleIds.push(el.ID);
                });

                const r = await db
                    .db("texter")
                    .collection("articles")
                    .deleteMany(filter);
                db
                    .db("texter")
                    .collection("users")
                    .updateMany({ ID: req.body.Credentials.UserId }, {
                        $pull: {
                            Articles: { $in: articleIds },
                        },
                    });
                res.send({
                    Deleted: r.result.n,
                    Error: {
                        Error: false,
                    },
                });
            } else {
                res.status(400);
                res.send({ Error: creds.error });
            }
        });
}

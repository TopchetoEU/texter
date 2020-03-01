import e, { Router } from "express";
import { MongoClient } from "mongodb";
import sha256 from "sha256";
import { ErrorsType } from "../../errors";
import { CredentialsChecker, Error } from "../credentialsChecker";

// All changeable properties of Article
enum Changeable {
    Title,
    Content,
    UserId,
}

export function GetArticlesRouter(
    database: MongoClient, errors: ErrorsType,
    checkCredentials: CredentialsChecker,
    passRegEx: RegExp): Router {
    return Router()
        .post("/get", async (req, res) => {
            // Checks if the selector is there
            if (typeof req.body.Selector === "undefined") {
                res.status(200);
                res.send({
                    Error: errors.Body.Missing.Selector,
                });
            // Checks is the selector a object
            } else if (typeof req.body.Selector !== "object") {
                res.status(200);
                res.send({
                    Error: errors.Body.InvalidType.Selector,
                });
            } else {
                // The db cursor without paging
                let cursor = database
                    .db("texter")
                    .collection("articles")
                    .find(req.body.Selector)
                    .project({ _id: 0 });

                // Pages the response, if required
                if (req.body.DoPaging === true) {
                    // Type check

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

                // Calculates result
                const result = await cursor.toArray();
                res.send({
                    Error: {
                        Error: false,
                    },
                    // --------------------- Makes sure user, created by old standard is compatible
                    Found: result.map((v) => BackwardCompatibility.toLatestGen(v)),
                });
            }
        })
        .post("/change", async (req, res) => {
            // Check for selector type
            if (typeof req.body.Selector === "undefined") {
                res.send({ Error: errors.Body.Missing.Selector });
            } else {
                // Verification of credentials (password, etc...)
                const verification = await checkCredentials(req.body.Credentials, database, passRegEx, errors);
                if (verification.success) {
                    // Check for accepted like values
                    if (req.body.Like === -1 || req.body.Like === 0 || req.body.Like === 1) {
                        const article = await database
                            .db("texter")
                            .collection("articles")
                            .findOne(req.body.Selector);

                        let likeValue = 0;
                        // Making like a switch
                        if (article.Likers[req.body.Credentials.UserId] !== req.body.Like) {
                            likeValue = req.body.Like;
                        }

                        try {
                            // Stores update results
                            const updateResults = await database
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
                                UpdatedElementCount: updateResults.result.ok === 1,
                            });
                        // Catches a unexpected error
                        } catch (e) {
                            res.status(200);
                            res.send({
                                Error: {
                                    Error: true,
                                    ErrorDetails: {
                                        General: "Unknown error",
                                        More: "Contact the dumb admin which made this nonworking!",
                                    },
                                },
                            });
                        }
                    // DoModify soon will be deprecated and won't be required
                    } else if (req.body.DoModify === true) {
                        // Modify is a list of property - value key pair for value updates
                        if (typeof req.body.Modify === "object") {
                            const selector = req.body.Selector;
                            const modifyList: any = {};
                            selector.CreatorId = req.body.Credentials.UserId;
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
                                        modifyList[modifyPropName] = modifyValue;
                                    } else {
                                        res.status(200);
                                        res.send({
                                            Error: {
                                                Error: true,
                                                ErrorDetails: {
                                                    General: "Modification property name not valid",
                                                    More: "Make sure you're not providing something else from all changeable properties",
                                                },
                                            },
                                        });
                                        return;
                                    }
                                }
                            }
                            if (modifyList !== {}) {
                                const r = await database
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
                    res.send({ Error: verification.error });
                }
            }
        })
        .post("/create", async (req, res) => {
            // Credentials check
            const verification = await checkCredentials(req.body.Credentials, database, passRegEx, errors);

            // Type checks
            if (typeof req.body.New === "undefined") {
                res.status(200);
                res.send({ Error: errors.Body.MissingAny });
                return;
            } else if (typeof req.body.New.Title === "undefined" || req.body.New.Title.trim().length === 0) {
                res.status(200);
                res.send({ Error: new Error("Title is missing!", "A title is required for a post")});
                return;
            } else if (typeof req.body.New.Content === "undefined" || req.body.New.Content.trim().length === 0) {
                res.status(200);
                res.send({ Error: new Error("Content is missing!", "A content is required for a post")});
                return;
            } else if (verification.success) {
                // A id is generated
                const newId = sha256(req.body.New.Title);
                const conflictingArticles = await database
                    .db("texter")
                    .collection("articles")
                    .find({ ID: newId })
                    .toArray();
                if (conflictingArticles.length > 0) {
                    res.status(200);
                    res.send({ Error: errors.Body.ArticleExists });
                } else {
                    // Generating new article
                    const article = {
                        Content: req.body.New.Content,
                        CreatorId: req.body.Credentials.UserId,
                        Date: new Date().getTime(),
                        ID: newId,
                        Likers: {
                            [req.body.Credentials.UserId]: 1,
                        },
                        OwnerId: req.body.Credentials.UserId,
                        Title: req.body.New.Title,
                    };
                    // Adding article to database
                    database
                        .db("texter")
                        .collection("articles")
                        .insertOne(article);

                    // Adding article to the owner's articles list
                    database
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
                res.status(200);
                res.send({
                    Error: verification.error,
                });
            }
        })
        .post("/delete", async (req, res) => {
            // Verifying credentials
            const verification = await checkCredentials(req.body.Credentials, database, passRegEx, errors);
            if (verification.success) {
                // Creating selector
                const selector = req.body.Selector;
                selector.CreatorId = req.body.Credentials.UserId;

                // Getting all article IDs, that must be deleted
                const articleIds = (await database
                    .db("texter")
                    .collection("articles")
                    .find(selector)
                    .toArray())
                    .map((v) => v.ID);

                // Deleting all articles by the given selector
                const result = await database
                    .db("texter")
                    .collection("articles")
                    .deleteMany(selector);

                // Removing all articles' dependencies to the owner
                database
                    .db("texter")
                    .collection("users")
                    .updateMany({ ID: req.body.Credentials.UserId }, {
                        $pull: {
                            Articles: { $in: articleIds },
                        },
                    });
                res.send({
                    Deleted: result.result.n,
                    Error: {
                        Error: false,
                    },
                });
            } else {
                res.status(200);
                res.send({ Error: verification.error });
            }
        });
}

// Support for older formats
export class BackwardCompatibility {
    // In gen 2, there is support for dates
    public static toGen2(article: any) {
        if (typeof article.Date !== "number") {
            article.Date = 0;
        }

        return article;
    }

    // For no breaking changes, there is toLatestGen, so you can just call it
    public static toLatestGen(article: any) {
        return this.toGen2(article);
    }
}

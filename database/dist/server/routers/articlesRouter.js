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
const express_1 = require("express");
const sha256_1 = __importDefault(require("sha256"));
var Changeables;
(function (Changeables) {
    Changeables[Changeables["Title"] = 0] = "Title";
    Changeables[Changeables["Content"] = 1] = "Content";
    Changeables[Changeables["UserId"] = 2] = "UserId";
})(Changeables || (Changeables = {}));
function GetArticlesRouter(db, errors, checkCredentials, passRegEx) {
    return express_1.Router()
        .post("/get", (req, res) => __awaiter(this, void 0, void 0, function* () {
        if (typeof req.body.Selector === "undefined") {
            res.status(400);
            res.send({
                Error: errors.Body.Missing.Selector,
            });
        }
        else if (typeof req.body.Selector !== "object") {
            res.status(400);
            res.send({
                Error: errors.Body.InvalidType.Selector,
            });
        }
        else {
            yield db.connect();
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
                }
                else {
                    a = a.limit(req.body.Paging.PageSize);
                    a = a.skip(req.body.Paging.PageSize * req.body.Paging.PageCount);
                }
            }
            const result = yield a.toArray();
            res.send({
                Error: {
                    Error: false,
                },
                Found: result,
            });
        }
    }))
        .post("/change", (req, res) => __awaiter(this, void 0, void 0, function* () {
        if (typeof req.body.Selector === "undefined") {
            res.send({ Error: errors.Body.Missing.Selector });
        }
        else {
            const creds = yield checkCredentials(req.body.Credentials, db, passRegEx, errors);
            if (creds.success) {
                if (req.body.Like === -1 || req.body.Like === 1) {
                    yield db.connect();
                    const article = yield db
                        .db("texter")
                        .collection("articles")
                        .findOne(req.body.Selector);
                    let likeValue = 0;
                    if (article.Likers[req.body.Credentials.UserId] !== req.body.Like) {
                        likeValue = req.body.Like;
                    }
                    try {
                        const r = yield db
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
                    }
                    catch (e) {
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
                }
                else if (req.body.DoModify === true) {
                    if (typeof req.body.Modify === "object") {
                        const selector = req.body.Selector;
                        const modifyList = {};
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
                                }
                                else {
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
                            const r = yield db
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
                    }
                    else {
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
                }
                else {
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
            }
            else {
                res.status(400);
                res.send({ Error: creds.error });
            }
        }
    }))
        .post("/create", (req, res) => __awaiter(this, void 0, void 0, function* () {
        const creds = yield checkCredentials(req.body.Credentials, db, passRegEx, errors);
        if (typeof req.body.New === "undefined") {
            res.status(400);
            res.send({ Error: errors.Body.MissingAny });
            console.log("a");
            return;
        }
        else if (typeof req.body.New.Title === "undefined") {
            res.status(400);
            res.send({ Error: errors.Body.MissingAny });
            console.log("b");
            return;
        }
        else if (typeof req.body.New.Content === "undefined") {
            res.status(400);
            res.send({ Error: errors.Body.MissingAny });
            console.log("c");
            return;
        }
        else if (creds.success) {
            yield db.connect();
            const newId = sha256_1.default(req.body.New.Title);
            const r = yield db
                .db("texter")
                .collection("articles")
                .find({ ID: newId })
                .toArray();
            if (r.length > 0) {
                console.log(r);
                res.status(400);
                res.send({ Error: errors.Body.ArticleExists });
            }
            else {
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
                yield db
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
        }
        else {
            res.status(400);
            res.send({
                Error: creds.error,
            });
        }
    }))
        .post("/delete", (req, res) => __awaiter(this, void 0, void 0, function* () {
        const creds = yield checkCredentials(req.body.Credentials, db, passRegEx, errors);
        if (creds.success) {
            const filter = req.body.Selector;
            filter.CreatorId = req.body.Credentials.UserId;
            const re = yield db
                .db("texter")
                .collection("articles")
                .find(filter)
                .toArray();
            const articleIds = [];
            re.forEach((el) => {
                articleIds.push(el.ID);
            });
            const r = yield db
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
        }
        else {
            res.status(400);
            res.send({ Error: creds.error });
        }
    }));
}
exports.GetArticlesRouter = GetArticlesRouter;
//# sourceMappingURL=articlesRouter.js.map
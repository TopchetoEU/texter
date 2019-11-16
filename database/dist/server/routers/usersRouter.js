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
    Changeables[Changeables["Password"] = 0] = "Password";
    Changeables[Changeables["Username"] = 1] = "Username";
    Changeables[Changeables["UserId"] = 2] = "UserId";
})(Changeables || (Changeables = {}));
var DebugStates;
(function (DebugStates) {
    DebugStates[DebugStates["Follow"] = 0] = "Follow";
    DebugStates[DebugStates["Unfollow"] = 1] = "Unfollow";
    DebugStates[DebugStates["None"] = null] = "None";
})(DebugStates || (DebugStates = {}));
function GetUsersRouter(db, errors, checkCredentials, passRegEx) {
    return express_1.Router()
        .post("/get", (req, res) => __awaiter(this, void 0, void 0, function* () {
        if (typeof req.body.Selector === "undefined") {
            res.status(400);
            res.send({
                Error: errors.Body.Missing.Selector,
            });
        }
        else {
            yield db.connect();
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
        const creds = yield checkCredentials(req.body.Credentials, db, passRegEx, errors);
        if (creds.success) {
            if ((req.body.Follow === true) && typeof req.body.Selector === "object") {
                const coll = db.db("texter").collection("users");
                const selectorA = Object.create(req.body.Selector);
                selectorA.Followers = { $in: [req.body.Credentials.UserId] };
                const selectorB = Object.create(req.body.Selector);
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
                const unfollow = yield coll.find({ Debug: 1 }).toArray();
                const follow = yield coll.find({ Debug: 0 }).toArray();
                const modF = [];
                const modUf = [];
                unfollow.forEach((element) => {
                    modUf.push(element.ID);
                });
                follow.forEach((element) => {
                    modF.push(element.ID);
                });
                yield coll.updateOne({ ID: req.body.Credentials.UserId }, {
                    $push: { Following: { $each: modF } },
                });
                yield coll.updateOne({ ID: req.body.Credentials.UserId }, {
                    $pull: { Following: { $in: modUf } },
                });
                yield coll.updateOne({ ID: req.body.Credentials.UserId }, {
                    $set: { Debug: DebugStates.None },
                });
                res.send({
                    Error: false,
                });
            }
            else if (req.body.DoModify === true) {
                if (typeof req.body.Modify === "object") {
                    const modifyList = {};
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
                                    modifyList[modifyPropName] = sha256_1.default(modifyValue);
                                }
                                else {
                                    modifyList[modifyPropName] = modifyValue;
                                }
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
    }))
        .post("/create", (req, res) => __awaiter(this, void 0, void 0, function* () {
        function getNextFreeId() {
            return __awaiter(this, void 0, void 0, function* () {
                const usrs = yield db.db("texter").collection("users").find({}).project({ ID: 1 }).toArray();
                const ids = [];
                let id = 0;
                usrs.forEach((element) => {
                    ids.push(element.ID);
                });
                while (ids.indexOf(id) !== -1) {
                    id = Math.random() * Number.MAX_SAFE_INTEGER;
                }
                return Promise.resolve(id);
            });
        }
        if (typeof req.body.New === "undefined") {
            res.status(400);
            res.send({ Error: errors.Body.MissingAny });
            console.log("a");
            return;
        }
        else if (typeof req.body.New.Username === "undefined") {
            res.status(400);
            res.send({ Error: errors.Body.MissingAny });
            console.log("b");
            return;
        }
        else if (typeof req.body.New.Password === "undefined") {
            res.status(400);
            res.send({ Error: errors.Body.MissingAny });
            console.log("c");
            return;
        }
        else {
            yield db.connect();
            const newId = yield getNextFreeId();
            const r = yield db
                .db("texter")
                .collection("users")
                .find({ Username: req.body.New.Username })
                .toArray();
            if (r.length > 0) {
                console.log(r);
                res.status(400);
                res.send({ Error: errors.Body.UserExists });
            }
            else {
                const user = {
                    Articles: new Array(),
                    Followers: [newId],
                    Following: [newId],
                    ID: newId,
                    Password: sha256_1.default(req.body.New.Password),
                    Username: req.body.New.Username,
                };
                yield db
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
    }));
}
exports.GetUsersRouter = GetUsersRouter;
//# sourceMappingURL=usersRouter.js.map
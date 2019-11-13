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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
var Changeables;
(function (Changeables) {
    Changeables[Changeables["Title"] = 0] = "Title";
    Changeables[Changeables["Content"] = 1] = "Content";
    Changeables[Changeables["UserId"] = 2] = "UserId";
})(Changeables || (Changeables = {}));
function GetOthersRouter(db, e, cc, prg) {
    return express_1.Router()
        .post("/checkCreds", (req, res) => __awaiter(this, void 0, void 0, function* () {
        res.send(yield cc(req.body.Credentials, db, prg, e));
    }));
}
exports.GetOthersRouter = GetOthersRouter;
//# sourceMappingURL=othersRouter.js.map